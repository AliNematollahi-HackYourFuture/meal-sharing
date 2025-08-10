// "use server";

// export async function SubmitReservationForm(formData) {
//   const name = formData.get("name");
//   const email = formData.get("email");
//   const phoneNumber = formData.get("phone-number");
//   const numberOfGuests = formData.get("number-of-guests");
//   const mealId = formData.get("meal-id");

//   const reservationData = {
//     number_of_guests: numberOfGuests,
//     meal_id: mealId,
//     created_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
//     contact_phonenumber: phoneNumber,
//     contact_name: name,
//     contact_email: email,
//   };

//   try {
//     const response = await fetch("http://localhost:8000/api/reservations", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(reservationData),
//     });

//     let data = {};
//     try {
//       data = await response.json();
//     } catch {
//       // JSON parsing failed (maybe server returned no body)
//     }

//     if (!response.ok) {
//       throw new Error(data.error || "Unknown server error");
//     }

//     return { success: true, message: data.message };

//   } catch (error) {
//     console.error("Error sending reservation:", error);
//     return { success: false, message: error.message || "Failed to connect to server" };
//   }
// }

"use server";

export async function SubmitReservationForm(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const phoneNumber = formData.get("phone-number");
  const numberOfGuests = parseInt(formData.get("number-of-guests"));
  const mealId = formData.get("meal-id");

  const reservationData = {
    number_of_guests: numberOfGuests,
    meal_id: mealId,
    created_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    contact_phonenumber: phoneNumber,
    contact_name: name,
    contact_email: email,
  };

  try {
    // 1. Create the reservation
    const response = await fetch("http://localhost:8000/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
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

    // 2. Fetch current meal data
    const mealRes = await fetch(`http://localhost:8000/api/meals/${mealId}`);
    const mealData = await mealRes.json();
    const meal = Array.isArray(mealData) ? mealData[0] : mealData;

    if (!meal?.max_reservations || meal.max_reservations < numberOfGuests) {
      return { success: false, message: "Not enough availability." };
    }

    const updatedAvailable = meal.max_reservations - numberOfGuests;

    // 3. Update meal availability
    const updateRes = await fetch(`http://localhost:8000/api/meals/${mealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_reservations: updatedAvailable,
      }),
    });

    if (!updateRes.ok) {
      return {
        success: true,
        message: "Reservation created, but availability update failed.",
      };
    }

    return { success: true, message: "Reservation submitted successfully!" };

  } catch (error) {
    console.error("Error sending reservation:", error);
    return {
      success: false,
      message: error.message || "Failed to connect to server",
    };
  }
}

