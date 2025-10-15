import { Router } from "express";
import * as GenerateReportController from '../controllers/generate_report_controller.js'; // Import the controller

const generateReportRoutes = Router();

generateReportRoutes.post('/generate_report_login_log', GenerateReportController.generate_report_login_log);
generateReportRoutes.post('/generate_report_login_log_specific_user/:user_id', GenerateReportController.generate_report_login_log_specific_user);



export default generateReportRoutes;

