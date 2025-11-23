import { SubscribeRequestSchema } from '../models/subscribeSchema';

describe('SubscribeRequestSchema', () => {
  describe('Valid Inputs', () => {
    it('should validate a valid subscription request without tag', () => {
      const validRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.gdprConsent).toBe(true);
        expect(result.data.timestamp).toBe('2025-11-14T09:00:00.000Z');
        expect(result.data.tag).toBeUndefined();
      }
    });

    it('should validate a valid subscription request with tag', () => {
      const validRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'newsletter',
      };

      const result = SubscribeRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.gdprConsent).toBe(true);
        expect(result.data.timestamp).toBe('2025-11-14T09:00:00.000Z');
        expect(result.data.tag).toBe('newsletter');
      }
    });

    it('should accept beta tag', () => {
      const request = {
        email: 'beta@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'beta',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('beta');
      }
    });

    it('should accept early-access tag', () => {
      const request = {
        email: 'early@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'early-access',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('early-access');
      }
    });

    it('should accept tournament-alerts tag', () => {
      const request = {
        email: 'tournament@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'tournament-alerts',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('tournament-alerts');
      }
    });

    it('should accept vip-members tag', () => {
      const request = {
        email: 'vip@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'vip-members',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('vip-members');
      }
    });
  });

  describe('Tag Edge Cases', () => {
    it('should accept empty string tag', () => {
      const request = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: '',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('');
      }
    });

    it('should accept tag with special characters', () => {
      const request = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'special_tag-2024',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('special_tag-2024');
      }
    });

    it('should accept tag with spaces', () => {
      const request = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 'beta access',
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe('beta access');
      }
    });

    it('should accept long tag names', () => {
      const longTag = 'very-long-tag-name-for-segmentation-purposes-2024';
      const request = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: longTag,
      };

      const result = SubscribeRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tag).toBe(longTag);
      }
    });
  });

  describe('Invalid Email', () => {
    it('should reject invalid email format', () => {
      const invalidRequest = {
        email: 'not-an-email',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
        expect(result.error.issues[0].message).toBe('Invalid email format');
      }
    });

    it('should reject missing email', () => {
      const invalidRequest = {
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Invalid GDPR Consent', () => {
    it('should reject false GDPR consent', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: false,
        timestamp: '2025-11-14T09:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('GDPR consent is required');
      }
    });

    it('should reject missing GDPR consent', () => {
      const invalidRequest = {
        email: 'test@example.com',
        timestamp: '2025-11-14T09:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Invalid Timestamp', () => {
    it('should reject invalid timestamp format', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: 'not-a-timestamp',
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject missing timestamp', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: true,
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should accept ISO 8601 timestamp', () => {
      const validRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-23T08:00:00.000Z',
      };

      const result = SubscribeRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should reject tag that is not a string', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: 123, // number instead of string
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject tag that is an object', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: { name: 'beta' }, // object instead of string
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject tag that is an array', () => {
      const invalidRequest = {
        email: 'test@example.com',
        gdprConsent: true,
        timestamp: '2025-11-14T09:00:00.000Z',
        tag: ['beta', 'newsletter'], // array instead of string
      };

      const result = SubscribeRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});
