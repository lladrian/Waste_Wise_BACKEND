import { Router } from "express";
import * as BarangayController from '../controllers/barangay_controller.js'; // Import the controller

const barangayRoutes = Router();

barangayRoutes.post('/add_barangay', BarangayController.create_barangay);
// barangayRoutes.get('/get_barangay_location/:city/:province', BarangayController.get_barangay_location);
barangayRoutes.get('/get_simple_barangay_list', BarangayController.get_simple_barangay_list);
barangayRoutes.get('/get_barangay_with_coordinates', BarangayController.get_barangay_with_coordinates);


barangayRoutes.get('/get_all_barangay', BarangayController.get_all_barangay);
barangayRoutes.get('/get_specific_barangay/:id', BarangayController.get_specific_barangay);
barangayRoutes.delete('/delete_barangay/:id', BarangayController.delete_barangay);
barangayRoutes.put('/update_barangay/:id', BarangayController.update_barangay);


export default barangayRoutes;

