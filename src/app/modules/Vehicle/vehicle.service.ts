import { Prisma, Vehicle } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

const createVehicle = async (payload: Prisma.VehicleCreateInput): Promise<Vehicle> => {
    const result = await prisma.vehicle.create({
        data: payload,
    });
    return result;
};

const getAllVehicles = async (): Promise<Vehicle[]> => {
    const result = await prisma.vehicle.findMany();
    return result;
};

const getSingleVehicle = async (id: string): Promise<Vehicle | null> => {
    const result = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });
    return result;
};

const updateVehicle = async (id: string, payload: Partial<Vehicle>): Promise<Vehicle> => {
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });

    if (!vehicle) {
        throw new AppError(httpStatus.NOT_FOUND, 'Vehicle not found');
    }

    const result = await prisma.vehicle.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};

const deleteVehicle = async (id: string): Promise<Vehicle> => {
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });

    if (!vehicle) {
        throw new AppError(httpStatus.NOT_FOUND, 'Vehicle not found');
    }

    // Check if active bookings exist (Requirement: "only if no active bookings exist")
    // Since I don't have Booking model linked fully yet (I do in schema), I should check bookings.
    // Wait, I have `bookings Booking[]` in Vehicle model.
    const activeBookings = await prisma.booking.findFirst({
        where: {
            vehicle_id: id,
            status: 'active',
        },
    });

    if (activeBookings) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete vehicle with active bookings');
    }

    const result = await prisma.vehicle.delete({
        where: {
            id,
        },
    });
    return result;
};

export const VehicleService = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
