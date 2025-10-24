import { Router } from "express";
import * as OTPController from '../controllers/otp_controller.js'; // Import the controller

const otpRoutes = Router();

otpRoutes.post('/mailer_sender', OTPController.mailer_sender);
otpRoutes.post('/add_otp', OTPController.create_otp);
otpRoutes.post('/verify_otp', OTPController.verify_otp);
otpRoutes.get('/test', OTPController.test);






export default otpRoutes;