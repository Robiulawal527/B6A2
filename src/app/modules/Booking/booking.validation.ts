import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        vehicle_id: z.string(),
        rent_start_date: z.string(), // ISO Date string
        rent_end_date: z.string(), // ISO Date string
    }),
});

export const BookingValidation = {
    createBookingValidationSchema,
};
