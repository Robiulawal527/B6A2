import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const signup = catchAsync(async (req, res) => {
    const result = await AuthService.signup(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});

const signin = catchAsync(async (req, res) => {
    const result = await AuthService.signin(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login successful',
        data: result,
    });
});

export const AuthController = {
    signup,
    signin,
};
