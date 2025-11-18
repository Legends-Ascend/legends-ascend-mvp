import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware stub for US-044
 * In production, this would validate JWT tokens or session cookies
 * For now, it extracts user_id from x-user-id header for testing
 */
export interface AuthenticatedRequest extends Request {
  user_id?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get user_id from header (temporary stub)
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid user ID format',
      },
    });
  }

  // Attach user_id to request
  req.user_id = userId;
  next();
};
