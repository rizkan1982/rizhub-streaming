import { Request, Response } from "express";
import fetchWithProxy from "../../lib/fetchWithProxy";
import * as cheerio from "cheerio";

/**
 * Get direct video stream URL from XVideos
 * This extracts the actual MP4/M3U8 URL for streaming
 */
export async function watchXvideos(req: Request, res: Response): Promise<void> {
  const { id } = req.query;
  
  if (!id) {
    res.json({ success: false, message: "Video ID required" });
    return;
  }

  let videoId = String(id);
  
  // Fix ID format: 
  // Input might be: "videoXXXX/slug" or "video.XXXX/slug"
  // We need: "video.XXXX/slug" for URL
  if (videoId.startsWith("video") && !videoId.startsWith("video.")) {
    // Replace "video" with "video."
    videoId = videoId.replace(/^video/, "video.");
  }
  
  const url = `https://www.xvideos.com/${videoId}`;

  try {
    console.log(`[WATCH] Fetching video: ${url}`);
    const html: string = await fetchWithProxy(url);
    
    if (!html) {
      res.json({ success: false, message: "Failed to fetch video page" });
      return;
    }

    const $ = cheerio.load(html);
    
    // Extract video URLs from page
    let videoUrls: any = {};
    
    // Method 1: Find in <script> tags
    const scripts = $("script").map((i, el) => $(el).html()).get();
    
    for (const script of scripts) {
      if (script && script.includes("html5player")) {
        // Extract HLS URL
        const hlsMatch = script.match(/html5player\.setVideoUrlHLS\(['"]([^'"]+)['"]\)/);
        if (hlsMatch) {
          videoUrls.hls = hlsMatch[1];
        }
        
        // Extract High quality MP4
        const highMatch = script.match(/html5player\.setVideoUrlHigh\(['"]([^'"]+)['"]\)/);
        if (highMatch) {
          videoUrls.high = highMatch[1];
        }
        
        // Extract Low quality MP4
        const lowMatch = script.match(/html5player\.setVideoUrlLow\(['"]([^'"]+)['"]\)/);
        if (lowMatch) {
          videoUrls.low = lowMatch[1];
        }
        
        // Also try alternative patterns
        const videoMatch = script.match(/html5player\.setVideoUrl\(['"]([^'"]+)['"]\)/);
        if (videoMatch) {
          videoUrls.standard = videoMatch[1];
        }
        
        if (videoUrls.high || videoUrls.hls || videoUrls.low || videoUrls.standard) {
          break;
        }
      }
    }
    
    // Method 1.5: Try direct regex on full HTML
    if (!videoUrls.high && !videoUrls.hls) {
      const htmlStr = html.toString();
      
      const patterns = [
        /setVideoUrlHigh\(['"]([^'"]+)['"]\)/,
        /setVideoUrlLow\(['"]([^'"]+)['"]\)/,
        /setVideoHLS\(['"]([^'"]+)['"]\)/,
        /"quality":"high"[^}]*"url":"([^"]+)"/,
        /"quality":"low"[^}]*"url":"([^"]+)"/,
      ];
      
      for (const pattern of patterns) {
        const match = htmlStr.match(pattern);
        if (match && match[1]) {
          videoUrls.fallback = match[1];
          break;
        }
      }
    }
    
    // Method 2: Find in JSON-LD
    const jsonLd = $('script[type="application/ld+json"]').html();
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd);
        if (data.contentUrl) {
          videoUrls.contentUrl = data.contentUrl;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    // Get best quality URL
    const streamUrl = videoUrls.high || videoUrls.standard || videoUrls.hls || videoUrls.low || videoUrls.fallback || videoUrls.contentUrl;
    
    console.log("[WATCH] Found URLs:", videoUrls);
    console.log("[WATCH] Selected stream URL:", streamUrl);
    
    if (!streamUrl) {
      console.error("[WATCH] No video URL found!");
      res.json({ 
        success: false, 
        message: "Could not extract video URL",
        debug: {
          foundUrls: videoUrls,
          url: url,
          hint: "The page HTML may have changed or video is restricted"
        }
      });
      return;
    }
    
    // Make sure URL is absolute
    const absoluteUrl = streamUrl.startsWith("http") ? streamUrl : `https:${streamUrl}`;
    
    console.log(`[WATCH] Video URL found: ${absoluteUrl}`);
    
    res.json({
      success: true,
      data: {
        id: videoId,
        streamUrl: absoluteUrl,
        qualities: videoUrls,
        originalUrl: url
      }
    });
    
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[WATCH ERROR]", err.message);
    res.json({ success: false, message: err.message });
  }
}
