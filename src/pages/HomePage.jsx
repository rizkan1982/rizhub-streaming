import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import FilterMenu from "../components/FilterMenu";
import VideoSection from "../components/VideoSection";
import { useLanguage } from "../contexts/LanguageContext";
import { getContinueWatching, getFavorites, getWatchHistory, clearHistory } from "../utils/watchHistory";

const API_BASE = import.meta.env.VITE_API_BASE || "https://rizhub-backenddua.vercel.app";

// Debug logging
console.log("🔧 API_BASE:", API_BASE);
console.log("🔧 VITE_API_BASE from env:", import.meta.env.VITE_API_BASE);

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("trending"); // trending, search
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ genre: '', duration: '' });
  const [continueWatching, setContinueWatching] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const { t } = useLanguage();
  
  // Load Continue Watching and Favorites
  useEffect(() => {
    setContinueWatching(getContinueWatching());
    setFavorites(getFavorites());
    setWatchHistory(getWatchHistory());
  }, [videos]); // Refresh when videos change

  useEffect(() => {
    const platform = searchParams.get("platform") || "xvideos";
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const genre = searchParams.get("genre") || '';
    const duration = searchParams.get("duration") || '';

    setCurrentPage(page);
    setFilters({ genre, duration });

    // Build search query with filters
    let searchQuery = search || '';
    if (genre) {
      searchQuery = searchQuery ? `${searchQuery} ${genre}` : genre;
    }

    if (searchQuery || genre) {
      setMode("search");
      fetchSearch(platform, searchQuery, page);
    } else {
      setMode("trending");
      fetchTrending(platform, page);
    }
  }, [searchParams]);

  const fetchSearch = async (platform, query, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/${platform}/search?key=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await res.json();
      
      if (data.success) {
        // Handle both response formats: data.data or data.results
        const videos = data.data || data.results || [];
        setVideos(videos);
      } else {
        setError(data.message || "Failed to fetch videos");
        setVideos([]);
      }
    } catch (err) {
      setError("Failed to connect to server");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async (platform, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Use random popular queries for variety on each page
      const trendingQueries = [
        "hot", "milf", "teen", "asian", "pov", "amateur", "big tits", 
        "big ass", "blonde", "brunette", "latina", "anal", "threesome",
        "lesbian", "massage", "stepmom", "teacher", "office", "public"
      ];
      
      // Pick a random query, but consistent for the same page (so back button works)
      const seed = page * 7; // Simple seed based on page
      const queryIndex = seed % trendingQueries.length;
      const query = trendingQueries[queryIndex];
      
      console.log(`🔥 Fetching trending (page ${page}): ${query}`);
      
      const res = await fetch(`${API_BASE}/${platform}/search?key=${query}&page=${page}`);
      const data = await res.json();
      
      if (data.success) {
        setVideos(data.data || data.results || []);
      } else {
        setError(data.message || "Failed to fetch videos");
        setVideos([]);
      }
    } catch (err) {
      console.error("❌ Trending fetch error:", err);
      setError("Failed to connect to server");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('🔄 Page change requested:', newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Update filters
    if (newFilters.genre) {
      params.set('genre', newFilters.genre);
    } else {
      params.delete('genre');
    }
    
    if (newFilters.duration) {
      params.set('duration', newFilters.duration);
    } else {
      params.delete('duration');
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 px-4 overflow-hidden">
        {/* Animated Gradient Background - Desktop only */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6">
            <span className="text-gradient-rizhub">{t('welcomeTitle')}</span>
          </h1>
          <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-6 md:mb-8">
            {t('welcomeDesc')}
          </p>
          <div className="flex justify-center gap-4 md:gap-8 text-white/40">
            <div className="flex flex-col items-center gap-1.5 md:gap-2">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5">
                <div className="w-full h-full bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold">
                  4K
                </div>
              </div>
              <span className="text-xs md:text-sm font-semibold">{t('ultraHD')}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 md:gap-2">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-600 to-red-600 p-0.5">
                <div className="w-full h-full bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl">
                  ⚡
                </div>
              </div>
              <span className="text-xs md:text-sm font-semibold">{t('fastStream')}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 md:gap-2">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-red-600 to-purple-600 p-0.5">
                <div className="w-full h-full bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl">
                  🔒
                </div>
              </div>
              <span className="text-xs md:text-sm font-semibold">{t('secure')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Watching & Favorites Sections */}
      {!loading && !error && (continueWatching.length > 0 || favorites.length > 0 || watchHistory.length > 0) && (
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Continue Watching */}
          {continueWatching.length > 0 && (
            <VideoSection
              title="Continue Watching"
              videos={continueWatching}
              icon="▶️"
              showProgress={true}
            />
          )}
          
          {/* Favorites */}
          {favorites.length > 0 && (
            <VideoSection
              title="My Favorites"
              videos={favorites}
              icon="❤️"
              onClear={() => {
                localStorage.removeItem('rizhub_favorites');
                setFavorites([]);
              }}
            />
          )}
          
          {/* Recently Watched */}
          {watchHistory.length > 0 && (
            <VideoSection
              title="Recently Watched"
              videos={watchHistory.slice(0, 10)}
              icon="🕒"
              onClear={() => {
                clearHistory();
                setWatchHistory([]);
              }}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-12">
        {/* Section Header with Filter */}
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-4xl font-black mb-2 md:mb-3">
              {mode === "search" ? (
                <span className="text-gradient-rizhub">{t('searchResults')}</span>
              ) : (
                <span className="text-gradient-rizhub">{t('trending')}</span>
              )}
            </h2>
            <div className="h-1 md:h-1.5 w-24 md:w-40 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full"></div>
          </div>
          
          {/* Filter Menu */}
          <FilterMenu 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 md:mb-8 p-4 md:p-8 bg-red-500/10 border border-red-500/30 rounded-2xl md:rounded-3xl backdrop-blur-sm md:backdrop-blur-xl">
            <div className="flex items-start md:items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold text-red-400 mb-1">{t('connectionError')}</h3>
                <p className="text-sm md:text-base text-white/70">{t('failedToConnect')}</p>
                <p className="text-xs md:text-sm text-white/40 mt-1 md:mt-2">
                  {t('makeBackend')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <Loading count={18} />}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {videos.map((video, i) => (
                <VideoCard key={video.id || i} video={video} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              hasMore={videos.length > 0} // Always show next if we have videos
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-16 md:py-32">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center text-4xl md:text-6xl">
              🎭
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">
              {t('noVideos')}
            </h3>
            <p className="text-white/50 text-base md:text-lg">
              {t('tryDifferent')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
