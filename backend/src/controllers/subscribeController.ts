import { Request, Response } from 'express';
import { SubscribeRequestSchema } from '../models/subscribeSchema';
import { subscribeToEmailList } from '../services/emailOctopusService';

/**
 * Handle email subscription requests
 * POST /api/v1/subscribe
 * Per US-001 requirements
 */
export const subscribeEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    const validationResult = SubscribeRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message);
      res.status(400).json({
        success: false,
        message: errors.join('. '),
        status: 'error',
      });
      return;
    }

    const { email, timestamp } = validationResult.data;

    // Call EmailOctopus service
    const result = await subscribeToEmailList(email, timestamp);

    // Map service status to HTTP response codes per FR-3
    const statusCodeMap: Record<string, number> = {
      pending_confirmation: 200,
      already_subscribed: 409,
      error: 500,
    };

    const statusCode = statusCodeMap[result.status] ?? (result.success ? 200 : 500);
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      status: 'error',
    });
  }
};
