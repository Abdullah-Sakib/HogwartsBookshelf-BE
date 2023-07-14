"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = require("zod");
const cow_constants_1 = require("./cow.constants");
const createCowZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        age: zod_1.z.number(),
        price: zod_1.z.number(),
        location: zod_1.z.enum([...cow_constants_1.location]),
        breed: zod_1.z.string(),
        weight: zod_1.z.number(),
        label: zod_1.z.enum([...cow_constants_1.label]),
        category: zod_1.z.enum([...cow_constants_1.category]),
        seller: zod_1.z.string(),
    }),
});
const updateCowZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        location: zod_1.z.enum([...cow_constants_1.location]).optional(),
        breed: zod_1.z.string().optional(),
        weight: zod_1.z.number().optional(),
        label: zod_1.z.enum([...cow_constants_1.label]).optional(),
        category: zod_1.z.enum([...cow_constants_1.category]).optional(),
        seller: zod_1.z.string().optional(),
    }),
});
exports.CowValidation = {
    createCowZodValidation,
    updateCowZodValidation,
};
