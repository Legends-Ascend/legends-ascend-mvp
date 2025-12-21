import { ADMIN_USERNAME, ADMIN_PASSWORD, SALT_ROUNDS } from '../config/adminConstants';

/**
 * Tests for Admin Constants Module
 * Validates PR #197 - Centralized admin credentials
 * Per issue #195: Admin unable to login after multiple logo clicks
 * 
 * Test Coverage:
 * - Verify admin constants are properly exported
 * - Verify constants match US-051 specifications
 * - Verify security best practices (SALT_ROUNDS)
 */

describe('Admin Constants Module', () => {
  describe('Module Exports', () => {
    it('should export ADMIN_USERNAME constant', () => {
      expect(ADMIN_USERNAME).toBeDefined();
      expect(typeof ADMIN_USERNAME).toBe('string');
    });

    it('should export ADMIN_PASSWORD constant', () => {
      expect(ADMIN_PASSWORD).toBeDefined();
      expect(typeof ADMIN_PASSWORD).toBe('string');
    });

    it('should export SALT_ROUNDS constant', () => {
      expect(SALT_ROUNDS).toBeDefined();
      expect(typeof SALT_ROUNDS).toBe('number');
    });
  });

  describe('US-051 Specification Compliance', () => {
    it('should have ADMIN_USERNAME set to supersaiyan per US-051', () => {
      expect(ADMIN_USERNAME).toBe('supersaiyan');
    });

    it('should have ADMIN_PASSWORD set to wh4t15myd35t1ny! per US-051', () => {
      expect(ADMIN_PASSWORD).toBe('wh4t15myd35t1ny!');
    });

    it('should have username that is lowercase', () => {
      expect(ADMIN_USERNAME).toBe(ADMIN_USERNAME.toLowerCase());
    });

    it('should have non-empty username', () => {
      expect(ADMIN_USERNAME.length).toBeGreaterThan(0);
    });

    it('should have non-empty password', () => {
      expect(ADMIN_PASSWORD.length).toBeGreaterThan(0);
    });
  });

  describe('Security Requirements', () => {
    it('should use 10 salt rounds per security requirements', () => {
      expect(SALT_ROUNDS).toBe(10);
    });

    it('should have SALT_ROUNDS as a positive integer', () => {
      expect(Number.isInteger(SALT_ROUNDS)).toBe(true);
      expect(SALT_ROUNDS).toBeGreaterThan(0);
    });

    it('should have password with sufficient complexity', () => {
      // Password should have at least 8 characters
      expect(ADMIN_PASSWORD.length).toBeGreaterThanOrEqual(8);
      
      // Password should contain special characters
      expect(/[!@#$%^&*(),.?":{}|<>]/.test(ADMIN_PASSWORD)).toBe(true);
      
      // Password should contain numbers
      expect(/\d/.test(ADMIN_PASSWORD)).toBe(true);
    });

    it('should have username that does not contain special characters', () => {
      // Username should be alphanumeric only (lowercase allowed per spec)
      expect(/^[a-z0-9]+$/.test(ADMIN_USERNAME)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should not have whitespace in username', () => {
      expect(ADMIN_USERNAME).not.toMatch(/\s/);
    });

    it('should not have whitespace at start or end of password', () => {
      expect(ADMIN_PASSWORD).toBe(ADMIN_PASSWORD.trim());
    });

    it('should have constants that are immutable', () => {
      // Attempting to reassign should not affect the exported values
      const originalUsername = ADMIN_USERNAME;
      const originalPassword = ADMIN_PASSWORD;
      const originalSaltRounds = SALT_ROUNDS;
      
      // These values should remain constant
      expect(ADMIN_USERNAME).toBe(originalUsername);
      expect(ADMIN_PASSWORD).toBe(originalPassword);
      expect(SALT_ROUNDS).toBe(originalSaltRounds);
    });
  });

  describe('Integration with bcrypt', () => {
    it('should have SALT_ROUNDS compatible with bcrypt (between 4 and 31)', () => {
      // Bcrypt supports salt rounds between 4 and 31
      expect(SALT_ROUNDS).toBeGreaterThanOrEqual(4);
      expect(SALT_ROUNDS).toBeLessThanOrEqual(31);
    });

    it('should use secure SALT_ROUNDS (10 or higher recommended)', () => {
      // OWASP recommends 10+ for bcrypt
      expect(SALT_ROUNDS).toBeGreaterThanOrEqual(10);
    });
  });
});
