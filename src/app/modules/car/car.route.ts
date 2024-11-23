import express from 'express';
import { carController } from './car.controller';

const router = express.Router();

router.post('/', carController.carCreateFun);
router.get('/', carController.getAllCarFun);


export const carRoute = router;
