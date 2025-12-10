import { z } from 'zod';

/**
 * User Model
 * Following TECHNICAL_ARCHITECTURE.md - PascalCase for types
 * Implements US-045 authentication requirements
 * Implements US-051 admin account requirements
 */

// Role type for admin/user distinction
export type UserRole = 'user' | 'admin';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  username: z.string().nullable().optional(),
  role: z.enum(['user', 'admin']).default('user'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Reserved usernames that cannot be used for registration
export const RESERVED_USERNAMES = ['supersaiyan', 'admin', 'administrator', 'root'];

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  newsletterOptIn: z.boolean().optional().default(false),
}).refine(
  (data) => !RESERVED_USERNAMES.some(u => data.email.toLowerCase().includes(u)),
  { message: 'This email cannot be used for registration' }
);

export type CreateUser = z.infer<typeof CreateUserSchema>;

/**
 * Login schema - supports both email and username-based login
 * Admin users can log in with username 'supersaiyan'
 * Regular users log in with email
 */
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/;

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(
      (val) =>
        val.includes('@')
          ? z.string().email().safeParse(val).success
          : USERNAME_REGEX.test(val),
      { message: 'Invalid email or username format' }
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
