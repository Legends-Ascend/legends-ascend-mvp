import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import type { User, UserRole } from '../models/User';
import { RESERVED_USERNAMES } from '../models/User';
import { subscribeToEmailList } from './emailOctopusService';

/**
 * Authentication Service
 * Following TECHNICAL_ARCHITECTURE.md - JWT authentication
 * Implements US-045 authentication requirements
 * Implements US-048 newsletter opt-in during registration
 * Implements US-051 admin account authentication
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
    username?: string | null;
    role: UserRole;
    created_at: Date;
  };
}

/**
 * Check if the input looks like an email (contains @)
 */
function isEmail(input: string): boolean {
  return input.includes('@');
}

/**
 * Register a new user
 * Hashes password using bcrypt before storing
 * Handles newsletter opt-in per US-048
 * Blocks reserved usernames per US-051
 */
export async function registerUser(
  email: string, 
  password: string, 
  newsletterOptIn: boolean = false
): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase();

  // Block reserved usernames/emails per US-051
  if (RESERVED_USERNAMES.some(u => normalizedEmail.includes(u))) {
    throw new Error('This email cannot be used for registration');
  }

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already in use');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Prepare newsletter consent timestamp
  const newsletterConsentTimestamp = newsletterOptIn ? new Date() : null;

  // Create user with newsletter preferences (default role is 'user')
  const result = await query(
    `INSERT INTO users (email, password_hash, newsletter_optin, newsletter_consent_timestamp, role) 
     VALUES ($1, $2, $3, $4, 'user') 
     RETURNING id, email, created_at, newsletter_optin, role`,
    [normalizedEmail, password_hash, newsletterOptIn, newsletterConsentTimestamp]
  );

  const user = result.rows[0];

  // Generate JWT token with role
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
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
      role: user.role,
      created_at: user.created_at,
    },
  };
}

/**
 * Login an existing user
 * Validates credentials and returns JWT token
 * Supports both email-based login (regular users) and username-based login (admin)
 */
export async function loginUser(emailOrUsername: string, password: string): Promise<AuthResponse> {
  const normalizedInput = emailOrUsername.toLowerCase();
  let result;

  // Check if input is email or username
  if (isEmail(normalizedInput)) {
    // Find user by email
    result = await query(
      'SELECT id, email, username, password_hash, role, created_at FROM users WHERE email = $1',
      [normalizedInput]
    );
  } else {
    // Find user by username (for admin login)
    result = await query(
      'SELECT id, email, username, password_hash, role, created_at FROM users WHERE username = $1',
      [normalizedInput]
    );
  }

  if (result.rows.length === 0) {
    // Don't reveal if user exists (prevent enumeration)
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token with role
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Log admin login attempts (structured logging per US-051)
  if (user.role === 'admin') {
    console.log(JSON.stringify({
      event: 'admin_login',
      username: '***', // Never log actual username for security
      success: true,
      timestamp: new Date().toISOString(),
    }));
  }

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    },
  };
}

/**
 * Verify JWT token and return user data
 * Now includes role in returned data
 */
export async function verifyAuthToken(token: string): Promise<{ id: string; email: string; username?: string | null; role: UserRole; created_at: Date }> {
  try {
    // Verify token
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; email: string; role?: UserRole };

    // Fetch user from database (always verify role from DB, not just token)
    const result = await query(
      'SELECT id, email, username, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
