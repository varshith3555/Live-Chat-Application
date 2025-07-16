import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import firebaseRoutes from './routes/firebaseRoutes.js';
import errorHandler from './middleware/error.js';
import { Server } from 'socket.io';
import http from 'http';
import User from './models/User.js';

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting (100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/firebase', firebaseRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true 
  } 
});

const onlineUsers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('setUserId', (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    io.emit('onlineUsers', Array.from(onlineUsers));
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on('joinRoom', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined room: ${chatId}`);
  });

  socket.on('sendMessage', ({ chatId, message }) => {
    socket.to(chatId).emit('receiveMessage', message);
  });

  socket.on('typing', (chatId) => {
    socket.to(chatId).emit('typing');
  });

  socket.on('stopTyping', (chatId) => {
    socket.to(chatId).emit('stopTyping');
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('onlineUsers', Array.from(onlineUsers));
      await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));