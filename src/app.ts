import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { carRoute } from './app/modules/car/car.route';
import { orderRoute } from './app/modules/order/order.route';

const app: Application = express();

// Middleware for JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Register car route
app.use('/api/cars', carRoute);

// Register Order route
app.use('/api/orders', orderRoute);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Server is live');
});

export default app;
