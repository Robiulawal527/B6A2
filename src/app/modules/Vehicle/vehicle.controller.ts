import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VehicleService } from './vehicle.service';

const createVehicle = catchAsync(async (req, res) => {
    const result = await VehicleService.createVehicle(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Vehicle created successfully',
        data: result,
    });
});

const getAllVehicles = catchAsync(async (req, res) => {
    const result = await VehicleService.getAllVehicles();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    });
});

const getSingleVehicle = catchAsync(async (req, res) => {
    const { vehicleId } = req.params;
    const result = await VehicleService.getSingleVehicle(vehicleId);

    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'Vehicle not found',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle retrieved successfully',
        data: result,
    });
});

const updateVehicle = catchAsync(async (req, res) => {
    const { vehicleId } = req.params;
    const result = await VehicleService.updateVehicle(vehicleId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle updated successfully',
        data: result,
    });
});

const deleteVehicle = catchAsync(async (req, res) => {
    const { vehicleId } = req.params;
    const result = await VehicleService.deleteVehicle(vehicleId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle deleted successfully',
        data: result,
    });
});

export const VehicleController = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
