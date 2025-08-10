'use client'

import { useState , useEffect } from 'react';
import MealsList from './components/MealsList';
import Link from 'next/link';


export default function Home() {

  const [meals ,setmeals] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const limit = process.env.NEXT_PUBLIC_DEFAULT_MEALS_LIMIT;

  const fetchLimitedMeals = async (limit) => {
    const response = await fetch(`${apiUrl}/api/limited-meals/${limit}`);
    const data = await response.json();
    setmeals(data)
  };

  useEffect(() => {
    fetchLimitedMeals(limit);
  }, []);


  return(
    
    <>
    <h1>Meal Sharing APP</h1>
    <MealsList meals={meals}/>
    <Link href="/meals">
      <button type='button'>See All Meals</button>
    </Link>
    </>
    );
}
