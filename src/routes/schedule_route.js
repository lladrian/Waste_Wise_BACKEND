import { Router } from "express";
import * as ScheduleController from '../controllers/schedule_controller.js'; // Import the controller

const scheduleRoutes = Router();

scheduleRoutes.post('/add_schedule', ScheduleController.create_schedule);
scheduleRoutes.get('/get_all_schedule', ScheduleController.get_all_schedule);
scheduleRoutes.get('/get_all_schedule_current_day', ScheduleController.get_all_schedule_current_day);
scheduleRoutes.get('/get_all_schedule_current_day_specific_user/:user_id', ScheduleController.get_all_schedule_current_day_specific_user);
scheduleRoutes.get('/get_specific_schedule/:id', ScheduleController.get_specific_schedule);
scheduleRoutes.get('/get_all_schedule_specific_user_garbage_collector/:user_id', ScheduleController.get_all_schedule_specific_user_garbage_collector);
scheduleRoutes.get('/get_all_schedule_specific_barangay/:barangay_id', ScheduleController.get_all_schedule_specific_barangay);
scheduleRoutes.delete('/delete_schedule/:id', ScheduleController.delete_schedule);
scheduleRoutes.put('/update_schedule/:id', ScheduleController.update_schedule);
scheduleRoutes.put('/update_schedule_approval/:id', ScheduleController.update_schedule_approval);
scheduleRoutes.put('/update_schedule_garbage_collector/:id', ScheduleController.update_schedule_garbage_collector);


export default scheduleRoutes;

