import express from 'express';
import { carController } from './car.controller';

const router = express.Router();

router.post('/', carController.carCreateFun);
router.get('/', carController.getAllCarFun);
router.get('/:carId', carController.getACarFun);
router.patch('/:carId', carController.updateACarFun);
router.delete('/:carId', carController.deleteACarFun);

export const carRoute = router;
