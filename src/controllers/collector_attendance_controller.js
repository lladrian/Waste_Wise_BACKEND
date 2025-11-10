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

export const check_collector_attendance = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const last_attendance = await CollectorAttendance.findOne({ user: user_id }).sort({ created_at: -1 }); 

        if(!last_attendance) {
            return res.status(400).json({ data: 0, message: "Collector attendance not found." });
        }

        return res.status(200).json({ data: last_attendance.flag });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to create collector attendance.' });
    }
});


export const create_collector_attendance = asyncHandler(async (req, res) => {
    const { truck, user, schedule, started_at } = req.body;

    try {
        if (!truck || !user || !started_at || !schedule) {
            return res.status(400).json({ message: "Please provide all fields (truck, user, schedule, started_at)." });
        }

        const last_attendance = await CollectorAttendance.findOne({ user: user }).sort({ created_at: -1 }); 

        const newCollectorAttendanceData = {
            started_at: started_at,
            truck: truck,
            user: user,
            schedule: schedule,
            created_at: storeCurrentDate(0, "hours")
        };

        const newCollectorAttendance = new CollectorAttendance(newCollectorAttendanceData);

        if(!last_attendance) {
            await newCollectorAttendance.save();
        }

        if(last_attendance && last_attendance.flag === 0) {
            await newCollectorAttendance.save();
        } 

        if(last_attendance && last_attendance.flag === 1) {
            return res.status(400).json({ message: 'Collector attendance already time in.' });
        }

        return res.status(200).json({ data: 'New collector attendance successfully created.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to create collector attendance.' });
    }
});

export const get_all_collector_attendance_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_attendances = await CollectorAttendance.find({ user: user_id });

        if(!collector_attendances) {
            return res.status(400).json({ message: "Collector attendance not found." });
        }

        return res.status(200).json({ data: collector_attendances });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector attendance.' });
    }
});



export const get_all_collector_attendance = asyncHandler(async (req, res) => {
    try {
        const collector_attendances = await CollectorAttendance.find();

        if(!collector_attendances) {
            return res.status(400).json({ message: "Collector attendance not found." });
        }


        return res.status(200).json({ data: collector_attendances });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector attendance.' });
    }
});

export const get_specific_collector_attendance = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_attendance = await CollectorAttendance.findById(id);

        if(!collector_attendance) {
            return res.status(400).json({ message: "Collector attendance not found." });
        }

        res.status(200).json({ data: collector_attendance });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific collector attendance.' });
    }
});


export const update_collector_attendance_time_out = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters
    const { ended_at } = req.body;

    try {
        if (!ended_at) {
            return res.status(400).json({ message: "Please provide all fields (ended_at)." });
        }

        const updatedCollectorAttendance = await CollectorAttendance.findOne({ user: user_id }).sort({ created_at: -1 }); 


        if (!updatedCollectorAttendance) {
            return res.status(404).json({ message: "Collector attendance not found" });
        }

        updatedCollectorAttendance.ended_at = ended_at ? ended_at : updatedCollectorAttendance.ended_at;
        updatedCollectorAttendance.flag = 0;

        if(updatedCollectorAttendance.flag === 1) {
            await updatedCollectorAttendance.save();
        } else {
            return res.status(400).json({ message: 'Collector attendance already time out.' });
        }

        return res.status(200).json({ data: 'Collector attendance successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update collector attendance.' });
    }
});



export const update_collector_attendance = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { truck, user, schedule } = req.body;

    try {
        if (!truck || !user || !schedule) {
            return res.status(400).json({ message: "Please provide all fields (truck, user, schedule)." });
        }

        const updatedCollectorAttendance = await CollectorAttendance.findById(id);

        if (!updatedCollectorAttendance) {
            return res.status(404).json({ message: "Collector attendance not found" });
        }

        updatedCollectorAttendance.truck = truck ? truck : updatedCollectorAttendance.truck;
        updatedCollectorAttendance.user = user ? user : updatedCollectorAttendance.user;
        updatedCollectorAttendance.schedule = schedule ? schedule : updatedCollectorAttendance.schedule;


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