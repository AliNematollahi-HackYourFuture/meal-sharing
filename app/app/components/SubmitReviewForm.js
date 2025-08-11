"use server";

export async function SubmitReviewForm(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const stars = formData.get("stars");

  const mealId = formData.get("meal-id");

  const reviewData = {
    title: title,
    meal_id: mealId,
    created_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    description: description,
    stars: stars,
  };

  console.log("reviewData", reviewData);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      // JSON parsing failed (maybe server returned no body)
    }

    if (!response.ok) {
      throw new Error(data.error || "Unknown server error");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error sending review:", error);
    return {
      success: false,
      message: error.message || "Failed to connect to server",
    };
  }
}
