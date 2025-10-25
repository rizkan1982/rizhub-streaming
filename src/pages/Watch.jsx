import { useLocation, useNavigate } from "react-router-dom";

export default function Watch() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.video) {
    return (
      <div className="text-center mt-20">
        <p>⚠️ Tidak ada video yang dipilih.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 bg-red-600 rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { video } = state;

  return (
    <div className="flex flex-col items-center px-6 pt-6">
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        ← Kembali
      </button>
      <h1 className="text-2xl font-semibold text-center mb-4">{video.title}</h1>

      <div className="w-full md:w-3/4 aspect-video">
        <iframe
          src={video.url}
          title={video.title}
          width="100%"
          height="100%"
          allowFullScreen
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
