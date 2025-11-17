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
        const last_attendance = await CollectorAttendance.findOne({ user: user_id })
        .populate('user')
        .populate('schedule')
        .populate({
            path: 'schedule',
            populate: {
              path: 'route',
              model: 'Route'
            }
        })
        .populate('truck')
        .sort({ created_at: -1 }); 

        if(!last_attendance) {
            return res.status(200).json({ data: 0, message: "Collector attendance not found." });
        }

        return res.status(200).json({ data: { flag: last_attendance.flag, attendances: last_attendance } });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to create collector attendance.' });
    }
});


export const create_collector_attendance = asyncHandler(async (req, res) => {
    const { truck, user, schedule, started_at, latitude, longitude } = req.body;

    try {
        if (!truck || !user || !started_at || !schedule || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (truck, user, schedule, started_at, latitude, longitude)." });
        }

        const last_attendance = await CollectorAttendance.findOne({ user: user }).sort({ created_at: -1 });

        const newCollectorAttendanceData = {
            position_start: {
                lat: latitude,
                lng: longitude
            },
            started_at: started_at,
            truck: truck,
            user: user,
            schedule: schedule,
            created_at: storeCurrentDate(0, "hours")
        };

        const newCollectorAttendance = new CollectorAttendance(newCollectorAttendanceData);

        if (last_attendance && last_attendance.flag === 1) {
            return res.status(400).json({ message: 'Collector attendance already time in.' });
        }

        const collector = await newCollectorAttendance.save();

        const data = await CollectorAttendance.findById(collector._id)
        .populate({
            path: 'schedule',
            populate: {
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', 
                    model: 'Barangay'
                }
            }
        })
        .populate('truck')
        .populate('user')

        
        return res.status(200).json({ data: data });
       // return res.status(200).json({ data: 'New collector attendance successfully created.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Failed to create collector attendance.' });
    }
});

export const get_all_collector_attendance_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters

    try {
        const collector_attendances = await CollectorAttendance.find({ user: user_id })
        .populate({
            path: 'schedule',
            populate: {
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', 
                    model: 'Barangay'
                }
            }
        })
        .populate({
            path: 'schedule',
            populate: {
                path: 'task.barangay_id',
                model: 'Barangay'
            }
        })
        .populate('truck')
        .populate('user')
        .sort({ created_at: -1 }); 

        return res.status(200).json({ data: collector_attendances });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all collector attendance.' });
    }
});



export const get_all_collector_attendance = asyncHandler(async (req, res) => {
    try {
        const collector_attendances = await CollectorAttendance.find()
            .populate({
                path: 'schedule',
                populate: {
                    path: 'route',
                    populate: {
                        path: 'merge_barangay.barangay_id', 
                        model: 'Barangay'
                    }
                }
            })
            .populate('truck')
            .populate('user')


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


export const update_collector_attendance_time_out = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters
    const { ended_at, latitude, longitude } = req.body;

    try {
        if (!ended_at || !latitude || !longitude) {
            return res.status(400).json({ message: "Please provide all fields (ended_at, longitude, latitude)." });
        }

        const updatedCollectorAttendance = await CollectorAttendance.findOne({ user: user_id }).sort({ created_at: -1 });


        if (!updatedCollectorAttendance) {
            return res.status(404).json({ message: "Collector attendance not found" });
        }

        if (updatedCollectorAttendance.flag === 0) {
            return res.status(400).json({ message: 'Collector attendance already time out.' });
        }

        updatedCollectorAttendance.position_end.lat = latitude ?? updatedCollectorAttendance.position_end.lat;
        updatedCollectorAttendance.position_end.lng = longitude ?? updatedCollectorAttendance.position_end.lng;
        updatedCollectorAttendance.ended_at = ended_at ? ended_at : updatedCollectorAttendance.ended_at;
        updatedCollectorAttendance.flag = 0;

        await updatedCollectorAttendance.save();

        const data = await CollectorAttendance.findById(updatedCollectorAttendance._id)
        .populate({
            path: 'schedule',
            populate: {
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', 
                    model: 'Barangay'
                }
            }
        })
        .populate('truck')
        .populate('user')

        
        return res.status(200).json({ data: data });
        // return res.status(200).json({ data: 'Collector attendance successfully updated.' });
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