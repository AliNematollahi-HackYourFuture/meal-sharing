import express from "express";
import db from "../db.js";

const reservationsRouter = express.Router();

// Get /reservations
reservationsRouter.get("/reservations", async (req, res) => {
  try {
    const reservations = await db("reservations").select("*");
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all reservations");
  }
});

// Post /reservations
reservationsRouter.post("/reservations", async (req, res) => {
  try {
    const {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;

    if (
      !number_of_guests ||
      !meal_id ||
      !created_date ||
      !contact_phonenumber ||
      !contact_name ||
      !contact_email
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [id] = await db("reservations").insert({
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    });

    res.status(201).json({
      message: "reservation added successfully",
      reservationId: id,
    });
  } catch (err) {
    console.error("Error adding reservation:", err);
    res.status(500).send("Error adding reservation");
  }
});

// Get /reservations/:id
reservationsRouter.get("/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isNaN(id) && id > 0) {
      const reservation = await db("reservations").select("*").where({ id });
      res.json(reservation);
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching all reservations");
  }
});

// Put /reservations/:id
reservationsRouter.put("/reservations/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    if (!isNaN(id) && id > 0) {
      const reservation = await db("reservations").select("*").where({ id });
      if (!reservation) {
        return res.status(404).json({ error: "reservation not found" });
      }

      await db("reservations").where({ id }).update(updateData);
      res.json({ message: "reservation updated successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).send("Error updating reservation");
  }
});

// Delete /reservations/:id
reservationsRouter.delete("/reservations/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!isNaN(id) && id > 0) {
      const reservation = await db("reservations").select("*").where({ id });
      if (!reservation) {
        return res.status(404).json({ error: "reservation not found" });
      }

      await db("reservations").where({ id }).del();
      res.json({ message: "reservation deleted successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid ID. ID must be a positive integer greater than 0.",
      });
    }
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).send("Error deleting reservation");
  }
});

export default reservationsRouter;
