import "dotenv/config";
import mongoose from "mongoose";
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket  } from 'ws';
import Schedule from '../models/schedule.js';
import Truck from '../models/truck.js';

// Export constants and instances
export const PORT = process.env.PORT || 5000;
export const app = express();
export const server = http.createServer(app);
export const io = new WebSocketServer({ server });


const getPhilippineDate = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' });
  return formatter.format(now); // YYYY-MM-DD in PH timezone
};

function broadcastList(name, data) {
    const message = JSON.stringify({ name, data });

    io.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

async function handleTruckPositionUpdate(ws, data) {
  const { truck_id, latitude, longitude } = data;

  try {
    if (latitude == null || longitude == null) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: "Please provide both latitude and longitude." 
      }));
      return;
    }

    const truck = await Truck.findById(truck_id);

    if (!truck) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: "Truck not found." 
      }));
      return;
    }

    // Update the truck's position
    truck.position.lat = latitude;
    truck.position.lng = longitude;

    if (await truck.save()) {
      // Get updated schedules
      const schedules = await Schedule.find({ scheduled_collection: getPhilippineDate() })
        .populate('route')
        .populate({
          path: 'truck',
          populate: {
            path: 'user',
            model: 'User'
          }
        });

      // Broadcast updated truck positions to all clients
      broadcastList('trucks', schedules);
      
      // Send success response to the requesting client
      ws.send(JSON.stringify({
        type: 'success',
        message: "Truck position successfully updated.",
        name: "schedules",
        data: schedules
      }));
    }
  } catch (error) {
    console.error('Failed to update position:', error);
    ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Failed to update position.',
      error: error.message 
    }));
  }
}

// Export the connectDB function
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

io.on('connection', (ws) => {
  console.log('🔌 User connected');

  ws.on('message', async (message) => {
    console.log(`Message received:${message}`);

    const data = JSON.parse(message);

    // Handle truck position updates via WebSocket
    if (data.type === 'update_truck_position') {
      await handleTruckPositionUpdate(ws, data);
    }
  });

  ws.on('close', () => {
    console.log('❌ User disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
