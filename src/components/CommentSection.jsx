import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function CommentSection({ videoId }) {
  const { language } = useLanguage();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [username, setUsername] = useState("");

  const isEnglish = language === 'en';

  // Load comments from localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem(`rizhub-comments-${videoId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }

    // Generate or get anonymous username
    let storedUsername = localStorage.getItem('rizhub-username');
    if (!storedUsername) {
      storedUsername = `User${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('rizhub-username', storedUsername);
    }
    setUsername(storedUsername);
  }, [videoId]);

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    setIsPosting(true);

    setTimeout(() => {
      const comment = {
        id: Date.now(),
        username: username,
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      localStorage.setItem(`rizhub-comments-${videoId}`, JSON.stringify(updatedComments));
      setNewComment("");
      setIsPosting(false);
    }, 500);
  };

  const handleLike = (commentId) => {
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updatedComments);
    localStorage.setItem(`rizhub-comments-${videoId}`, JSON.stringify(updatedComments));
  };

  const handleDislike = (commentId) => {
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, dislikes: c.dislikes + 1 } : c
    );
    setComments(updatedComments);
    localStorage.setItem(`rizhub-comments-${videoId}`, JSON.stringify(updatedComments));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return isEnglish ? 'Just now' : 'Baru saja';
    if (diffMins < 60) return `${diffMins} ${isEnglish ? 'min ago' : 'menit lalu'}`;
    if (diffHours < 24) return `${diffHours} ${isEnglish ? 'hr ago' : 'jam lalu'}`;
    return `${diffDays} ${isEnglish ? 'days ago' : 'hari lalu'}`;
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-black text-gradient-rizhub">
          💬 {isEnglish ? 'Comments' : 'Komentar'}
        </h3>
        <span className="px-3 py-1 bg-purple-600/20 rounded-full text-sm font-bold text-purple-400">
          {comments.length}
        </span>
      </div>

      {/* Add Comment */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white flex-shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            {/* Username Display */}
            <div className="mb-2 text-sm text-white/60">
              {isEnglish ? 'Commenting as' : 'Berkomentar sebagai'}{' '}
              <span className="text-gradient-rizhub font-bold">{username}</span>
            </div>
            
            {/* Comment Input */}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isEnglish ? "Share your thoughts... (No login required)" : "Bagikan pikiran Anda... (Tanpa login)"}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
              rows={3}
              disabled={isPosting}
            />
            
            {/* Post Button */}
            <div className="mt-3 flex justify-end">
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim() || isPosting}
                className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
                  !newComment.trim() || isPosting
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {isPosting 
                  ? (isEnglish ? '⏳ Posting...' : '⏳ Mengirim...') 
                  : (isEnglish ? '📤 Post Comment' : '📤 Kirim Komentar')
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center text-3xl">
              💭
            </div>
            <p className="text-white/50">
              {isEnglish ? 'No comments yet. Be the first!' : 'Belum ada komentar. Jadilah yang pertama!'}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  {/* Username & Time */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-white">{comment.username}</span>
                    <span className="text-xs text-white/40">{formatTimeAgo(comment.timestamp)}</span>
                  </div>
                  
                  {/* Comment Content */}
                  <p className="text-white/80 mb-3 leading-relaxed">{comment.content}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 transition-all group"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform">👍</span>
                      <span className="text-sm font-semibold text-white/70 group-hover:text-green-400">
                        {comment.likes > 0 && comment.likes}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleDislike(comment.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all group"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform">👎</span>
                      <span className="text-sm font-semibold text-white/70 group-hover:text-red-400">
                        {comment.dislikes > 0 && comment.dislikes}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
