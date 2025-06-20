import { useState } from "react";
import { useEffect } from "react";

export default function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const handleData = async () => {
      const response = await fetch("http://localhost:3000/all-meals");

      const res = await response.json();
      setMeals(res);
    };

    handleData();
  }, []);

  {
    meals.map((meal) => {
      return (
        <div>
          <h3> title: {meal.title} </h3>
          <p>description: {meal.description}</p>
          <p>price: {meal.price}</p>
        </div>
      );
    });
  }
}
