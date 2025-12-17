import { Router } from "express";
import * as TestController from '../controllers/test_controller.js'; // Import the controller

const testRoutes = Router();


testRoutes.get('/get_truck_rotation', TestController.get_truck_rotation);

export default testRoutes;

