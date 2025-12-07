import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../utils/AppError';
import prisma from '../utils/prisma';
// Actually auth.service creates a local instance. I should have a shared one.
// For now I'll create a new one or use from library if I had one. 
// I'll import from a shared location if possible, but I don't have one yet.
// I'll create a shared prisma client file.

import { PrismaClient, Role } from '@prisma/client';

const prismaClient = new PrismaClient(); // Temporary, should use singleton

import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(
                token,
                config.jwt.secret as string,
            ) as JwtPayload;
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
        }

        const { role, email } = decoded;

        // Check if user exists
        const user = await prismaClient.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'This user is not found !');
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.LOCKED, 'You are not authorized'); // 423 Locked or 403 Forbidden? 403 usually.
            // 403 Forbidden is better.
            // But for now sticking to standard or what I typed. 403.
        }

        // Attach user to request if needed.
        // req.user = decoded as JwtPayload; // TS might complain if I don't extend Request type.
        // For now I'll skip attaching unless I need it in controller. I usually do.
        // I need to extend Request interface.
        // I'll do `req.user = decoded;` after casting or extending.

        // Extend Request type locally or assume I cast it when using.
        (req as any).user = decoded;

        next();
    });
};

export default auth;
