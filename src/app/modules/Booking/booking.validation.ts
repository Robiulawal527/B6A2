import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        vehicleId: z.string(),
        startTime: z.string(),
        endTime: z.string().optional()
    })
});

export const BookingValidation = {
    createBookingValidationSchema
};
