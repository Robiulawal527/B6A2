import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
    const userId = (req as any).user.id;
    const result = await BookingService.createBooking(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result
    });
});

const getAllBookings = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const result = await BookingService.getAllBookings(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: result
    });
});

const updateBooking = catchAsync(async (req, res) => {
    const { bookingId } = req.params;
    const user = (req as any).user;
    const { status } = req.body; // 'cancelled' or logic based on route?

    // Route for Cancel is typically PUT /bookings/:id with some payload?
    // User can "Cancel booking".
    // Admin can "Mark as returned".

    // I need to decide based on role or input.
    // Spec: "PUT /api/v1/bookings/:bookingId" behavior differs by role.

    let result;
    if (user.role === 'customer') {
        // Customer cancelling
        // Should I check if req.body.status === 'cancelled'?
        // Assuming intention based on endpoint usage. 
        // Or requiring `status` in body.
        // Prompt says "Cancel booking".
        result = await BookingService.cancelBooking(bookingId, user.id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Booking cancelled successfully',
            data: result
        });
    } else if (user.role === 'admin') {
        // Admin marking as returned
        // check status?
        // "Mark as 'returned'".
        result = await BookingService.returnBooking(bookingId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Booking returned successfully',
            data: result
        });
    }
});

export const BookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};
