import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for subscription endpoint
 * Per US-001 requirements: max 5 requests per IP per 5 minutes
 */
export const subscribeRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    status: 'error',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
