import express from 'express';
import mealsRouter from './routers/meals.js';
import reservationsRouter from './routers/reservations.js';
import reviewsRouter from './routers/reviews.js';
import cors from 'cors';


const app = express();
app.use(cors());

app.use(express.json());

app.use('/api',mealsRouter)
app.use('/api',reservationsRouter)
app.use('/api',reviewsRouter)

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});