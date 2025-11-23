import { jest } from '@jest/globals';
import { registerUser } from '../services/authService';
import * as database from '../config/database';
import * as emailOctopusService from '../services/emailOctopusService';

/**
 * Integration tests for newsletter opt-in during registration (US-048)
 * Tests that newsletter subscription is handled correctly during user registration
 */

// Set required environment variable
process.env.JWT_SECRET = 'test-secret-key-for-newsletter-optin-testing';

// Mock database queries
jest.mock('../config/database');

// Mock emailOctopusService
jest.mock('../services/emailOctopusService', () => ({
  subscribeToEmailList: jest.fn(),
}));

const mockQuery = database.query as jest.MockedFunction<typeof database.query>;
const mockSubscribeToEmailList = emailOctopusService.subscribeToEmailList as jest.MockedFunction<
  typeof emailOctopusService.subscribeToEmailList
>;

describe('Newsletter Opt-In During Registration (US-048)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User opts in for newsletter', () => {
    it('should create user with newsletter_optin true and subscribe with registered and news tags', async () => {
      const testEmail = 'optin@example.com';
      const testPassword = 'SecurePass123';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174001';

      // Mock: Check user doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: Insert new user
      const mockCreatedAt = new Date('2024-01-01');
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUserId,
          email: testEmail,
          created_at: mockCreatedAt,
          newsletter_optin: true,
        }],
      } as any);

      // Mock: Newsletter subscription succeeds
      mockSubscribeToEmailList.mockResolvedValueOnce({
        success: true,
        message: 'Subscribed successfully',
        status: 'pending_confirmation',
      });

      const result = await registerUser(testEmail, testPassword, true);

      // Verify user was created
      expect(result.user.id).toBe(mockUserId);
      expect(result.user.email).toBe(testEmail);
      expect(result.token).toBeDefined();

      // Verify INSERT query included newsletter preferences
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall).toBeDefined();
      expect(insertCall![0]).toContain('newsletter_optin');
      expect(insertCall![0]).toContain('newsletter_consent_timestamp');
      expect(insertCall![1]![2]).toBe(true); // newsletterOptIn parameter
      expect(insertCall![1]![3]).toBeInstanceOf(Date); // newsletterConsentTimestamp parameter

      // Give async newsletter subscription time to execute
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify newsletter subscription was called with correct tags
      expect(mockSubscribeToEmailList).toHaveBeenCalledWith(
        testEmail,
        expect.any(String), // ISO timestamp
        undefined, // single tag parameter (not used)
        ['registered', 'news'] // tags array
      );
    });
  });

  describe('User does not opt in for newsletter', () => {
    it('should create user with newsletter_optin false and subscribe with registered tag only', async () => {
      const testEmail = 'optout@example.com';
      const testPassword = 'SecurePass123';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174002';

      // Mock: Check user doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: Insert new user
      const mockCreatedAt = new Date('2024-01-01');
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUserId,
          email: testEmail,
          created_at: mockCreatedAt,
          newsletter_optin: false,
        }],
      } as any);

      // Mock: Newsletter subscription succeeds
      mockSubscribeToEmailList.mockResolvedValueOnce({
        success: true,
        message: 'Subscribed successfully',
        status: 'pending_confirmation',
      });

      const result = await registerUser(testEmail, testPassword, false);

      // Verify user was created
      expect(result.user.id).toBe(mockUserId);
      expect(result.user.email).toBe(testEmail);

      // Verify INSERT query included newsletter preferences
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall).toBeDefined();
      expect(insertCall![1]![2]).toBe(false); // newsletterOptIn parameter
      expect(insertCall![1]![3]).toBeNull(); // newsletterConsentTimestamp is null when opted out

      // Give async newsletter subscription time to execute
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify newsletter subscription was called with registered tag only
      expect(mockSubscribeToEmailList).toHaveBeenCalledWith(
        testEmail,
        expect.any(String), // ISO timestamp
        undefined, // single tag parameter (not used)
        ['registered'] // tags array - only registered, no news
      );
    });
  });

  describe('Registration succeeds even if newsletter subscription fails', () => {
    it('should create user and return token even when newsletter API fails', async () => {
      const testEmail = 'failedsubscription@example.com';
      const testPassword = 'SecurePass123';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174003';

      // Mock: Check user doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: Insert new user
      const mockCreatedAt = new Date('2024-01-01');
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUserId,
          email: testEmail,
          created_at: mockCreatedAt,
          newsletter_optin: true,
        }],
      } as any);

      // Mock: Newsletter subscription fails
      mockSubscribeToEmailList.mockRejectedValueOnce(new Error('EmailOctopus API unavailable'));

      const result = await registerUser(testEmail, testPassword, true);

      // Verify user was still created successfully
      expect(result.user.id).toBe(mockUserId);
      expect(result.user.email).toBe(testEmail);
      expect(result.token).toBeDefined();

      // Give async newsletter subscription time to execute and fail
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify newsletter subscription was attempted
      expect(mockSubscribeToEmailList).toHaveBeenCalled();

      // Registration should not throw error even though newsletter subscription failed
      // This is the key test for FR-6: "Newsletter subscription MUST NOT block account creation"
    });
  });

  describe('Default behavior', () => {
    it('should default to no newsletter opt-in when parameter is omitted', async () => {
      const testEmail = 'default@example.com';
      const testPassword = 'SecurePass123';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174004';

      // Mock: Check user doesn't exist
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      // Mock: Insert new user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUserId,
          email: testEmail,
          created_at: new Date('2024-01-01'),
          newsletter_optin: false,
        }],
      } as any);

      // Call registerUser without newsletterOptIn parameter (should default to false)
      const result = await registerUser(testEmail, testPassword);

      // Verify user was created
      expect(result.user.id).toBe(mockUserId);

      // Verify INSERT query included newsletter preferences with default false
      const insertCall = mockQuery.mock.calls[1];
      expect(insertCall).toBeDefined();
      expect(insertCall![1]![2]).toBe(false); // newsletterOptIn defaults to false

      // Give async newsletter subscription time to execute
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify newsletter subscription was called with registered tag only (not opted in)
      expect(mockSubscribeToEmailList).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        undefined,
        ['registered']
      );
    });
  });
});
