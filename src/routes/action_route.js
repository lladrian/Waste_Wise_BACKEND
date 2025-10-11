import { Router } from "express";
import * as RoleActionController from '../controllers/action_controller.js'; // Import the controller

const roleActionRoutes = Router();

roleActionRoutes.post('/add_role_action', RoleActionController.create_role_action);
roleActionRoutes.get('/get_all_role_action', RoleActionController.get_all_role_action);
roleActionRoutes.get('/get_specific_role_action/:id', RoleActionController.get_specific_role_action);
roleActionRoutes.delete('/delete_role_action/:id', RoleActionController.delete_role_action);
roleActionRoutes.put('/update_role_action/:id', RoleActionController.update_role_action);


export default roleActionRoutes;

