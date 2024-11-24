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

const getRevenue = async () => {
  const totalRevenuePipeline = [
    {
      $group: {
        _id: null, // Grouping all documents together
        totalRevenue: {
          $sum: {
            $multiply: ['$quantity', '$totalPrice'], // Calculate revenue per order
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field in the result
        totalRevenue: 1,
      },
    },
  ];

  const result = await OrderModel.aggregate(totalRevenuePipeline);
  return result;
};

export const OrderService = {
  postOrderDataIntoDB,
  getAllOrders,
  getAnOrder,
  getRevenue,
};
