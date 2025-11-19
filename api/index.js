"use strict";
/**
 * Vercel Serverless API Entry Point
 *
 * This file serves as the main handler for all API routes in Vercel's serverless environment.
 * Vercel automatically detects files in /api directory and creates serverless functions.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("../backend/src/config/database");
const playerRoutes_1 = __importDefault(require("../backend/src/routes/playerRoutes"));
const teamRoutes_1 = __importDefault(require("../backend/src/routes/teamRoutes"));
const matchRoutes_1 = __importDefault(require("../backend/src/routes/matchRoutes"));
const subscribeRoutes_1 = __importDefault(require("../backend/src/routes/subscribeRoutes"));
const inventoryRoutes_1 = __importDefault(require("../backend/src/routes/inventoryRoutes"));
const squadRoutes_1 = __importDefault(require("../backend/src/routes/squadRoutes"));
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Database initialization (lazy)
let dbInitialized = false;
const ensureDbInitialized = async () => {
    if (!dbInitialized) {
        try {
            await (0, database_1.initializeDatabase)();
            dbInitialized = true;
            console.log('Database initialized successfully');
        }
        catch (error) {
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
    }
    catch (error) {
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
app.use('/api/players', playerRoutes_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/v1', subscribeRoutes_1.default);
app.use('/api/v1/players', inventoryRoutes_1.default);
app.use('/api/v1/squads', squadRoutes_1.default);
// Export for Vercel serverless
exports.default = app;
