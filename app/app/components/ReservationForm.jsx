import { SubmitReservationForm } from "./SubmitReservationForm";
import { useActionState } from 'react';
import { useEffect } from "react";


export default function ReservationForm({mealId , available ,onReservationSuccess}) {
const [message, formAction] = useActionState(async (prevState, formData) => {

  const guests = parseInt(formData.get('number-of-guests'));

      if (guests > available) {
        return 'Not enough availability for this reservation.';
      }


    const res = await SubmitReservationForm(formData);
    return res.message || 'Reservation submitted!';
  }, null);


    useEffect(() => {
    if (message && message.includes('success')) {
      onReservationSuccess?.(); // Call parent function to refetch data
    }
  }, [message, onReservationSuccess]);



  return (
    <form action={formAction}>
      <input type="hidden" name="meal-id" value={mealId} />

      <label htmlFor="name">Name</label>
      <input name="name" type="text" id="name" />
      <label htmlFor="email">Email</label>
      <input name="email" type="email" id="email" />
      <label htmlFor="phone-number">Phone Number</label>
      <input name="phone-number" type="number" id="phone-number" />
      <label htmlFor="number-of-guests">Number of Guests</label>
      <select name="number-of-guests" id="number-of-guests">
        {[...Array(20)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <button type="submit">Reserve</button>
      {message && <p >{message}</p>}
    </form>
  );
}
