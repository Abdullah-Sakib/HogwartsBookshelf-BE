import { z } from 'zod';

const nameSchema = z.object({
  firstName: z.string({
    required_error: 'firstname is required',
  }),
  lastName: z.string({
    required_error: 'lastname is required',
  }),
});

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'password is required',
    }),
    role: z.enum(['seller', 'buyer'], {
      required_error: 'role is required',
    }),
    name: nameSchema,
    phoneNumber: z.string({
      required_error: 'phone number is required',
    }),
    address: z.string({
      required_error: 'address is required',
    }),
    budget: z.number({
      required_error: 'budget is required',
    }),
    income: z.number({
      required_error: 'income is required',
    }),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});

export const authValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
};
