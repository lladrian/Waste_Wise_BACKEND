import { Router } from "express";
import * as RequestController from '../controllers/request_controller.js'; // Import the controller

const requestRoutes = Router();

requestRoutes.post('/add_request', RequestController.create_request);
requestRoutes.get('/get_all_request', RequestController.get_all_request);
requestRoutes.get('/get_specific_request/:id', RequestController.get_specific_request);
requestRoutes.delete('/delete_request/:id', RequestController.delete_request);
requestRoutes.put('/update_request/:id', RequestController.update_request);
requestRoutes.put('/update_request_approval/:id', RequestController.update_request_approval);


export default requestRoutes;

