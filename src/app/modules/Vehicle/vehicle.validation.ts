import { z } from 'zod';

const createVehicleValidationSchema = z.object({
    body: z.object({
        vehicle_name: z.string(),
        type: z.enum(['car', 'bike', 'van', 'SUV']),
        registration_number: z.string(),
        daily_rent_price: z.number().positive(),
        availability_status: z.enum(['available', 'booked']).optional(),
    }),
});

const updateVehicleValidationSchema = z.object({
    body: z.object({
        vehicle_name: z.string().optional(),
        type: z.enum(['car', 'bike', 'van', 'SUV']).optional(),
        registration_number: z.string().optional(),
        daily_rent_price: z.number().positive().optional(),
        availability_status: z.enum(['available', 'booked']).optional(),
    }),
});

export const VehicleValidation = {
    createVehicleValidationSchema,
    updateVehicleValidationSchema,
};
