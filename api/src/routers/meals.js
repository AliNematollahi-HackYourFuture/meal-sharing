import express from "express";
import db from "../db.js";

const mealsRouter = express.Router();

// GET /future-meals
mealsRouter.get("/future-meals", async (req, res) => {
  try {
    const [rows] = await db.raw("SELECT * FROM meals WHERE when_date > NOW()");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching future meals");
  }
});

// GET /past-meals
mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const [rows] = await db.raw("SELECT * FROM meals WHERE when_date < NOW()");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching past meals");
  }
});

// GET /all-meals
mealsRouter.get("/all-meals", async (req, res) => {
  try {
    const [rows] = await db.raw("SELECT * FROM meals ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all meals");
  }
});

// GET /first-meal
mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const [rows] = await db.raw("SELECT * FROM meals ORDER BY id ASC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).send({ error: "No meals found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching first meal");
  }
});

// GET /last-meal
mealsRouter.get("/last-meal", async (req, res) => {
  try {
    const [rows] = await db.raw("SELECT * FROM meals ORDER BY id DESC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).send({ error: "No meals found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching last meal");
  }
});

// Get /meals
mealsRouter.get("/meals", async (req, res) => {
  try {
    const meals = await db("meals").select("*");
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all meals");
  }
});

// Post /meals

mealsRouter.post("/meals", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      when_date,
      max_reservations,
      price,
      created_date,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !when_date ||
      !max_reservations ||
      !price ||
      !created_date
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [id] = await db("meals").insert({
      title,
      description,
      location,
      when_date,
      max_reservations,
      price,
      created_date,
    });

    res.status(201).json({
      message: "Meal added successfully",
      mealId: id,
    });
  } catch (err) {
    console.error("Error adding meal:", err);
    res.status(500).send("Error adding meal");
  }
});

// Get /meals/:id
mealsRouter.get("/meals/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isNaN(id) && id > 0) {
      const meal = await db("meals").select("*").where({ id });
      res.json(meal);
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all meals");
  }
});

// Put /meals/:id
mealsRouter.put("/meals/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    if (!isNaN(id) && id > 0) {
      const meal = await db("meals").select("*").where({ id });
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      await db("meals").where({ id }).update(updateData);
      res.json({ message: "Meal updated successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).send("Error updating meal");
  }
});

// Delete /meals/:id
mealsRouter.delete("/meals/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!isNaN(id) && id > 0) {
      const meal = await db("meals").select("*").where({ id });
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      await db("meals").where({ id }).del();
      res.json({ message: "Meal deleted successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).send("Error deleting meal");
  }
});

export default mealsRouter;
