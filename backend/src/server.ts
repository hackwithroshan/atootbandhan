import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import initializeSocket from './socket.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Pass the io instance to the app so controllers can access it
app.set('io', io);

// Initialize all socket event handlers
initializeSocket(io);

// Connect to Database first, then start the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Backend server with sockets running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database. Server did not start.', err);
    // @ts-ignore
    process.exit(1);
});