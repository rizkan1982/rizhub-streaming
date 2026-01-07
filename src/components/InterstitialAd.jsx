import { useState, useEffect } from 'react';

/**
 * Interstitial Ad Component
 * Menampilkan iklan full-screen sebelum video diputar
 * 
 * Ganti YOUR_INTERSTITIAL_ZONE_ID dengan Zone ID dari PropellerAds
 */

export default function InterstitialAd({ onAdComplete, show }) {
  const [countdown, setCountdown] = useState(5); // 5 detik countdown
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Load PropellerAds Interstitial
    const script = document.createElement('script');
    script.src = 'https://glizauvo.net/400/YOUR_INTERSTITIAL_ZONE_ID';
    script.async = true;
    document.body.appendChild(script);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.body.removeChild(script);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        
        {/* Ad Container */}
        <div className="w-full max-w-4xl aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl overflow-hidden border border-white/10 mb-6">
          {/* Placeholder - iklan akan muncul di sini */}
          <div id="propeller-interstitial-ad" className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60 text-lg">Loading Ad...</p>
            </div>
          </div>
        </div>

        {/* Skip Button */}
        {canSkip ? (
          <button
            onClick={onAdComplete}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl"
          >
            ▶️ Lanjutkan Menonton
          </button>
        ) : (
          <div className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white/60 font-semibold rounded-xl border border-white/20">
            Tunggu {countdown} detik...
          </div>
        )}

        {/* Info Text */}
        <p className="text-white/40 text-sm mt-4 text-center">
          💰 Dukungan Anda melalui iklan membantu kami menyediakan konten gratis
        </p>
      </div>
    </div>
  );
}

