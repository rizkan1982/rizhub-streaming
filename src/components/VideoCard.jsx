import React from "react";
import { useNavigate } from "react-router-dom";
import { isFavorite, toggleFavorite } from "../utils/watchHistory";
import { proxyImageUrl } from "../utils/imageProxy";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);

  // Check if video is favorited
  React.useEffect(() => {
    setIsFav(isFavorite(video.url || video.link || video.id));
  }, [video]);

  const handleClick = () => {
    navigate("/watch", { state: { video } });
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const result = toggleFavorite({
      ...video,
      url: video.url || video.link || video.id
    });
    setIsFav(result.isFavorite);
  };

  // Get image URL dari berbagai field dan proxy untuk bypass ISP blocking
  const imageUrl = video.image || video.thumb || video.thumbnail || video.img || null;
  const proxiedImageUrl = proxyImageUrl(imageUrl);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="video-card cursor-pointer group w-full"
    >
      {/* Image Container with Preview Effect */}
      <div className="relative overflow-hidden aspect-[2/3] md:aspect-[9/14] rounded-xl md:rounded-2xl">
        {imageUrl && !imageError ? (
          <>
            {/* Main Image with ISP Bypass Proxy */}
            <img
              src={proxiedImageUrl}
              alt={video.title || "Video thumbnail"}
              className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-110 md:group-hover:brightness-75"
              loading="lazy"
              onError={handleImageError}
            />
            
            {/* Gradient Overlay on Hover - Desktop only */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Mobile gradient - always visible */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* Preview Shimmer Effect - Desktop only */}
            {isHovering && (
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center flex-col gap-3 p-4">
            <div className="text-6xl">🎬</div>
            <p className="text-xs text-center text-white/50 line-clamp-2">{video.title}</p>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-black/90 backdrop-blur-sm md:backdrop-blur-xl rounded-lg md:rounded-xl flex items-center justify-center active:scale-95 md:hover:scale-110 transition-transform border border-white/10 z-10"
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFav ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white/60 active:text-red-400 md:hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          )}
        </button>
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/90 backdrop-blur-sm md:backdrop-blur-xl px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-xs font-bold text-white border border-white/10">
            {video.duration}
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="play-overlay">
          <div className="play-button">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Hover Glow Border - Desktop only */}
        <div className="hidden md:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.5)]"></div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <h2 className="text-xs md:text-sm font-bold line-clamp-2 text-white md:group-hover:text-gradient-rizhub transition-colors duration-200">
          {video.title || "Untitled Video"}
        </h2>
        
        {/* Additional Info */}
        <div className="flex items-center gap-3 md:gap-4 text-xs text-white/40">
          {video.views && (
            <span className="flex items-center gap-1 md:gap-1.5 md:group-hover:text-purple-400 transition-colors">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {video.views}
            </span>
          )}
          {video.rating && (
            <span className="flex items-center gap-1 md:gap-1.5 md:group-hover:text-pink-400 transition-colors">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {video.rating}
            </span>
          )}
        </div>
        
        {/* Premium Badge (Optional) - Desktop only */}
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Premium Quality
          </div>
        </div>
      </div>
    </div>
  );
}
