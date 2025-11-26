import { Request, Response } from 'express';
import { registerUser, loginUser, verifyAuthToken } from '../services/authService';
import { CreateUserSchema, LoginSchema } from '../models/User';

/**
 * Authentication Controller
 * Following TECHNICAL_ARCHITECTURE.md - REST API patterns
 * Implements US-045 FR-1 and FR-2 (Login and Registration)
 * Implements US-051 admin login support
 */

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export async function register(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = CreateUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email or password format',
          details: validation.error.issues,
        },
      });
    }

    const { email, password, newsletterOptIn } = validation.data;

    // Register user with newsletter preference
    const authResponse = await registerUser(email, password, newsletterOptIn);

    res.status(201).json({
      success: true,
      data: authResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.message === 'Email already in use') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_IN_USE',
          message: 'Email already in use',
        },
      });
    }

    // Handle reserved email/username rejection (US-051 AC-10)
    if (error instanceof Error && error.message === 'This email cannot be used for registration') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'This email cannot be used for registration',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}

/**
 * Login an existing user
 * POST /api/v1/auth/login
 * Supports both email-based login (regular users) and username-based login (admin)
 */
export async function login(req: Request, res: Response) {
  try {
    // Validate request body with LoginSchema (supports username or email)
    const validation = LoginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email/username or password format',
          details: validation.error.issues,
        },
      });
    }

    const { email, password } = validation.data;

    // Login user (email field can contain username for admin)
    const authResponse = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: authResponse,
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}

/**
 * Get current user from token
 * GET /api/v1/auth/me
 */
export async function me(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
        },
      });
    }

    const token = authHeader.substring(7);

    // Verify token and get user (includes role)
    const user = await verifyAuthToken(token);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);

    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
}
