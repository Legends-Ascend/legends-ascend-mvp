import request from 'supertest';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import adminRoutes from '../routes/adminRoutes';
import * as database from '../config/database';

/**
 * Tests for admin routes and middleware
 * Following TECHNICAL_ARCHITECTURE.md - REST API testing patterns
 * Implements US-051 admin account and dashboard requirements
 */

// Set required environment variables for tests
process.env.JWT_SECRET = 'test-secret-key-for-admin-testing';

// Mock the database
jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

describe('Admin Routes - /api/v1/admin', () => {
  let app: express.Application;

  beforeEach(() => {
    // Create a minimal Express app
    app = express();
    
    const corsOptions = {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/v1/admin', adminRoutes);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/v1/admin (Admin Dashboard)', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should return 403 for non-admin users', async () => {
      // Create a valid token for a regular user
      const token = jwt.sign(
        { userId: 'regular-user-id', email: 'user@example.com', role: 'user' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // Mock database to return a regular user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          role: 'user',
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
      expect(response.body.error.message).toBe('Admin access required');
    });

    it('should return 200 for authenticated admin users', async () => {
      // Create a valid token for an admin user
      const token = jwt.sign(
        { userId: 'admin-user-id', email: 'supersaiyan@admin.legendsascend.local', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // Mock database to return admin user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Admin Dashboard');
      expect(response.body.data.user.username).toBe('supersaiyan');
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should return 401 if token user does not exist in database', async () => {
      // Create a valid token for a non-existent user
      const token = jwt.sign(
        { userId: 'deleted-user-id', email: 'deleted@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // Mock database to return no user
      mockQuery.mockResolvedValueOnce({
        rows: [],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should verify role from database, not just token', async () => {
      // Create a token claiming admin role, but user is actually a regular user in DB
      const token = jwt.sign(
        { userId: 'sneaky-user-id', email: 'sneaky@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // Mock database to return user with 'user' role (not admin)
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'sneaky-user-id',
          email: 'sneaky@example.com',
          username: null,
          role: 'user', // DB says user, not admin
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('should reject malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/admin/health (Admin Health Check)', () => {
    it('should return 200 for authenticated admin users', async () => {
      const token = jwt.sign(
        { userId: 'admin-user-id', email: 'supersaiyan@admin.legendsascend.local', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin/health')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Admin API is healthy');
      expect(response.body.data.timestamp).toBeDefined();
    });
  });

  describe('CORS for Admin Routes', () => {
    it('should respond to OPTIONS request on /admin', async () => {
      const response = await request(app)
        .options('/api/v1/admin')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
  });
});
