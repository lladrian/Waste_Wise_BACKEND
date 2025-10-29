import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Truck from '../models/truck.js';
import Schedule from '../models/schedule.js';
import { io } from '../config/connect.js';



async function broadcastList(name, data) {
    const message = JSON.stringify({ name, data });

    io.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}


export const get_web_socket_schedule = asyncHandler(async (req, res) => {
    const { schedules } = req.body;

    try {
        if (!schedules) {
            return res.status(400).json({ message: "Please provide all fields (schedules)." });
        }

        await broadcastList('trucks', schedules);

        return res.status(200).json({ data: 'Web socket schedules successfully updated.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to update web socket schedules.' });
    }
});
