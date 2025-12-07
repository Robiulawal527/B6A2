import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidation.signupValidationSchema),
    AuthController.signup,
);

router.post(
    '/signin',
    validateRequest(AuthValidation.signinValidationSchema),
    AuthController.signin,
);

export const AuthRoutes = router;
