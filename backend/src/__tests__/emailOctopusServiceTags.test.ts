import { jest } from '@jest/globals';
import { subscribeToEmailList } from '../services/emailOctopusService';

/**
 * Unit tests for EmailOctopus service tags array support (US-048)
 * Tests backward compatibility and multiple tags functionality
 */

// Mock global fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('EmailOctopus Service - Tags Array Support (US-048)', () => {
  const testEmail = 'test@example.com';
  const testTimestamp = '2024-01-01T00:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAILOCTOPUS_API_KEY = 'test-api-key';
    process.env.EMAILOCTOPUS_LIST_ID = 'test-list-id';
    process.env.EMAILOCTOPUS_DEBUG = 'false';
  });

  describe('Multiple tags support', () => {
    it('should send multiple tags when tags array is provided', async () => {
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp, undefined, ['registered', 'news']);

      // Verify fetch was called
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Get the request body
      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Verify both tags are in the request
      expect(requestBody).toContain('tags%5B%5D=registered'); // URL-encoded tags[]=registered
      expect(requestBody).toContain('tags%5B%5D=news'); // URL-encoded tags[]=news
    });

    it('should use tags array even when single tag is also provided (tags takes precedence)', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp, 'beta', ['registered', 'news']);

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should use tags array, not single tag
      expect(requestBody).toContain('tags%5B%5D=registered');
      expect(requestBody).toContain('tags%5B%5D=news');
      expect(requestBody).not.toContain('tags%5B%5D=beta');
    });
  });

  describe('Backward compatibility with single tag', () => {
    it('should still work with single tag parameter (deprecated)', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp, 'beta-access');

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should use single tag
      expect(requestBody).toContain('tags%5B%5D=beta-access');
    });

    it('should default to "beta" tag when no tag or tags provided', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp);

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should use default 'beta' tag
      expect(requestBody).toContain('tags%5B%5D=beta');
    });

    it('should use configured tag from environment variable when no params provided', async () => {
      process.env.EMAILOCTOPUS_BETA_ACCESS_TAG = 'early-bird';

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp);

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should use configured tag
      expect(requestBody).toContain('tags%5B%5D=early-bird');

      // Clean up
      delete process.env.EMAILOCTOPUS_BETA_ACCESS_TAG;
    });
  });

  describe('Empty tags array handling', () => {
    it('should fall back to single tag when tags array is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp, 'beta', []);

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should fall back to single tag when tags array is empty
      expect(requestBody).toContain('tags%5B%5D=beta');
    });

    it('should use default when both tags array is empty and no single tag', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      await subscribeToEmailList(testEmail, testTimestamp, undefined, []);

      const requestBody = mockFetch.mock.calls[0][1]?.body as string;
      
      // Should use default 'beta' tag
      expect(requestBody).toContain('tags%5B%5D=beta');
    });
  });

  describe('Success responses with tags', () => {
    it('should return success with debug info showing tags applied', async () => {
      process.env.EMAILOCTOPUS_DEBUG = 'true';

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ id: 'subscriber-id', status: 'SUBSCRIBED' }),
      } as Response);

      const result = await subscribeToEmailList(
        testEmail, 
        testTimestamp, 
        undefined, 
        ['registered', 'news']
      );

      expect(result.success).toBe(true);
      expect(result.status).toBe('pending_confirmation');
      expect(result.debug).toBeDefined();
      expect(result.debug?.tagsApplied).toEqual(['registered', 'news']);
    });
  });
});
