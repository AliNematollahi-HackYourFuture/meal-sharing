import express from 'express';
import db from './db.js';

const router = express.Router();

// GET /future-meals
router.get('/future-meals', async (req, res) => {
  try {
    const [rows] = await db.raw('SELECT * FROM meals WHERE when_date > NOW()');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching future meals');
  }
});

// GET /past-meals
router.get('/past-meals', async (req, res) => {
  try {
    const [rows] = await db.raw('SELECT * FROM meals WHERE when_date < NOW()');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching past meals');
  }
});

// GET /all-meals
router.get('/all-meals', async (req, res) => {
  try {
    const [rows] = await db.raw('SELECT * FROM meals ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching all meals');
  }
});

// GET /first-meal
router.get('/first-meal', async (req, res) => {
  try {
    const [rows] = await db.raw('SELECT * FROM meals ORDER BY id ASC LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).send({ error: 'No meals found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching first meal');
  }
});

// GET /last-meal
router.get('/last-meal', async (req, res) => {
  try {
    const [rows] = await db.raw('SELECT * FROM meals ORDER BY id DESC LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).send({ error: 'No meals found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching last meal');
  }
});

export default router;
