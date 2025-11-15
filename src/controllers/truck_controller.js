import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import Truck from '../models/truck.js';
import Schedule from '../models/schedule.js';
import { io } from '../config/connect.js';

import axios from "axios";

function base_url(req) {
    const protocol = req.protocol; // "http" or "https"
    const host = req.get("host");  // e.g., "waste-wise-backend-uzub.onrender.com"
    const baseUrl = `${protocol}://${host}`;
    return baseUrl;
}


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


async function broadcastList(name, data) {
    const message = JSON.stringify({ name, data });

    io.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const getPhilippineDate = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' });
  return formatter.format(now); // YYYY-MM-DD in PH timezone
};


export const create_truck = asyncHandler(async (req, res) => {
    const { user, truck_id, status } = req.body;

    try {
        if (!user || !truck_id || !status) {
            return res.status(400).json({ message: "Please provide all fields (user, truck_id, status)." });
        }

        const existingTruck = await Truck.findOne({ user: user });

        if (existingTruck) {
            return res.status(400).json({ message: "This user is already assigned to a truck." });
        }


        const newTruckData = {
            user: user,
            truck_id: truck_id,
            status: status,
            created_at: storeCurrentDate(0, "hours")
        };

        const newTruck = new Truck(newTruckData);
        await newTruck.save();

        return res.status(200).json({ data: 'New truck successfully created.' });
    } catch (error) {
        console.error('Error creating role action:', error);
        return res.status(500).json({ error: 'Failed to create truck.' });
    }
});

export const get_all_truck = asyncHandler(async (req, res) => {
    try {
        const trucks = await Truck.find().populate('user');

        return res.status(200).json({ data: trucks });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all truck.' });
    }
});

export const get_specific_truck = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const truck = await Truck.findById(id);

        res.status(200).json({ data: truck });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific truck.' });
    }
});

export const update_truck_status = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { status } = req.body;

    try {
        if (!status) {
            return res.status(400).json({ message: "Please provide all fields (status)." });
        }

        const updatedTruck = await Truck.findById(id);

        if (!updatedTruck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        updatedTruck.status = status ? status : updatedTruck.status;

        await updatedTruck.save();

        return res.status(200).json({ data: 'Truck successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update truck.' });
    }
});

export const update_truck_position = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters
    const { latitude, longitude } = req.body;

    try {
        if (latitude == null || longitude == null) {
            return res.status(400).json({ message: "Please provide both latitude and longitude." });
        }

        const truck = await Truck.findById(id);
        const url = base_url(req); // pass req to the function

        if (!truck) {
            return res.status(404).json({ message: "Truck not found." });
        }

        // Update the truck's position
        truck.position.lat = latitude;
        truck.position.lng = longitude;

        if (await truck.save()) {
            const schedules = await Schedule.find({ scheduled_collection: getPhilippineDate() })
                .populate('route')
                // .populate('user')
                .populate({
                    path: 'truck',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                });

            if (url.includes('localhost') || url.includes('waste-wise-backend-chi.vercel.app')) {
                const response = await axios.post(`http://waste-wise-backend-uzub.onrender.com/web_sockets/get_web_socket_schedule`, { scheduled_collection: getPhilippineDate() });
                // console.log(response.data)
            } else if (url.includes('waste-wise-backend-uzub.onrender.com')) {
                await broadcastList('trucks', schedules);
            }
        }

        return res.status(200).json({ data: "Truck position successfully updated." });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update position.', error2: error });
    }
});


export const update_truck = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters
    const { user, truck_id, status } = req.body;

    try {
        if (!user || !truck_id || !status) {
            return res.status(400).json({ message: "Please provide all fields (user, truck_id, status)." });
        }

        const updatedTruck = await Truck.findById(id);

        if (!updatedTruck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        updatedTruck.user = user ? user : updatedTruck.user;
        updatedTruck.truck_id = truck_id ? truck_id : updatedTruck.truck_id;
        updatedTruck.status = status ? status : updatedTruck.status;


        await updatedTruck.save();

        return res.status(200).json({ data: 'Truck successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update truck.' });
    }
});


// export const update_truck_hidden = asyncHandler(async (req, res) => {
//     const { id } = req.params; // Get the meal ID from the request parameters

//     try {
//         const updatedTruck = await Truck.findById(id);

//         if (!updatedTruck) {
//             return res.status(404).json({ message: "Truck action not found" });
//         }

//         updatedTruck.is_hidden = true;

//         await updatedTruck.save();

//         return res.status(200).json({ data: 'Truck successfully updated.' });
//     } catch (error) {
//         return res.status(500).json({ error: 'Failed to update truck.' });
//     }
// });


export const delete_truck = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedTruck = await Truck.findByIdAndDelete(id);

        if (!deletedTruck) return res.status(404).json({ message: 'Truck not found' });

        return res.status(200).json({ data: 'Truck successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete truck.' });
    }
});