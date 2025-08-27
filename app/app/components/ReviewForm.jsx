import { SubmitReviewForm } from "./SubmitReviewForm";
import { useActionState } from "react";
import { useState } from 'react';

export default function ReviewForm({ mealId }) {
  const [message, formAction] = useActionState(async (prevState, formData) => {
    const res = await SubmitReviewForm(formData);
    return res.message || "Review submitted!";
  }, null);

  const [rating, setRating] = useState(0);

  return (
    <form action={formAction}>
      <input type="hidden" name="meal-id" value={mealId} />

      <label htmlFor="name">Title</label>
      <input name="title" type="text" id="title" />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows="4"
        placeholder="Write your comment here..."
      ></textarea>

    <div>
        <label>Rating:</label>
        <div style={{ cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                color: star <= rating ? 'gold' : 'gray',
                fontSize: '1.5rem',
              }}
            >
              ★
            </span>
          ))}
        </div>
        {/* Hidden input to send rating value */}
        <input type="hidden" name="stars" value={rating} />
      </div>


      <button type="submit">Add Comment</button>
      {message && <p>{message}</p>}
    </form>
  );
}
