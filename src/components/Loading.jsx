export default function Loading({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="loading-rizhub rounded-2xl overflow-hidden border border-white/10">
          <div className="aspect-[9/14] bg-white/5"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-white/5 rounded-lg w-3/4"></div>
            <div className="h-3 bg-white/5 rounded-lg w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingVideo() {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-500 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-pink-500 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-red-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-purple-400 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-pink-400 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-red-400 rounded-full animate-float" style={{animationDelay: '2.5s'}}></div>
      </div>

      <div className="relative text-center z-10">
        {/* Main Animated Logo */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Outer rotating rings */}
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-pink-600 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-2 border-4 border-transparent border-b-pink-600 border-l-red-600 rounded-full animate-spin-reverse"></div>
          
          {/* Glowing background pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          
          {/* Center shield logo with bounce */}
          <div className="absolute inset-6 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
            <div className="relative">
              {/* Play icon */}
              <svg className="w-16 h-16 text-white animate-scale-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Animated Title Text */}
        <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
          Loading RizHub
        </h2>
        <p className="text-white/60 text-lg animate-pulse" style={{animationDelay: '0.5s'}}>
          Preparing your premium content...
        </p>
        
        {/* Animated Progress Bar */}
        <div className="mt-8 w-80 mx-auto">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-loading-bar"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-loading-shine"></div>
          </div>
          
          {/* Loading Steps */}
          <div className="mt-3 flex justify-between text-xs text-white/40">
            <span className="animate-pulse">◆ Initializing...</span>
            <span className="animate-pulse" style={{animationDelay: '0.5s'}}>◆ Loading...</span>
            <span className="animate-pulse" style={{animationDelay: '1s'}}>◆ Almost ready...</span>
          </div>
        </div>

        {/* Bouncing Dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
