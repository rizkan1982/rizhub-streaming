import { useLocation, Link } from "react-router-dom";

export default function WatchPage() {
  const location = useLocation();
  const video = location.state?.video;

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Video tidak ditemukan.</p>
        <Link to="/" className="mt-4 text-blue-400 underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link to="/" className="text-blue-400 underline">
          ← Kembali
        </Link>

        <h1 className="text-2xl font-bold mt-4 mb-6">{video.title}</h1>

        {/* iframe untuk menampilkan video */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={video.url}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        <p className="text-gray-400 mt-4">Durasi: {video.duration}</p>
      </div>
    </div>
  );
}
