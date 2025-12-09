import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        customer_id: z.string().optional(),
        vehicle_id: z.string(),
        rent_start_date: z.string(),
        rent_end_date: z.string(),
    }),
});

const updateBookingValidationSchema = z.object({
    body: z.object({
        status: z.enum(['cancelled', 'returned']),
    }),
});

export const BookingValidation = {
    createBookingValidationSchema,
    updateBookingValidationSchema,
};
