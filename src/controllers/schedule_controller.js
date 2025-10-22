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
    const { route, truck, user, scheduled_collection, garbage_type } = req.body;

    try {
        if (!route || !truck || !scheduled_collection || !user || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, scheduled_collection, user, garbage_type)." });
        }

        if (await Schedule.findOne({ user: user, truck: truck, scheduled_collection: scheduled_collection, route: route })) return res.status(400).json({ message: 'Schedule already exists' });

        const newScheduleData = {
            garbage_type: garbage_type,
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

export const get_all_schedule_specific_barangay = asyncHandler(async (req, res) => {
    const { barangay_id } = req.params;

    try {
        const schedules = await Schedule.find()
            .populate('route')
            // .populate('user')
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            });

        // Filter schedules where the route's merge_barangay contains the specified barangay_id
        const filteredSchedules = schedules.filter(schedule => {
            // Check if route exists and has merge_barangay array
            if (!schedule.route || !schedule.route.merge_barangay) {
                return false;
            }
            
            // Check if any barangay in merge_barangay matches the requested barangay_id
            return schedule.route.merge_barangay.some(barangay => 
                barangay.barangay_id.toString() === barangay_id
            );
        });

        return res.status(200).json({ data: filteredSchedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).json({ error: 'Failed to get schedules for barangay.' });
    }
});

export const get_all_schedule = asyncHandler(async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('route')
            // .populate('user')
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



export const update_schedule_approval = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { remark, status, is_editable, user } = req.body;

    try {
        if (!remark || !status || !is_editable || !user) {
            return res.status(400).json({ message: "Please provide all fields (remark, status, is_editable, user)." });
        }

        const updatedSchedule = await Schedule.findById(id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        if (status === "Pending") {
            updatedSchedule.approved_by = null;
            updatedSchedule.approved_at = null;
            updatedSchedule.cancelled_by = null;
            updatedSchedule.cancelled_at = null;
        }


        if (status === "Scheduled") {
            updatedSchedule.approved_by = user ? user : updatedSchedule.approved_by;
            updatedSchedule.approved_at = storeCurrentDate(0, "hours");
            updatedSchedule.cancelled_by = null;
            updatedSchedule.cancelled_at = null;
        }

        if (status === "Cancelled") {
            updatedSchedule.cancelled_by = user ? user : updatedSchedule.cancelled_by;
            updatedSchedule.cancelled_at = storeCurrentDate(0, "hours");
            updatedSchedule.approved_by = null;
            updatedSchedule.approved_at = null;
        }

        updatedSchedule.is_editable = is_editable ? is_editable : updatedSchedule.is_editable;
        updatedSchedule.remark = remark ? remark : updatedSchedule.remark;
        updatedSchedule.status = status ? status : updatedSchedule.status;


        await updatedSchedule.save();

        return res.status(200).json({ data: 'Schedule successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
});


export const update_schedule = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { route, truck, scheduled_collection, remark, status, garbage_type } = req.body;

    try {
        if (!route || !truck || !scheduled_collection || !remark || !status || !garbage_type) {
            return res.status(400).json({ message: "Please provide all fields (route, truck, scheduled_collection, remark, status, garbage_type)." });
        }

        if (await Schedule.findOne({ _id: { $ne: id }, truck: truck, scheduled_collection: scheduled_collection, route: route })) return res.status(400).json({ message: 'Schedule already exists' });

        const updatedSchedule = await Schedule.findById(id);

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        updatedSchedule.garbage_type = garbage_type ? garbage_type : updatedSchedule.garbage_type;
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