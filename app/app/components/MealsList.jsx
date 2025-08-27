import Link from 'next/link';
import Meal from "./Meal";

export default function MealsList({ meals }) {
  return (
    <div className="meal-grid">
      {meals.map((meal) => (
        <Link key={meal.id} href={`/meals/${meal.id}`}>
          <Meal
            id={meal.id}
            title={meal.title}
            description={meal.description}
            price={meal.price}
            whenDate={meal.when_date.slice(0, 10)}
            available={meal.max_reservations}
          />
        </Link>
      ))}
    </div>
  );
}
