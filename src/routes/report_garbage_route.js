import { Router } from "express";
import * as ReportGarbageController from '../controllers/report_garbage_controller.js'; // Import the controller

const reportGarbageRoutes = Router();

reportGarbageRoutes.post('/add_report_garbage', ReportGarbageController.create_report_garbage);
reportGarbageRoutes.get('/get_all_report_garbage', ReportGarbageController.get_all_report_garbage);
reportGarbageRoutes.get('/get_all_report_garbage_specific_barangay/:barangay_id', ReportGarbageController.get_all_report_garbage_specific_barangay);
reportGarbageRoutes.get('/get_specific_report_garbage/:id', ReportGarbageController.get_specific_report_garbage);
reportGarbageRoutes.get('/get_all_report_garbage_specific_user/:user_id', ReportGarbageController.get_all_report_garbage_specific_user);
reportGarbageRoutes.delete('/delete_report_garbage/:id', ReportGarbageController.delete_report_garbage);
reportGarbageRoutes.put('/update_report_garbage/:id', ReportGarbageController.update_report_garbage);

export default reportGarbageRoutes;
