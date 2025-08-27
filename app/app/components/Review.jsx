export default function Review({ reviews }) {
  return reviews.map((review) => (
    <div key={review.id} className="review-card">
      <h4>{review.title}</h4>
      <p>{review.description}</p>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= review.stars ? "gold" : "gray",
              fontSize: "1.5rem",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p>Date: {review.created_date.slice(0,10)}</p>
    </div>
  ));
}
