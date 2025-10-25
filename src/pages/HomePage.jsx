import { useState } from "react";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`http://localhost:3000/xvideos/search?key=${query}&page=1`);
    const data = await res.json();
    setVideos(data.results || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Lustpress Video Explorer</h1>
      </header>

      <div className="flex justify-center mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Cari video..."
          className="w-1/2 px-4 py-2 rounded-l-md text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {videos.map((v, i) => (
            <VideoCard key={i} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
