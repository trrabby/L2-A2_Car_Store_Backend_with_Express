import express from 'express';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', orderController.orderCreateFun);
router.get('/', orderController.getAllOrdersFun);
router.get('/:carId', orderController.getAnOrderFun);

export const orderRoute = router;
