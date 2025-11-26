import bcrypt from 'bcrypt';
import { jest } from '@jest/globals';
import { seedAdminAccount } from '../seed';
import * as database from '../config/database';

/**
 * Tests for admin account seeding
 * Following TECHNICAL_ARCHITECTURE.md - Database seeding patterns
 * Implements US-051 AC-1: Admin Account Exists After Deployment
 */

// Mock database queries
jest.mock('../config/database');
const mockQuery = database.query as jest.MockedFunction<typeof database.query>;

// Admin credentials as specified in US-051
const ADMIN_USERNAME = 'supersaiyan';
const ADMIN_PASSWORD = 'wh4t15myd35t1ny!';

describe('Admin Account Seed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('seedAdminAccount', () => {
    it('creates admin account with correct username and role', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Verify the INSERT query was called with correct parameters
      expect(mockQuery).toHaveBeenCalledTimes(2);
      
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall[0]).toContain('INSERT INTO users');
      expect(insertCall[0]).toContain("'admin'");
      expect(insertCall[1]?.[0]).toBe(ADMIN_USERNAME);
    });

    it('creates admin account with password that validates against wh4t15myd35t1ny!', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Get the hashed password from the INSERT call
      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall?.[1]?.[2] as string;

      // Verify the hash validates against the expected password
      const passwordValid = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
      expect(passwordValid).toBe(true);
    });

    it('uses bcrypt with 10 salt rounds', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Get the hashed password from the INSERT call
      const insertCall = mockQuery.mock.calls[1];
      const hashedPassword = insertCall?.[1]?.[2] as string;

      // Bcrypt hash format: $2b$10$... (10 rounds)
      expect(hashedPassword).toMatch(/^\$2[aby]\$10\$/);
    });

    it('skips creation if admin already exists', async () => {
      // Mock: Admin already exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-admin-id' }],
      } as any);

      await seedAdminAccount();

      // Only one query should be made (the check query)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery.mock.calls[0][0]).toContain('SELECT id FROM users WHERE username');
    });

    it('creates admin with correct email format', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Verify the email uses the expected format
      const insertCall = mockQuery.mock.calls[1];
      const email = insertCall?.[1]?.[1] as string;
      expect(email).toBe(`${ADMIN_USERNAME}@admin.legendsascend.local`);
    });

    it('throws error on database failure', async () => {
      // Mock: Database error
      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(seedAdminAccount()).rejects.toThrow('Database connection failed');
    });
  });

  describe('Security requirements', () => {
    it('never stores password in plaintext', async () => {
      // Mock: Admin doesn't exist yet
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);
      
      // Mock: Insert succeeds
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await seedAdminAccount();

      // Check that the password is never passed as plaintext in any query
      const allQueryArgs = mockQuery.mock.calls.flatMap(call => 
        call.slice(1).flat().filter(arg => typeof arg === 'string')
      );

      expect(allQueryArgs).not.toContain(ADMIN_PASSWORD);
    });
  });
});
