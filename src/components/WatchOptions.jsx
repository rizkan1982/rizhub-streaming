import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function WatchOptions({ video }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const isEnglish = language === 'en';

  const options = [
    {
      icon: '🏠',
      label: isEnglish ? 'Back to Home' : 'Kembali ke Beranda',
      action: () => navigate('/'),
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: '🔍',
      label: isEnglish ? 'Search Similar' : 'Cari yang Mirip',
      action: () => {
        const firstTag = video?.tags?.[0] || video?.title?.split(' ')[0] || 'hot';
        navigate(`/?search=${encodeURIComponent(firstTag)}`);
      },
      color: 'from-pink-600 to-red-600'
    },
    {
      icon: '🔄',
      label: isEnglish ? 'Reload Video' : 'Muat Ulang Video',
      action: () => window.location.reload(),
      color: 'from-cyan-600 to-blue-600'
    },
    {
      icon: '📋',
      label: isEnglish ? 'Copy Link' : 'Salin Link',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        alert(isEnglish ? '✅ Link copied!' : '✅ Link disalin!');
      },
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: '⚠️',
      label: isEnglish ? 'Report Issue' : 'Laporkan Masalah',
      action: () => {
        alert(isEnglish 
          ? 'Report feature coming soon!' 
          : 'Fitur laporan segera hadir!'
        );
      },
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: '❤️',
      label: isEnglish ? 'Save to Favorites' : 'Simpan ke Favorit',
      action: () => {
        const favorites = JSON.parse(localStorage.getItem('rizhub-favorites') || '[]');
        const exists = favorites.find((v) => v.id === video?.id);
        
        if (exists) {
          alert(isEnglish ? '✅ Already in favorites!' : '✅ Sudah ada di favorit!');
        } else {
          favorites.push({
            id: video?.id,
            title: video?.title,
            image: video?.image,
            url: video?.url,
            addedAt: new Date().toISOString()
          });
          localStorage.setItem('rizhub-favorites', JSON.stringify(favorites));
          alert(isEnglish ? '✅ Added to favorites!' : '✅ Ditambahkan ke favorit!');
        }
      },
      color: 'from-pink-600 to-rose-600'
    },
  ];

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2 sm:p-3 lg:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg"
        title={isEnglish ? "Options" : "Opsi"}
      >
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
          <div className="absolute right-0 mt-2 sm:mt-4 w-[90vw] sm:w-80 max-w-sm max-h-[80vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl z-50 animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-2xl font-black text-gradient-rizhub">
                  ⚙️ {isEnglish ? 'Options' : 'Opsi'}
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
            </div>

            {/* Options List */}
            <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-gradient-to-r ${option.color} border border-white/10 hover:border-white/20 transition-all duration-300 group`}
                >
                  <span className="text-xl sm:text-3xl group-hover:scale-125 transition-transform flex-shrink-0">
                    {option.icon}
                  </span>
                  <span className="text-left text-sm sm:text-base font-bold text-white/80 group-hover:text-white transition-colors">
                    {option.label}
                  </span>
                  <svg className="ml-auto w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

          </div>
        </>
      )}
    </div>
  );
}

