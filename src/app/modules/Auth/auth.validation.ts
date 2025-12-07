import { z } from 'zod';

const signupValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        phone: z.string(),
        role: z.enum(['admin', 'customer']).optional(),
    }),
});

const signinValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const AuthValidation = {
    signupValidationSchema,
    signinValidationSchema,
};
