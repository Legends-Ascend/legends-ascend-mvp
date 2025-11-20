import { subscribeToEmailList } from '../services/emailOctopusService';

// Mock fetch globally
global.fetch = jest.fn();

describe('emailOctopusService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      EMAILOCTOPUS_API_KEY: 'test-api-key',
      EMAILOCTOPUS_LIST_ID: 'test-list-id',
      EMAILOCTOPUS_DEBUG: 'false',
      // Don't set EMAILOCTOPUS_BETA_ACCESS_TAG by default to preserve existing test behavior
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('subscribeToEmailList', () => {
    describe('Happy Path', () => {
      it('should successfully subscribe a new email', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '123',
            email_address: email,
            status: 'SUBSCRIBED',
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(
          'https://emailoctopus.com/api/1.6/lists/test-list-id/contacts',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              api_key: 'test-api-key',
              email_address: email,
              status: 'SUBSCRIBED',
              'fields[ConsentTimestamp]': timestamp,
              update_existing: 'true',
            }).toString(),
          })
        );

        expect(result).toEqual({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        });
      });

      it('should return sanitized debug payload when enabled', async () => {
        process.env.EMAILOCTOPUS_DEBUG = 'true';

        const email = 'debug@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';
        process.env.EMAILOCTOPUS_BETA_ACCESS_TAG = 'beta';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '789',
            email_address: email,
            status: 'SUBSCRIBED',
          }),
        });

        const result = await subscribeToEmailList(email, timestamp);

        expect(result).toEqual({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
          debug: expect.objectContaining({
            httpStatus: 201,
            tagsApplied: ['beta'],
            updateExisting: true,
          }),
        });

        expect((result.debug as any).requestBodyPreview).toContain('api_key=[REDACTED]');
        expect((result.debug as any).requestBodyPreview).toContain('tags%5B%5D=beta');
      });

      it('should include tags and update_existing flag when configured', async () => {
        // Arrange
        process.env.EMAILOCTOPUS_BETA_ACCESS_TAG = 'beta-access';
        const email = 'tagged@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '456',
            email_address: email,
            status: 'SUBSCRIBED',
            tags: ['beta-access'],
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(
          'https://emailoctopus.com/api/1.6/lists/test-list-id/contacts',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              api_key: 'test-api-key',
              email_address: email,
              status: 'SUBSCRIBED',
              'fields[ConsentTimestamp]': timestamp,
              update_existing: 'true',
              'tags[]': 'beta-access',
            }).toString(),
          })
        );

        expect(result).toEqual({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        });
      });

      it('should handle already subscribed email (409 status)', async () => {
        // Arrange
        const email = 'existing@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 409,
          json: async () => ({
            error: {
              code: 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS',
              message: 'Member already exists',
            },
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: true,
          message: 'This email is already on our list. Check your inbox for updates.',
          status: 'already_subscribed',
        });
      });

      it('should handle already subscribed email (error code)', async () => {
        // Arrange
        const email = 'existing@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 400,
          json: async () => ({
            error: {
              code: 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS',
              message: 'Member already exists',
            },
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: true,
          message: 'This email is already on our list. Check your inbox for updates.',
          status: 'already_subscribed',
        });
      });
    });

    describe('Error Handling', () => {
      it('should throw error when EMAILOCTOPUS_API_KEY is missing', async () => {
        // Arrange
        process.env.EMAILOCTOPUS_API_KEY = '';

        // Act & Assert
        await expect(
          subscribeToEmailList('test@example.com', '2025-11-14T09:00:00.000Z')
        ).rejects.toThrow('EmailOctopus configuration missing');
      });

      it('should throw error when EMAILOCTOPUS_LIST_ID is missing', async () => {
        // Arrange
        process.env.EMAILOCTOPUS_LIST_ID = '';

        // Act & Assert
        await expect(
          subscribeToEmailList('test@example.com', '2025-11-14T09:00:00.000Z')
        ).rejects.toThrow('EmailOctopus configuration missing');
      });

      it('should handle API error responses', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 400,
          json: async () => ({
            error: {
              code: 'INVALID_EMAIL',
              message: 'Invalid email address',
            },
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        });
      });

      it('should handle network errors', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to connect. Please try again later.',
          status: 'error',
        });
      });

      it('should handle 500 server errors', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 500,
          json: async () => ({
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
            },
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        });
      });

      it('should handle 401 authentication errors', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 401,
          json: async () => ({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Invalid API key',
            },
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle malformed JSON response', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 200,
          json: async () => {
            throw new Error('Invalid JSON');
          },
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to connect. Please try again later.',
          status: 'error',
        });
      });

      it('should handle timeout errors', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockRejectedValue(new Error('Request timeout'));

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to connect. Please try again later.',
          status: 'error',
        });
      });

      it('should handle emails with unicode characters', async () => {
        // Arrange
        const email = 'tést@éxample.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '123',
            email_address: email,
            status: 'SUBSCRIBED',
          }),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result.success).toBe(true);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining(`email_address=${encodeURIComponent(email)}`),
          })
        );
      });

      it('should handle empty error object in response', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 400,
          json: async () => ({}),
        });

        // Act
        const result = await subscribeToEmailList(email, timestamp);

        // Assert
        expect(result).toEqual({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        });
      });
    });

    describe('API Integration', () => {
      it('should pass consent timestamp to EmailOctopus', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T12:34:56.789Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 200,
          json: async () => ({ id: '123' }),
        });

        // Act
        await subscribeToEmailList(email, timestamp);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.any(String),
          })
        );

        const callBody = new URLSearchParams((global.fetch as jest.Mock).mock.calls[0][1].body);
        expect(callBody.get('fields[ConsentTimestamp]')).toBe(timestamp);
      });

      it('should use correct API endpoint URL', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 200,
          json: async () => ({ id: '123' }),
        });

        // Act
        await subscribeToEmailList(email, timestamp);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith(
          'https://emailoctopus.com/api/1.6/lists/test-list-id/contacts',
          expect.any(Object)
        );
      });

      it('should include beta-access tag when EMAILOCTOPUS_BETA_ACCESS_TAG is set', async () => {
        // Arrange
        process.env.EMAILOCTOPUS_BETA_ACCESS_TAG = 'beta-access';
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '123',
            email_address: email,
            status: 'SUBSCRIBED',
          }),
        });

        // Act
        await subscribeToEmailList(email, timestamp);

        // Assert
        const callBody = new URLSearchParams((global.fetch as jest.Mock).mock.calls[0][1].body);
        expect(callBody.getAll('tags[]')).toEqual(['beta-access']);
        expect(callBody.get('api_key')).toBe('test-api-key');
        expect(callBody.get('email_address')).toBe(email);
        expect(callBody.get('status')).toBe('SUBSCRIBED');
      });

      it('should not include tags when EMAILOCTOPUS_BETA_ACCESS_TAG is not set', async () => {
        // Arrange
        const email = 'test@example.com';
        const timestamp = '2025-11-14T09:00:00.000Z';

        (global.fetch as jest.Mock).mockResolvedValue({
          status: 201,
          json: async () => ({
            id: '123',
            email_address: email,
            status: 'SUBSCRIBED',
          }),
        });

        // Act
        await subscribeToEmailList(email, timestamp);

        // Assert
        const callBody = new URLSearchParams((global.fetch as jest.Mock).mock.calls[0][1].body);
        expect(callBody.getAll('tags[]')).toEqual([]);
        expect(callBody.get('api_key')).toBe('test-api-key');
        expect(callBody.get('email_address')).toBe(email);
      });
    });
  });
});
