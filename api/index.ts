/**
 * Vercel Serverless API Entry Point
 * 
 * This file serves as the main handler for all API routes in Vercel's serverless environment.
 * Vercel automatically detects files in /api directory and creates serverless functions.
 */

import express from 'express';
import cors from 'cors';
import { initializeDatabase } from '../backend/src/config/database';
import playerRoutes from '../backend/src/routes/playerRoutes';
import teamRoutes from '../backend/src/routes/teamRoutes';
import matchRoutes from '../backend/src/routes/matchRoutes';
import subscribeRoutes from '../backend/src/routes/subscribeRoutes';
import inventoryRoutes from '../backend/src/routes/inventoryRoutes';
import squadRoutes from '../backend/src/routes/squadRoutes';

const app = express();

// Middleware
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['*']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Database initialization (lazy)
let dbInitialized = false;

const ensureDbInitialized = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
};

// Initialize database on first request
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Service temporarily unavailable' 
    });
  }
});

// Health check at root of API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Legends Ascend API is running' });
});

// Mount routes
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/v1', subscribeRoutes);
app.use('/api/v1/players', inventoryRoutes);
app.use('/api/v1/squads', squadRoutes);

// Export for Vercel serverless
export default app;
