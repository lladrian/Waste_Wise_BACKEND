import { Router } from "express";
import * as CollectorAttendanceController from '../controllers/collector_attendance_controller.js'; // Import the controller

const collectorAttendanceRoutes = Router();

collectorAttendanceRoutes.post('/add_collector_attendance', CollectorAttendanceController.create_collector_attendance);
collectorAttendanceRoutes.get('/get_all_collector_attendance', CollectorAttendanceController.get_all_collector_attendance);
collectorAttendanceRoutes.get('/get_specific_collector_attendance/:id', CollectorAttendanceController.get_specific_collector_attendance);
collectorAttendanceRoutes.delete('/delete_collector_attendance/:id', CollectorAttendanceController.delete_collector_attendance);
collectorAttendanceRoutes.put('/update_collector_attendance/:id', CollectorAttendanceController.update_collector_attendance);


export default collectorAttendanceRoutes;


