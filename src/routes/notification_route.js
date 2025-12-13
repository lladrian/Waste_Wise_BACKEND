import { Router } from "express";
import * as NotificationController from '../controllers/notification_controller.js'; // Import the controller

const notificationRoutes = Router();

notificationRoutes.post('/create_notification', NotificationController.create_notification);
notificationRoutes.post('/create_notification_resident', NotificationController.create_notification_resident);
notificationRoutes.post('/create_notification_garbage_collector', NotificationController.create_notification_garbage_collector);
notificationRoutes.post('/update_read_multiple_notification', NotificationController.update_read_multiple_notification);
notificationRoutes.post('/update_archive_multiple_notification', NotificationController.update_archive_multiple_notification);
notificationRoutes.post('/create_notification_many', NotificationController.create_notification_many);
notificationRoutes.get('/update_read_all_notification_specific_user/:user_id', NotificationController.update_read_all_notification_specific_user);
notificationRoutes.get('/update_read_specific_notification/:id', NotificationController.update_read_specific_notification);
notificationRoutes.get('/get_all_notification_specific_user/:user_id/:role', NotificationController.get_all_notification_specific_user);


export default notificationRoutes;

