import { Vehicle } from '@prisma/client';
import prisma from '../../utils/prisma';

const createVehicle = async (payload: Vehicle) => {
    const result = await prisma.vehicle.create({
        data: payload,
    });
    return result;
};

const getAllVehicles = async () => {
    const result = await prisma.vehicle.findMany();
    return result;
};

const getVehicleById = async (id: string) => {
    const result = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });
    return result;
};

const updateVehicle = async (id: string, payload: Partial<Vehicle>) => {
    const result = await prisma.vehicle.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};

const deleteVehicle = async (id: string) => {
    const activeBookings = await prisma.booking.findFirst({
        where: {
            vehicle_id: id,
            status: 'active',
        },
    });

    if (activeBookings) {
        throw new Error('Vehicle cannot be deleted because it has active bookings');
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
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
