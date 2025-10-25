import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeXvideos(query: string) {
  try {
    const url = `https://www.xvideos.com/?k=${encodeURIComponent(query)}&p=1`;

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);
    const results: any[] = [];

    $("div.thumb-block").each((i, el) => {
      const title = $(el).find("p.title a").text().trim();
      const urlPath = $(el).find("p.title a").attr("href") || "";
      const thumb =
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src") ||
        "";
      const id = urlPath.split("/")[2] || null;

      if (title && thumb && urlPath) {
        results.push({
          id,
          title,
          thumb,
          url: `https://www.xvideos.com${urlPath}`,
        });
      }
    });

    return results;
  } catch (error: any) {
    console.error("Scrape Error:", error.message);
    return [];
  }
}
