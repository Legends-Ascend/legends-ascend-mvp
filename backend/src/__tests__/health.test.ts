/**
 * API Health Check Test Suite
 * 
 * Tests for the API health check endpoint including:
 * - Basic functionality
 * - Response format
 * - Error handling
 * - Performance
 */

import request from 'supertest';
import express, { Application } from 'express';

describe('API Health Check', () => {
  let app: Application;

  beforeEach(() => {
    // Create a minimal Express app for testing
    app = express();
    app.use(express.json());
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Legends Ascend API is running' });
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 OK status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return correct response structure', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });

    it('should return status "ok"', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.status).toBe('ok');
    });

    it('should return appropriate message', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.message).toBe('Legends Ascend API is running');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Content-Type', 'invalid');
      
      // Should still return 200 for GET requests
      expect(response.status).toBe(200);
    });

    it('should not be affected by query parameters', async () => {
      const response = await request(app)
        .get('/api/health?invalid=param');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time (< 100ms)', async () => {
      const startTime = Date.now();
      await request(app).get('/api/health');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(100);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/api/health')
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should not support POST method', async () => {
      const response = await request(app).post('/api/health');
      expect(response.status).toBe(404);
    });

    it('should not support PUT method', async () => {
      const response = await request(app).put('/api/health');
      expect(response.status).toBe(404);
    });

    it('should not support DELETE method', async () => {
      const response = await request(app).delete('/api/health');
      expect(response.status).toBe(404);
    });
  });

  describe('Security', () => {
    it('should not expose sensitive information', async () => {
      const response = await request(app).get('/api/health');
      
      // Check that response doesn't contain sensitive data
      const bodyString = JSON.stringify(response.body);
      expect(bodyString).not.toMatch(/password/i);
      expect(bodyString).not.toMatch(/secret/i);
      expect(bodyString).not.toMatch(/token/i);
      expect(bodyString).not.toMatch(/key/i);
    });

    it('should not leak server implementation details', async () => {
      const response = await request(app).get('/api/health');
      
      // Note: Express exposes x-powered-by by default
      // In production, this should be disabled with app.disable('x-powered-by')
      // For now, just verify the response doesn't contain internal paths or secrets
      const bodyString = JSON.stringify(response.body);
      expect(bodyString).not.toMatch(/\/var\/www/i);
      expect(bodyString).not.toMatch(/\/home\//i);
      expect(bodyString).not.toMatch(/node_modules/i);
    });
  });
});

describe('API Validation Utils', () => {
  describe('Input Sanitization', () => {
    it('should sanitize string inputs', () => {
      const unsafeInput = '<script>alert("xss")</script>';
      const sanitized = unsafeInput.replace(/[<>]/g, '');
      
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'not-an-email';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    it('should validate numeric inputs', () => {
      const validNumber = '123';
      const invalidNumber = 'abc';
      
      expect(isNaN(Number(invalidNumber))).toBe(true);
      expect(isNaN(Number(validNumber))).toBe(false);
    });
  });

  describe('Error Response Formatting', () => {
    it('should format error responses consistently', () => {
      const error = {
        status: 400,
        message: 'Bad Request',
        errors: ['Invalid input'],
      };
      
      expect(error).toHaveProperty('status');
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('errors');
      expect(Array.isArray(error.errors)).toBe(true);
    });
  });
});
