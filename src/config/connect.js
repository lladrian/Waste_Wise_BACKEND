import "dotenv/config";
import mongoose from "mongoose";
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Schedule from '../models/schedule.js';
import Truck from '../models/truck.js';
import CollectorAttendance from '../models/collector_attendance.js';
import moment from 'moment-timezone';



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

function broadcastList(name, data) {
  const message = JSON.stringify({ name, data });

  io.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function getTodayDayName() {
  const now = new Date();
  // Convert to Philippines time (UTC+8)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const philippinesTime = new Date(utc + 8 * 3600000);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[philippinesTime.getDay()];

  return dayName.toLowerCase();
}

function calculateBearingForGoogleMapsWebOrig(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDeg(Math.atan2(y, x));

  // Normalize to 0–360
  bearing = (bearing + 360) % 360;

  // 🔧 FIX: Icon faces RIGHT (East), so rotate -90°
  const adjustedBearing = (bearing - 90 + 360) % 360;

  return adjustedBearing;
}


function calculateBearingForGoogleMapsWeb(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  // Initial bearing (0–360, where 0 = North)
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Icon faces RIGHT (East) → -90°
  // Add one more 90° → total -180°
  const adjustedBearing = (bearing - 0 + 360) % 360;

  return adjustedBearing;
}




function calculateBearingForReactNativeMaps(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  const iconBearing = (bearing - 90 + 360) % 360;
  
  return Math.round(iconBearing);
}

async function handleTruckPositionUpdate(ws, data) {
  const { truck_id, latitude, longitude } = data;

  try {
    // Validate ObjectId (ONLY if using MongoDB _id)
    if (!mongoose.Types.ObjectId.isValid(truck_id)) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid truck_id format.'
      }));
      return;
    }

    if (latitude == null || longitude == null) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Please provide both latitude and longitude.'
      }));
      return;
    }

    const truck = await Truck.findById(truck_id);

    if (!truck) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Truck not found.'
      }));
      return;
    }

    let heading = 0;
    let heading_web = 0;

   
    heading = calculateBearingForReactNativeMaps(
      truck.position.lat,
      truck.position.lng,
      latitude,
      longitude
    );
    
    heading_web = calculateBearingForGoogleMapsWeb(
      truck.position.lat,
      truck.position.lng,
      latitude,
      longitude
    );
    
    

    const attendance = await CollectorAttendance.findOne({
      user: truck.user,
      flag: 1
    });

    if (!attendance) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Collector is not currently on duty.'
      }));
      return;
    }

    // Update position
    truck.position.lat = latitude;
    truck.position.lng = longitude;
    truck.heading = heading;
    truck.heading_web = heading_web;

  
    await truck.save();

    // Get updated schedules
    const schedules = await Schedule.find({
      recurring_day: getTodayDayName()
    })
      .populate({
        path: 'task',
        populate: {
          path: 'merge_barangay.barangay_id',
          model: 'Barangay'
        }
      })
      .populate({
        path: 'route',
        populate: {
          path: 'merge_barangay.barangay_id',
          model: 'Barangay'
        }
      })
      .populate({
        path: 'task.barangay_id',
        model: 'Barangay'
      })
      .populate({
        path: 'truck',
        populate: {
          path: 'user',
          model: 'User'
        }
      })
      .populate('garbage_sites')
      .populate('user')
      .populate('approved_by')
      .populate('cancelled_by');

    // Broadcast update
    broadcastList('trucks', schedules);

    ws.send(JSON.stringify({
      type: 'success',
      message: 'Truck position successfully updated.',
      name: 'schedules',
      data: schedules
    }));

  } catch (error) {
    console.error('Failed to update position:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to update position.',
      error: error.message
    }));
  }
}




async function handleAttendanceTruckPositionUpdate(ws, data) {
  const { user_id, latitude, longitude, route_status } = data;

  try {
    if (latitude == null || longitude == null || user_id == null || route_status == null) {
      ws.send(JSON.stringify({
        type: 'error',
        message: "Please provide all fields (latitude, longitude, user_id, route_status)."
      }));
      return;
    }

    const attendance = await CollectorAttendance.findOne({ user: user_id, flag: 1 });


    if (!attendance) {
      ws.send(JSON.stringify({
        type: 'error',
        message: "Collector attendance not found."
      }));
      return;
    }

    const newRoutePoint = {
      position: {
        lat: latitude,
        lng: longitude
      },
      route_status: route_status,
      created_at: storeCurrentDate(0, "hours")
    };

    if (attendance.flag && attendance.flag === 1) {

      if (!Array.isArray(attendance.route_history)) {
        attendance.route_history = [];
      }

      attendance.route_history.push(newRoutePoint);
      await attendance.save();
    }


    // Send success response to the requesting client
    ws.send(JSON.stringify({
      type: 'success',
      message: "Collector attendance position successfully updated.",
      name: "attendances",
    }));
  } catch (error) {
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

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format.'
      }));
      return;
    }

    // Handle truck position updates via WebSocket
    if (data.type === 'update_truck_position') {
      await handleTruckPositionUpdate(ws, data);
    }

    if (data.type === 'update_collector_attendance_truck_position') {
      await handleAttendanceTruckPositionUpdate(ws, data);
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
