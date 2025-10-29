import "dotenv/config";
import mongoose from "mongoose";
import express from 'express';
import http from 'http';
// import { Server } from 'socket.io';  // import Server from socket.io
import { WebSocketServer } from 'ws';


// Export constants and instances
export const PORT = process.env.PORT || 5000;
export const app = express();
export const server = http.createServer(app);
export const io = new WebSocketServer({ server });
// export const io = new Server(server, {
//   cors: { origin: "*" }, // configure as needed
//   methods: ["GET", "POST"]
// });

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

  ws.on('message', (message) => {
    console.log(`Message received:${message}`);

    // Broadcast the message to all connected clients
    io.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
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
