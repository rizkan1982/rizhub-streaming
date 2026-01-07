import VideoCard from './VideoCard';
import { useNavigate } from 'react-router-dom';

export default function VideoSection({ title, videos, icon, onClear, showProgress = false }) {
  const navigate = useNavigate();

  if (videos.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center text-2xl">
              {icon}
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-sm font-bold text-white border border-purple-500/30">
            {videos.length}
          </span>
        </div>
        
        {onClear && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm font-semibold border border-red-500/30"
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {/* Videos Grid */}
      <div className="relative">
        {/* Gradient Fade on Sides */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto scroll-smooth pb-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-white/5">
          <div className="flex gap-4 min-w-max px-2">
            {videos.map((video, i) => (
              <div key={i} className="w-72 relative">
                {showProgress && video.progressPercent && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10 rounded-b-2xl overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      style={{ width: `${video.progressPercent}%` }}
                    ></div>
                  </div>
                )}
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

