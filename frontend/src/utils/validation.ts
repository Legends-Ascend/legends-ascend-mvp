/**
 * Form validation utilities using Zod
 * Following TECHNICAL_ARCHITECTURE.md and US-045 requirements
 */

import { z } from 'zod';

/**
 * Login form validation schema
 * - Email: Valid email format (RFC 5322)
 * - Password: Required (validation on login is minimal, just ensure it's provided)
 */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 * - Email: Valid email format (RFC 5322)
 * - Password: Minimum 8 characters with uppercase, lowercase, and number
 * - Confirm Password: Must match password
 * - Newsletter Opt-In: Optional boolean for newsletter subscription (US-048)
 */
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  confirmPassword: z.string(),
  newsletterOptIn: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
