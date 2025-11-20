import { afterEach, describe, it, expect, vi } from 'vitest';
import { getApiUrl, validateApiConfig, logConfigWarnings, isProductionMisconfigured } from '../apiConfig';

/**
 * Edge Case Tests for API Configuration (PR #131)
 * 
 * These tests validate edge cases and boundary conditions for the console warning fix
 * that prevents inappropriate warnings in development mode.
 */

describe('apiConfig - Edge Cases and Boundary Conditions (PR #131)', () => {
  const originalEnv = { ...import.meta.env };

  const setEnv = (overrides: Record<string, unknown>) => {
    Object.assign(import.meta.env as Record<string, unknown>, overrides);
  };

  afterEach(() => {
    // Restore original environment
    Object.keys(import.meta.env).forEach((key) => {
      delete (import.meta.env as Record<string, unknown>)[key];
    });
    Object.assign(import.meta.env as Record<string, unknown>, originalEnv);
  });

  describe('getApiUrl - Edge Cases', () => {
    it('should handle empty string VITE_API_URL', () => {
      setEnv({ VITE_API_URL: '' });
      const result = getApiUrl();
      // Empty string is falsy, so should fall back to '/api'
      expect(result).toBe('/api');
    });

    it('should handle whitespace-only VITE_API_URL', () => {
      setEnv({ VITE_API_URL: '   ' });
      const result = getApiUrl();
      // Whitespace is truthy, so should return it
      expect(result).toBe('   ');
    });

    it('should handle URL with trailing slash', () => {
      setEnv({ VITE_API_URL: 'https://backend.example.com/api/' });
      const result = getApiUrl();
      expect(result).toBe('https://backend.example.com/api/');
    });

    it('should handle URL without /api suffix', () => {
      setEnv({ VITE_API_URL: 'https://backend.example.com' });
      const result = getApiUrl();
      expect(result).toBe('https://backend.example.com');
    });

    it('should handle localhost URLs', () => {
      setEnv({ VITE_API_URL: 'http://localhost:3000/api' });
      const result = getApiUrl();
      expect(result).toBe('http://localhost:3000/api');
    });

    it('should handle IP address URLs', () => {
      setEnv({ VITE_API_URL: 'http://192.168.1.1:3000/api' });
      const result = getApiUrl();
      expect(result).toBe('http://192.168.1.1:3000/api');
    });
  });

  describe('validateApiConfig - Production Edge Cases', () => {
    it('should handle backend subdomain with vercel.app', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://backend-abc.vercel.app/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle api subdomain with vercel.app', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://api.myapp.vercel.app/v1' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn for frontend-looking vercel.app URLs', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://myapp-frontend.vercel.app/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('frontend deployment');
    });

    it('should handle non-vercel production URLs', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://api.mycompany.com/v1' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle Railway deployment URLs', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://myapp.up.railway.app/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle Heroku deployment URLs', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://myapp.herokuapp.com/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('isProductionMisconfigured - Comprehensive Scenarios', () => {
    it('should not flag localhost as misconfigured in production', () => {
      setEnv({ PROD: true, VITE_API_URL: 'http://localhost:3000/api' });
      expect(isProductionMisconfigured()).toBe(false);
    });

    it('should not flag IP addresses as misconfigured', () => {
      setEnv({ PROD: true, VITE_API_URL: 'http://10.0.0.1:3000/api' });
      expect(isProductionMisconfigured()).toBe(false);
    });

    it('should not flag /api as misconfigured in production (monorepo)', () => {
      setEnv({ PROD: true, VITE_API_URL: '/api' });
      expect(isProductionMisconfigured()).toBe(false);
    });

    it('should not flag undefined VITE_API_URL as misconfigured in production', () => {
      setEnv({ PROD: true, VITE_API_URL: undefined });
      expect(isProductionMisconfigured()).toBe(false);
    });

    it('should flag obvious frontend vercel.app URLs as misconfigured', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://legends-ascend-frontend.vercel.app/api' });
      expect(isProductionMisconfigured()).toBe(true);
    });

    it('should flag app.vercel.app URLs without backend/api indicators', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://my-web-app.vercel.app/api' });
      expect(isProductionMisconfigured()).toBe(true);
    });

    it('should always return false in development mode regardless of URL', () => {
      const testUrls = [
        'https://frontend.vercel.app/api',
        '/api',
        '',
        'invalid-url',
      ];

      testUrls.forEach((url) => {
        setEnv({ PROD: false, VITE_API_URL: url });
        expect(isProductionMisconfigured()).toBe(false);
      });
    });
  });

  describe('logConfigWarnings - Console Output Edge Cases', () => {
    it('should handle multiple warnings gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Set up a scenario that would trigger warnings
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      logConfigWarnings();
      
      // Should have been called (warnings + header + footer)
      expect(consoleWarnSpy.mock.calls.length).toBeGreaterThan(0);
      
      consoleWarnSpy.mockRestore();
    });

    it('should not throw errors with invalid environment state', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Set invalid environment
      setEnv({ PROD: 'not-a-boolean', VITE_API_URL: undefined });
      
      expect(() => logConfigWarnings()).not.toThrow();
      
      consoleWarnSpy.mockRestore();
    });

    it('should format warnings correctly for readability', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      setEnv({ PROD: true, VITE_API_URL: 'https://frontend.vercel.app/api' });
      
      logConfigWarnings();
      
      // Should include numbered warnings
      const calls = consoleWarnSpy.mock.calls;
      const hasNumberedWarning = calls.some((call) => 
        call.some((arg) => typeof arg === 'string' && /^\d+\./.test(arg))
      );
      expect(hasNumberedWarning).toBe(true);
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Development Mode Protection (PR #131 Fix)', () => {
    it('should never log warnings in development mode even with bad config', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      setEnv({ 
        PROD: false, 
        VITE_API_URL: 'https://obviously-wrong-url.vercel.app/api' 
      });
      
      logConfigWarnings();
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should validate as valid in dev mode with any URL', () => {
      const testConfigs = [
        { VITE_API_URL: '/api' },
        { VITE_API_URL: '' },
        { VITE_API_URL: 'https://frontend.vercel.app/api' },
        { VITE_API_URL: undefined },
      ];

      testConfigs.forEach((config) => {
        setEnv({ PROD: false, ...config });
        const result = validateApiConfig();
        expect(result.isValid).toBe(true);
        expect(result.warnings).toHaveLength(0);
      });
    });

    it('should return false for misconfigured check in dev mode', () => {
      setEnv({ PROD: false, VITE_API_URL: '/api' });
      expect(isProductionMisconfigured()).toBe(false);
      
      setEnv({ PROD: false, VITE_API_URL: 'https://frontend.vercel.app/api' });
      expect(isProductionMisconfigured()).toBe(false);
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should handle null VITE_API_URL by treating it as string "null"', () => {
      // In environment variables, null becomes the string "null"
      setEnv({ VITE_API_URL: null });
      const result = getApiUrl();
      // null is truthy as a string, so it returns "null"
      expect(result).toBe('null');
    });

    it('should handle undefined VITE_API_URL by treating it as string "undefined"', () => {
      // In environment variables, undefined becomes the string "undefined"
      setEnv({ VITE_API_URL: undefined });
      const result = getApiUrl();
      // undefined is truthy as a string, so it returns "undefined"
      expect(result).toBe('undefined');
    });

    it('should handle missing VITE_API_URL (truly undefined)', () => {
      // Don't set VITE_API_URL at all - this is truly undefined
      setEnv({});
      const result = getApiUrl();
      // Truly undefined should fall back to '/api'
      expect(result).toBe('/api');
    });

    it('should not throw on null environment in production', () => {
      setEnv({ PROD: true, VITE_API_URL: null });
      expect(() => validateApiConfig()).not.toThrow();
      expect(() => isProductionMisconfigured()).not.toThrow();
    });
  });

  describe('URL Pattern Edge Cases', () => {
    it('should handle URLs with port numbers', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://backend.example.com:8080/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle URLs with query parameters', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://backend.example.com/api?version=1' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle URLs with multiple path segments', () => {
      setEnv({ PROD: true, VITE_API_URL: 'https://backend.example.com/v1/api/endpoint' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle URLs with uppercase', () => {
      setEnv({ PROD: true, VITE_API_URL: 'HTTPS://BACKEND.EXAMPLE.COM/API' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });
  });

  describe('Boolean Environment Variable Edge Cases', () => {
    it('should handle PROD as string "true"', () => {
      setEnv({ PROD: 'true', VITE_API_URL: '/api' });
      // JavaScript truthy check - string "true" is truthy
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle PROD as string "false"', () => {
      setEnv({ PROD: 'false', VITE_API_URL: '/api' });
      // JavaScript truthy check - string "false" is still truthy!
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle PROD as number 1', () => {
      setEnv({ PROD: 1, VITE_API_URL: '/api' });
      const result = validateApiConfig();
      expect(result.isValid).toBe(true);
    });

    it('should handle PROD as number 0', () => {
      setEnv({ PROD: 0, VITE_API_URL: '/api' });
      const result = validateApiConfig();
      // 0 is falsy, so treated as development
      expect(result.isValid).toBe(true);
    });
  });
});
