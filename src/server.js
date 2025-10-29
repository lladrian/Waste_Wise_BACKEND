import cors from 'cors';
import express from 'express';
import { app, connectDB } from './config/connect.js';

// import residentUserRoutes from "./routes/resident_user_route.js";
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
import garbageReportRoutes from "./routes/garbage_report_route.js";
import webSocketRoutes from "./routes/web_socket_route.js";
import collectorReportRoutes from "./routes/collector_report_route.js";
import garbageSiteRoutes from "./routes/garbage_site_route.js";




// CORS middleware - allow anyone to connect
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  // origin: '*',  // for open access, but can't use credentials:true with '*'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});
connectDB();


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
app.use("/garbage_reports", garbageReportRoutes);
app.use("/collector_reports", collectorReportRoutes);
app.use("/web_sockets", webSocketRoutes);
app.use("/garbage_sites", garbageSiteRoutes);