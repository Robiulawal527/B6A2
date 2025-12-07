import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import AppError from '../../utils/AppError';

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const getSingleUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await UserService.getSingleUser(userId);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result
    });
});

const updateUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = (req as any).user;

    // Authorization Check: Admin or Own
    if (user.role !== 'admin' && user.id !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You can only update your own profile');
    }

    // If customer, prevent role update?
    // "Customer: Update own profile only"
    // Usually means name, phone, etc. Not role.
    if (user.role !== 'admin' && req.body.role) {
        throw new AppError(httpStatus.FORBIDDEN, 'You cannot update your role');
    }

    const result = await UserService.updateUser(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await UserService.deleteUser(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: result
    });
});

export const UserController = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};
