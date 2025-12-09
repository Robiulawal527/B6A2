import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const result = await BookingService.createBooking(user.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

const getAllBookings = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const role = req.query.role as string || user.role;
    // req.user.role comes from auth middleware.

    const result = await BookingService.getAllBookings(user.id, user.role);

    // Adjust message based on role? Or just generic?
    const message = user.role === 'admin'
        ? 'Bookings retrieved successfully'
        : 'My Bookings retrieved successfully';

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: message,
        data: result,
    });
});

const getMyBookings = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const result = await BookingService.getMyBookings(user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Bookings retrieved successfully',
        data: result,
    });
})

const returnBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
    // Check if it is a cancel or return based on user role or payload?
    // Requirement says: PUT /api/v1/bookings/:bookingId
    // Customer: Cancel booking
    // Admin: Mark as "returned"
    // So we need to switch logic based on role.

    const user = (req as any).user;

    let result;
    let message = "";

    if (user.role === 'customer') {
        // Assume cancel logic
        // "status": "cancelled" in body
        if (req.body.status !== 'cancelled') {
            // Maybe allow other updates? But requirements focus on cancel/return.
            // If payload has status cancelled, treat as cancel.
            // Actually requirement says: PUT /api/v1/bookings/:bookingId
            // Request Body - Customer Cancellation: { "status": "cancelled" }
            // Request Body - Admin Mark as Returned: { "status": "returned" }

            // So better to delegate to service based on payload status or role + payload status.
        }
        result = await BookingService.cancelBooking(id, user.id);
        message = "Booking cancelled successfully";
    } else if (user.role === 'admin') {
        if (req.body.status === 'returned') {
            result = await BookingService.returnBooking(id);
            message = "Booking marked as returned successfully";
        } else {
            // Admin might want to cancel too?
            // The requirements table says:
            // Admin: Mark as "returned" (updates vehicle to "available")
            // It doesn't explicitly say Admin can cancel, but typically they can.
            // For now, let's stick to what is explicitly requested.
            // Logic for return.
            result = await BookingService.returnBooking(id);
            message = "Booking marked as returned successfully";
        }
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: message,
        data: result,
    });
});

export const BookingController = {
    createBooking,
    getAllBookings,
    getMyBookings,
    returnBooking
};
