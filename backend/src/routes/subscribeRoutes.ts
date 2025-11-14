import { Router } from 'express';
import { subscribeEmail } from '../controllers/subscribeController';
import { subscribeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/v1/subscribe
 * Subscribe user to email list with GDPR compliance
 * Rate limited: 5 requests per IP per 5 minutes
 */
router.post('/subscribe', subscribeRateLimiter, subscribeEmail);

export default router;
