import { load } from "cheerio";
import LustPress from "../../LustPress";
import { IVideoData } from "../../interfaces";

const lust = new LustPress();

export async function scrapeContent(url: string) {
  try {
    const resolve = await lust.fetchBody(url);
    const $ = load(resolve);

    class Xvideos { 
      link: string;
      id: string;
      title: string;
      image: string;
      duration: string;
      views: string;
      rating: string;
      publish: string;
      upVote: string;
      downVote: string;
      video: string;
      tags: string[];
      models: string[];
      thumbnail: string;
      bigimg: string;
      embed: string;
      constructor() {
        // Link & ID
        this.link = $("meta[property='og:url']").attr("content") || 
                    $("link[rel='canonical']").attr("href") || 
                    "None";
        this.id = this.link !== "None" ? this.link.split("/")[3] + "/" + this.link.split("/")[4] : "None";
        
        // Title with multiple fallbacks
        this.title = $("meta[property='og:title']").attr("content") || 
                     $("h2.page-title").text().trim() ||
                     $("title").text().replace(" - XVIDEOS.COM", "").trim() ||
                     "None";
        
        // Image
        this.image = $("meta[property='og:image']").attr("content") || 
                     $("#player img").attr("src") ||
                     "None";
        
        // Duration with multiple fallbacks
        this.duration = $("meta[property='og:duration']").attr("content") || 
                       $("span.duration").text().trim() ||
                       $("#video-duration").text().trim() ||
                       "0";
        
        // Views with multiple fallbacks - more aggressive
        this.views = $("div#v-views").find("strong.mobile-hide").text().trim() || 
                    $("strong.mobile-hide").first().text().trim() ||
                    $("div.metadata").find("strong").first().text().trim() ||
                    $("strong").filter((i, el) => {
                      const text = $(el).text();
                      return text.includes('Views') || text.includes('views') || /\d+/.test(text);
                    }).first().text().trim() ||
                    $("div.video-metadata").find("strong").first().text().trim() ||
                    $("span.mobile-hide").filter((i, el) => /\d/.test($(el).text())).first().text().trim() ||
                    "None";
        
        // Rating with multiple fallbacks - more aggressive
        this.rating = $("span.rating-total-txt").text().trim() || 
                     $("div.metadata").find("span").filter((i, el) => $(el).text().includes("%")).text().trim() ||
                     $("span").filter((i, el) => $(el).text().includes("%")).first().text().trim() ||
                     $("div.rating-box").find("span").first().text().trim() ||
                     $(".vote-actions span").first().text().trim() ||
                     "None";
        this.publish = $("script[type='application/ld+json']").text() || "None";
        try {
          if (this.publish !== "None" && this.publish.includes("uploadDate")) {
            const parts = this.publish.split("uploadDate");
            if (parts[1]) {
              this.publish = parts[1]
                .split("}")[0]
                .split(":")[1]
                .replace(/"/g, "")
                .replace(/,/g, "") || "None";
            }
          }
        } catch {
          this.publish = "None";
        }
        // Up/Down votes with fallbacks
        this.upVote = $("span.rating-good-nbr").text().trim() || 
                     $("span.vote-actions-good").text().trim() ||
                     $("span").filter((i, el) => $(el).text().includes("👍") || $(el).hasClass("good")).first().text().trim() ||
                     "None";
        this.downVote = $("span.rating-bad-nbr").text().trim() || 
                       $("span.vote-actions-bad").text().trim() ||
                       $("span").filter((i, el) => $(el).text().includes("👎") || $(el).hasClass("bad")).first().text().trim() ||
                       "None";
        const thumb = $("script")
          .map((i, el) => {
            return $(el).text();
          }).get()
          .filter((el) => el.includes("html5player.setThumbSlideBig"))[0] || "None";
        this.thumbnail = thumb.match(/html5player.setThumbSlideBig\((.*?)\)/)?.[1] || "None";
        this.bigimg = thumb.match(/html5player.setThumbUrl169\((.*?)\)/)?.[1] || "None";
        this.video = thumb.match(/html5player.setVideoUrlHigh\((.*?)\)/)?.[1] || "None";
        this.tags = $("a.is-keyword.btn.btn-default")
          .map((i, el) => {
            return $(el).text();
          }).get();
        this.models = $("li.model")
          .map((i, el) => {
            return $(el).find("a").attr("href") || "None";
          }
          ).get();
        this.models = this.models.map((el) => el.split("/")[2]);
        this.embed = $("input#copy-video-embed").attr("value") || "None";
        try {
          if (this.embed !== "None" && this.embed.includes("iframe")) {
            const parts = this.embed.split("iframe");
            if (parts[1]) {
              const srcParts = parts[1].split(" ");
              if (srcParts[1]) {
                this.embed = srcParts[1].replace(/src=/g, "").replace(/"/g, "");
              }
            }
          }
        } catch {
          this.embed = "None";
        }
      }
    }
    
    const xv = new Xvideos();
    
    // Debug logging with HTML snippets
    console.log("🔍 Scraped Data:", {
      title: xv.title,
      duration: xv.duration,
      views: xv.views,
      rating: xv.rating,
      upVote: xv.upVote,
      downVote: xv.downVote
    });
    
    // Debug: Log HTML elements we're looking for
    console.log("🔎 HTML Debug:");
    console.log("  - v-views div:", $("div#v-views").text().substring(0, 100));
    console.log("  - rating span:", $("span.rating-total-txt").text().substring(0, 50));
    console.log("  - All strong tags count:", $("strong").length);
    console.log("  - All spans with %:", $("span").filter((i, el) => $(el).text().includes("%")).length);
    
    const data: IVideoData = {
      success: true,
      data: {
        title: lust.removeHtmlTagWithoutSpace(xv.title),
        id: xv.id,
        image: xv.image,
        duration: lust.secondToMinute(Number(xv.duration)),
        views: lust.removeHtmlTag(xv.views),
        rating: xv.rating,
        uploaded: xv.publish,
        upvoted: xv.upVote,
        downvoted: xv.downVote,
        models: xv.models,
        tags: xv.tags,
      },
      source: xv.link,
      assets: lust.removeAllSingleQuoteOnArray([xv.embed, xv.thumbnail, xv.bigimg, xv.video])
    };
    return data;
    
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}