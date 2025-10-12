import { Router } from "express";
import * as UserController from '../controllers/user_controller.js'; // Import the controller

const userRoutes = Router();

userRoutes.post('/add_user', UserController.create_user);
userRoutes.post('/login_user', UserController.login_user);
userRoutes.put('/update_user_verified/:id', UserController.update_user_verified);
userRoutes.put('/update_user/:id', UserController.update_user);
userRoutes.put('/update_user_password/:id', UserController.update_user_password);
userRoutes.put('/update_user_password_admin/:id', UserController.update_user_password_admin);
userRoutes.put('/update_user_password_recovery', UserController.update_user_password_recovery);
userRoutes.get('/get_all_user', UserController.get_all_user);
userRoutes.get('/get_specific_user/:id', UserController.get_specific_user);
userRoutes.delete('/delete_user/:id', UserController.delete_user);

userRoutes.get('/test', UserController.test);

export default userRoutes;