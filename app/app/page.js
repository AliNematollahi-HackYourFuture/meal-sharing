'use client'
import MealsList from './components/MealsList ';
export default function Home() {
  return(
    
    <>
    <h1>Meal Sharing APP</h1>
    <MealsList numberOfItemsToShow={3}/>
    </>
    );
}
