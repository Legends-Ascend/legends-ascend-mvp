import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import type { User } from '../models/User';
import { subscribeToEmailList } from './emailOctopusService';

/**
 * Authentication Service
 * Following TECHNICAL_ARCHITECTURE.md - JWT authentication
 * Implements US-045 authentication requirements
 * Implements US-048 newsletter opt-in during registration
 */

const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

/**
 * Get JWT secret from environment variable
 * Throws error if not set to enforce security
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return secret;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    created_at: Date;
  };
}

/**
 * Register a new user
 * Hashes password using bcrypt before storing
 * Handles newsletter opt-in per US-048
 */
export async function registerUser(
  email: string, 
  password: string, 
  newsletterOptIn: boolean = false
): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already in use');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Prepare newsletter consent timestamp
  const newsletterConsentTimestamp = newsletterOptIn ? new Date() : null;

  // Create user with newsletter preferences
  const result = await query(
    `INSERT INTO users (email, password_hash, newsletter_optin, newsletter_consent_timestamp) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, created_at, newsletter_optin`,
    [email.toLowerCase(), password_hash, newsletterOptIn, newsletterConsentTimestamp]
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Subscribe to newsletter asynchronously (non-blocking)
  const tags = newsletterOptIn ? ['registered', 'news'] : ['registered'];
  const consentTimestamp = (newsletterConsentTimestamp || new Date()).toISOString();
  
  // Fire and forget pattern - newsletter subscription should not block registration
  subscribeToEmailList(email, consentTimestamp, undefined, tags)
    .catch((error) => {
      // Log error but don't throw (non-blocking per FR-6)
      console.error('Newsletter subscription failed during registration:', {
        email,
        newsletterOptIn,
        tags,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // TODO: In production, send to error tracking service (e.g., Sentry) and/or retry queue
    });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
  };
}

/**
 * Login an existing user
 * Validates credentials and returns JWT token
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  // Find user by email
  const result = await query(
    'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
  };
}

/**
 * Verify JWT token and return user data
 */
export async function verifyAuthToken(token: string): Promise<{ id: string; email: string; created_at: Date }> {
  try {
    // Verify token
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; email: string };

    // Fetch user from database
    const result = await query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
