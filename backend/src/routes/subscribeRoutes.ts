import { Router } from 'express';
import { subscribeEmail } from '../controllers/subscribeController';
import { subscribeRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/v1/subscribe
 * Subscribe user to email list with GDPR compliance
 * Rate limited: 5 requests per IP per 5 minutes
 * 
 * Note: OPTIONS requests are automatically handled by the CORS middleware
 * configured in the main Express app (index.ts)
 */
router.post('/subscribe', subscribeRateLimiter, subscribeEmail);

export default router;
