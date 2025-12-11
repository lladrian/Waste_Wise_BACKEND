import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Truck from '../models/truck.js';
import Schedule from '../models/schedule.js';
import CollectorAttendance from '../models/collector_attendance.js';

import { io } from '../config/connect.js';



async function broadcastList(name, data) {
    const message = JSON.stringify({ name, data });

    io.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export const get_web_socket_attendance = asyncHandler(async (req, res) => {
    const { user, flag } = req.body;

    try {
        if (!user || !flag) {
            return res.status(400).json({ message: "Please provide all fields (user, flag)." });
        }


        const collector_attendances = await CollectorAttendance.findOne({ user: user, flag: flag })
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


        await broadcastList('attendance', collector_attendances);

        return res.status(200).json({ data: 'Web socket attendance successfully updated.', collector_attendances: collector_attendances.length });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to update web socket attendance.' });
    }
});


export const get_web_socket_schedule = asyncHandler(async (req, res) => {
    const { recurring_day } = req.body;

    try {
        if (!recurring_day) {
            return res.status(400).json({ message: "Please provide all fields (recurring_day)." });
        }


        const schedules = await Schedule.find({ recurring_day: recurring_day })
            .populate({
                path: 'route',
                populate: {
                    path: 'merge_barangay.barangay_id', // populate each barangay inside route
                    model: 'Barangay'
                }
            })
            .populate({
                path: 'task.barangay_id', // ✅ populate barangay_id inside each task
                model: 'Barangay'
            })
            .populate({
                path: 'truck',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .populate('garbage_sites');


        await broadcastList('trucks', schedules);

        return res.status(200).json({ data: 'Web socket schedules successfully updated.', schedules: schedules.length });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to update web socket schedules.' });
    }
});
