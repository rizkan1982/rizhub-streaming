import { useState } from "react";
import SearchBar from "../components/SearchBar";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/xvideos/search?key=${query}&page=1`);
      const data = await res.json();
      if (data.success) {
        setVideos(data.results);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="px-6">
      <h1 className="text-center text-3xl font-bold pt-8 text-red-500">
        Lustpress Video Explorer
      </h1>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-center mt-10">🔄 Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
          {videos.map((video, i) => (
            <VideoCard key={i} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
