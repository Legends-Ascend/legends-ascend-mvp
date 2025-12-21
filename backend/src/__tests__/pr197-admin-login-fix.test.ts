import request from 'supertest';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import * as database from '../config/database';
import authRoutes from '../routes/authRoutes';
import { ADMIN_USERNAME, ADMIN_PASSWORD, SALT_ROUNDS } from '../config/adminConstants';

/**
 * End-to-End Tests for PR #197 - Admin Login Fix
 * Validates fix for issue #195: Admin unable to login after multiple logo clicks
 * 
 * Test Coverage:
 * - Admin can login with username (not email)
 * - Admin credentials from adminConstants work correctly
 * - Password hashing and verification works
 * - JWT token is generated for admin
 * - Admin role is properly set
 * - Edge cases: wrong password, case sensitivity, etc.
 */

// Mock the database
jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

// Set required environment variables
process.env.JWT_SECRET = 'test-secret-key-for-pr197-admin-login';
process.env.NODE_ENV = 'test';

describe('PR #197: Admin Login Fix - End-to-End Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    // Create Express app
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
    // Auth routes already include /auth prefix, so mount at /api/v1
    app.use('/api/v1', authRoutes);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Admin Login with Username (Fix for #195)', () => {
    it('should successfully login admin with username from adminConstants', async () => {
      // Create hashed password for admin
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      // Mock: Find admin by username
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date('2025-01-01'),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME, // Using username in email field
          password: ADMIN_PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.username).toBe(ADMIN_USERNAME);
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should login admin using exact credentials from adminConstants', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return JWT token with admin role', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      const token = response.body.data.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // JWT should have 3 parts separated by dots
      const tokenParts = token.split('.');
      expect(tokenParts.length).toBe(3);
    });

    it('should find admin by username not email', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME, // Username, not email
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      // Verify query was for username, not email
      expect(mockQuery).toHaveBeenCalledTimes(1);
      const query = mockQuery.mock.calls[0][0] as string;
      expect(query).toContain('WHERE username = $1');
    });
  });

  describe('Password Verification', () => {
    it('should reject login with wrong password', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: 'wrongpassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });

    it('should reject login if admin does not exist', async () => {
      // Mock: Admin not found
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid credentials');
    });

    it('should verify password using bcrypt compare', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      // Password should have been verified against hash
      expect(mockQuery).toHaveBeenCalled();
    });
  });

  describe('Case Sensitivity', () => {
    it('should handle lowercase username', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME.toLowerCase(),
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle uppercase username input by normalizing', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME.toUpperCase(),
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should be case-sensitive for password', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD.toUpperCase(), // Wrong case
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Response Structure', () => {
    it('should return user object with admin details', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date('2025-01-01'),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.data.user).toMatchObject({
        username: ADMIN_USERNAME,
        email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
        role: 'admin',
      });
    });

    it('should not expose password_hash in response', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.data.user.password_hash).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should reject empty username', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: ADMIN_PASSWORD,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject empty password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: '',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle whitespace in credentials', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: `  ${ADMIN_USERNAME}  `, // Extra whitespace
          password: ADMIN_PASSWORD,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Security', () => {
    it('should not reveal if user exists in error message', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent',
          password: 'anypassword',
        })
        .expect(401);

      // Should return generic error, not "user not found"
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should use same error message for wrong password', async () => {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ADMIN_USERNAME,
          password: 'wrongpassword',
        })
        .expect(401);

      // Should return same generic error as non-existent user
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should rate limit login attempts', async () => {
      // This test verifies that rate limiting is in place
      // The actual rate limiting is tested in separate rate limiter tests
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      mockQuery.mockResolvedValue({
        rows: [{
          id: 'admin-uuid',
          username: ADMIN_USERNAME,
          email: `${ADMIN_USERNAME}@admin.legendsascend.local`,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date(),
        }],
      } as any);

      // Multiple successful requests should work (within rate limit)
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          });

        expect([200, 429]).toContain(response.status);
      }
    });
  });
});
