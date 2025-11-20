import { z } from 'zod';

/**
 * Frontend validation schema for email subscription
 * Matches backend schema for consistency
 */
export const SubscribeFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to receive emails',
  }),
});

export type SubscribeFormData = z.infer<typeof SubscribeFormSchema>;

export interface SubscribeResponse {
  success: boolean;
  message: string;
  status?: 'pending_confirmation' | 'already_subscribed' | 'error';
  debug?: {
    httpStatus?: number;
    emailOctopusResponse?: unknown;
    requestBodyPreview?: string;
    tagsApplied?: string[];
    updateExisting?: boolean;
    error?: string;
  };
}
