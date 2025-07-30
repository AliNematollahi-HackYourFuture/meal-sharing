import { useState } from "react";
import { useEffect } from "react";

import Meal from "./Meal";

export default function ShowMealById({ id }) {
  const [meal, setMeal] = useState();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMealById = async () => {
    const response = await fetch(`${apiUrl}/api/meals/${id}`);

    const res = await response.json();
    setMeal(res);
  };

  useEffect(() => {
    getMealById();
  }, []);
  return (
    <>
      <h1>Meal id : {id}</h1>
      {meal !== undefined && meal.length > 0 ? (
        <Meal
          title={meal[0].title}
          description={meal[0].description}
          price={meal[0].price}
        />
      ) : (
        <h2>Invalid Id</h2>
      )}
    </>
  );
}
