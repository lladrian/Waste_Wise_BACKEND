import { Router } from "express";
import * as GarbageReportController from '../controllers/garbage_report_controller.js'; // Import the controller

const garbageReportRoutes = Router();

garbageReportRoutes.post('/add_garbage_report', GarbageReportController.create_garbage_report);
garbageReportRoutes.get('/get_all_garbage_report', GarbageReportController.get_all_garbage_report);
garbageReportRoutes.get('/get_all_garbage_report_specific_barangay/:barangay_id', GarbageReportController.get_all_garbage_report_specific_barangay);
garbageReportRoutes.get('/get_specific_garbage_report/:id', GarbageReportController.get_specific_garbage_report);
garbageReportRoutes.get('/get_all_garbage_report_specific_user/:user_id', GarbageReportController.get_all_garbage_report_specific_user);
garbageReportRoutes.delete('/delete_garbage_report/:id', GarbageReportController.delete_garbage_report);
garbageReportRoutes.put('/update_garbage_report_status/:id', GarbageReportController.update_garbage_report_status);
garbageReportRoutes.put('/update_garbage_report/:id', GarbageReportController.update_garbage_report);
garbageReportRoutes.put('/update_garbage_report_reponse/:id', GarbageReportController.update_garbage_report_reponse);




export default garbageReportRoutes;
