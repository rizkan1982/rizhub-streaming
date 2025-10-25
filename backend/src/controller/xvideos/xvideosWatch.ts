import { Request, Response } from "express";
import fetchHtml from "../../lib/fetchWithProxy";
import * as cheerio from "cheerio";

export const xvideosWatch = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing video id" });
    }

    const videoUrl = `https://www.xvideos.com/video${id}`;
    const html = await fetchHtml(videoUrl);

    const $ = cheerio.load(html);

    const script = $('script:contains("setVideoUrlHigh")').html() || "";
    const match = script.match(/setVideoUrlHigh\('(.*?)'\)/);

    if (!match || !match[1]) {
      return res.status(404).json({ success: false, message: "Video stream not found" });
    }

    const streamUrl = match[1];
    const title = $("title").text().trim();

    return res.json({
      success: true,
      title,
      stream_url: streamUrl,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch video stream",
    });
  }
};
