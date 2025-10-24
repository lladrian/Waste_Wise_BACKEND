import { Router } from "express";
import * as OTPController from '../controllers/otp_controller.js'; // Import the controller

const otpRoutes = Router();

otpRoutes.post('/request_approval_mailer', OTPController.request_approval_mailer);
otpRoutes.post('/request_reject_mailer', OTPController.request_reject_mailer);
otpRoutes.post('/credential_mailer', OTPController.credential_mailer);
otpRoutes.post('/credential_mailer_new_user', OTPController.credential_mailer_new_user);
otpRoutes.post('/otp_mailer', OTPController.otp_mailer);
otpRoutes.post('/add_otp', OTPController.create_otp);
otpRoutes.post('/verify_otp', OTPController.verify_otp);

export default otpRoutes;