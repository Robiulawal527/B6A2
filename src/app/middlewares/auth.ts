import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import prisma from '../utils/prisma';

const auth = (...requiredRoles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new Error('You are not authorized!');
            }

            const verifiedUser = jwt.verify(
                token,
                config.jwt.secret as string,
            ) as JwtPayload;

            // Fetch user from database to get full user object
            const user = await prisma.user.findUnique({
                where: {
                    id: verifiedUser.id,
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                throw new Error('You are not authorized');
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;
