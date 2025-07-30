"use client";
import { use } from "react";
import ShowMealById from "../../components/ShowMealById";
export default function Home({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  return (
    <>
      <h1>Meal</h1>
      <ShowMealById id={id} />
    </>
  );
}
