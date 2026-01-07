import { Request, Response } from "express";
import fetchWithProxy from "../../lib/fetchWithProxy";
import * as cheerio from "cheerio";

export default async function xvideosSearch(req: Request, res: Response): Promise<void> {
  const { key, page } = req.query;
  const query: string = (key as string)?.trim().replace(/\s+/g, "+") || "";
  const pageNumber: string = (page as string) || "1";
  const url = `https://www.xvideos.com/?k=${query}&p=${pageNumber}`;

  try {
    const html: string = await fetchWithProxy(url);
    if (!html) {
      res.json({ success: false, message: "Failed to fetch HTML" });
      return;
    }

    const $ = cheerio.load(html);
    const results: { title: string; url: string; image: string; duration: string }[] = [];

    $(".thumb-block").each((_, el) => {
      const title = $(el).find("p.title > a").text().trim();
      const videoUrl = "https://www.xvideos.com" + ($(el).find("p.title > a").attr("href") || "");
      const image =
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src") ||
        "";
      const duration = $(el).find(".duration").text().trim();

      results.push({ title, url: videoUrl, image, duration });
    });

    res.json({
      success: true,
      total: results.length,
      query,
      page: pageNumber,
      results,
    });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[XVIDEOS SEARCH ERROR]", err.message);
    res.json({ success: false, message: err.message });
  }
}
