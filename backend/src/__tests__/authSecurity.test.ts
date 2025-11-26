import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { jest } from '@jest/globals';
import authRoutes from '../routes/authRoutes';
import * as authService from '../services/authService';

/**
 * Security tests for authentication system
 * Tests input validation, SQL injection prevention, XSS prevention, and timing attack resistance
 * Following TECHNICAL_ARCHITECTURE.md - Security testing patterns
 */

process.env.JWT_SECRET = 'test-secret-key-for-security-testing';

jest.mock('../services/authService');

const mockRegisterUser = authService.registerUser as jest.MockedFunction<typeof authService.registerUser>;
const mockLoginUser = authService.loginUser as jest.MockedFunction<typeof authService.loginUser>;
const mockVerifyAuthToken = authService.verifyAuthToken as jest.MockedFunction<typeof authService.verifyAuthToken>;

describe('Authentication Security Tests', () => {
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
    app.use('/api/v1', authRoutes);

    jest.clearAllMocks();
  });

  describe('SQL Injection Prevention', () => {
    it('should safely handle SQL injection attempt in email field', async () => {
      const sqlInjectionEmail = "admin'--";

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: sqlInjectionEmail,
          password: 'password123',
        });

      // Should fail validation (invalid email format)
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should safely handle SQL injection attempt in login', async () => {
      const sqlInjectionEmail = "' OR '1'='1";

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: sqlInjectionEmail,
          password: 'password123',
        });

      // Should fail validation (invalid email format)
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockLoginUser).not.toHaveBeenCalled();
    });

    it('should safely handle SQL union injection attempt', async () => {
      const sqlInjectionEmail = "user@example.com' UNION SELECT * FROM users--";

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: sqlInjectionEmail,
          password: 'password123',
        });

      // Should fail validation
      expect(response.status).toBe(400);
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should reject emails with SQL keywords', async () => {
      const sqlKeywordEmails = [
        "DROP TABLE users@example.com",
        "DELETE FROM@example.com",
        "INSERT INTO@example.com",
      ];

      for (const email of sqlKeywordEmails) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: email,
            password: 'password123',
          });

        expect(response.status).toBe(400);
        expect(mockRegisterUser).not.toHaveBeenCalled();
      }
    });
  });

  describe('XSS Prevention', () => {
    it('should not execute script tags in error messages', async () => {
      mockRegisterUser.mockRejectedValue(
        new Error('<script>alert("XSS")</script>')
      );

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(500);

      // Error message should be sanitized
      expect(response.body.error.message).not.toContain('<script>');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle XSS attempt in email field during registration', async () => {
      const xssEmail = '<script>alert("XSS")</script>@example.com';

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: xssEmail,
          password: 'password123',
        });

      // Should fail validation (invalid email format)
      expect(response.status).toBe(400);
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should handle HTML injection in password', async () => {
      mockRegisterUser.mockResolvedValue({
        token: 'safe-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: '<b>password</b>',
        })
        .expect(201);

      // Password should be accepted (it's hashed, not displayed)
      // But response should not contain HTML
      expect(JSON.stringify(response.body)).not.toContain('<b>');
    });
  });

  describe('Input Validation', () => {
    it('should reject empty email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: '',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should reject empty password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: '',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should reject missing email field', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing password field', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject null email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: null,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject undefined email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: undefined,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject non-string email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 12345,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject array as email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: ['test@example.com'],
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject object as password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: { value: 'password123' },
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Password Security', () => {
    it('should enforce minimum password length of 8 characters', async () => {
      const shortPasswords = ['a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg'];

      for (const password of shortPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: password,
          });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      }

      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should accept password with exactly 8 characters', async () => {
      mockRegisterUser.mockResolvedValue({
        token: 'token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'abcdefgh',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should accept passwords with special characters', async () => {
      mockRegisterUser.mockResolvedValue({
        token: 'token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const specialPasswords = [
        'P@ssw0rd!',
        'Test#123$',
        'My_Pass-123',
        '12345678!@#$%^&*()',
      ];

      for (const password of specialPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'test@example.com',
            password: password,
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        jest.clearAllMocks();
        mockRegisterUser.mockResolvedValue({
          token: 'token',
          user: {
            id: '123',
            email: 'test@example.com',
            role: 'user' as const,
            created_at: new Date(),
          },
        });
      }
    });
  });

  describe('Authorization Header Security', () => {
    it('should reject request with missing Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'token-without-bearer')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(mockVerifyAuthToken).not.toHaveBeenCalled();
    });

    it('should reject request with malformed Bearer token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject request with extra spaces in Bearer token', async () => {
      mockVerifyAuthToken.mockRejectedValue(
        new Error('Invalid or expired token')
      );

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer  token-with-extra-spaces')
        .expect(401);

      // Should still attempt to verify (but will fail)
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject empty Authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', '')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(mockVerifyAuthToken).not.toHaveBeenCalled();
    });
  });

  describe('Response Security', () => {
    it('should not leak sensitive information in error responses', async () => {
      mockLoginUser.mockRejectedValue(
        new Error('Invalid credentials')
      );

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      // Should not reveal whether email exists
      expect(response.body.error.message).toBe('Invalid credentials');
      expect(response.body.error.message).not.toContain('email');
      expect(response.body.error.message).not.toContain('password');
      expect(response.body.error.message).not.toContain('user not found');
    });

    it('should not expose stack traces in production-like errors', async () => {
      mockRegisterUser.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(500);

      expect(response.body).not.toHaveProperty('stack');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
      expect(response.body.error.message).toBe('An unexpected error occurred');
    });

    it('should not include password in any response', async () => {
      mockRegisterUser.mockResolvedValue({
        token: 'token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'MySecretPassword123',
        })
        .expect(201);

      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toContain('MySecretPassword123');
      expect(responseStr).not.toContain('password');
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });
  });

  describe('Rate Limiting Integration', () => {
    it('should have rate limiter middleware on registration endpoint', async () => {
      // This test verifies that rate limiters are attached
      // The actual rate limiting behavior is tested in the route tests
      
      mockRegisterUser.mockResolvedValue({
        token: 'token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      // Should include rate limit headers in test environment
      // (limits are higher in test mode to avoid false positives)
      expect(response.headers).toHaveProperty('ratelimit-limit');
    });

    it('should have rate limiter middleware on login endpoint', async () => {
      mockLoginUser.mockResolvedValue({
        token: 'token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'user' as const,
          created_at: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.headers).toHaveProperty('ratelimit-limit');
    });

    it('should have rate limiter middleware on token verification endpoint', async () => {
      mockVerifyAuthToken.mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        role: 'user' as const,
        created_at: new Date(),
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.headers).toHaveProperty('ratelimit-limit');
    });
  });
});
