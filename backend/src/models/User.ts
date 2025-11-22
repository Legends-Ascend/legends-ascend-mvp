import { z } from 'zod';

/**
 * User Model
 * Following TECHNICAL_ARCHITECTURE.md - PascalCase for types
 * Implements US-045 authentication requirements
 */

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
