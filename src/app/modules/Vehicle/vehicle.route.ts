import express from 'express';
import { VehicleController } from './vehicle.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { VehicleValidation } from './vehicle.validation';

const router = express.Router();

router.post(
    '/',
    auth(Role.admin),
    validateRequest(VehicleValidation.createVehicleValidationSchema),
    VehicleController.createVehicle,
);

router.get('/', VehicleController.getAllVehicles);

router.get('/:vehicleId', VehicleController.getSingleVehicle);

router.put(
    '/:vehicleId',
    auth(Role.admin),
    validateRequest(VehicleValidation.updateVehicleValidationSchema),
    VehicleController.updateVehicle,
);

router.delete(
    '/:vehicleId',
    auth(Role.admin),
    VehicleController.deleteVehicle,
);

export const VehicleRoutes = router;
