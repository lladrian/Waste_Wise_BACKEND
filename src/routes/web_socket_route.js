import { Router } from "express";
import * as WebSocketController from '../controllers/web_socket_controller.js'; // Import the controller

const webSocketRoutes = Router();

webSocketRoutes.post('/get_web_socket_schedule', WebSocketController.get_web_socket_schedule);

export default webSocketRoutes;

