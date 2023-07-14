import z from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string(),
    buyer: z.string(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
