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

/**
 * Rate limiter for login endpoint
 * Prevent brute force attacks: max 5 login attempts per IP per 15 minutes
 * In test environment, allow more requests to avoid rate limiting tests
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 100 : 5, // Higher limit for tests
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Rate limiter for token verification endpoint
 * Prevent abuse: max 100 requests per IP per 15 minutes
 */
export const authVerifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for registration endpoint
 * Prevent abuse: max 3 registration attempts per IP per hour
 * In test environment, allow more requests to avoid rate limiting tests
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'test' ? 100 : 3, // Higher limit for tests
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many registration attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for admin endpoints
 * Prevent abuse of admin API: max 100 requests per IP per 15 minutes
 * Per US-051 requirements
 */
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many admin requests. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
