import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import TruckActivity from '../models/truck_activity.js';

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


export const create_truck_activity = asyncHandler(async (req, res) => {
    const { user, route } = req.body;

    try {
        if (!user || !route) {
            return res.status(400).json({ message: "Please provide all fields (user, route)." });
        }

        const newTruckActivityData = {
            user: user,
            route: route,
            started_at: storeCurrentDate(0, "hours"),
            created_at: storeCurrentDate(0, "hours")
        };

        const newTruckActivity = new TruckActivity(newTruckActivityData);
        await newTruckActivity.save();

        return res.status(200).json({ data: 'New truck activity successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create truck activity.' });
    }
});

export const get_all_truck_activity = asyncHandler(async (req, res) => {
    try {
        const truck_activities = await TruckActivity.find();

        return res.status(200).json({ data: truck_activities });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all truck activities.' });
    }
});


export const get_specific_truck_activity  = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const truck_activity = await TruckActivity.findById(id);

        res.status(200).json({ data: truck_activity });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific truck activity.' });
    }
});




export const update_truck_activity = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, route } = req.body;

    try {
        if (!user || !route) {
            return res.status(400).json({ message: "Please provide all fields (user, route)." });
        }

        const updatedTruckActivity= await TruckActivity.findById(id);

        if (!updatedTruckActivity) {
            return res.status(404).json({ message: "Truck activity not found" });
        }

        updatedTruckActivity.user = user ? user : updatedTruckActivity.user;
        updatedTruckActivity.route = route ? route : updatedTruckActivity.route;

        await updatedTruckActivity.save();

        return res.status(200).json({ data: 'Truck activity successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update truck activity.' });
    }
});



export const update_truck_activity_coordinates = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { longitude, latitude } = req.body;

    try {
        if (!longitude || !latitude) {
            return res.status(400).json({ message: "Please provide all fields (longitude, latitude)." });
        }

        const updatedTruckActivity= await TruckActivity.findById(id);

        if (!updatedTruckActivity) {
            return res.status(404).json({ message: "Truck activity not found" });
        }

        updatedTruckActivity.latitude = latitude ? latitude : updatedTruckActivity.latitude;
        updatedTruckActivity.longitude = longitude ? longitude : updatedTruckActivity.longitude;

        await updatedTruckActivity.save();

        return res.status(200).json({ data: 'Truck activity successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update truck activity.' });
    }
});


export const update_truck_activity_completion = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { is_complete } = req.body;

    try {
        if (!is_complete) {
            return res.status(400).json({ message: "Please provide all fields (is_complete)." });
        }

        const updatedTruckActivity= await TruckActivity.findById(id);

        if (!updatedTruckActivity) {
            return res.status(404).json({ message: "Truck activity not found" });
        }

        if(is_complete == 'true') {
            updatedTruckActivity.ended_at = is_complete ? storeCurrentDate(0, "hours") : updatedTruckActivity.latitude;
        } else {
            updatedTruckActivity.ended_at = null;
        }

        await updatedTruckActivity.save();

        return res.status(200).json({ data: 'Truck activity successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update truck activity.' });
    }
});



export const delete_truck_activity = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedTruckActivity = await TruckActivity.findByIdAndDelete(id);

        if (!deletedTruckActivity) return res.status(404).json({ message: 'Truck activity not found' });

        return res.status(200).json({ data: 'Truck activity successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete truck activity.' });
    }
});