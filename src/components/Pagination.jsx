import { useLanguage } from "../contexts/LanguageContext";

export default function Pagination({ currentPage, totalPages, onPageChange, hasMore = true }) {
  const { language } = useLanguage();
  
  const prevText = language === 'en' ? 'Previous' : 'Sebelumnya';
  const nextText = language === 'en' ? 'Next' : 'Selanjutnya';
  const pageText = language === 'en' ? 'Page' : 'Halaman';
  
  console.log('📄 Pagination render:', { currentPage, hasMore, totalPages });

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 py-6 sm:py-8 lg:py-12 px-2">
      {/* Previous Button */}
      <button
        onClick={() => {
          console.log('⬅️ Previous button clicked!');
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage <= 1}
        className={`
          group relative px-3 py-2 sm:px-5 sm:py-3 lg:px-8 lg:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm lg:text-lg
          transition-all duration-300 overflow-hidden
          ${currentPage <= 1 
            ? 'bg-white/5 text-white/30 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 text-white border border-purple-500/30 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/30'
          }
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center gap-1 sm:gap-2">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{prevText}</span>
          <span className="sm:hidden">◄</span>
        </span>
      </button>

      {/* Page Indicator */}
      <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 rounded-xl sm:rounded-2xl border border-white/10">
        <span className="text-white font-bold text-xs sm:text-sm lg:text-lg whitespace-nowrap">
          <span className="hidden sm:inline">{pageText} </span>
          <span className="text-gradient-rizhub text-sm sm:text-xl lg:text-2xl">{currentPage}</span>
          {totalPages && <span className="text-white/40 text-xs sm:text-sm lg:text-base"> / {totalPages}</span>}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => {
          console.log('➡️ Next button clicked!');
          onPageChange(currentPage + 1);
        }}
        disabled={!hasMore}
        className={`
          group relative px-3 py-2 sm:px-5 sm:py-3 lg:px-8 lg:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm lg:text-lg
          transition-all duration-300 overflow-hidden
          ${!hasMore 
            ? 'bg-white/5 text-white/30 cursor-not-allowed' 
            : 'bg-gradient-to-r from-pink-600/20 to-red-600/20 hover:from-pink-600 hover:to-red-600 text-white border border-pink-500/30 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/30'
          }
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline">{nextText}</span>
          <span className="sm:hidden">►</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
}

