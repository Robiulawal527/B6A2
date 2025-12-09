import httpStatus from 'http-status';
import { User } from '@prisma/client';
import config from '../../config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';

const signup = async (payload: User) => {
    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds),
    );

    const userData = {
        ...payload,
        password: hashedPassword,
    };

    const result = await prisma.user.create({
        data: userData,
    });

    const { password, ...userWithoutPassword } = result;

    return userWithoutPassword;
};

const signin = async (payload: Pick<User, 'email' | 'password'>) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        throw new Error('User does not exist');
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password,
    );

    if (!isPasswordMatched) {
        throw new Error('Password does not match');
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const token = jwt.sign(jwtPayload, config.jwt.secret as string, {
        expiresIn: config.jwt.expires_in,
    });

    const { password, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword,
    };
};

export const AuthService = {
    signup,
    signin,
};
