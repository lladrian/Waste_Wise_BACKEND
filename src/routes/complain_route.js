import { Router } from "express";
import * as ComplainController from '../controllers/complain_controller.js'; // Import the controller

const complainRoutes = Router();

complainRoutes.post('/add_complain', ComplainController.create_complain);
complainRoutes.get('/get_all_complain', ComplainController.get_all_complain);
complainRoutes.get('/get_specific_complain/:id', ComplainController.get_specific_complain);
complainRoutes.delete('/delete_complain/:id', ComplainController.delete_complain);
complainRoutes.put('/update_complain/:id', ComplainController.update_complain);


export default complainRoutes;
