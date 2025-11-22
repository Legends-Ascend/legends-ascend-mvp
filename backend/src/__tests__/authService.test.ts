import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import { registerUser, loginUser, verifyAuthToken, AuthResponse } from '../services/authService';
import * as database from '../config/database';

/**
 * Unit tests for authentication service
 * Tests password hashing, JWT generation, and token verification
 * Following TECHNICAL_ARCHITECTURE.md - Service layer testing
 */

// Set required environment variable
process.env.JWT_SECRET = 'test-secret-key-for-auth-service-testing';

// Mock database queries
jest.mock('../config/database');

const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password with bcrypt before storing', async () => {
      const testEmail = 'test@example.com';
      const testPassword = 'MySecurePassword123';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

      // Mock: Check user doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: Insert new user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUserId,
          email: testEmail,
          created_at: new Date('2024-01-01'),
        }],
      } as any);

      const result = await registerUser(testEmail, testPassword);

      // Verify password was hashed (second call is INSERT)
      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall?.[1]?.[1] as string;

      // Verify it's a bcrypt hash (starts with $2b$10$ for 10 rounds)
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Verify the hash can be verified against original password
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      expect(isValid).toBe(true);

      // Verify response structure
      expect(result.token).toBeDefined();
      expect(result.user.id).toBe(mockUserId);
      expect(result.user.email).toBe(testEmail);
    });

    it('should normalize email to lowercase', async () => {
      const mixedCaseEmail = 'Test@Example.COM';
      const expectedEmail = 'test@example.com';

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: expectedEmail,
          created_at: new Date(),
        }],
      } as any);

      await registerUser(mixedCaseEmail, 'password123');

      // Verify email was lowercased in both queries
      expect(mockQuery.mock.calls[0]?.[1]?.[0]).toBe(expectedEmail);
      expect(mockQuery.mock.calls[1]?.[1]?.[0]).toBe(expectedEmail);
    });

    it('should throw error if email already exists', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-user-id' }],
      } as any);

      await expect(
        registerUser('existing@example.com', 'password123')
      ).rejects.toThrow('Email already in use');

      // Should only check existence, not insert
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should generate valid JWT token with correct expiration', async () => {
      const testEmail = 'jwt@example.com';
      const testUserId = '456e7890-e89b-12d3-a456-426614174001';

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: testUserId,
          email: testEmail,
          created_at: new Date(),
        }],
      } as any);

      const result = await registerUser(testEmail, 'password123');

      // Verify token
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.email).toBe(testEmail);

      // Verify expiration is approximately 7 days (within 1 minute tolerance)
      const expectedExpiry = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
      expect(Math.abs(decoded.exp - expectedExpiry)).toBeLessThan(60);
    });

    it('should use 10 salt rounds for bcrypt', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          created_at: new Date(),
        }],
      } as any);

      await registerUser('test@example.com', 'password123');

      const hashedPassword = mockQuery.mock.calls[1]?.[1]?.[1] as string;

      // Bcrypt hash format: $2b$10$... (10 rounds)
      expect(hashedPassword).toMatch(/^\$2[aby]\$10\$/);
    });
  });

  describe('loginUser', () => {
    it('should verify password using bcrypt.compare', async () => {
      const testEmail = 'login@example.com';
      const testPassword = 'CorrectPassword123';
      const testUserId = '789e0123-e89b-12d3-a456-426614174002';

      // Hash the password first (simulating what's in DB)
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: testUserId,
          email: testEmail,
          password_hash: hashedPassword,
          created_at: new Date('2024-01-01'),
        }],
      } as any);

      const result = await loginUser(testEmail, testPassword);

      expect(result.user.id).toBe(testUserId);
      expect(result.user.email).toBe(testEmail);
      expect(result.token).toBeDefined();
    });

    it('should throw error for non-existent user', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword', 10);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          password_hash: hashedPassword,
          created_at: new Date(),
        }],
      } as any);

      await expect(
        loginUser('test@example.com', 'WrongPassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should normalize email to lowercase for lookup', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          password_hash: hashedPassword,
          created_at: new Date(),
        }],
      } as any);

      await loginUser('TEST@EXAMPLE.COM', 'password123');

      // Verify query used lowercase email
      expect(mockQuery.mock.calls[0]?.[1]?.[0]).toBe('test@example.com');
    });

    it('should generate new JWT token on each login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      mockQuery.mockResolvedValue({
        rows: [{
          id: '123',
          email: 'test@example.com',
          password_hash: hashedPassword,
          created_at: new Date(),
        }],
      } as any);

      const result1 = await loginUser('test@example.com', 'password123');
      
      // Small delay to ensure different iat (issued at) timestamp
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result2 = await loginUser('test@example.com', 'password123');

      // Tokens should be different due to different timestamps
      expect(result1.token).not.toBe(result2.token);
    });
  });

  describe('verifyAuthToken', () => {
    it('should verify valid JWT token and return user data', async () => {
      const testUserId = '123e4567-e89b-12d3-a456-426614174000';
      const testEmail = 'verify@example.com';

      // Generate a valid token
      const token = jwt.sign(
        { userId: testUserId, email: testEmail },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: testUserId,
          email: testEmail,
          created_at: new Date('2024-01-01'),
        }],
      } as any);

      const result = await verifyAuthToken(token);

      expect(result.id).toBe(testUserId);
      expect(result.email).toBe(testEmail);
      expect(result.created_at).toBeDefined();
    });

    it('should throw error for expired token', async () => {
      const testUserId = '123';
      const testEmail = 'expired@example.com';

      // Generate an expired token (negative expiration)
      const expiredToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        process.env.JWT_SECRET!,
        { expiresIn: '-1s' }
      );

      await expect(
        verifyAuthToken(expiredToken)
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error for invalid signature', async () => {
      // Generate token with wrong secret
      const token = jwt.sign(
        { userId: '123', email: 'test@example.com' },
        'wrong-secret-key',
        { expiresIn: '7d' }
      );

      await expect(
        verifyAuthToken(token)
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', async () => {
      await expect(
        verifyAuthToken('not-a-valid-jwt-token')
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error if user no longer exists in database', async () => {
      const token = jwt.sign(
        { userId: 'deleted-user-id', email: 'deleted@example.com' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await expect(
        verifyAuthToken(token)
      ).rejects.toThrow('Invalid or expired token');
    });

    it('should query database with userId from token', async () => {
      const testUserId = 'specific-user-id-123';
      
      const token = jwt.sign(
        { userId: testUserId, email: 'test@example.com' },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: testUserId,
          email: 'test@example.com',
          created_at: new Date(),
        }],
      } as any);

      await verifyAuthToken(token);

      // Verify query was called with correct userId
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, email, created_at FROM users WHERE id = $1'),
        [testUserId]
      );
    });
  });

  describe('JWT Secret Environment Variable', () => {
    it('should throw error if JWT_SECRET is not set', async () => {
      // Save and clear JWT_SECRET
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          created_at: new Date(),
        }],
      } as any);

      await expect(
        registerUser('test@example.com', 'password123')
      ).rejects.toThrow('JWT_SECRET environment variable is required but not set');

      // Restore JWT_SECRET
      process.env.JWT_SECRET = originalSecret;
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(200);

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          created_at: new Date(),
        }],
      } as any);

      const result = await registerUser('test@example.com', longPassword);

      // Should successfully hash and store
      expect(result.token).toBeDefined();

      // Verify the hash can still be validated
      const hashedPassword = mockQuery.mock.calls[1]?.[1]?.[1] as string;
      const isValid = await bcrypt.compare(longPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should handle special characters in email', async () => {
      const specialEmail = 'user+test@example.co.uk';

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: specialEmail.toLowerCase(),
          created_at: new Date(),
        }],
      } as any);

      const result = await registerUser(specialEmail, 'password123');

      expect(result.user.email).toBe(specialEmail.toLowerCase());
    });

    it('should handle special characters in password', async () => {
      const specialPassword = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';

      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: '123',
          email: 'test@example.com',
          created_at: new Date(),
        }],
      } as any);

      await registerUser('test@example.com', specialPassword);

      const hashedPassword = mockQuery.mock.calls[1]?.[1]?.[1] as string;
      const isValid = await bcrypt.compare(specialPassword, hashedPassword);
      expect(isValid).toBe(true);
    });
  });
});
