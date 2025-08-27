"use client";

import { useState, useEffect, useCallback } from "react";
import MealsList from "../components/MealsList";
import SearchBox from "../components/SearchBox";
import SortControls from "../components/SortControls";

export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("price");
  const [sortDir, setSortDir] = useState("asc");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchMeals = async () => {
    const response = await fetch(`${apiUrl}/api/meals`);
    const data = await response.json();
    setMeals(data);
    setFilteredMeals(data);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...meals];

    // Search
    if (searchTerm) {
      result = result.filter((meal) =>
        meal.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Convert values based on sort key
      if (sortKey === "price") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sortKey === "created_date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      else return aVal < bVal ? 1 : -1;
    });

    setFilteredMeals(result);
  }, [meals, searchTerm, sortKey, sortDir]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortKey, sortDir, meals, applyFilters]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Meals</h1>
      <div className="sort-search-container">
        <div className="sort-search-container-item">
          <h3>Search Meals:</h3>
          <SearchBox onSearch={setSearchTerm} />
        </div>
        <div className="sort-search-container-item">
          <h3>Sort Meals By:</h3>
          <SortControls
            sortKey={sortKey}
            sortDir={sortDir}
            onSortChange={(key, dir) => {
              setSortKey(key);
              setSortDir(dir);
            }}
          />
        </div>
      </div>

      <div>
        <MealsList meals={filteredMeals} />
      </div>
    </div>
  );
}
