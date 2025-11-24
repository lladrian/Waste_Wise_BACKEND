import { Router } from "express";
import * as BarangayRequestController from '../controllers/barangay_request_controller.js'; // Import the controller

const complainRoutes = Router();

complainRoutes.post('/add_barangay_request', BarangayRequestController.create_barangay_request);
complainRoutes.get('/get_all_barangay_request', BarangayRequestController.get_all_barangay_request);
complainRoutes.get('/get_all_barangay_request_specific_barangay/:barangay_id', BarangayRequestController.get_all_barangay_request_specific_barangay);
complainRoutes.get('/get_specific_barangay_request/:id', BarangayRequestController.get_specific_barangay_request);
complainRoutes.delete('/delete_barangay_request/:id', BarangayRequestController.delete_barangay_request);
complainRoutes.put('/update_barangay_request/:id', BarangayRequestController.update_barangay_request);


export default complainRoutes;
