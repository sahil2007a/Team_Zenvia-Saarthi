const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Welcome / Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SAARTHI Backend API',
    status: 'Running',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Bearer Token required)',
        profile: 'PUT /api/auth/profile (Bearer Token required)',
      },
    },
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Unhandled Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server with fallback port capability
let currentPort = parseInt(process.env.PORT || '5001', 10);

const startServer = (port) => {
  const srv = app
    .listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`  🚀 SAARTHI Backend Server is LIVE on port ${port}`);
      console.log(`  📡 Health Check: http://localhost:${port}/api/health`);
      console.log(`  🔐 Auth Endpoint: http://localhost:${port}/api/auth`);
      console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`======================================================\n`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Port Busy] Port ${port} is in use. Attempting port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('[Server Error]:', err);
      }
    });

  return srv;
};

const server = startServer(currentPort);

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = { app, server };
