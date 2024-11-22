import { Request, Response } from 'express';
import { CarService } from './car.service';

// Function to create a new car
const carCreateFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const carData = req.body;

    if (!carData) {
      res.status(400).json({
        message: 'Car data is required.',
        success: false,
      });
      return;
    }

    const result = await CarService.postCarDataIntoDB(carData);

    res.status(201).json({
      message: 'Car created successfully.',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Error creating car.',
      error: err.message,
    });
  }
};

// Function to get all cars by a search term
const getAllCarFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        message: 'Invalid or missing searchTerm query parameter.',
        success: false,
      });
      return;
    }

    const result = await CarService.getAllCars(searchTerm);

    res.status(200).json({
      message: 'Cars retrieved successfully.',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Error fetching cars.',
      error: err.message,
    });
  }
};

export const carController = {
  carCreateFun,
  getAllCarFun,
};
