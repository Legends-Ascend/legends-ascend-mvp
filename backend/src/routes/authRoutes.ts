import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { loginRateLimiter, registerRateLimiter, authVerifyRateLimiter } from '../middleware/rateLimiter';

/**
 * Authentication Routes
 * Following TECHNICAL_ARCHITECTURE.md - REST API versioning /v1/...
 * Implements US-045 authentication endpoints
 * Includes rate limiting to prevent brute force attacks
 */

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user account
 * Rate limited: max 3 requests per IP per hour
 */
router.post('/auth/register', registerRateLimiter, register);

/**
 * POST /api/v1/auth/login
 * Login with email and password
 * Rate limited: max 5 requests per IP per 15 minutes
 */
router.post('/auth/login', loginRateLimiter, login);

/**
 * GET /api/v1/auth/me
 * Get current user from JWT token
 * Rate limited: max 100 requests per IP per 15 minutes
 */
router.get('/auth/me', authVerifyRateLimiter, me);

export default router;
