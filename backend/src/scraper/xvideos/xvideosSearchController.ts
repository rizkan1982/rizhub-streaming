import { load } from "cheerio";
import LustPress from "../../LustPress";
import c from "../../utils/options";
import { ISearchVideoData } from "../../interfaces";

const lust = new LustPress();

export async function scrapeContent(url: string) {
  try {
    const res = await lust.fetchBody(url);
    const $ = load(res);

    class XvideosSearch {
      search: object[];
      constructor() {
        const data = $("div.thumb-under")
          .map((i, el) => {
            return {
              title: $(el).find("a").attr("title"),
              duration: $(el).find("span.duration")
                .map((i, el) => {
                  return $(el).text();
                }).get()[0],
            };
          }).get();
        this.search = $("div.mozaique.cust-nb-cols")
          .find("div.thumb")
          .map((i, el) => {
            const href = $(el).find("a").attr("href") || "";
            const videoId = $(el).find("img").attr("data-videoid") || "";
            const thumbImg = $(el).find("img");
            const duration = data[i]?.duration === data[i + 1]?.duration ? "" : (data[i]?.duration || "");
            
            return {
              link: `${c.XVIDEOS}${href}` || "None",
              id: href || "None",
              image: thumbImg.attr("data-src") || thumbImg.attr("src") || "None",
              title: data[i]?.title || "None",
              duration: duration || "None",
              rating: null,
              video: videoId ? `${c.XVIDEOS}/embedframe/${videoId}` : "None"
            };
          }).get();

        this.search = this.search.filter((el: any) => {
          return !el.id.includes("THUMBNUM");
        });
        this.search = this.search.filter((el: any) => {
          return el.id.includes("/video");
        });
      }
    }
    
    const xv = new XvideosSearch();
    if (xv.search.length === 0) throw Error("No result found");
    const data = xv.search as unknown as string[];
    const result: ISearchVideoData = {
      success: true,
      data: data,
      source: url,
    };
    return result;

  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}