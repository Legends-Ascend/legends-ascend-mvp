import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import { seedAdminAccount } from '../seed';
import * as database from '../config/database';
import { ADMIN_USERNAME, ADMIN_PASSWORD, SALT_ROUNDS } from '../config/adminConstants';

/**
 * Tests for PR #197 - Admin Account Seeding with Centralized Constants
 * Validates that seedAdminAccount uses the new adminConstants module
 * Per issue #195: Admin unable to login after multiple logo clicks
 * 
 * Test Coverage:
 * - Admin account uses centralized constants
 * - Password is properly hashed with bcrypt
 * - Duplicate admin prevention
 * - Error handling and recovery
 * - Security validations
 */

// Mock database queries
jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

describe('PR #197: Admin Seeding with Centralized Constants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin Account Creation with adminConstants', () => {
    it('should create admin using ADMIN_USERNAME from constants', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Verify INSERT uses ADMIN_USERNAME
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[1]?.[0]).toBe(ADMIN_USERNAME);
      expect(insertCall[1]?.[0]).toBe('supersaiyan');
    });

    it('should create admin using ADMIN_PASSWORD from constants', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Get the hashed password from the INSERT call
      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall[1]?.[2] as string;

      // Verify the hash validates against ADMIN_PASSWORD from constants
      const isValid = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
      expect(isValid).toBe(true);
      
      const isValidWithExpectedPassword = await bcrypt.compare('wh4t15myd35t1ny!', hashedPassword);
      expect(isValidWithExpectedPassword).toBe(true);
    });

    it('should use SALT_ROUNDS from constants for password hashing', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall[1]?.[2] as string;

      // Bcrypt hash format: $2b$10$ means 10 rounds
      expect(hashedPassword).toMatch(/^\$2[aby]\$10\$/);
      
      const saltRoundsMatch = hashedPassword.match(/^\$2[aby]\$(\d+)\$/);
      if (saltRoundsMatch) {
        expect(parseInt(saltRoundsMatch[1])).toBe(SALT_ROUNDS);
        expect(parseInt(saltRoundsMatch[1])).toBe(10);
      }
    });

    it('should create admin with email using ADMIN_USERNAME constant', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const insertCall = mockQuery.mock.calls[1];
      const email = insertCall[1]?.[1] as string;
      expect(email).toBe(`${ADMIN_USERNAME}@admin.legendsascend.local`);
      expect(email).toBe('supersaiyan@admin.legendsascend.local');
    });

    it('should create admin with role admin', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[0]).toContain("'admin'");
    });
  });

  describe('Duplicate Admin Prevention', () => {
    it('should skip admin creation if admin already exists', async () => {
      // Mock: Admin already exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-admin-id' }],
      } as any);

      await seedAdminAccount();

      // Only one query should be made (the check query)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery.mock.calls[0][0]).toContain('SELECT id FROM users WHERE username');
    });

    it('should check for existing admin using ADMIN_USERNAME constant', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Should have checked for existing admin using the constant
      const selectCall = mockQuery.mock.calls[0];
      expect(selectCall[0]).toContain('SELECT id FROM users WHERE username');
      expect(selectCall[1]?.[0]).toBe(ADMIN_USERNAME);
      expect(selectCall[1]?.[0]).toBe('supersaiyan');
    });
  });

  describe('Error Handling', () => {
    it('should throw error on database failure when checking for admin', async () => {
      // Mock: Database error on SELECT
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(seedAdminAccount()).rejects.toThrow('Database connection failed');
    });

    it('should throw error on database failure when inserting admin', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Database error on INSERT
      mockQuery.mockRejectedValueOnce(new Error('Insert failed'));

      await expect(seedAdminAccount()).rejects.toThrow('Insert failed');
    });
  });

  describe('Security Validations', () => {
    it('should never store password in plaintext', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Check all query parameters
      const allParams = mockQuery.mock.calls.flatMap(call => 
        call.slice(1).flat().filter(arg => typeof arg === 'string')
      );

      // Password from adminConstants should never appear in queries
      expect(allParams).not.toContain(ADMIN_PASSWORD);
      expect(allParams).not.toContain('wh4t15myd35t1ny!');
    });

    it('should hash password differently each time due to salt', async () => {
      // Create two hashes to verify they're different (due to random salt)
      const hash1 = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
      const hash2 = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      // Hashes should be different
      expect(hash1).not.toBe(hash2);

      // But both should validate against the same password
      expect(await bcrypt.compare(ADMIN_PASSWORD, hash1)).toBe(true);
      expect(await bcrypt.compare(ADMIN_PASSWORD, hash2)).toBe(true);
    });
  });

  describe('Consistency with adminConstants', () => {
    it('should use exact same credentials as defined in adminConstants', async () => {
      // Mock: Admin doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Verify all values match adminConstants
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[1]?.[0]).toBe(ADMIN_USERNAME);
      
      const hashedPassword = insertCall[1]?.[2] as string;
      const passwordValid = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
      expect(passwordValid).toBe(true);
    });

    it('should import constants from adminConstants module', () => {
      // This test verifies the import works correctly
      expect(ADMIN_USERNAME).toBe('supersaiyan');
      expect(ADMIN_PASSWORD).toBe('wh4t15myd35t1ny!');
      expect(SALT_ROUNDS).toBe(10);
    });
  });
});
