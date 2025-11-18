import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../validation';

describe('validation', () => {
  describe('loginSchema', () => {
    it('should accept valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'notanemail',
        password: 'Password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });
  });

  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = registerSchema.safeParse({
        email: 'notanemail',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Pass1',
        confirmPassword: 'Pass1',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
      }
    });

    it('should reject password without uppercase letter', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const uppercaseError = result.error.issues.find(
          issue => issue.message === 'Password must include at least one uppercase letter'
        );
        expect(uppercaseError).toBeDefined();
      }
    });

    it('should reject password without lowercase letter', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'PASSWORD123',
        confirmPassword: 'PASSWORD123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const lowercaseError = result.error.issues.find(
          issue => issue.message === 'Password must include at least one lowercase letter'
        );
        expect(lowercaseError).toBeDefined();
      }
    });

    it('should reject password without number', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password',
        confirmPassword: 'Password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const numberError = result.error.issues.find(
          issue => issue.message === 'Password must include at least one number'
        );
        expect(numberError).toBeDefined();
      }
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const mismatchError = result.error.issues.find(
          issue => issue.message === 'Passwords do not match'
        );
        expect(mismatchError).toBeDefined();
      }
    });
  });
});
