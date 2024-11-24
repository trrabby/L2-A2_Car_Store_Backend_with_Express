import { z } from 'zod';

export const carValidationSchema = z.object({
  brand: z.string().min(1, { message: 'Brand is required.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z
    .number()
    .int()
    .min(1886, { message: 'Year must be 1886 or later.' })
    .max(new Date().getFullYear(), { message: 'Year cannot be in the future.' })
    .nonnegative({ message: 'Year must be a positive number.' })
    .refine((val) => !isNaN(val), { message: 'Year must be a valid number.' }),
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
    errorMap: () => {
      return {
        message: `Invalid category. Allowed values are Sedan, SUV, Truck, Coupe, Convertible.`,
      };
    },
  }),
  description: z.string().min(1, { message: 'Description is required.' }),
  quantity: z
    .number()
    .int({ message: 'Quantity must be an integer.' })
    .nonnegative({ message: 'Quantity cannot be negative.' }),
  inStock: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default carValidationSchema;
