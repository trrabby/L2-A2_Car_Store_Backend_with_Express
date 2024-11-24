import express from 'express';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', orderController.orderCreateFun);
router.get('/', orderController.getAllOrdersFun);
router.get('/revenue', orderController.getTotalRevenueFun);
router.get('/:orderId', orderController.getAnOrderFun);

export const orderRoute = router;
