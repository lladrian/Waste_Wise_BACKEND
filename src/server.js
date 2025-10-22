import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';


import connectDB from './config/db.js';


import residentUserRoutes from "./routes/resident_user_route.js";
import userRoutes from "./routes/user_route.js";
import otpRoutes from "./routes/otp_route.js";
import roleActionRoutes from "./routes/action_route.js";
import notificationRoutes from "./routes/notification_route.js";
import logRoutes from "./routes/log_route.js";
import routeRoutes from "./routes/route_route.js";
import truckActivityRoutes from "./routes/truck_activity_route.js";
import scheduleRoutes from "./routes/schedule_route.js";
import generateReportRoutes from "./routes/generate_report_route.js";
import truckRoutes from "./routes/truck_route.js";
import complainRoutes from "./routes/complain_route.js";
import collectorAttendanceRoutes from "./routes/collector_attendance_route.js";
import barangayRoutes from "./routes/barangay_route.js";
import requestRoutes from "./routes/request_route.js";







dotenv.config();

const app = express();

// CORS middleware - allow anyone to connect
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});


app.get('/current-location', async (req, res) => {
    try {
        // Get client IP address
        const clientIP = req.headers['x-forwarded-for'] || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress ||
                        (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Use IP API to get location details
        const ipApiResponse = await axios.get(`http://ip-api.com/json/${clientIP}`);
        const locationData = ipApiResponse.data;

        // if (locationData.status === 'fail') {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Unable to fetch location data'
        //     });
        // }


        res.json({
            success: true,
            message: 'Location data fetched successfully',
            data: {
                ip: clientIP,
                country: locationData.country,
                countryCode: locationData.countryCode,
                region: locationData.regionName,
                city: locationData.city,
                zipCode: locationData.zip,
                coordinates: {
                    latitude: locationData.lat,
                    longitude: locationData.lon
                },
                timezone: locationData.timezone,
                isp: locationData.isp,
                organization: locationData.org
            }
        });

    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});



//app.use("/residents", residentUserRoutes);
app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/actions", roleActionRoutes);
app.use("/notifications", notificationRoutes);
app.use("/logs", logRoutes);
app.use("/routes", routeRoutes);
app.use("/barangays", barangayRoutes);
app.use("/truck_activities", truckActivityRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/generate_reports", generateReportRoutes);
app.use("/trucks", truckRoutes);
app.use("/complains", complainRoutes);
app.use("/collector_attendances", collectorAttendanceRoutes);
app.use("/requests", requestRoutes);



// Optionally use separate DB connect file
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


