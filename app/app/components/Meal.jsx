import Image from "next/image";

export default function Meal({
  id,
  title,
  description,
  price,
  available,
  whenDate,
}) {
  const imageUrl = `/images/${id}.AVIF`;

  return (
    <div className="meal-card">
      <Image
        src={imageUrl}
        alt={title}
        width={300}
        height={200}
        className="meal-card-image"
      />
      <div className="meal-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>Price:</strong> {price} DKK</p>
        <p><strong>When:</strong> {whenDate}</p>
        <p><strong>Available:</strong> {available}</p>
      </div>
    </div>
  );
}
