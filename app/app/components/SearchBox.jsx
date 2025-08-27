'use client';

export default function SearchBox({ onSearch }) {
  return (
    <input
      className="search-box"
      type="text"
      placeholder="Search meals..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
