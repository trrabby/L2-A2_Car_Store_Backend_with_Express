import { z } from 'zod';

export const orderValidationSchema = z.object({
  email: z.string().email('Invalid email address.'),
  car: z.string().min(1, 'Car field is required.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
  totalPrice: z.number().positive('Total price must be greater than 0.'),
});

export default orderValidationSchema;
