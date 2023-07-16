import { z } from 'zod';

const wishlistZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'user id is required',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    bookId: z.string({
      required_error: 'bookId is required',
    }),
  }),
});

export const wishlistValidation = {
  wishlistZodSchema,
};
