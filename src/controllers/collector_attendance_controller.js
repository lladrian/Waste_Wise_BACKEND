import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import CollectorAttendance from '../models/collector_attendance.js';

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


export const create_collector_attendance = asyncHandler(async (req, res) => {
    const { truck, user, route } = req.body;

    try {
        if (!truck || !user || !route) {
            return res.status(400).json({ message: "Please provide all fields (truck, user, route)." });
        }


        const newCollectorAttendanceData = {
            truck: truck,
            user: user,
            route: route,
            started_at: storeCurrentDate(0, "hours"),
            created_at: storeCurrentDate(0, "hours")
        };

        const newCollectorAttendance = new CollectorAttendance(newCollectorAttendanceData);
        await newCollectorAttendance.save();

        return res.status(200).json({ data: 'New collector attendance successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create collector attendance.' });
    }
});




export const get_all_collector_attendance = asyncHandler(async (req, res) => {
    try {
        const collector_attendances = await CollectorAttendance.find();

        return res.status(200).json({ data: collector_attendances });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector attendance.' });
    }
});

export const get_specific_collector_attendance = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_attendance = await CollectorAttendance.findById(id);

        res.status(200).json({ data: collector_attendance });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific collector attendance.' });
    }
});




export const update_collector_attendance = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { truck, user, route } = req.body;

    try {
        if (!truck || !user || !route) {
            return res.status(400).json({ message: "Please provide all fields (truck, user, route)." });
        }

        const updatedCollectorAttendance = await CollectorAttendance.findById(id);

        if (!updatedCollectorAttendance) {
            return res.status(404).json({ message: "Collector attendance not found" });
        }

        updatedCollectorAttendance.truck = truck ? truck : updatedCollectorAttendance.truck;
        updatedCollectorAttendance.user = user ? user : updatedCollectorAttendance.user;
        updatedCollectorAttendance.route = route ? route : updatedCollectorAttendance.route;


        await updatedCollectorAttendance.save();

        return res.status(200).json({ data: 'Collector attendance successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collector attendance.' });
    }
});


export const delete_collector_attendance = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedCollectorAttendance = await CollectorAttendance.findByIdAndDelete(id);

        if (!deletedCollectorAttendance) return res.status(404).json({ message: 'Collector attendance not found' });

        return res.status(200).json({ data: 'Collector attendance successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete collector attendance.' });
    }
});