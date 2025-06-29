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
    if ("maxPrice" in req.query) {
      const maxPrice = req.query.maxPrice;

      if (!isNaN(maxPrice) && maxPrice > 0) {
        const limitedPriceMeals = await db("meals")
          .select("*")
          .where("price", "<", maxPrice);
        res.json(limitedPriceMeals);
        return;
      }
    } else if ("availableReservations" in req.query) {
      const availableReservations =
        req.query.availableReservations.toLowerCase();

      if (availableReservations === "true") {
        const availableReservationsMeals = await db("meals")
          .leftJoin("reservations", "meals.id", "reservations.meal_id")
          .groupBy("meals.id")
          .select("meals.*")
          .havingRaw("meals.max_reservations > COUNT(reservations.id)");

        res.json(availableReservationsMeals);
        return;
      } else if (availableReservations === "false") {
        const unAvailableReservationsMeals = await db("meals")
          .leftJoin("reservations", "meals.id", "reservations.meal_id")
          .groupBy("meals.id")
          .select("meals.*")
          .havingRaw("meals.max_reservations <= COUNT(reservations.id)");

        res.json(unAvailableReservationsMeals);
        return;
      }
    } else if ("title" in req.query) {
      const title = req.query.title.toString().toLowerCase();

      if (title) {
        const meals = await db("meals")
          .select("*")
          .where("title", "like", `%${title}%`);

        res.json(meals);
        return;
      }
    } else if ("dateAfter" in req.query) {
      const dateAfter = new Date(req.query.dateAfter.toString());

      if (dateAfter == "Invalid Date") {
        res.status(400).json({ error: "Invalid date format" });
      } else if (dateAfter instanceof Date) {
        const meals = await db("meals")
          .select("*")
          .where("when_date", ">", dateAfter);

        res.json(meals);
        return;
      }
    } else if ("dateBefore" in req.query) {
      const dateBefore = new Date(req.query.dateBefore.toString());

      if (dateBefore == "Invalid Date") {
        res.status(400).json({ error: "Invalid date format" });
      } else if (dateBefore instanceof Date) {
        const meals = await db("meals")
          .select("*")
          .where("when_date", ">", dateBefore);

        res.json(meals);
        return;
      }
    } else if ("limit" in req.query) {
      const limit = Number(req.query.limit);
      if (Number.isInteger(limit) && limit > 0) {
        const meals = await db("meals").limit(limit);

        res.json(meals);
        return;
      }
    } else if ("sortKey" in req.query) {
      const sortKey = req.query.sortKey.toLowerCase();
      let sortDirection;
      if ("sortDir" in req.query) {
        const sortDir = req.query.sortDir.toLowerCase();
        sortDir === "asc" || sortDir === "desc"
          ? (sortDirection = sortDir)
          : (sortDirection = "asc");
      } else {
        sortDirection = "asc";
      }

      if (sortKey === "when") {
        const meals = await db("meals")
          .select("*")
          .orderBy("when_date", sortDirection);

        res.json(meals);
        return;
      } else if (sortKey === "max_reservations" || sortKey === "price") {
        const meals = await db("meals")
          .select("*")
          .orderBy(sortKey, sortDirection);

        res.json(meals);
        return;
      } else {
        res.status(400).json({ error: "Invalid Sort Key" });
      }
    } else {
      const meals = await db("meals").select("*");
      res.json(meals);
    }
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
    const id = req.params.id;
    if (!IsNan(id) && id > 0) {
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
    if (!IsNan(id) && id > 0) {
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
    if (!IsNan(id) && id > 0) {
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
