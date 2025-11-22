import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { jest } from '@jest/globals';
import authRoutes from '../routes/authRoutes';
import * as authService from '../services/authService';

/**
 * Integration tests for authentication endpoints
 * Tests registration, login, and token verification
 * Following TECHNICAL_ARCHITECTURE.md - REST API testing patterns
 */

// Set required environment variables for tests
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';

// Mock the auth service
jest.mock('../services/authService');

const mockRegisterUser = authService.registerUser as jest.MockedFunction<typeof authService.registerUser>;
const mockLoginUser = authService.loginUser as jest.MockedFunction<typeof authService.loginUser>;
const mockVerifyAuthToken = authService.verifyAuthToken as jest.MockedFunction<typeof authService.verifyAuthToken>;

describe('Authentication API - /api/v1/auth', () => {
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
    app.use('/api/v1', authRoutes);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const mockAuthResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          created_at: new Date('2024-01-01T00:00:00Z'),
        },
      };

      mockRegisterUser.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(mockRegisterUser).toHaveBeenCalledWith('test@example.com', 'SecurePass123');
    });

    it('should reject registration with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'SecurePass123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should reject registration with password shorter than 8 characters', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('should return 409 when email is already in use', async () => {
      mockRegisterUser.mockRejectedValue(
        new Error('Email already in use')
      );

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'SecurePass123',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EMAIL_IN_USE');
      expect(response.body.error.message).toBe('Email already in use');
    });

    it('should return 500 on unexpected errors', async () => {
      mockRegisterUser.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123',
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockAuthResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          created_at: new Date('2024-01-01T00:00:00Z'),
        },
      };

      mockLoginUser.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'SecurePass123');
    });

    it('should reject login with invalid credentials', async () => {
      mockLoginUser.mockRejectedValue(
        new Error('Invalid credentials')
      );

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'not-an-email',
          password: 'SecurePass123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(mockLoginUser).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user data with valid token', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        created_at: new Date('2024-01-01T00:00:00Z'),
      };

      mockVerifyAuthToken.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer mock-jwt-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(mockVerifyAuthToken).toHaveBeenCalledWith('mock-jwt-token');
    });

    it('should reject request without authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(mockVerifyAuthToken).not.toHaveBeenCalled();
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'InvalidHeader')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(mockVerifyAuthToken).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      mockVerifyAuthToken.mockRejectedValue(
        new Error('Invalid or expired token')
      );

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toBe('Invalid or expired token');
    });
  });

  describe('CORS and OPTIONS', () => {
    it('should respond to OPTIONS request on /auth/register', async () => {
      const response = await request(app)
        .options('/api/v1/auth/register')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });

    it('should respond to OPTIONS request on /auth/login', async () => {
      const response = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });

    it('should respond to OPTIONS request on /auth/me', async () => {
      const response = await request(app)
        .options('/api/v1/auth/me')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-methods']).toContain('GET');
    });
  });
});
