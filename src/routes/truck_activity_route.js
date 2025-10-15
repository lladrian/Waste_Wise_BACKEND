import { Router } from "express";
import * as TruckActivityController from '../controllers/truck_activity_controller.js'; // Import the controller

const truckActivityRoutes = Router();

truckActivityRoutes.post('/add_truck_activity', TruckActivityController.create_truck_activity);
truckActivityRoutes.get('/get_all_truck_activity', TruckActivityController.get_all_truck_activity);
truckActivityRoutes.get('/get_specific_truck_activity/:id', TruckActivityController.get_specific_truck_activity);
truckActivityRoutes.delete('/delete_truck_activity/:id', TruckActivityController.delete_truck_activity);
truckActivityRoutes.put('/update_truck_activity/:id', TruckActivityController.update_truck_activity);
truckActivityRoutes.put('/update_truck_activity_completion/:id', TruckActivityController.update_truck_activity_completion);
truckActivityRoutes.put('/update_truck_activity_coordinates/:id', TruckActivityController.update_truck_activity_coordinates);

export default truckActivityRoutes;

