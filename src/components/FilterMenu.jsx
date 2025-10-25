import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function FilterMenu({ onFilterChange, currentFilters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  
  const isEnglish = language === 'en';

  // Genre options
  const genres = [
    { id: 'all', label: isEnglish ? 'All Genres' : 'Semua Genre', value: '' },
    { id: 'amateur', label: 'Amateur', value: 'amateur' },
    { id: 'anal', label: 'Anal', value: 'anal' },
    { id: 'asian', label: 'Asian', value: 'asian' },
    { id: 'bbw', label: 'BBW', value: 'bbw' },
    { id: 'bdsm', label: 'BDSM', value: 'bdsm' },
    { id: 'big-ass', label: 'Big Ass', value: 'big ass' },
    { id: 'big-tits', label: 'Big Tits', value: 'big tits' },
    { id: 'blonde', label: 'Blonde', value: 'blonde' },
    { id: 'blowjob', label: 'Blowjob', value: 'blowjob' },
    { id: 'brunette', label: 'Brunette', value: 'brunette' },
    { id: 'creampie', label: 'Creampie', value: 'creampie' },
    { id: 'ebony', label: 'Ebony', value: 'ebony' },
    { id: 'hardcore', label: 'Hardcore', value: 'hardcore' },
    { id: 'hentai', label: 'Hentai', value: 'hentai' },
    { id: 'latina', label: 'Latina', value: 'latina' },
    { id: 'lesbian', label: 'Lesbian', value: 'lesbian' },
    { id: 'milf', label: 'MILF', value: 'milf' },
    { id: 'pov', label: 'POV', value: 'pov' },
    { id: 'squirt', label: 'Squirt', value: 'squirt' },
    { id: 'teen', label: 'Teen (18+)', value: 'teen' },
    { id: 'threesome', label: 'Threesome', value: 'threesome' },
  ];

  // Duration options
  const durations = [
    { id: 'all', label: isEnglish ? 'All Durations' : 'Semua Durasi', value: '' },
    { id: 'short', label: isEnglish ? 'Short (0-5 min)' : 'Pendek (0-5 menit)', value: '0-5' },
    { id: 'medium', label: isEnglish ? 'Medium (5-10 min)' : 'Sedang (5-10 menit)', value: '5-10' },
    { id: 'long', label: isEnglish ? 'Long (10-30 min)' : 'Panjang (10-30 menit)', value: '10-30' },
    { id: 'verylong', label: isEnglish ? 'Very Long (30-60 min)' : 'Sangat Panjang (30-60 menit)', value: '30-60' },
    { id: 'epic', label: isEnglish ? 'Epic (60+ min)' : 'Epik (60+ menit)', value: '60+' },
  ];

  const handleGenreChange = (value) => {
    onFilterChange({ ...currentFilters, genre: value, page: 1 });
  };

  const handleDurationChange = (value) => {
    onFilterChange({ ...currentFilters, duration: value, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({ genre: '', duration: '', page: 1 });
  };

  const hasActiveFilters = currentFilters.genre || currentFilters.duration;

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2 sm:p-3 lg:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl sm:rounded-2xl transition-all duration-300"
        title={isEnglish ? "Filters & Settings" : "Filter & Pengaturan"}
      >
        {/* Notification Badge */}
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold text-white">
              {(currentFilters.genre ? 1 : 0) + (currentFilters.duration ? 1 : 0)}
            </span>
          </div>
        )}
        
        {/* Hamburger Icon */}
        <div className="flex flex-col gap-1 sm:gap-1.5 w-5 sm:w-6">
          <div className={`h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5 sm:translate-y-2' : ''}`}></div>
          <div className={`h-0.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`h-0.5 bg-gradient-to-r from-red-400 to-purple-400 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5 sm:-translate-y-2' : ''}`}></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="absolute right-0 mt-2 sm:mt-4 w-[90vw] sm:w-80 lg:w-96 max-w-md max-h-[85vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl z-50 animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gradient-rizhub">
                  {isEnglish ? '🎛️ Filters' : '🎛️ Filter'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {isEnglish ? 'Clear All Filters' : 'Hapus Semua Filter'}
                </button>
              )}
            </div>

            {/* Genre Section */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-white/10">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎭</span>
                {isEnglish ? 'Genre' : 'Genre'}
              </h4>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.value)}
                    className={`
                      px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300
                      ${(currentFilters.genre === genre.value) || (!currentFilters.genre && genre.value === '')
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                      }
                    `}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Section */}
            <div className="p-3 sm:p-4 lg:p-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">⏱️</span>
                {isEnglish ? 'Duration' : 'Durasi'}
              </h4>
              <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => handleDurationChange(duration.value)}
                    className={`
                      px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 text-left
                      ${(currentFilters.duration === duration.value) || (!currentFilters.duration && duration.value === '')
                        ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                      }
                    `}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Info */}
            <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-t border-white/10">
              <p className="text-xs sm:text-sm text-white/50 text-center">
                {isEnglish 
                  ? '💡 Tip: Combine genre + duration for better results!' 
                  : '💡 Tips: Gabungkan genre + durasi untuk hasil lebih baik!'
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

