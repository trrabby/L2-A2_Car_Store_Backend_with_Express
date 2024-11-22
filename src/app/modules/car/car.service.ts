import { TCar } from './car.interface';
import { CarModel } from './car.model';

const postCarDataIntoDB = async (carData: TCar) => {
  const result = await CarModel.create(carData);
  return result;
};

const getAllCars = async (searchTerm: string) => {
  const result = await CarModel.find({
    $or: [
      { brand: { $regex: searchTerm, $options: 'i' } },
      { model: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
    ],
  });
  return result;
};

export const CarService = {
  postCarDataIntoDB,
  getAllCars,
};
