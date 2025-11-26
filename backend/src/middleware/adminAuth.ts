import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import type { UserRole } from '../models/User';

/**
 * Admin authentication middleware for US-051
 * Protects admin-only routes by verifying JWT token and admin role
 * Following TECHNICAL_ARCHITECTURE.md - Middleware patterns
 */

interface JwtPayload {
  userId: string;
  email: string;
  role?: UserRole;
}

export interface AdminAuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
    username?: string | null;
  };
}

/**
 * Get JWT secret from environment variable
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return secret;
}

/**
 * Middleware to require admin role
 * - Verifies JWT token is valid
 * - Verifies user role is 'admin' from database (not just token)
 * - Attaches user info to request
 * 
 * Returns:
 * - 401 Unauthorized if no token or invalid token
 * - 403 Forbidden if user is not admin
 */
export async function requireAdmin(req: AdminAuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  const token = authHeader.substring(7);

  try {
    // Verify token signature
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    // Always verify role from database, not just token (security requirement)
    const result = await query(
      'SELECT id, email, username, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      });
    }

    const user = result.rows[0];

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required',
        },
      });
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
}
