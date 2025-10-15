import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Schedule from '../models/schedule.js';

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


export const create_schedule = asyncHandler(async (req, res) => {
    const { route, truck, user, scheduled_collection } = req.body;

    try {
        if (!route || !truck || !scheduled_collection || !user) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, scheduled_collection, user)." });
        }


        const newScheduleData = {
            route: route,
            truck: truck,
            user: user,
            scheduled_collection: scheduled_collection,
            created_at: storeCurrentDate(0, "hours")
        };

        const newSchedule = new Schedule(newScheduleData);
        await newSchedule.save();

        return res.status(200).json({ data: 'New schedule successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create schedule.' });
    }
});

export const get_all_schedule = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('route')
            .populate('user')
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            });

        return res.status(200).json({ data: schedules });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all schedules.' });
    }
});

export const get_specific_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const schedule = await Schedule.findById(id);

        res.status(200).json({ data: schedule });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific schedule.' });
    }
});


export const update_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { route, truck, scheduled_collection, remark, status } = req.body;

    try {
        if (!route || !truck || !scheduled_collection || !remark || !status) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, scheduled_collection, remark, status)." });
        }

        const updatedSchedule = await Schedule.findById(id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        updatedSchedule.route = route ? route : updatedSchedule.route;
        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;
        updatedSchedule.truck = truck ? truck : updatedSchedule.truck;
        updatedSchedule.scheduled_collection = scheduled_collection ? scheduled_collection : updatedSchedule.scheduled_collection;

        await updatedSchedule.save();

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});


export const update_schedule_garbage_collector = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { remark, status } = req.body;

    try {
        if (!remark || !status) {
            return res.status(400).json({ message: "Please provide all fields (remark, status)." });
        }

        const updatedSchedule = await Schedule.findById(id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }


        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;

        await updatedSchedule.save();

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});


export const delete_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(id);

        if (!deletedSchedule) return res.status(404).json({ message: 'Schedule not found' });

        return res.status(200).json({ data: 'Schedule successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete schedule.' });
    }
});