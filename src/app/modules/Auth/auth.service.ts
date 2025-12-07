import config from '../../config';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

import prisma from '../../utils/prisma';

const signup = async (payload: Prisma.UserCreateInput) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, 'User with this email already exists!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds),
    );

    const newUser = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
        },
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

    return newUser;
};

const signin = async (payload: Pick<Prisma.UserCreateInput, 'email' | 'password'>) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password!');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id
    };

    const token = jwt.sign(jwtPayload, config.jwt.secret as string, {
        expiresIn: config.jwt.expires_in,
    } as jwt.SignOptions);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        token,
    };
};

export const AuthService = {
    signup,
    signin,
};
