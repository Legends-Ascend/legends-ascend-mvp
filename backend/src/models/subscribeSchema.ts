import { z } from 'zod';

/**
 * Validation schema for email subscription requests
 * Per US-001 requirements: email, GDPR consent, and timestamp
 */
export const SubscribeRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent is required',
  }),
  timestamp: z.string().datetime(),
});

export type SubscribeRequest = z.infer<typeof SubscribeRequestSchema>;

/**
 * Response type for subscription API
 */
export interface SubscribeResponse {
  success: boolean;
  message: string;
  status?: 'pending_confirmation' | 'already_subscribed' | 'error';
}
