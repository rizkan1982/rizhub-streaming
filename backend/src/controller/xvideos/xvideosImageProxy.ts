import { Request, Response } from "express";
import fetch from "node-fetch";
import https from "https";
import http from "http";

/**
 * Proxy images (thumbnails) untuk bypass ISP blocking
 * Ini memastikan thumbnail video bisa load di data seluler Indonesia
 */
export async function proxyImage(req: Request, res: Response): Promise<void> {
  const { url } = req.query;
  
  if (!url) {
    res.status(400).json({ error: "Image URL required" });
    return;
  }

  const imageUrl = String(url);
  
  try {
    console.log(`[IMAGE PROXY] Fetching: ${imageUrl.substring(0, 100)}...`);
    
    // Create custom agent untuk bypass SSL issues
    const isHttps = imageUrl.startsWith("https");
    const agent = isHttps 
      ? new https.Agent({
          rejectUnauthorized: false,
          keepAlive: true,
          timeout: 30000,
        })
      : new http.Agent({
          keepAlive: true,
          timeout: 30000,
        });
    
    // Fetch image dengan headers yang bypass ISP detection
    const response = await fetch(imageUrl, {
      agent,
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.xvideos.com/",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "DNT": "1",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    if (!response.ok) {
      console.error(`[IMAGE PROXY] Failed: ${response.status}`);
      res.status(response.status).json({ error: "Failed to fetch image" });
      return;
    }

    // Get image metadata
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const contentLength = response.headers.get("content-length");
    
    // Set response headers dengan aggressive caching untuk save bandwidth
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": contentLength || "",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, immutable", // Cache 24 jam
      "Expires": new Date(Date.now() + 86400000).toUTCString(),
      "X-Content-Type-Options": "nosniff",
    });
    
    // Stream image
    if (response.body) {
      response.body.pipe(res);
    }
    
    console.log(`✅ [IMAGE PROXY] Success`);
    
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[IMAGE PROXY ERROR]", err.message);
    res.status(500).json({ error: err.message });
  }
}
