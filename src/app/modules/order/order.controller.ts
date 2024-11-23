import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { CarService } from '../car/car.service';

// Function to create a new order
const orderCreateFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;

    if (!orderData) {
      res.status(400).json({
        message: 'Order data is required.',
        status: false,
      });
      return;
    } else {
      const orderedCarId = req.body?.car;
      const orderedCarQty = req.body?.quantity;

      const carsExistingData = await CarService.getACars(orderedCarId);

      if (carsExistingData[0].quantity < 1) {
        res.status(501).json({
          message: 'Stock unavailable. Please choose other products',
          status: true,
        });
        return;
      }

      if (carsExistingData) {
        const qtyAfterOrder = carsExistingData[0].quantity - orderedCarQty;

        if (qtyAfterOrder < 0) {
          res.status(501).json({
            message:
              'You order exceeds the available stock. Please order available stock',
            status: true,
          });

          return;
        }

        if (qtyAfterOrder <= 0) {
          const inStock = false;

          const updateDoc = {
            $set: { ...carsExistingData, quantity: 0, inStock },
          };

          const result = await CarService.updateACarData(
            { _id: orderedCarId },
            updateDoc,
          );
          res.status(201).json({
            message:
              'Order created successfully. Onwards orders can not be processed due to unavailable stock',
            status: true,
            data: result,
          });

          return;
        }

        const updateDoc = {
          $set: { ...carsExistingData, quantity: qtyAfterOrder, inStock: true },
        };

        await CarService.updateACarData({ _id: orderedCarId }, updateDoc);
      }

      const result = await OrderService.postOrderDataIntoDB(orderData);
      res.status(201).json({
        message: 'Order created successfully.',
        status: true,
        data: result,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: 'Error creating order.',
      error: err.message,
    });
  }
};

// Function to get all cars by a search term
const getAllOrdersFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await OrderService.getAllOrders();
    res.status(200).json({
      message: 'Orders retrieved successfully.',
      status: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Error fetching orders.',
      error: err.message,
    });
  }
};

const getAnOrderFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getAnOrder(orderId);
    if (result) {
      res.status(200).json({
        message: 'Order retrieved successfully.',
        status: true,
        data: result,
      });
      return;
    } else {
      res.status(404).json({
        message: 'Search Mismatched, no such data available in DB.',
        status: true,
      });
    }
  } catch (err: any) {
    res.status(404).json({
      message: 'Search Mismatched, no such data available in DB.',
      status: false,
      error: err.message,
    });
  }
};

export const orderController = {
  orderCreateFun,
  getAllOrdersFun,
  getAnOrderFun,
};
