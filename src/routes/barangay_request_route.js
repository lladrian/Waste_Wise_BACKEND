import { Router } from "express";
import * as BarangayRequestController from '../controllers/barangay_request_controller.js'; // Import the controller

const barangayRequestRoutes = Router();

barangayRequestRoutes.post('/add_barangay_request', BarangayRequestController.create_barangay_request);
barangayRequestRoutes.get('/get_all_barangay_request', BarangayRequestController.get_all_barangay_request);
barangayRequestRoutes.get('/get_all_barangay_request_specific_barangay/:barangay_id', BarangayRequestController.get_all_barangay_request_specific_barangay);
barangayRequestRoutes.get('/get_specific_barangay_request/:id', BarangayRequestController.get_specific_barangay_request);
barangayRequestRoutes.delete('/delete_barangay_request/:id', BarangayRequestController.delete_barangay_request);
barangayRequestRoutes.put('/update_barangay_request/:id', BarangayRequestController.update_barangay_request);
barangayRequestRoutes.put('/update_barangay_request_status/:id', BarangayRequestController.update_barangay_request_status);




export default barangayRequestRoutes;
