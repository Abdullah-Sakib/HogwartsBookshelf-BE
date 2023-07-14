import { z } from 'zod';
import { category, label, location } from './cow.constants';

const createCowZodValidation = z.object({
  body: z.object({
    name: z.string(),
    age: z.number(),
    price: z.number(),
    location: z.enum([...location] as [string, ...string[]]),
    breed: z.string(),
    weight: z.number(),
    label: z.enum([...label] as [string, ...string[]]),
    category: z.enum([...category] as [string, ...string[]]),
    seller: z.string(),
  }),
});

const updateCowZodValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    location: z.enum([...location] as [string, ...string[]]).optional(),
    breed: z.string().optional(),
    weight: z.number().optional(),
    label: z.enum([...label] as [string, ...string[]]).optional(),
    category: z.enum([...category] as [string, ...string[]]).optional(),
    seller: z.string().optional(),
  }),
});

export const CowValidation = {
  createCowZodValidation,
  updateCowZodValidation,
};
