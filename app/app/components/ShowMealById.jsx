import Meal from "./Meal";

export default function ShowMealById({ meal }) {
  
  return (
    <>
      {meal !== undefined ? (
        <Meal
          id={meal.id}
          title={meal.title}
          description={meal.description}
          price={meal.price}
          available={meal.max_reservations}
          whenDate={meal.when_date.slice(0, 10)}
        />
      ) : (
        <h2>Invalid Id</h2>
      )}
    </>
  );
}
