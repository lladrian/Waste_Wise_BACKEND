import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Route from '../models/route.js';

function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}


export const create_route = asyncHandler(async (req, res) => {
    const { route_name, merge_barangay } = req.body;

    try {
        if (!route_name || !merge_barangay) {
            return res.status(400).json({ message: "Please provide all fields (route_name, merge_barangay)." });
        }

        const routeData = {
            route_name: route_name,
            merge_barangay: merge_barangay,
            created_at: storeCurrentDate(0, "hours")
        };

        const newRouteData = new Route(routeData);
        await newRouteData.save();

        return res.status(200).json({ data: 'New route successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create route.' });
    }
});

export const get_all_route = asyncHandler(async (req, res) => {
    try {
        const routes = await Route.find().populate('merge_barangay.barangay_id');

        return res.status(200).json({ data: routes });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all routes.' });
    }
});

export const get_specific_route = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const route = await Route.findById(id).populate('merge_barangay.barangay_id');

        res.status(200).json({ data: route });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific route.' });
    }
});





export const update_route = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { route_name, merge_barangay } = req.body;

    try {
        if (!route_name || !merge_barangay) {
            return res.status(400).json({ message: "Please provide all fields (route_name, merge_barangay)." });
        }

        const updatedRoute = await Route.findById(id);

        if (!updatedRoute) {
            return res.status(404).json({ message: "Route not found" });
        }

        updatedRoute.route_name = route_name ? route_name : updatedRoute.route_name;
        updatedRoute.merge_barangay = merge_barangay ? merge_barangay : updatedRoute.merge_barangay;

        await updatedRoute.save();

        return res.status(200).json({ data: 'Route successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update route.' });
    }
});


export const delete_route = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedRoute = await Route.findByIdAndDelete(id);

        if (!deletedRoute) return res.status(404).json({ message: 'Route not found' });

        return res.status(200).json({ data: 'Route successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete route.' });
    }
});