import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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


//app.use("/residents", residentUserRoutes);
app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/actions", roleActionRoutes);
app.use("/notifications", notificationRoutes);
app.use("/logs", logRoutes);
app.use("/routes", routeRoutes);
app.use("/truck_activities", truckActivityRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/generate_reports", generateReportRoutes);
app.use("/trucks", truckRoutes);
app.use("/complains", complainRoutes);



// Optionally use separate DB connect file
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


