import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mt-8">
      <input
        type="text"
        placeholder="Cari video..."
        className="w-2/3 p-3 rounded-l-lg text-black outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 px-5 rounded-r-lg font-semibold"
      >
        Search
      </button>
    </form>
  );
}
