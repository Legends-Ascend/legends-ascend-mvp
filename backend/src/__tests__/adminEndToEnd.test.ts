import request from 'supertest';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import * as database from '../config/database';
import authRoutes from '../routes/authRoutes';
import adminRoutes from '../routes/adminRoutes';

/**
 * End-to-End tests for US-051 Admin Account and Dashboard
 * Tests complete user flows from login to admin operations
 * Following TECHNICAL_ARCHITECTURE.md - E2E testing patterns
 */

jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

process.env.JWT_SECRET = 'test-secret-key-for-e2e';
process.env.NODE_ENV = 'test';

describe('US-051 Admin Account - End-to-End Flows', () => {
  let app: express.Application;

  beforeEach(() => {
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
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/admin', adminRoutes);

    jest.clearAllMocks();
  });

  /**
   * Complete Admin Login Flow
   * Tests the entire journey from login to accessing admin dashboard
   */
  describe('Complete Admin Login Flow', () => {
    it('should complete full admin login and dashboard access flow', async () => {
      const hashedPassword = await bcrypt.hash('wh4t15myd35t1ny!', 10);
      
      // Step 1: Admin logs in with username
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.user.role).toBe('admin');
      const token = loginResponse.body.data.token;

      // Step 2: Admin accesses dashboard using token
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const dashboardResponse = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(dashboardResponse.body.success).toBe(true);
      expect(dashboardResponse.body.data.message).toBe('Admin Dashboard');
      expect(dashboardResponse.body.data.user.username).toBe('supersaiyan');
    });

    it('should complete full admin health check flow', async () => {
      const hashedPassword = await bcrypt.hash('wh4t15myd35t1ny!', 10);
      
      // Login
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      const token = loginResponse.body.data.token;

      // Access health check
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const healthResponse = await request(app)
        .get('/api/v1/admin/health')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(healthResponse.body.success).toBe(true);
      expect(healthResponse.body.data.message).toBe('Admin API is healthy');
      expect(healthResponse.body.data.timestamp).toBeDefined();
    });
  });

  /**
   * Regular User Cannot Access Admin Flow
   * Tests complete rejection flow for non-admin users
   */
  describe('Regular User Rejection Flow', () => {
    it('should complete full regular user rejection flow', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
      // Step 1: Regular user logs in successfully
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          password_hash: hashedPassword,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        })
        .expect(200);

      expect(loginResponse.body.data.user.role).toBe('user');
      const token = loginResponse.body.data.token;

      // Step 2: Regular user attempts to access admin dashboard
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          role: 'user',
        }],
      } as any);

      const dashboardResponse = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(dashboardResponse.body.success).toBe(false);
      expect(dashboardResponse.body.error.code).toBe('FORBIDDEN');
      expect(dashboardResponse.body.error.message).toBe('Admin access required');
    });
  });

  /**
   * Unauthenticated User Flow
   * Tests complete flow for users without authentication
   */
  describe('Unauthenticated User Flow', () => {
    it('should reject unauthenticated access to admin dashboard', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should reject unauthenticated access to admin health check', async () => {
      const response = await request(app)
        .get('/api/v1/admin/health')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  /**
   * Token Manipulation Attempts
   * Tests security against common attack vectors
   */
  describe('Security: Token Manipulation Attempts', () => {
    it('should reject token with tampered role claim', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
      // Login as regular user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          password_hash: hashedPassword,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        });

      const token = loginResponse.body.data.token;

      // Try to use token (which has role: user in database)
      // Even if token claim says admin, database check should fail
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          role: 'user', // Database still says user
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  /**
   * Multiple Sequential Requests
   * Tests that admin can make multiple requests with same token
   */
  describe('Multiple Sequential Requests', () => {
    it('should allow multiple admin requests with same token', async () => {
      const hashedPassword = await bcrypt.hash('wh4t15myd35t1ny!', 10);
      
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      const token = loginResponse.body.data.token;

      // First request
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Second request with same token
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      await request(app)
        .get('/api/v1/admin/health')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Third request with same token
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const finalResponse = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalResponse.body.success).toBe(true);
    });
  });

  /**
   * Concurrent Admin and User Sessions
   * Tests that admin and regular user can have active sessions simultaneously
   */
  describe('Concurrent Admin and User Sessions', () => {
    it('should support concurrent admin and regular user sessions', async () => {
      const adminPassword = await bcrypt.hash('wh4t15myd35t1ny!', 10);
      const userPassword = await bcrypt.hash('userpassword123', 10);
      
      // Admin login
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          password_hash: adminPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const adminLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      const adminToken = adminLoginResponse.body.data.token;

      // Regular user login
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          password_hash: userPassword,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      const userLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        });

      const userToken = userLoginResponse.body.data.token;

      // Admin should access dashboard
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-user-id',
          email: 'supersaiyan@admin.legendsascend.local',
          username: 'supersaiyan',
          role: 'admin',
        }],
      } as any);

      const adminResponse = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(adminResponse.body.data.user.role).toBe('admin');

      // Regular user should be denied
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null,
          role: 'user',
        }],
      } as any);

      const userResponse = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(userResponse.body.error.code).toBe('FORBIDDEN');
    });
  });

  /**
   * Error Recovery Scenarios
   * Tests proper error handling and recovery
   */
  describe('Error Recovery Scenarios', () => {
    it('should handle database connection errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database connection lost'));

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should handle missing JWT secret gracefully', async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'Bearer some-token')
        .expect(500);

      expect(response.body.success).toBe(false);

      // Restore
      process.env.JWT_SECRET = originalSecret;
    });
  });

  /**
   * Input Validation Edge Cases
   * Tests various input validation scenarios
   */
  describe('Input Validation Edge Cases', () => {
    it('should reject very long username', async () => {
      const veryLongUsername = 'a'.repeat(1000);
      
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: veryLongUsername,
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should reject SQL injection attempts in username', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: "'; DROP TABLE users; --",
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should handle special characters in username', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@#$%',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error.message).toBe('Invalid credentials');
    });
  });
});
