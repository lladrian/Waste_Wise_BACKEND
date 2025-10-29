import { Router } from "express";
import * as UserController from '../controllers/user_controller.js'; // Import the controller

const userRoutes = Router();

userRoutes.post('/add_user_resident', UserController.create_user_resident);
userRoutes.post('/add_user', UserController.create_user);
userRoutes.post('/login_user', UserController.login_user);
userRoutes.put('/update_user_verified/:id', UserController.update_user_verified);
userRoutes.put('/update_user_resident_garbage_site/:id', UserController.update_user_resident_garbage_site);
userRoutes.put('/update_user/:id', UserController.update_user);
userRoutes.put('/update_user_profile/:id', UserController.update_user_profile);
userRoutes.put('/update_user_resident/:id', UserController.update_user_resident);
userRoutes.put('/update_user_password/:id', UserController.update_user_password);
userRoutes.put('/update_user_password_admin/:id', UserController.update_user_password_admin);
userRoutes.put('/update_user_password_recovery', UserController.update_user_password_recovery);
userRoutes.get('/get_all_user_truck_driver', UserController.get_all_user_truck_driver);
userRoutes.get('/get_all_user', UserController.get_all_user);
userRoutes.get('/get_specific_user/:id', UserController.get_specific_user);
userRoutes.delete('/delete_user/:id', UserController.delete_user);


export default userRoutes;


