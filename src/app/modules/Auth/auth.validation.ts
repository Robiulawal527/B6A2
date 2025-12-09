import { z } from 'zod';

const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        phone: z.string(),
        role: z.enum(['admin', 'customer']),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const AuthValidation = {
    createUserValidationSchema,
    loginValidationSchema,
};
