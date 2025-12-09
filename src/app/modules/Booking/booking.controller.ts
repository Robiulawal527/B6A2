import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const result = await BookingService.createBooking(user.id, user.role, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

const getAllBookings = catchAsync(async (req, res) => {
    const user = (req as any).user;

    const result = await BookingService.getAllBookings(user.id, user.role);

    const message = user.role === 'admin'
        ? 'Bookings retrieved successfully'
        : 'Your bookings retrieved successfully';

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
        message: 'Your bookings retrieved successfully',
        data: result,
    });
})

const updateBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = (req as any).user;
    const { status } = req.body;

    let result;
    let message = "";

    if (user.role === 'customer') {
        if (status !== 'cancelled') {
            throw new Error('Customers can only cancel bookings');
        }
        result = await BookingService.cancelBooking(id, user.id, user.role);
        message = "Booking cancelled successfully";
    } else if (user.role === 'admin') {
        if (status === 'returned') {
            result = await BookingService.returnBooking(id);
            message = "Booking marked as returned. Vehicle is now available";
        } else if (status === 'cancelled') {
            result = await BookingService.cancelBooking(id, user.id, user.role);
            message = "Booking cancelled successfully";
        } else {
            throw new Error('Invalid status update');
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
    updateBooking
};
