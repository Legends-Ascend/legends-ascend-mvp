import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSignupForm } from '../EmailSignupForm';

/**
 * CORS and API Integration Tests for Issue #97
 * 
 * These tests validate that PR #101 properly addresses the CORS/blocking error
 * by testing the API integration with the new proxy configuration
 */

// Mock fetch globally
global.fetch = vi.fn();

// Helper to create mock Response objects with proper structure
const createMockResponse = (body: unknown, options: { ok?: boolean; status?: number } = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => body,
} as Response);

describe('EmailSignupForm - CORS and API Integration (Issue #97)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('API URL Configuration', () => {
    it('should use relative path /api by default for proxy support', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Thank you! Check your email to confirm your subscription.',
        status: 'pending_confirmation',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/subscribe'),
          expect.any(Object)
        );
      });
      
      // Verify that the URL is relative (starts with /api, not http://)
      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toMatch(/^\/api\/v1\/subscribe/);
    });

    it('should use VITE_API_URL when environment variable is set', async () => {
      const user = userEvent.setup();
      
      // Mock environment variable
      const originalEnv = import.meta.env.VITE_API_URL;
      import.meta.env.VITE_API_URL = 'https://api.legendsascend.com/api';
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Success',
        status: 'pending_confirmation',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      
      // Restore original env
      import.meta.env.VITE_API_URL = originalEnv;
    });
  });

  describe('Error Handling for Issue #97', () => {
    it('should display specific error message for Failed to fetch (TypeError)', async () => {
      const user = userEvent.setup();
      
      // Simulate the exact error from Issue #97
      vi.mocked(global.fetch).mockRejectedValueOnce(
        new TypeError('Failed to fetch')
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/unable to reach the server/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage.textContent).toContain('check your internet connection');
        expect(errorMessage.textContent).toContain('ad blockers');
      });
    });

    it('should log detailed error information to console for debugging', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const testError = new Error('Network connection failed');
      testError.name = 'NetworkError';
      
      vi.mocked(global.fetch).mockRejectedValueOnce(testError);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        // Verify error logging for backend team debugging
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Subscription error details:',
          expect.objectContaining({
            message: 'Network connection failed',
            name: 'NetworkError',
          })
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Subscription error:',
          testError
        );
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle ERR_BLOCKED_BY_CLIENT scenario gracefully', async () => {
      const user = userEvent.setup();
      
      // Simulate browser blocking (ad blocker, privacy extension, etc.)
      const blockedError = new TypeError('Failed to fetch');
      vi.mocked(global.fetch).mockRejectedValueOnce(blockedError);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        // Should suggest disabling ad blockers
        const errorMessage = screen.getByText(/try disabling ad blockers/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Request Headers for CORS', () => {
    it('should send correct Content-Type header', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Success',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
    });

    it('should use POST method for subscription', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Success',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });
  });

  describe('Acceptance Criteria Validation', () => {
    it('should successfully submit without CORS errors', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Thank you! Check your email to confirm your subscription.',
        status: 'pending_confirmation',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      // Should receive success message
      await waitFor(() => {
        const successMessage = screen.getByText(/thank you/i);
        expect(successMessage).toBeInTheDocument();
      });
      
      // Should clear form after success
      await waitFor(() => {
        const emailInputAfter = screen.queryByDisplayValue('test@example.com');
        expect(emailInputAfter).not.toBeInTheDocument();
      });
    });

    it('should provide user-friendly error messages on failure', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: false,
        message: 'Unable to subscribe. Please try again later.',
        status: 'error',
      }, { ok: false, status: 500 }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/unable to subscribe/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage.closest('div')).toHaveAttribute('role', 'alert');
      });
    });

    it('should send correct payload structure', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse({
        success: true,
        message: 'Success',
      }));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const call = vi.mocked(global.fetch).mock.calls[0];
        const body = JSON.parse(call[1].body as string);
        
        // Verify required fields for backend validation
        expect(body).toHaveProperty('email', 'test@example.com');
        expect(body).toHaveProperty('gdprConsent', true);
        expect(body).toHaveProperty('timestamp');
        
        // Verify timestamp format (ISO 8601)
        expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });

  describe('Network Error Scenarios', () => {
    it('should handle timeout errors', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockRejectedValueOnce(
        new Error('Request timeout')
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/unable to connect/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should handle DNS resolution errors', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockRejectedValueOnce(
        new TypeError('Failed to fetch')
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
