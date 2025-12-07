/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
// import { ZodError } from 'zod';
// import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];

    //   if (err instanceof ZodError) {
    //     // Handle Zod Error
    //   } else if (err?.name === 'ValidationError') {
    //     // Handle Mongoose/Prisma Validation Error if needed
    //   } else if (err?.name === 'CastError') {
    //     // Handle Cast Error
    //   }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // stack: config.node_env === 'development' ? err?.stack : null,
        err,
    });
};

export default globalErrorHandler;
