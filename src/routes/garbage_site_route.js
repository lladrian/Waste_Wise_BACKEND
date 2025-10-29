import { Router } from "express";
import * as GarbageSiteController from '../controllers/garbage_site_controller.js'; // Import the controller

const garbageSiteRoutes = Router();

garbageSiteRoutes.post('/add_garbage_site', GarbageSiteController.create_garbage_site);
garbageSiteRoutes.get('/get_all_garbage_site', GarbageSiteController.get_all_garbage_site);
garbageSiteRoutes.get('/get_all_garbage_site_specific_barangay/:barangay_id', GarbageSiteController.get_all_garbage_site_specific_barangay);
garbageSiteRoutes.get('/get_specific_garbage_site/:id', GarbageSiteController.get_specific_garbage_site);
garbageSiteRoutes.delete('/delete_garbage_site/:id', GarbageSiteController.delete_garbage_site);
garbageSiteRoutes.put('/update_garbage_site/:id', GarbageSiteController.update_garbage_site);


export default garbageSiteRoutes;

