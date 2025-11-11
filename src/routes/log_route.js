import { Router } from "express";
import * as LogController from '../controllers/log_controller.js'; // Import the controller

const logRoutes = Router();

logRoutes.get('/get_all_login_log', LogController.get_all_login_log);
logRoutes.get('/get_all_login_log_specific_user/:user_id', LogController.get_all_login_log_specific_user);



 

export default logRoutes;

