import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import userRoutes from "./routes/user_route.js";
import otpRoutes from "./routes/otp_route.js";
import roleActionRoutes from "./routes/action_route.js";



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

app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/actions", roleActionRoutes);


// Optionally use separate DB connect file
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


