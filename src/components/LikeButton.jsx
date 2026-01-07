import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LikeButton({ videoId }) {
  const { language } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const isEnglish = language === 'en';

  useEffect(() => {
    // Load likes from localStorage
    const storedLikes = localStorage.getItem(`rizhub-likes-${videoId}`);
    if (storedLikes) {
      const data = JSON.parse(storedLikes);
      setLikeCount(data.likes || 0);
      setDislikeCount(data.dislikes || 0);
    }

    // Check if user already liked/disliked
    const userAction = localStorage.getItem(`rizhub-user-action-${videoId}`);
    if (userAction === 'like') setLiked(true);
    if (userAction === 'dislike') setDisliked(true);
  }, [videoId]);

  const handleLike = () => {
    if (liked) {
      // Unlike
      setLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
      localStorage.removeItem(`rizhub-user-action-${videoId}`);
    } else {
      // Like
      setLiked(true);
      setLikeCount(prev => prev + 1);
      
      // Remove dislike if exists
      if (disliked) {
        setDisliked(false);
        setDislikeCount(prev => Math.max(0, prev - 1));
      }
      
      localStorage.setItem(`rizhub-user-action-${videoId}`, 'like');
    }

    // Update total counts
    updateCounts();
  };

  const handleDislike = () => {
    if (disliked) {
      // Remove dislike
      setDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
      localStorage.removeItem(`rizhub-user-action-${videoId}`);
    } else {
      // Dislike
      setDisliked(true);
      setDislikeCount(prev => prev + 1);
      
      // Remove like if exists
      if (liked) {
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      
      localStorage.setItem(`rizhub-user-action-${videoId}`, 'dislike');
    }

    // Update total counts
    updateCounts();
  };

  const updateCounts = () => {
    setTimeout(() => {
      const data = {
        likes: likeCount + (liked ? 0 : 1) - (liked ? 1 : 0),
        dislikes: dislikeCount + (disliked ? 0 : 1) - (disliked ? 1 : 0)
      };
      localStorage.setItem(`rizhub-likes-${videoId}`, JSON.stringify(data));
    }, 100);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 ${
          liked
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-green-500/30'
        }`}
      >
        <span className={`text-lg sm:text-xl lg:text-2xl transition-transform ${liked ? 'scale-125' : 'group-hover:scale-110'}`}>
          {liked ? '👍' : '👍'}
        </span>
        <div className="text-left">
          <div className="text-[10px] sm:text-xs opacity-60">{isEnglish ? 'Like' : 'Suka'}</div>
          <div className="text-xs sm:text-sm font-black">{likeCount > 0 ? likeCount.toLocaleString() : '0'}</div>
        </div>
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 ${
          disliked
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50'
            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-red-500/30'
        }`}
      >
        <span className={`text-lg sm:text-xl lg:text-2xl transition-transform ${disliked ? 'scale-125' : 'group-hover:scale-110'}`}>
          {disliked ? '👎' : '👎'}
        </span>
        <div className="text-left">
          <div className="text-[10px] sm:text-xs opacity-60">{isEnglish ? 'Dislike' : 'Tidak Suka'}</div>
          <div className="text-xs sm:text-sm font-black">{dislikeCount > 0 ? dislikeCount.toLocaleString() : '0'}</div>
        </div>
      </button>
    </div>
  );
}
