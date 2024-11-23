import { TCar } from './car.interface';
import { CarModel } from './car.model';

const postCarDataIntoDB = async (carData: TCar) => {
  const result = await CarModel.create(carData);
  return result;
};

const getAllCars = async () => {
  const result = await CarModel.find();
  return result;
};

const getMatchedCars = async (searchTerm: string) => {
  const result = await CarModel.find({
    $or: [
      { brand: { $regex: searchTerm, $options: 'i' } },
      { model: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
    ],
  });
  return result;
};

const getACars = async (id: string) => {
  const result = await CarModel.find({ _id: id });
  return result;
};

const updateACarData = async (
  prevIdData: { _id: string },
  updatedData: object,
) => {
  const result = await CarModel.updateOne(prevIdData, updatedData);
  return result;
};

const deleteACarData = async (id: string) => {
  const result = await CarModel.deleteOne({ _id: id });
  return result;
};

export const CarService = {
  postCarDataIntoDB,
  getMatchedCars,
  getAllCars,
  getACars,
  updateACarData,
  deleteACarData,
};
