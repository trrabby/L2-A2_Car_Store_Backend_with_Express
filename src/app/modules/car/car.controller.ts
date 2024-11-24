import { Request, Response } from 'express';
import { CarService } from './car.service';
import carValidationSchema from './car.validation';

// Function to create a new car
const carCreateFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const carData = req.body;

    const ZodParsedData = carValidationSchema.safeParse(carData);
    if (!ZodParsedData.success) {
      // Extract and format the error messages
      const errorMessages = ZodParsedData.error.errors.map(
        (err) => err.message,
      );
      res.status(400).json({
        message: 'Validation Error',
        errors: errorMessages,
      });
      return;
    }

    if (!ZodParsedData) {
      res.status(400).json({
        message: 'Car data is required.',
        status: false,
      });
      return;
    }

    const result = await CarService.postCarDataIntoDB(ZodParsedData.data);

    res.status(201).json({
      message: 'Car created successfully.',
      status: true,
      data: result,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: 'Error creating car.',
      error: err.message,
    });
    return;
  }
};

// Function to get all cars by a search term
const getAllCarFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      const result = await CarService.getAllCars();
      res.status(200).json({
        message: 'Cars retrieved successfully.',
        status: true,
        data: result,
      });
      return;
    }

    if (typeof searchTerm !== 'string') {
      res.status(400).json({
        message: 'Please search by category, model, or brand.',
        status: false,
      });
      return;
    }

    const result = await CarService.getMatchedCars(searchTerm);

    if (!result.length) {
      res.status(404).json({
        message: 'Search Mismatched, no such data available in DB.',
        status: true,
        data: result,
      });
      return;
    }

    res.status(200).json({
      message: 'Matched Cars retrieved successfully.',
      status: true,
      data: result,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: 'Error fetching cars.',
      error: err.message,
    });
    return;
  }
};

// Function to get a single car
const getACarFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;

    const result = await CarService.getACars(carId);

    if (result.length) {
      res.status(200).json({
        message: 'Car retrieved successfully.',
        status: true,
        data: result,
      });
      return;
    }

    res.status(404).json({
      message: 'Search Mismatched, no such data available in DB.',
      status: true,
    });
    return;
  } catch (err: any) {
    res.status(404).json({
      message: 'Search Mismatched, no such data available in DB.',
      status: false,
      error: err.message,
    });
    return;
  }
};

// Function to update a car
const updateACarFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;
    const updateInfo = req.body;

    const filter = { _id: carId };

    const updatedAt = new Date();

    if (updateInfo?.quantity > 0) {
      const inStock = true;

      const updateDoc = {
        $set: { ...updateInfo, updatedAt, inStock },
      };

      const result = await CarService.updateACarData(filter, updateDoc);

      res.status(200).json({
        message: 'Car updated successfully.',
        status: true,
        data: result,
      });
      return;
    }

    if (updateInfo?.quantity <= 0) {
      res.status(501).json({
        message: 'Stock should be more than 0',
      });
      return;
    }

    const updateDoc = {
      $set: { ...updateInfo, updatedAt },
    };

    const result = await CarService.updateACarData(filter, updateDoc);

    res.status(200).json({
      message: 'Car updated successfully.',
      status: true,
      data: result,
    });
    return;
  } catch (err: any) {
    res.status(404).json({
      message: 'Something went wrong, please check back.',
      status: false,
      error: err.message,
    });
    return;
  }
};

// Function to delete a car
const deleteACarFun = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;

    await CarService.deleteACarData(carId);

    res.status(200).json({
      message: 'Car deleted successfully.',
      status: true,
      data: {},
    });
    return;
  } catch (err: any) {
    res.status(404).json({
      message: 'Something went wrong, please check back.',
      status: false,
      error: err.message,
    });
    return;
  }
};

export const carController = {
  carCreateFun,
  getAllCarFun,
  getACarFun,
  updateACarFun,
  deleteACarFun,
};
