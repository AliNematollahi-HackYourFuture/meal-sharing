'use client';

export default function SortControls({ sortKey, sortDir, onSortChange }) {
  return (
    <div className="sort-controls">
      <select value={sortKey} onChange={(e) => onSortChange(e.target.value, sortDir)}>
        <option value="price">Price</option>
        <option value="created_date">Date</option>
      </select>
      <select value={sortDir} onChange={(e) => onSortChange(sortKey, e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
