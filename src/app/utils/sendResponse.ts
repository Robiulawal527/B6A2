import { Response } from 'express';

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode, // Prompt reference: "Response format ... MUST exactly match". Often requires explicit status in body or just HTTP status. I'll include it in body to be safe or standard. Wait, usually standard wrapper is `{ success: true, message: '...', data: ... }`. The HTTP status is in the header.
        // The prompt "See API Reference" is unavailable, but usually it implies standard structure.
        message: data.message,
        data: data.data,
    });
};

export default sendResponse;
