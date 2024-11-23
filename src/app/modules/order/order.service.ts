import { TOrder } from './order.interface';
import { OrderModel } from './order.model';

const postOrderDataIntoDB = async (orderData: TOrder) => {
  const result = await OrderModel.create(orderData);
  return result;
};

const getAllOrders = async () => {
  const result = await OrderModel.find().sort({ _id: -1 });
  return result;
};

const getAnOrder = async (id: string) => {
  const result = await OrderModel.find({ _id: id });
  return result;
};

export const OrderService = {
  postOrderDataIntoDB,
  getAllOrders,
  getAnOrder,
};
