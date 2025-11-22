import { Router } from 'express';
import { register, login, me } from '../controllers/authController';

/**
 * Authentication Routes
 * Following TECHNICAL_ARCHITECTURE.md - REST API versioning /v1/...
 * Implements US-045 authentication endpoints
 */

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user account
 */
router.post('/auth/register', register);

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
router.post('/auth/login', login);

/**
 * GET /api/v1/auth/me
 * Get current user from JWT token
 */
router.get('/auth/me', me);

export default router;
