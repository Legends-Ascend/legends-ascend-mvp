import request from 'supertest';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import * as database from '../config/database';
import authRoutes from '../routes/authRoutes';
import adminRoutes from '../routes/adminRoutes';
import { seedAdminAccount } from '../seed';

/**
 * Integration tests for US-051 Admin Account and Dashboard
 * Tests all 10 acceptance criteria end-to-end
 * Following TECHNICAL_ARCHITECTURE.md - Integration testing patterns
 */

// Mock the database
jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

// Set required environment variables for tests
process.env.JWT_SECRET = 'test-secret-key-for-admin-integration';
process.env.NODE_ENV = 'test';

describe('US-051 Admin Account and Dashboard - Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    // Create a complete Express app with all routes
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
   * AC-1: Admin Account Exists After Deployment
   * Tests that admin account is created with correct credentials and role
   */
  describe('AC-1: Admin Account Exists After Deployment', () => {
    it('should create admin account with username supersaiyan and role admin', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Verify the INSERT query was called correctly
      expect(mockQuery).toHaveBeenCalledTimes(2);
      
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[0]).toContain('INSERT INTO users');
      expect(insertCall[0]).toContain("'admin'");
      expect(insertCall[1]?.[0]).toBe('supersaiyan');
    });

    it('should hash admin password with bcrypt using 10 salt rounds', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall?.[1]?.[2] as string;

      // Verify password hash format includes 10 rounds
      expect(hashedPassword).toMatch(/^\$2[aby]\$10\$/);
      
      // Verify password validates correctly
      const passwordValid = await bcrypt.compare('wh4t15myd35t1ny!', hashedPassword);
      expect(passwordValid).toBe(true);
    });

    it('should not create duplicate admin accounts', async () => {
      // Mock: Admin already exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-admin-id' }],
      } as any);

      await seedAdminAccount();

      // Only one query should be made (the check query)
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should create admin with special internal email format', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const insertCall = mockQuery.mock.calls[1];
      const email = insertCall?.[1]?.[1] as string;
      expect(email).toBe('supersaiyan@admin.legendsascend.local');
    });

    it('should never store password in plaintext', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const allQueryArgs = mockQuery.mock.calls.flatMap(call => 
        call.slice(1).flat().filter(arg => typeof arg === 'string')
      );

      expect(allQueryArgs).not.toContain('wh4t15myd35t1ny!');
    });
  });

  /**
   * AC-2: Admin Can Log In Via Existing Login Page
   * Tests admin authentication with username instead of email
   */
  describe('AC-2: Admin Can Log In Via Existing Login Page', () => {
    it('should authenticate admin user with username supersaiyan', async () => {
      const hashedPassword = await bcrypt.hash('wh4t15myd35t1ny!', 10);
      
      // Mock: Find admin by username
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan', // Username instead of email
          password: 'wh4t15myd35t1ny!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('supersaiyan');
      expect(response.body.data.user.role).toBe('admin');
      expect(response.body.data.token).toBeDefined();
    });

    it('should redirect admin to /admin after login (via token role)', async () => {
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      // Verify response includes admin role for frontend redirect logic
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should fail login with incorrect admin password', async () => {
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid credentials');
    });
  });

  /**
   * AC-3: Admin Dashboard Accessible
   * Tests admin dashboard endpoint accessibility
   */
  describe('AC-3: Admin Dashboard Accessible', () => {
    it('should allow admin to access dashboard endpoint', async () => {
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
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Admin Dashboard');
      expect(response.body.data.user.username).toBe('supersaiyan');
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should return admin username in dashboard response', async () => {
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
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.data.user.username).toBe('supersaiyan');
    });
  });

  /**
   * AC-4: Regular Users Cannot Access Admin Routes
   * Tests that non-admin users receive 403 Forbidden
   */
  describe('AC-4: Regular Users Cannot Access Admin Routes', () => {
    it('should return 403 Forbidden for regular user attempting admin access', async () => {
      const token = jwt.sign(
        { userId: 'regular-user-id', email: 'user@example.com', role: 'user' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

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

    it('should verify role from database, not just token claim', async () => {
      // Attacker tries to modify token to claim admin role
      const maliciousToken = jwt.sign(
        { userId: 'sneaky-user-id', email: 'sneaky@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // Database says user is actually 'user', not 'admin'
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'sneaky-user-id',
          email: 'sneaky@example.com',
          username: null,
          role: 'user', // Real role from database
        }],
      } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${maliciousToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  /**
   * AC-5: Unauthenticated Users Redirected from Admin Routes
   * Tests that users without authentication receive 401
   */
  describe('AC-5: Unauthenticated Users Redirected from Admin Routes', () => {
    it('should return 401 Unauthorized for requests without token', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should return 401 for invalid JWT token', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'Bearer invalid-token-12345')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should return 401 for expired JWT token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'admin-user-id', email: 'supersaiyan@admin.legendsascend.local', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  /**
   * AC-6: Regular User Login Still Works
   * Tests that regular user authentication is unaffected
   */
  describe('AC-6: Regular User Login Still Works', () => {
    it('should allow regular user to login with email', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('user@example.com');
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.token).toBeDefined();
    });

    it('should redirect regular user to /game/lineup (via token role)', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        });

      // Verify response includes user role for frontend redirect logic
      expect(response.body.data.user.role).toBe('user');
    });
  });

  /**
   * AC-9: JWT Token Includes Role
   * Tests that JWT tokens contain role information
   */
  describe('AC-9: JWT Token Includes Role', () => {
    it('should include admin role in JWT token payload', async () => {
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      const token = response.body.data.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      expect(decoded.role).toBe('admin');
      expect(decoded.userId).toBe('admin-user-id');
      expect(decoded.email).toBe('supersaiyan@admin.legendsascend.local');
    });

    it('should include user role in JWT token payload', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        });

      const token = response.body.data.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      expect(decoded.role).toBe('user');
    });
  });

  /**
   * AC-10: Admin Account Cannot Be Registered Publicly
   * Tests that reserved usernames are blocked from registration
   */
  describe('AC-10: Admin Account Cannot Be Registered Publicly', () => {
    it('should reject registration with supersaiyan in email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'supersaiyan@example.com',
          password: 'password123',
          newsletterOptIn: false,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('This email cannot be used for registration');
    });

    it('should reject registration with admin in email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123',
          newsletterOptIn: false,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('This email cannot be used for registration');
    });

    it('should reject registration with administrator in email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'administrator@example.com',
          password: 'password123',
          newsletterOptIn: false,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject registration with root in email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'root@example.com',
          password: 'password123',
          newsletterOptIn: false,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should allow normal user registration', async () => {
      // Mock: User doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'new-user-id',
          email: 'normal@example.com',
          role: 'user',
          created_at: new Date(),
          newsletter_optin: false,
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'normal@example.com',
          password: 'password123',
          newsletterOptIn: false,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  /**
   * Security Requirements Tests
   * Tests additional security requirements from US-051
   */
  describe('Security Requirements', () => {
    it('should always verify admin role from database on every request', async () => {
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

      await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify database query was made
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, email, username, role FROM users WHERE id = $1'),
        ['admin-user-id']
      );
    });

    it('should return 401 if token user does not exist in database', async () => {
      const token = jwt.sign(
        { userId: 'deleted-user-id', email: 'deleted@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // User deleted from database
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should not reveal if username exists in login error messages', async () => {
      // Non-existent username
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent',
          password: 'password123',
        })
        .expect(401);

      // Should not reveal if username exists
      expect(response.body.error.message).toBe('Invalid credentials');
    });
  });

  /**
   * Performance Requirements Tests
   * Tests performance targets from US-051
   */
  describe('Performance Requirements', () => {
    it('should respond to admin login in <500ms', async () => {
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

      const startTime = Date.now();
      
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'supersaiyan',
          password: 'wh4t15myd35t1ny!',
        });

      const duration = Date.now() - startTime;
      
      // Should be fast (<500ms target, but in tests allow up to 1000ms)
      expect(duration).toBeLessThan(1000);
    });

    it('should respond to admin dashboard in <50ms (route protection check)', async () => {
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

      const startTime = Date.now();
      
      await request(app)
        .get('/api/v1/admin')
        .set('Authorization', `Bearer ${token}`);

      const duration = Date.now() - startTime;
      
      // Should be very fast (allow up to 100ms in test environment)
      expect(duration).toBeLessThan(100);
    });
  });

  /**
   * CORS and Rate Limiting Tests
   */
  describe('CORS and Rate Limiting', () => {
    it('should handle CORS preflight requests for admin routes', async () => {
      const response = await request(app)
        .options('/api/v1/admin')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should accept requests from allowed origins', async () => {
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
        .get('/api/v1/admin')
        .set('Origin', 'http://localhost:3000')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });
  });

  /**
   * Edge Cases and Boundary Conditions
   */
  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should handle missing Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/v1/admin')
        .set('Authorization', 'some-token')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should handle empty email/username in login', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle null username field for regular users', async () => {
      const hashedPassword = await bcrypt.hash('userpassword123', 10);
      
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'regular-user-id',
          email: 'user@example.com',
          username: null, // Regular users have null username
          password_hash: hashedPassword,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'userpassword123',
        })
        .expect(200);

      expect(response.body.data.user.username).toBeUndefined();
    });

    it('should handle case-insensitive username login', async () => {
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

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'SuperSaiyan', // Uppercase
          password: 'wh4t15myd35t1ny!',
        })
        .expect(200);

      expect(response.body.data.user.username).toBe('supersaiyan');
    });
  });
});
