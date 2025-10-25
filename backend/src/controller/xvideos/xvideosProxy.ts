import { Request, Response } from "express";
import fetch from "node-fetch";
import https from "https";
import http from "http";

/**
 * Proxy video stream to bypass CORS, SSL, and ISP blocking
 * This streams video through our backend server
 */
export async function proxyXvideosStream(req: Request, res: Response): Promise<void> {
  const { url } = req.query;
  
  if (!url) {
    res.status(400).json({ error: "Video URL required" });
    return;
  }

  const videoUrl = String(url);
  
  try {
    console.log(`[PROXY] Streaming video: ${videoUrl.substring(0, 100)}...`);
    
    // Create custom agent with ISP bypass settings
    const isHttps = videoUrl.startsWith("https");
    const agent = isHttps 
      ? new https.Agent({
          rejectUnauthorized: false, // Bypass SSL certificate validation
          keepAlive: true,
          timeout: 60000, // 60 second timeout
        })
      : new http.Agent({
          keepAlive: true,
          timeout: 60000,
        });
    
    // Fetch video with headers that bypass ISP detection
    const response = await fetch(videoUrl, {
      agent,
      timeout: 60000, // 60 second timeout
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.xvideos.com/",
        "Origin": "https://www.xvideos.com",
        "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "DNT": "1",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "video",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    if (!response.ok) {
      console.error(`[PROXY] Failed to fetch video: ${response.status}`);
      res.status(response.status).json({ error: "Failed to fetch video" });
      return;
    }

    // Get video metadata
    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    
    // Handle range requests for seeking
    const range = req.headers.range;
    
    if (range && contentLength) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : parseInt(contentLength) - 1;
      const chunksize = (end - start) + 1;
      
      // Re-fetch with range
      const rangeResponse = await fetch(videoUrl, {
        agent,
        timeout: 60000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.xvideos.com/",
          "Origin": "https://www.xvideos.com",
          "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "identity",
          "DNT": "1",
          "Connection": "keep-alive",
          "Range": `bytes=${start}-${end}`,
          "Sec-Fetch-Dest": "video",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
        },
      });
      
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize.toString(),
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      });
      
      if (rangeResponse.body) {
        rangeResponse.body.pipe(res);
      }
    } else {
      // Stream full video
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": contentLength || "",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      });
      
      if (response.body) {
        response.body.pipe(res);
      }
    }
    
    console.log(`[PROXY] Streaming started successfully`);
    
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[PROXY ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
}

