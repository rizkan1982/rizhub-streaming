import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getRecentSearches, addRecentSearch } from "../utils/watchHistory";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const searchRef = useRef(null);

  // Popular search suggestions
  const popularSearches = [
    "hot", "milf", "teen", "asian", "latina", "amateur", 
    "big tits", "big ass", "blonde", "brunette", "threesome",
    "lesbian", "anal", "pov", "massage", "stepmom"
  ];

  // Load recent searches
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e, searchQuery = null) => {
    if (e) e.preventDefault();
    const finalQuery = searchQuery || query;
    
    if (finalQuery.trim()) {
      addRecentSearch(finalQuery.trim());
      setRecentSearches(getRecentSearches());
      navigate(`/?platform=xvideos&search=${encodeURIComponent(finalQuery.trim())}`);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(null, suggestion);
  };

  // Filter suggestions based on query
  const filteredSuggestions = query.trim() 
    ? popularSearches.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];
  
  const showingSuggestions = showSuggestions && (recentSearches.length > 0 || filteredSuggestions.length > 0);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/95 border-b border-white/5 shadow-2xl">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo - RizHub */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Logo Icon */}
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-3 rounded-2xl transform group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.89l7-3.78v8.88z"/>
                </svg>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent tracking-tight">
                RizHub
              </h1>
              <p className="text-xs text-white/40 tracking-widest uppercase font-semibold">
                {t('premium')}
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('search')}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                {t('searchBtn')}
              </button>
              
              {/* Search Suggestions */}
              {showingSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && !query.trim() && (
                    <div className="p-2">
                      <div className="px-4 py-2 text-xs text-white/40 font-semibold uppercase tracking-wider">
                        🕒 Recent Searches
                      </div>
                      {recentSearches.slice(0, 5).map((search, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 text-white rounded-xl transition-colors flex items-center gap-3 group"
                        >
                          <svg className="w-4 h-4 text-white/40 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="group-hover:text-gradient-rizhub">{search}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Filtered Suggestions */}
                  {filteredSuggestions.length > 0 && query.trim() && (
                    <div className="p-2">
                      <div className="px-4 py-2 text-xs text-white/40 font-semibold uppercase tracking-wider">
                        🔥 Popular Searches
                      </div>
                      {filteredSuggestions.slice(0, 8).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 text-white rounded-xl transition-colors flex items-center gap-3 group"
                        >
                          <svg className="w-4 h-4 text-white/40 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="group-hover:text-gradient-rizhub">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group"
            title="Switch Language"
          >
            <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">
              {language === 'en' ? 'EN' : 'ID'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

