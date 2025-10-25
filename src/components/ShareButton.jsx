import { useState } from 'react';

export default function ShareButton({ video, url }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const title = video?.title || 'Check out this video!';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: '🔗',
      action: handleCopyLink,
      color: 'from-purple-600 to-pink-600'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank');
      },
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
      color: 'from-blue-400 to-blue-500'
    },
    {
      name: 'Facebook',
      icon: '📘',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      },
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
      },
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Reddit',
      icon: '👽',
      action: () => {
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`, '_blank');
      },
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden border border-purple-500/30 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/30 font-bold"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base">
          📤 <span className="hidden sm:inline">Share</span>
        </span>
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 z-50 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl min-w-[220px] sm:min-w-[250px]">
            {/* Copied Notification */}
            {copied && (
              <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-green-500/20 border border-green-500/30 rounded-lg sm:rounded-xl text-green-400 text-xs sm:text-sm font-semibold text-center">
                ✅ Link copied!
              </div>
            )}
            
            {/* Share Options */}
            <div className="space-y-1.5 sm:space-y-2">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link') {
                      setShowMenu(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white/5 transition-colors text-left group/item"
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center text-base sm:text-lg flex-shrink-0`}>
                    {option.icon}
                  </div>
                  <span className="text-white text-sm sm:text-base font-semibold group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:${option.color}">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

