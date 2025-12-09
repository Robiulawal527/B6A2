import express from 'express';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
    '/',
    auth('customer', 'admin'),
    validateRequest(BookingValidation.createBookingValidationSchema),
    BookingController.createBooking,
);

router.get(
    '/',
    auth('admin', 'customer'),
    BookingController.getAllBookings
);

router.get(
    '/my-bookings',
    auth('customer'),
    BookingController.getMyBookings
);

router.put(
    '/:id',
    auth('admin', 'customer'),
    validateRequest(BookingValidation.updateBookingValidationSchema),
    BookingController.updateBooking
)

export const BookingRoutes = router;
