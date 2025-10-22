import "dotenv/config";
import mongoose from "mongoose";

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

// Export constants and instances
export const PORT = process.env.PORT || 5000;
export const app = express();
export const server = http.createServer(app);
export const wss = new WebSocketServer({ server });
export const corsMiddleware = cors; 
export const expressMiddleware = express; 



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
