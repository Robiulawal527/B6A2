import { Booking } from '@prisma/client';
import prisma from '../../utils/prisma';
import httpStatus from 'http-status';

const createBooking = async (
    userId: string,
    payload: { vehicle_id: string; rent_start_date: string; rent_end_date: string },
) => {
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id: payload.vehicle_id,
        },
    });

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    if (vehicle.availability_status === 'booked') {
        throw new Error('Vehicle is already booked');
    }

    const startDate = new Date(payload.rent_start_date);
    const endDate = new Date(payload.rent_end_date);
    const durationInMs = endDate.getTime() - startDate.getTime();
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

    if (durationInDays < 0) {
        throw new Error("End date must be after start date");
    }

    const totalPrice = durationInDays * vehicle.daily_rent_price;

    const result = await prisma.$transaction(async (transactionClient) => {
        const booking = await transactionClient.booking.create({
            data: {
                customer_id: userId,
                vehicle_id: payload.vehicle_id,
                rent_start_date: startDate,
                rent_end_date: endDate,
                total_price: totalPrice,
                status: 'active',
            },
            include: {
                vehicle: true,
                customer: true,
            },
        });

        await transactionClient.vehicle.update({
            where: {
                id: payload.vehicle_id,
            },
            data: {
                availability_status: 'booked',
            },
        });

        console.log(booking);
        return booking;
    });

    return result;
};

const getAllBookings = async (userId: string, role: string) => {
    if (role === 'admin') {
        const result = await prisma.booking.findMany({
            include: {
                vehicle: true,
                customer: true,
            },
        });
        return result;
    }

    const result = await prisma.booking.findMany({
        where: {
            customer_id: userId,
        },
        include: {
            vehicle: true,
            customer: true,
        },
    });
    return result;
};

const getMyBookings = async (userId: string) => {
    const result = await prisma.booking.findMany({
        where: {
            customer_id: userId
        },
        include: {
            vehicle: true,
            customer: true
        }
    })
    return result;
}

const cancelBooking = async (bookingId: string, userId: string, userRole?: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Only check ownership if user is not admin
    if (userRole !== 'admin' && booking.customer_id !== userId) {
        throw new Error("You are not authorized to cancel this booking");
    }

    // Customer: Cancel booking (before start date only)
    // Admin can cancel at any time
    const currentDate = new Date();
    if (userRole !== 'admin' && booking.rent_start_date <= currentDate) {
        throw new Error("You cannot cancel a booking after it has started");
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const updatedBooking = await transactionClient.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status: 'cancelled'
            },
            include: {
                vehicle: true,
                customer: true
            }
        })

        await transactionClient.vehicle.update({
            where: {
                id: booking.vehicle_id
            },
            data: {
                availability_status: 'available'
            }
        })
        return updatedBooking;
    })
    return result;

}

const returnBooking = async (bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new Error("Booking not found");
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const updatedBooking = await transactionClient.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status: 'returned'
            },
            include: {
                vehicle: true,
                customer: true
            }
        })

        await transactionClient.vehicle.update({
            where: {
                id: booking.vehicle_id
            },
            data: {
                availability_status: 'available'
            }
        })

        return updatedBooking;
    });
    return result;
}

export const BookingService = {
    createBooking,
    getAllBookings,
    getMyBookings,
    cancelBooking,
    returnBooking
};
