import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import playerRoutes from './routes/playerRoutes';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import subscribeRoutes from './routes/subscribeRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import squadRoutes from './routes/squadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('trust proxy', 1); // Ensure correct client IP detection behind proxies

// CORS configuration - explicit setup for development and production
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

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/v1', subscribeRoutes); // US-001: Email subscription route
app.use('/api/v1/players', inventoryRoutes); // US-044: Player inventory routes
app.use('/api/v1/squads', squadRoutes); // US-044: Squad management routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Legends Ascend API is running' });
});

// Database initialization
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

// For serverless deployment (Vercel)
if (process.env.VERCEL) {
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
  
  // Export the Express app for Vercel
  export default app;
} else {
  // Traditional server deployment
  const startServer = async () => {
    try {
      await initializeDatabase();
      console.log('Database initialized successfully');
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}
