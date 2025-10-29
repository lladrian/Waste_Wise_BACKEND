import { Router } from "express";
import * as RouteController from '../controllers/route_controller.js'; // Import the controller

const routeRoutes = Router();

routeRoutes.post('/add_route', RouteController.create_route);
routeRoutes.get('/get_all_route', RouteController.get_all_route);
routeRoutes.get('/get_specific_route/:id', RouteController.get_specific_route);
routeRoutes.delete('/delete_route/:id', RouteController.delete_route);
routeRoutes.put('/update_route/:id', RouteController.update_route);


export default routeRoutes;

