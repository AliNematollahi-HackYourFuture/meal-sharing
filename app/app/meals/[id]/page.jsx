"use client";

import { use, useState, useEffect, useCallback } from "react";

import ShowMealById from "../../components/ShowMealById";
import ReservationForm from "../../components/ReservationForm";
import ReviewForm from "../../components/ReviewForm";
import Review from "../../components/Review";

export default function Home({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [meal, setMeal] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [displayReservationForm, setdisplayReservationForm] = useState(false);
  const [displayAddReviewForm, setdisplayAddReviewForm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMealById = useCallback(async () => {
    const response = await fetch(`${apiUrl}/api/meals/${id}`);
    const res = await response.json();
    setMeal(res);
  }, [apiUrl, id]);

  const getReviewsByMealId = async () => {
    const response = await fetch(`${apiUrl}/api/meals/${id}/reviews`);
    const res = await response.json();
    setReviews(res);
  };

  useEffect(() => {
    getMealById();
    getReviewsByMealId();
  }, [getMealById]);

  console.log("meal", meal);
  console.log("reviews", reviews);

  if (!meal || meal.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="meal-page-layout">
        <div className="meal-page-item">
          <ShowMealById meal={meal[0]} />
        </div>
        <div className="meal-page-item">
          <h2>Reviews</h2>
          {reviews.length > 0 && <Review reviews={reviews} />}
        </div>
      </div>

      {!displayReservationForm && (
        <button
          type="button"
          onClick={() => {
            setdisplayReservationForm(true);
          }}
        >
          Reserve This Meal
        </button>
      )}

      {displayReservationForm && (
        <ReservationForm
          mealId={id}
          available={meal[0].max_reservations}
          onReservationSuccess={getMealById}
        />
      )}

      {!displayAddReviewForm && (
        <button
          type="button"
          onClick={() => {
            setdisplayAddReviewForm(true);
          }}
        >
          Add Review For This Meal
        </button>
      )}

      {displayAddReviewForm && <ReviewForm mealId={id} />}
    </>
  );
}
