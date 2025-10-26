import fetch from "node-fetch";

const freeProxies = [
  "https://api.allorigins.win/raw?url=",
  "https://thingproxy.freeboard.io/fetch/",
  "https://corsproxy.io/?",
];

export default async function fetchWithProxy(url: string): Promise<string> {
  const userAgent =
    process.env.USER_AGENT ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

  const scraperApiKey = process.env.SCRAPERAPI_KEY;

  // 1️⃣ Coba dulu ScraperAPI (kalau ada)
  if (scraperApiKey) {
    const scraperUrl = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(
      url
    )}`;
    try {
      const res = await fetch(scraperUrl, {
        headers: { "User-Agent": userAgent },
        timeout: 10000,
      });
      if (res.ok) {
        const html = await res.text();
        if (html.includes("<html")) {
          console.log("[ScraperAPI OK]");
          return html;
        }
      }
    } catch (err) {
      console.warn("[ScraperAPI Failed]", (err as Error).message);
    }
  }

  // 2️⃣ Jika ScraperAPI gagal, coba proxy publik gratis
  for (const proxy of freeProxies) {
    try {
      const proxyUrl =
        proxy.includes("?url=") || proxy.endsWith("/")
          ? `${proxy}${encodeURIComponent(url)}`
          : `${proxy}?url=${encodeURIComponent(url)}`;

      const res = await fetch(proxyUrl, {
        headers: { "User-Agent": userAgent },
        timeout: 10000,
      });
      if (res.ok) {
        const html = await res.text();
        if (html.includes("<html")) {
          console.log(`[Proxy OK] ${proxy}`);
          return html;
        }
      }
    } catch (err) {
      console.warn(`[Proxy Failed] ${proxy}: ${(err as Error).message}`);
    }
  }

  // 3️⃣ Last resort: Direct fetch (tanpa proxy)
  console.log("[Trying direct fetch without proxy]");
  try {
    const res = await fetch(url, {
      headers: { 
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      },
      timeout: 15000,
    });
    if (res.ok) {
      const html = await res.text();
      if (html.includes("<html")) {
        console.log("[Direct fetch OK]");
        return html;
      }
    }
  } catch (err) {
    console.warn(`[Direct fetch Failed]: ${(err as Error).message}`);
  }

  throw new Error("All proxies failed to fetch HTML.");
}
