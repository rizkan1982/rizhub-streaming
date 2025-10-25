import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// ROUTE: Search videos
// =====================
app.get("/xvideos/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ success: false, message: "Missing search query" });
    }

    const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(searchUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const results: any[] = [];

    $("div.thumb-inside").each((i, el) => {
      const title = $(el).find("p.title a").text().trim();
      const url = $(el).find("p.title a").attr("href") || "";
      const thumb =
        $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      const idMatch = url.match(/video(\w+)/);

      results.push({
        id: idMatch ? idMatch[1] : null,
        title,
        thumb,
        url: `https://www.xvideos.com${url}`,
      });
    });

    res.json({ success: true, total: results.length, data: results });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================
// ROUTE: Watch video
// ======================
app.get("/xvideos/watch", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing video ID" });
    }

    const videoUrl = `https://www.xvideos.com/video${id}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(videoUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Coba cari link video dari tag <source>
    const videoSrc =
      $("video > source").attr("src") ||
      $("source").attr("src") ||
      null;

    // Kalau tidak ada <source>, coba dari JavaScript variable di HTML
    const regex = /setVideoUrlHigh\('(.+?)'\)/.exec(html);
    const fallback = regex ? regex[1] : null;

    const streamUrl = videoSrc || fallback;

    if (!streamUrl) {
      return res.json({ success: false, message: "Video stream not found" });
    }

    res.json({
      success: true,
      data: {
        id,
        stream: streamUrl.startsWith("http") ? streamUrl : `https:${streamUrl}`,
        original: videoUrl,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
