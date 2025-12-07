import { Booking, Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

const createBooking = async (userId: string, payload: { vehicleId: string; startTime: string; endTime?: string }) => {
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id: payload.vehicleId,
        },
    });

    if (!vehicle) {
        throw new AppError(httpStatus.NOT_FOUND, 'Vehicle not found');
    }

    if (vehicle.availability_status !== 'available') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Vehicle is not available');
    }

    // Parse dates
    const startDate = new Date(payload.startTime);
    // If endTime not provided, maybe default duration? Prompt says "rent_end_date Required".
    // So payload must have it. Validation should enforce.
    // I'll assume payload has endTime or I can't calculate price.
    // Wait, the API table for Bookings says "rent_end_date: Required".
    // So I'll require it.
    if (!payload.endTime) {
        throw new AppError(httpStatus.BAD_REQUEST, 'End time is required');
    }
    const endDate = new Date(payload.endTime);

    const durationInMs = endDate.getTime() - startDate.getTime();
    const durationInHours = durationInMs / (1000 * 60 * 60); // Hours
    const durationInDays = Math.ceil(durationInHours / 24); // Days? "daily rate * duration". Usually booking is per day?
    // If hourly, it would specify hourly rate. Table says "daily_rent_price".
    // I will treat it as days.
    const days = durationInDays > 0 ? durationInDays : 1;

    const totalPrice = days * vehicle.daily_rent_price;

    const result = await prisma.$transaction(async (transactionClient) => {
        // Create Booking
        const booking = await transactionClient.booking.create({
            data: {
                customer_id: userId,
                vehicle_id: payload.vehicleId,
                rent_start_date: startDate,
                rent_end_date: endDate,
                total_price: totalPrice,
                status: 'active',
            },
        });

        // Update Vehicle Status
        await transactionClient.vehicle.update({
            where: {
                id: payload.vehicleId,
            },
            data: {
                availability_status: 'booked',
            },
        });

        return booking;
    });

    return result;
};

const getAllBookings = async (user: any) => {
    // Admin: View all. Customer: View own.
    if (user.role === 'admin') {
        return await prisma.booking.findMany({
            include: {
                vehicle: true,
                customer: true
            }
        });
    } else {
        return await prisma.booking.findMany({
            where: {
                customer_id: user.id
            },
            include: {
                vehicle: true,
                customer: false // Don't need to see own profile nested?
            }
        });
    }
}

const cancelBooking = async (bookingId: string, userId: string) => {
    // Customer can cancel if active
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.customer_id !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You can only cancel your own bookings');
    }

    // Check start date (must be before)
    // "Cancel booking (before start date only)"
    const now = new Date();
    if (now >= booking.rent_start_date) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot cancel booking after it has started'); // or if started?
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'cancelled' }
        });

        // Update vehicle status
        await tx.vehicle.update({
            where: { id: booking.vehicle_id },
            data: { availability_status: 'available' }
        });

        return updatedBooking;
    });

    return result;
}

const returnBooking = async (bookingId: string) => {
    // Admin marks as returned
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.status !== 'active') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Booking is not active');
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: 'returned',
                // rent_end_date: new Date() ? No, keeping original scheduled end? Or actual return time?
                // Table doesn't say "actual_return_date".
                // I'll just update status.
            }
        });

        await tx.vehicle.update({
            where: { id: booking.vehicle_id },
            data: { availability_status: 'available' }
        });

        return updatedBooking;
    });

    return result;
}

export const BookingService = {
    createBooking,
    getAllBookings,
    cancelBooking,
    returnBooking
};
