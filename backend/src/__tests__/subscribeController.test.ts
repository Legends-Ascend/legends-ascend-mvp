import { Request, Response } from 'express';
import { subscribeEmail } from '../controllers/subscribeController';
import * as emailOctopusService from '../services/emailOctopusService';

// Mock the emailOctopusService
jest.mock('../services/emailOctopusService');

describe('subscribeController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    
    req = {
      body: {},
    };
    
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('POST /api/v1/subscribe', () => {
    describe('Happy Path', () => {
      it('should successfully subscribe a valid email with GDPR consent', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'test@example.com',
          '2025-11-14T09:00:00.000Z',
          undefined,  // tag parameter is optional
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockResult);
      });

      it('should handle already subscribed email gracefully', async () => {
        // Arrange
        req.body = {
          email: 'existing@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        const mockResult = {
          success: true,
          message: 'This email is already on our list. Check your inbox for updates.',
          status: 'already_subscribed',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(409);
        expect(jsonMock).toHaveBeenCalledWith(mockResult);
      });
    });

    describe('Tag Parameter Tests', () => {
      it('should pass custom tag to EmailOctopus service when provided', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
          tag: 'newsletter',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'test@example.com',
          '2025-11-14T09:00:00.000Z',
          'newsletter',
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockResult);
      });

      it('should handle early-access tag', async () => {
        // Arrange
        req.body = {
          email: 'earlyuser@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
          tag: 'early-access',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'earlyuser@example.com',
          '2025-11-14T09:00:00.000Z',
          'early-access',
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
      });

      it('should handle tournament-alerts tag', async () => {
        // Arrange
        req.body = {
          email: 'tournament@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
          tag: 'tournament-alerts',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'tournament@example.com',
          '2025-11-14T09:00:00.000Z',
          'tournament-alerts',
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
      });

      it('should handle empty string tag', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
          tag: '',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'test@example.com',
          '2025-11-14T09:00:00.000Z',
          '',
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
      });
    });

    describe('Validation Errors', () => {
      it('should reject request with invalid email format', async () => {
        // Arrange
        req.body = {
          email: 'invalid-email',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
        expect(emailOctopusService.subscribeToEmailList).not.toHaveBeenCalled();
      });

      it('should reject request with missing email', async () => {
        // Arrange
        req.body = {
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
      });

      it('should reject request with missing GDPR consent', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: false,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
      });

      it('should reject request with missing timestamp', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
        };

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
      });

      it('should reject request with invalid timestamp format', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: 'not-a-valid-timestamp',
        };

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
      });
    });

    describe('Error Handling', () => {
      it('should handle EmailOctopus service failures', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        const mockResult = {
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(mockResult);
      });

      it('should handle unexpected errors gracefully', async () => {
        // Arrange
        req.body = {
          email: 'test@example.com',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockRejectedValue(
          new Error('Network error')
        );

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            message: 'Something went wrong. Please try again.',
            status: 'error',
          })
        );
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty request body', async () => {
        // Arrange
        req.body = {};

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            status: 'error',
          })
        );
      });

      it('should handle email with special characters', async () => {
        // Arrange
        req.body = {
          email: 'test+tag@example.co.uk',
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(emailOctopusService.subscribeToEmailList).toHaveBeenCalledWith(
          'test+tag@example.co.uk',
          '2025-11-14T09:00:00.000Z',
          undefined,  // tag parameter is optional
          undefined
        );
        expect(statusMock).toHaveBeenCalledWith(200);
      });

      it('should handle very long email addresses', async () => {
        // Arrange
        const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
        req.body = {
          email: longEmail,
          gdprConsent: true,
          timestamp: '2025-11-14T09:00:00.000Z',
        };

        const mockResult = {
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        };

        (emailOctopusService.subscribeToEmailList as jest.Mock).mockResolvedValue(mockResult);

        // Act
        await subscribeEmail(req as Request, res as Response);

        // Assert
        expect(statusMock).toHaveBeenCalledWith(200);
      });
    });
  });
});
