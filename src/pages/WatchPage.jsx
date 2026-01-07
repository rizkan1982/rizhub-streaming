import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import { LoadingVideo } from "../components/Loading";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import WatchOptions from "../components/WatchOptions";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import ShareButton from "../components/ShareButton";
import { useLanguage } from "../contexts/LanguageContext";
import { addToHistory, isFavorite, toggleFavorite } from "../utils/watchHistory";
import { proxyImageUrl } from "../utils/imageProxy";

const API_BASE = import.meta.env.VITE_API_BASE || "https://rizhub-backend.vercel.app";

// Debug logging
console.log("🔧 WatchPage API_BASE:", API_BASE);

export default function WatchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;
  const { t } = useLanguage();
  
  const [videoDetails, setVideoDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState("xvideos");
  const [streamUrl, setStreamUrl] = useState(null);
  const [relatedPage, setRelatedPage] = useState(1);
  const RELATED_PER_PAGE = 12;

  useEffect(() => {
    if (!video) {
      navigate("/");
      return;
    }

    console.log("🎬 Video data received:", video);
    
    // Add to watch history
    addToHistory({
      ...video,
      url: video.link || video.url || video.id
    });

    // Extract platform from video URL if available
    const videoLink = video.link || video.url || "";
    console.log("🔗 Video link:", videoLink);
    
    if (videoLink) {
      if (videoLink.includes("xvideos")) setPlatform("xvideos");
      else if (videoLink.includes("pornhub")) setPlatform("pornhub");
      else if (videoLink.includes("xnxx")) setPlatform("xnxx");
      else if (videoLink.includes("redtube")) setPlatform("redtube");
      else if (videoLink.includes("xhamster")) setPlatform("xhamster");
      else if (videoLink.includes("youporn")) setPlatform("youporn");
    }

    // Extract video ID from URL if not provided
    if (!video.id && videoLink) {
      // Try different patterns
      let match = videoLink.match(/video\.([^/]+)\/([^/?]+)/); // video.ID/slug
      if (!match) {
        match = videoLink.match(/video(\d+)\/([^/?]+)/); // videoNUM/slug
      }
      
      if (match) {
        // For xvideos, ID format is: videoXXXX/slug
        if (match[1] && match[2]) {
          video.id = `video${match[1]}/${match[2]}`;
        }
      }
      
      console.log("🆔 Extracted video ID:", video.id);
    }

    fetchVideoDetails();
  }, [video]);

  const fetchVideoDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // PRIORITY 1: Get stream URL for direct playback
      if (video.id) {
        console.log(`🎬 Fetching stream URL: ${API_BASE}/${platform}/watch?id=${video.id}`);
        
        try {
          const watchRes = await fetch(`${API_BASE}/${platform}/watch?id=${video.id}`);
          const watchData = await watchRes.json();
          
          console.log("📺 Watch response:", watchData);
          
          if (watchData.success && watchData.data?.streamUrl) {
            // Use backend proxy to bypass CORS/SSL issues
            const originalUrl = watchData.data.streamUrl;
            const proxiedUrl = `${API_BASE}/${platform}/proxy?url=${encodeURIComponent(originalUrl)}`;
            setStreamUrl(proxiedUrl);
            console.log("✅ Stream URL extracted:", originalUrl);
            console.log("🔄 Using proxy URL:", proxiedUrl);
          }
        } catch (err) {
          console.warn("⚠️ Failed to get stream URL:", err);
        }
        
        // PRIORITY 2: Get video details (parallel)
        console.log(`📡 Fetching video details: ${API_BASE}/${platform}/get?id=${video.id}`);
        const res = await fetch(`${API_BASE}/${platform}/get?id=${video.id}`);
        const data = await res.json();
        
        console.log("📦 Video details response:", data);
        
        if (data.success) {
          setVideoDetails(data);
          
          // Fetch related videos - Try multiple methods
          try {
            // Method 1: Try related endpoint with proper ID
            const videoIdClean = video.id?.replace('video', '');
            const relatedRes = await fetch(
              `${API_BASE}/${platform}/related?id=${videoIdClean}`
            );
            const relatedData = await relatedRes.json();
            
            if (relatedData.success && relatedData.data?.length > 0) {
              console.log("✅ Related videos from /related:", relatedData.data.length);
              setRelatedVideos(relatedData.data.slice(0, 12));
            } else {
              // Method 2: Fallback to search with tags
              console.log("🔄 Trying search fallback for related videos");
              const tags = data.data?.tags || [];
              const searchQuery = tags[0] || video.title?.split(' ')[0] || 'popular';
              
              const searchRes = await fetch(
                `${API_BASE}/${platform}/search?key=${encodeURIComponent(searchQuery)}&page=1`
              );
              const searchData = await searchRes.json();
              
              if (searchData.success) {
                const videos = searchData.data || searchData.results || [];
                console.log("✅ Related videos from search:", videos.length);
                setRelatedVideos(videos.slice(0, 12));
              }
            }
          } catch (err) {
            console.warn("⚠️ Failed to fetch related videos:", err);
            // Last resort: fetch trending
            try {
              const trendRes = await fetch(`${API_BASE}/${platform}/search?key=hot&page=1`);
              const trendData = await trendRes.json();
              if (trendData.success) {
                const videos = trendData.data || trendData.results || [];
                setRelatedVideos(videos.slice(0, 12));
              }
            } catch (e) {
              console.error("❌ All methods failed");
            }
          }
        }
      }
    } catch (err) {
      console.error("❌ Error fetching video:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gold mb-4">Video Not Found</h2>
          <Link to="/" className="btn-cinema">
            ← Back to Home
        </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingVideo />;
  }

  // Generate embed URL from video URL/ID
  const generateEmbedUrl = () => {
    // If backend provided embed URL, use it
    if (videoDetails?.assets?.[0]) {
      return videoDetails.assets[0];
    }
    
    // Extract video ID from URL
    const videoLink = video.link || video.url || "";
    
    // Pattern: video.XXXXX/slug or videoXXXXX/slug
    const match = videoLink.match(/video\.([^/]+)/);
    
    if (match && match[1]) {
      // Only use the ID part, NOT the slug!
      return `https://www.xvideos.com/embedframe/${match[1]}`;
    }
    
    // Fallback: if video.id exists, extract just the first part
    if (video.id) {
      const idMatch = video.id.match(/video([^/]+)/);
      if (idMatch && idMatch[1]) {
        return `https://www.xvideos.com/embedframe/${idMatch[1]}`;
      }
    }
    
    return null;
  };
  
  const embedUrl = generateEmbedUrl();
  const videoUrl = videoDetails?.assets?.[3] || null;
  
  console.log("🎥 Generated embed URL:", embedUrl);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 sm:mb-8 transition-all duration-300 group">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold text-sm sm:text-base">{t('backToGallery')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Video Player */}
            <div className="bg-white/5 backdrop-blur-lg sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-xl sm:shadow-2xl">
              <div className="aspect-video bg-black relative rounded-2xl sm:rounded-3xl overflow-hidden">
                {streamUrl && !error ? (
                  /* Custom Video Player with Full Controls */
                  <CustomVideoPlayer
                    src={streamUrl}
                    poster={proxyImageUrl(video.image)}
                    title={video.title}
                    onEnded={() => {
                      // Auto-play next related video
                      if (relatedVideos.length > 0) {
                        const nextVideo = relatedVideos[0];
                        navigate('/watch', { state: { video: nextVideo } });
                      }
                    }}
                  />
                ) : loading ? (
                  /* Loading State */
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-center px-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.89l7-3.78v8.88z"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl text-gradient-rizhub font-black mb-2">Loading Premium Content</p>
                      <p className="text-xs sm:text-sm text-white/40">Extracting stream URL...</p>
                      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  /* Error State - Server Down */
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-center p-4 sm:p-6 lg:p-8 max-w-md mx-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-red-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-gradient-rizhub font-black mb-3 sm:mb-4">
                        {t('errorTitle')}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 leading-relaxed">
                        {t('errorMessage')}
                      </p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="btn-rizhub text-sm sm:text-base"
                      >
                        🔄 {t('refreshPage')}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Fallback: Loading Player */
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    {video.image && (
                      <img 
                        src={proxyImageUrl(video.image)}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl sm:blur-2xl"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="relative text-center p-4 sm:p-6 lg:p-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-base sm:text-lg lg:text-xl text-gradient-rizhub font-black mb-2">{t('preparing')}</p>
                      <p className="text-xs sm:text-sm text-white/40">{t('pleasewait')}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Alternative: Try iframe (hidden by default, might work on some videos) */}
              <div className="hidden">
                {embedUrl ? (
          <iframe
                    src={embedUrl}
                    title={video.title || "Video player"}
                    className="w-full aspect-video border-0"
                    frameBorder="0"
            allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                ) : videoUrl ? (
                  <video
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={video.image}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#6b1423]">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">📺</div>
                      <p className="text-xl text-gray-300 mb-4">Video player not available</p>
                      <p className="text-sm text-gray-400 mb-6">
                        This video cannot be embedded. You can watch it on the original site:
                      </p>
                      <a 
                        href={video.url || video.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-cinema inline-block"
                      >
                        🌐 Watch on XVideos
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white/5 backdrop-blur-lg sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
              {/* Title & Options */}
              <div className="flex items-start justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-2xl lg:text-4xl font-black text-white leading-tight flex-1">
                  {(videoDetails?.data?.title && videoDetails.data.title !== 'Not found' ? videoDetails.data.title : video.title) || 'Loading...'}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <ShareButton video={video} />
                  <WatchOptions video={video} />
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                {videoDetails?.data?.views && videoDetails.data.views !== 'None' && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-xl sm:rounded-2xl border border-white/10">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-purple-600/20 flex items-center justify-center text-base sm:text-lg lg:text-xl">
                      👁️
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/40 uppercase font-semibold tracking-wide">VIEWS</p>
                      <p className="text-xs sm:text-sm font-bold text-purple-400">
                        {videoDetails.data.views}
                      </p>
                    </div>
                  </div>
                )}
                
                {videoDetails?.data?.rating && videoDetails.data.rating !== 'None' && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-xl sm:rounded-2xl border border-white/10">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-pink-600/20 flex items-center justify-center text-base sm:text-lg lg:text-xl">
                      ⭐
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/40 uppercase font-semibold tracking-wide">RATING</p>
                      <p className="text-xs sm:text-sm font-bold text-pink-400">
                        {videoDetails.data.rating}
                      </p>
                    </div>
                  </div>
                )}
                
                {videoDetails?.data?.duration && videoDetails.data.duration !== '0min, 0sec' && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 rounded-xl sm:rounded-2xl border border-white/10">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-red-600/20 flex items-center justify-center text-base sm:text-lg lg:text-xl">
                      ⏱️
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/40 uppercase font-semibold tracking-wide">DURATION</p>
                      <p className="text-xs sm:text-sm font-bold text-red-400">
                        {videoDetails.data.duration || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                
                {videoDetails?.data?.uploaded && videoDetails.data.uploaded !== 'None' && (
                  <div className="flex items-center gap-2 bg-[#0a0e27]/50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
                    <span className="text-lg sm:text-2xl">📅</span>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400">Uploaded</p>
                      <p className="text-xs sm:text-sm font-bold text-[#d4af37]">
                        {videoDetails.data.uploaded}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Votes */}
              {(videoDetails?.data?.upvoted && videoDetails.data.upvoted !== 'None') || (videoDetails?.data?.downvoted && videoDetails.data.downvoted !== 'None') && (
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {videoDetails.data.upvoted && videoDetails.data.upvoted !== 'None' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-green-400">
                      <span className="text-base sm:text-xl">👍</span>
                      <span className="font-semibold text-sm sm:text-base">{videoDetails.data.upvoted}</span>
                    </div>
                  )}
                  {videoDetails.data.downvoted && videoDetails.data.downvoted !== 'None' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-red-400">
                      <span className="text-base sm:text-xl">👎</span>
                      <span className="font-semibold text-sm sm:text-base">{videoDetails.data.downvoted}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {videoDetails?.data?.tags && videoDetails.data.tags.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {videoDetails.data.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[10px] sm:text-xs text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Like Button */}
            <div className="flex justify-center lg:justify-start">
              <LikeButton 
                videoId={video.id || video.url?.split('/').pop()} 
                platform={platform}
              />
            </div>
            
            {/* Comment Section */}
            <CommentSection 
              videoId={video.id || video.url?.split('/').pop()} 
              platform={platform}
            />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gradient-rizhub mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">🎬</span> {t('relatedContent')}
              </h2>
              
              {relatedVideos.length > 0 ? (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    {relatedVideos.slice(0, relatedPage * RELATED_PER_PAGE).map((v, i) => (
                      <div key={v.id || i} className="transform hover:scale-[1.02] transition-transform duration-300">
                        <VideoCard video={v} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {relatedVideos.length > relatedPage * RELATED_PER_PAGE && (
                    <button
                      onClick={() => setRelatedPage(prev => prev + 1)}
                      className="w-full mt-3 sm:mt-4 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 border border-purple-500/30 hover:border-purple-500 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-bold transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30"
                    >
                      {t('language') === 'en' ? '⬇️ Load More' : '⬇️ Muat Lebih Banyak'}
                    </button>
                  )}
                </>
              ) : loading ? (
                <div className="text-center py-6 sm:py-8 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10">
                  <div className="loading-rizhub w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-xl sm:rounded-2xl"></div>
                  <p className="text-xs sm:text-sm text-white/40">Loading related content...</p>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-purple-600/20 flex items-center justify-center text-2xl sm:text-3xl">
                    🎬
                  </div>
                  <p className="text-xs sm:text-sm text-white/40">No related videos found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
