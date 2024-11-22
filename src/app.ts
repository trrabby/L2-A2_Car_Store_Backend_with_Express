import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { carRoute } from './app/modules/car/car.route';

const app: Application = express();

// Middleware for JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Register car route
app.use('/api/cars', carRoute);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Server is live');
});

export default app;
