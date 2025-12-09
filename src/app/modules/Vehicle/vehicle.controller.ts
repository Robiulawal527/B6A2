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
        message: result.length > 0 
            ? 'Vehicles retrieved successfully' 
            : 'No vehicles found',
        data: result,
    });
});

const getVehicleById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await VehicleService.getVehicleById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle retrieved successfully',
        data: result,
    });
});

const updateVehicle = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await VehicleService.updateVehicle(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle updated successfully',
        data: result,
    });
});

const deleteVehicle = catchAsync(async (req, res) => {
    const { id } = req.params;
    await VehicleService.deleteVehicle(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vehicle deleted successfully',
        data: null,
    });
});

export const VehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
