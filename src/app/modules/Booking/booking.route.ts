import express from 'express';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
    '/',
    auth('customer'),
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

// Unified PUT endpoint for Cancel (Customer) and Return (Admin)
router.put(
    '/:id',
    auth('admin', 'customer'),
    BookingController.returnBooking // Controller handles logic differentiation
)


export const BookingRoutes = router;
