"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const nameSchema = zod_1.z.object({
    firstName: zod_1.z.string({
        required_error: 'firstname is required',
    }),
    lastName: zod_1.z.string({
        required_error: 'lastname is required',
    }),
});
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
        role: zod_1.z.enum(['seller', 'buyer'], {
            required_error: 'role is required',
        }),
        name: nameSchema,
        phoneNumber: zod_1.z.string({
            required_error: 'phone number is required',
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        budget: zod_1.z.number({
            required_error: 'budget is required',
        }),
        income: zod_1.z.number({
            required_error: 'income is required',
        }),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'phoneNumber is required',
        }),
        password: zod_1.z.string({
            required_error: 'password is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refreshToken is required',
        }),
    }),
});
exports.authValidation = {
    createUserZodSchema,
    loginUserZodSchema,
    refreshTokenZodSchema,
};
