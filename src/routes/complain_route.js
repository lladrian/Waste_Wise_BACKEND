import { Router } from "express";
import * as ComplainController from '../controllers/complain_controller.js'; // Import the controller

const complainRoutes = Router();

complainRoutes.post('/add_complain', ComplainController.create_complain);
complainRoutes.get('/get_all_complain', ComplainController.get_all_complain);
complainRoutes.get('/get_all_complain_specific_barangay/:barangay_id', ComplainController.get_all_complain_specific_barangay);
complainRoutes.get('/get_specific_complain/:id', ComplainController.get_specific_complain);
complainRoutes.delete('/delete_complain/:id', ComplainController.delete_complain);
complainRoutes.put('/update_complain/:id', ComplainController.update_complain);
complainRoutes.put('/update_complain_verification/:id', ComplainController.update_complain_verification);



export default complainRoutes;
