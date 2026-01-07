/**
 * Proxy image URL untuk bypass ISP blocking
 * TEMPORARY: Disabled karena backend belum punya endpoint /image/proxy
 */
export function proxyImageUrl(originalUrl, apiBase = import.meta.env.VITE_API_BASE || "https://rizhub-backend.vercel.app") {
  // Return original URL langsung (no proxy) karena backend production belum ter-update
  return originalUrl || '';
}
