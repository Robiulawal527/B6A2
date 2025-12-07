import express from 'express';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
    '/',
    auth(Role.customer, Role.admin), // "Customer or Admin"
    validateRequest(BookingValidation.createBookingValidationSchema),
    BookingController.createBooking
);

router.get(
    '/',
    auth(Role.admin, Role.customer),
    BookingController.getAllBookings
);

router.put(
    '/:bookingId',
    auth(Role.admin, Role.customer),
    BookingController.updateBooking
);

export const BookingRoutes = router;
