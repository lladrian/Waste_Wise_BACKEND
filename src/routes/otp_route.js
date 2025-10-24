import { Router } from "express";
import * as OTPController from '../controllers/otp_controller.js'; // Import the controller

const otpRoutes = Router();

otpRoutes.post('/add_otp', OTPController.create_otp);
otpRoutes.post('/verify_otp', OTPController.verify_otp);
otpRoutes.get('/test', OTPController.test);
otpRoutes.get('/test_otp', OTPController.test_otp);
otpRoutes.get('/test_otp_orig', OTPController.test_otp_orig);
otpRoutes.get('/test_otp_orig2', OTPController.test_otp_orig2);
otpRoutes.get('/test_otp_orig3', OTPController.test_otp_orig3);






export default otpRoutes;