import { Router } from "express";
import * as ResidentUserController from '../controllers/resident_user_controller.js'; // Import the controller

const residentUserRoutes = Router();

residentUserRoutes.post('/add_user', ResidentUserController.create_user);
residentUserRoutes.post('/login_user', ResidentUserController.login_user);
residentUserRoutes.put('/update_user_verified/:id', ResidentUserController.update_user_verified);
residentUserRoutes.put('/update_user/:id', ResidentUserController.update_user);
residentUserRoutes.put('/update_user_password/:id', ResidentUserController.update_user_password);
residentUserRoutes.put('/update_user_password_admin/:id', ResidentUserController.update_user_password_admin);
residentUserRoutes.put('/update_user_password_recovery', ResidentUserController.update_user_password_recovery);
residentUserRoutes.get('/get_all_user', ResidentUserController.get_all_user);
residentUserRoutes.get('/get_specific_user/:id', ResidentUserController.get_specific_user);
residentUserRoutes.delete('/delete_user/:id', ResidentUserController.delete_user);


export default residentUserRoutes;