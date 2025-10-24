import { Router } from "express";
import * as OTPController from '../controllers/otp_controller.js'; // Import the controller

const otpRoutes = Router();

otpRoutes.post('/add_otp', OTPController.create_otp);
otpRoutes.post('/verify_otp', OTPController.verify_otp);
otpRoutes.get('/test_otp', OTPController.test_otp);
otpRoutes.get('/test_otp_orig', OTPController.test_otp_orig);




export default otpRoutes;