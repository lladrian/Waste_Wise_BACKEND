import { Router } from "express";
import * as OTPController from '../controllers/otp_controller.js'; // Import the controller

const otpRoutes = Router();

otpRoutes.post('/add_otp', OTPController.create_otp);
otpRoutes.post('/verify_otp', OTPController.verify_otp);


export default otpRoutes;