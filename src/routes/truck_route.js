import { Router } from "express";
import * as TruckController from '../controllers/truck_controller.js'; // Import the controller

const truckRoutes = Router();

truckRoutes.post('/add_truck', TruckController.create_truck);
truckRoutes.get('/get_all_truck', TruckController.get_all_truck);
truckRoutes.get('/get_specific_truck/:id', TruckController.get_specific_truck);
truckRoutes.delete('/delete_truck/:id', TruckController.delete_truck);
truckRoutes.put('/update_truck/:id', TruckController.update_truck);
truckRoutes.put('/update_truck_position/:id', TruckController.update_truck_position);
// truckRoutes.put('/update_truck_hidden/:id', TruckController.update_truck_hidden);

export default truckRoutes;