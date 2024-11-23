import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { CarService } from '../car/car.service';

// Function to create a new order
const orderCreateFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;

    if (!orderData || !orderData.car || !orderData.quantity) {
      res.status(400).json({
        message:
          'Order data is incomplete. Please provide all required fields.',
        status: false,
      });
      return;
    }

    const {
      car: orderedCarId,
      quantity: orderedCarQty,
      ...otherOrderData
    } = orderData;

    const carData = await CarService.getACars(orderedCarId);

    if (!carData.length) {
      res.status(404).json({
        message: 'Car not found in the database.',
        status: false,
      });
      return;
    }

    const car = carData[0];

    if (car.quantity < 1) {
      res.status(400).json({
        message: 'Stock unavailable. Please choose another product.',
        status: false,
      });
      return;
    }

    const qtyAfterOrder = car.quantity - orderedCarQty;

    if (qtyAfterOrder < 0) {
      res.status(400).json({
        message: 'Ordered quantity exceeds available stock.',
        status: false,
      });
      return;
    }

    // Construct the updated car document
    const inStock = qtyAfterOrder > 0;
    const updatedCarData = {
      ...car,
      quantity: qtyAfterOrder,
      inStock,
      updatedAt: new Date(), // Add updatedAt timestamp
    };

    const carUpdateDoc = {
      $set: updatedCarData,
    };

    // Update car stock in the database
    await CarService.updateACarData({ _id: orderedCarId }, carUpdateDoc);

    // Add `createdAt` and `updatedAt` fields to the order
    const completeOrderData = {
      ...otherOrderData,
      car: orderedCarId,
      quantity: orderedCarQty,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderResult =
      await OrderService.postOrderDataIntoDB(completeOrderData);

    res.status(201).json({
      message: 'Order created successfully.',
      status: true,
      data: orderResult,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: 'Error creating order.',
      status: false,
      error: err.message,
    });
    return;
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
