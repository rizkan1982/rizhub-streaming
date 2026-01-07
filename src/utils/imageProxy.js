/**
 * Proxy image URL untuk bypass ISP blocking
 * Berguna untuk data seluler Indonesia yang memblokir domain adult
 */
export function proxyImageUrl(originalUrl, apiBase = import.meta.env.VITE_API_BASE || "https://rizhub-backend.vercel.app") {
  if (!originalUrl) return '';
  
  // TEMPORARY: Disable proxy karena backend belum ter-deploy dengan endpoint baru
  // Return original URL dulu, nanti akan di-enable setelah backend deploy
  return originalUrl;
  
  // Jika URL sudah melalui proxy, return as is
  if (originalUrl.includes('/image/proxy')) {
    return originalUrl;
  }
  
  // Jika URL relatif atau sudah CDN lokal, return as is
  if (originalUrl.startsWith('/') || originalUrl.startsWith('data:') || !originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  // Proxy melalui backend untuk bypass ISP blocking
  return `${apiBase}/image/proxy?url=${encodeURIComponent(originalUrl)}`;
}
