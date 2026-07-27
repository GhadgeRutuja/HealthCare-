const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || ['https://your-frontend.vercel.app']
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection (optional for now)
const connectDB = require('./config/database');
connectDB().catch(() => {
  console.log('🔧 Server running without database connection');
});

// Import models to register schemas
require('./models/User');
require('./models/Doctor');
require('./models/Service');
require('./models/Appointment');

const path = require('path');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/services', require('./routes/services'));
app.use('/api/admin', require('./routes/admin'));  // Admin routes
app.use('/api/records', require('./routes/records')); // Medical records
app.use('/api/notifications', require('./routes/notifications')); // Notifications
app.use('/api/messages', require('./routes/messages')); // Messages

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MediCare API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Socket.io setup
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

// Map of user IDs to socket IDs
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('⚡ Socket connected:', socket.id);

  socket.on('register', (userId) => {
    if (userId) {
      userSockets.set(userId.toString(), socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
    // Remove from map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

// Make io accessible to routers
app.set('io', io);
app.set('userSockets', userSockets);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 MediCare Backend Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = server;
