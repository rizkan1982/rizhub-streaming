import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/watch", { state: { video } })}
      className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
    >
      {video.image ? (
        <img
          src={video.image}
          alt={video.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
      <div className="p-3">
        <h2 className="text-sm font-semibold line-clamp-2 text-white">
          {video.title}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{video.duration}</p>
      </div>
    </div>
  );
}
