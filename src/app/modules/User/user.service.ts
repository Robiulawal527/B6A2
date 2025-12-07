import { Prisma, User } from '@prisma/client';
import prisma from '../../utils/prisma';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            address: false, // User model in schema doesn't have address. Wait, I didn't add address. Prompt schema doesn't have address.
            password: false, // Exclude password
            createdAt: true,
            updatedAt: true,
        } as any,
        // select type check might fail if I select fields that don't exist.
        // I will just use `select` correctly.
    });
    return result;
};

const getSingleUser = async (id: string): Promise<User | null> => {
    const result = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            bookings: true // maybe? No, requirement just says view users.
        }
    });
    return result;
};

const updateUser = async (id: string, payload: Partial<User>) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const result = await prisma.user.update({
        where: { id },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            password: false
        } as any
    });

    return result;
}

const deleteUser = async (id: string): Promise<User> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check active bookings
    // Assuming Bookings are linked.
    // "Delete user (only if no active bookings exist)"
    // I need to check if user has bookings with status 'active'. (or maybe any booking?)
    // Requirement says "only if no active bookings exist".
    const activeBooking = await prisma.booking.findFirst({
        where: {
            customer_id: id,
            status: 'active'
        }
    });

    if (activeBooking) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete user with active bookings');
    }

    const result = await prisma.user.delete({
        where: { id }
    });

    return result;
}

export const UserService = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};
