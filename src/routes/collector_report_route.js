import { Router } from "express";
import * as CollectorReportController from '../controllers/collector_report_controller.js'; // Import the controller

const collectorReportRoutes = Router();

collectorReportRoutes.post('/add_collector_report', CollectorReportController.create_collector_report);
collectorReportRoutes.get('/get_all_collector_report', CollectorReportController.get_all_collector_report);
collectorReportRoutes.get('/get_all_collector_report_specific_user/:user_id', CollectorReportController.get_all_collector_report_specific_user);
collectorReportRoutes.get('/get_specific_collector_report/:id', CollectorReportController.get_specific_collector_report);
collectorReportRoutes.delete('/delete_collector_report/:id', CollectorReportController.delete_collector_report);
collectorReportRoutes.put('/update_collector_report_status/:id', CollectorReportController.update_collector_report_status);
collectorReportRoutes.put('/update_collector_report/:id', CollectorReportController.update_collector_report);



export default collectorReportRoutes;
