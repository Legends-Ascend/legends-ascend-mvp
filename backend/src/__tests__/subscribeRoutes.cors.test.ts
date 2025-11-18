import request from 'supertest';
import express from 'express';
import cors from 'cors';
import subscribeRoutes from '../routes/subscribeRoutes';

/**
 * Integration tests for CORS and OPTIONS handling on subscription endpoint
 * These tests verify that the API properly handles CORS preflight requests
 */
describe('Subscription API - CORS and OPTIONS', () => {
  let app: express.Application;

  beforeEach(() => {
    // Create a minimal Express app with CORS middleware
    app = express();
    
    // Use the same CORS configuration as production
    const corsOptions = {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api/v1', subscribeRoutes);
  });

  describe('OPTIONS /api/v1/subscribe', () => {
    it('should respond to OPTIONS request with 200 status (CORS middleware)', async () => {
      const response = await request(app)
        .options('/api/v1/subscribe')
        .expect(200);

      // CORS middleware handles OPTIONS and returns 200
      expect(response.status).toBe(200);
    });

    it('should include CORS headers in OPTIONS response', async () => {
      const response = await request(app)
        .options('/api/v1/subscribe')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      // Verify CORS headers are present
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-methods']).toContain('OPTIONS');
    });

    it('should allow preflight request from allowed origin', async () => {
      const response = await request(app)
        .options('/api/v1/subscribe')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should handle OPTIONS request without origin header', async () => {
      const response = await request(app)
        .options('/api/v1/subscribe')
        .expect(200);

      // Should still respond successfully (CORS middleware handles it)
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/subscribe - CORS headers', () => {
    it('should include CORS headers in POST response', async () => {
      const response = await request(app)
        .post('/api/v1/subscribe')
        .set('Origin', 'http://localhost:5173')
        .send({
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: new Date().toISOString(),
        });

      // Verify CORS headers are present (regardless of response status)
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
  });

  describe('Method restrictions', () => {
    it('should reject GET requests to /subscribe endpoint', async () => {
      const response = await request(app)
        .get('/api/v1/subscribe');

      // Express returns 404 for undefined routes
      expect(response.status).toBe(404);
    });

    it('should reject PUT requests to /subscribe endpoint', async () => {
      const response = await request(app)
        .put('/api/v1/subscribe')
        .send({});

      expect(response.status).toBe(404);
    });

    it('should reject DELETE requests to /subscribe endpoint', async () => {
      const response = await request(app)
        .delete('/api/v1/subscribe');

      expect(response.status).toBe(404);
    });

    it('should only allow POST and OPTIONS methods', async () => {
      // OPTIONS should work (handled by CORS middleware)
      await request(app)
        .options('/api/v1/subscribe')
        .expect(200);

      // POST should work (even if it fails validation, it should not be 404/405)
      const postResponse = await request(app)
        .post('/api/v1/subscribe')
        .send({});

      // Should be 400 (validation error) or 429 (rate limit), not 404/405
      expect(postResponse.status).not.toBe(404);
      expect(postResponse.status).not.toBe(405);
    });
  });
});
