/**
 * Authentication service for API interactions
 * Following TECHNICAL_ARCHITECTURE.md - REST API patterns
 */

import type { User, LoginRequest, RegisterRequest, AuthResponse, AuthError } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Login user with email and password
 * Calls POST /api/v1/auth/login
 */
export async function loginUser(credentials: LoginRequest): Promise<{ token: string; user: User }> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData: AuthError = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
        },
      }));

      if (response.status === 401) {
        throw new Error('Invalid credentials');
      } else if (response.status === 500) {
        throw new Error('Something went wrong. Please try again later.');
      } else {
        throw new Error(errorData.error.message || 'Login failed');
      }
    }

    const data: AuthResponse = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to connect. Please check your internet connection.');
  }
}

/**
 * Register new user with email and password
 * Calls POST /api/v1/auth/register
 */
export async function registerUser(userData: RegisterRequest): Promise<{ token: string; user: User }> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData: AuthError = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
        },
      }));

      if (response.status === 409) {
        throw new Error('Email already in use');
      } else if (response.status === 500) {
        throw new Error('Something went wrong. Please try again later.');
      } else {
        throw new Error(errorData.error.message || 'Registration failed');
      }
    }

    const data: AuthResponse = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to connect. Please check your internet connection.');
  }
}

/**
 * Verify authentication token and fetch user data
 * Calls GET /api/v1/auth/me
 */
export async function verifyToken(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid or expired token');
    }

    const data = await response.json();
    return data.data.user;
  } catch {
    throw new Error('Invalid or expired token');
  }
}
