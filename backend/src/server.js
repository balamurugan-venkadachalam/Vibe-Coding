const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/api/v1/health/liveness', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is alive' });
});

app.get('/api/v1/health/readiness', (req, res) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ok', message: 'Service is ready' });
  } else {
    res.status(503).json({ status: 'error', message: 'Service is not ready' });
  }
});

// API routes
app.use('/api/v1/tasks', require('./routes/taskRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? 'mongodb://localhost:27017/todo-app-test'
      : (process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app');

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected && process.env.NODE_ENV !== 'test') {
      throw new Error('Failed to connect to MongoDB');
    }

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, connectDB }; // Export both for testing 