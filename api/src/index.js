import express from 'express';
import mealsRouter from './routers/meals.js';
import reservationsRouter from './routers/reservations.js';

const app = express();
app.use(express.json());

app.use('/api',mealsRouter)
app.use('/api',reservationsRouter)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
