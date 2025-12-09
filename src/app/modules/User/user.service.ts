import { User } from '@prisma/client';
import prisma from '../../utils/prisma';

const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

const updateUser = async (id: string, userId: string, userRole: string, payload: Partial<User>) => {
    // Customer can only update their own profile
    if (userRole === 'customer' && id !== userId) {
        throw new Error('You can only update your own profile');
    }

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

const deleteUser = async (id: string) => {
    const activeBookings = await prisma.booking.findFirst({
        where: {
            customer_id: id,
            status: 'active',
        },
    });

    if (activeBookings) {
        throw new Error('User cannot be deleted because they have active bookings');
    }

    const result = await prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
};

export const UserService = {
    getAllUsers,
    updateUser,
    deleteUser,
};
