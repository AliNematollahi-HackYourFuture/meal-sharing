import express from "express";
import db from "../db.js";

const reviewsRouter = express.Router();

// Get /reviews
reviewsRouter.get("/reviews", async (req, res) => {
  try {
    const reviews = await db("reviews").select("*");
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all reviews");
  }
});

// Get /meals/:meal_id/reviews
reviewsRouter.get("/meals/:meal_id/reviews", async (req, res) => {
  try {
    const mealId = req.params.meal_id;

    if (!isNaN(mealId) && mealId > 0) {
      const review = await db("reviews").select("*").where({ meal_id: mealId });
      res.json(review);
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all reviews");
  }
});

// Post /reviews
reviewsRouter.post("/reviews", async (req, res) => {
  try {
    const { title, description, stars, meal_id, created_date } = req.body;

    if (!title || !description || !stars || !meal_id || !created_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [id] = await db("reviews").insert({
      title,
      description,
      stars,
      meal_id,
      created_date,
    });

    res.status(201).json({
      message: "review added successfully",
      reviewId: id,
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).send("Error adding review");
  }
});

// Get /reviews/:id
reviewsRouter.get("/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isNaN(id) && id > 0) {
      const review = await db("reviews").select("*").where({ id });
      res.json(review);
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all reviews");
  }
});

// Put /reviews/:id
reviewsRouter.put("/reviews/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    if (!isNaN(id) && id > 0) {
      const review = await db("reviews").select("*").where({ id });
      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }

      await db("reviews").where({ id }).update(updateData);
      res.json({ message: "review updated successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).send("Error updating review");
  }
});

// Delete /reviews/:id
reviewsRouter.delete("/reviews/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!isNaN(id) && id > 0) {
      const review = await db("reviews").select("*").where({ id });
      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }

      await db("reviews").where({ id }).del();
      res.json({ message: "review deleted successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).send("Error deleting review");
  }
});

export default reviewsRouter;