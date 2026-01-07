import { Request, Response } from "express";
import fetchWithProxy from "../../lib/fetchWithProxy";
import * as cheerio from "cheerio";

export default async function xnxxSearch(req: Request, res: Response): Promise<void> {
  const { key, page } = req.query;
  const query: string = (key as string)?.trim().replace(/\s+/g, "+") || "";
  const pageNumber: string = (page as string) || "1";
  const url = `https://www.xnxx.com/search/${query}/${pageNumber}`;

  try {
    const html: string = await fetchWithProxy(url);
    if (!html) {
      res.json({ success: false, message: "Failed to fetch HTML" });
      return;
    }

    const $ = cheerio.load(html);
    const results: { title: string; url: string; image: string; duration: string }[] = [];

    $(".thumb-block").each((_, el) => {
      const title = $(el).find(".thumb-under > p > a").text().trim();
      const videoUrl = "https://www.xnxx.com" + ($(el).find(".thumb-under > p > a").attr("href") || "");
      const image =
        $(el).find(".thumb img").attr("data-src") ||
        $(el).find(".thumb img").attr("src") ||
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
    console.error("[XNXX SEARCH ERROR]", err.message);
    res.json({ success: false, message: err.message });
  }
}
