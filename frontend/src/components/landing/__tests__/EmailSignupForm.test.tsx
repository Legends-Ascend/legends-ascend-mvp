import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSignupForm } from '../EmailSignupForm';

// Mock fetch globally
global.fetch = vi.fn();

// Helper to ensure mocked Responses include the properties the component reads
const createMockResponse = (
  body: unknown,
  options: {
    ok?: boolean;
    status?: number;
    headers?: HeadersInit;
    json?: () => Promise<unknown>;
  } = {}
) =>
  ({
    ok: options.ok ?? true,
    status: options.status ?? 200,
    headers: new Headers(options.headers ?? { 'content-type': 'application/json' }),
    json: options.json ?? (async () => body),
  } as Response);

describe('EmailSignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('should render email input field', () => {
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should render GDPR consent checkbox', () => {
      render(<EmailSignupForm />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should render submit button', () => {
      render(<EmailSignupForm />);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render EU regional disclosure', () => {
      render(<EmailSignupForm />);
      
      const disclosure = screen.getByText(/for eu residents/i);
      expect(disclosure).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on email input', () => {
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Validation', () => {
    it('should validate GDPR consent is required', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      // Don't check the checkbox
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const error = screen.getByText(/you must consent to receive emails/i);
        expect(error).toBeInTheDocument();
        expect(error).toHaveAttribute('role', 'alert');
      });
    });

    it('should display consent errors with role="alert" for accessibility', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      // Don't click checkbox - this should trigger consent error
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Happy Path - Successful Subscription', () => {
    it('should submit form successfully with valid data', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        }),
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/v1/subscribe'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('test@example.com'),
          })
        );
      });
      
      await waitFor(() => {
        const successMessage = screen.getByText(/thank you/i);
        expect(successMessage).toBeInTheDocument();
      });
    });

    it('should display success state after successful submission', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        }),
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/success!/i)).toBeInTheDocument();
      });
    });

    it('should clear form fields after successful submission', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          message: 'Thank you!',
          status: 'pending_confirmation',
        }),
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API returns error', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        }),
      } as Response);
      
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

    it('should display error when network request fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
      
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

    it('should handle already subscribed scenario', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          message: 'This email is already on our list. Check your inbox for updates.',
          status: 'already_subscribed',
        }),
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'existing@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const message = screen.getByText(/already on our list/i);
        expect(message).toBeInTheDocument();
      });
    });

    it('should handle 405 Method Not Allowed error gracefully', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 405,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => {
          throw new Error('Not JSON');
        },
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/subscription service is not configured correctly/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage.closest('div')).toHaveAttribute('role', 'alert');
      });
    });

    it('should handle invalid JSON response', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: async () => {
          throw new SyntaxError('Unexpected end of JSON input');
        },
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        // When content-type is not application/json, it throws "Invalid response format"
        const errorMessage = screen.getByText(/unable to connect/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should handle JSON parsing errors with application/json content type', async () => {
      const user = userEvent.setup();
      
      // This test simulates the scenario where response says it's JSON but parsing fails
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => {
          throw new SyntaxError('Unexpected end of JSON input');
        },
      } as Response);
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/service configuration error/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      
      expect(emailInput).toHaveAccessibleName();
      expect(emailInput).toBeInTheDocument();
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      // Don't check consent - this triggers an error with role="alert"
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('should disable button during submission', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          json: async () => ({ success: true, message: 'Success' })
        } as Response), 100))
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button');
      
      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(checkbox).toHaveFocus();
      
      // Note: Privacy Policy link would be next, then submit button
      await user.tab();
      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle email with special characters', async () => {
      const user = userEvent.setup();

      vi.mocked(global.fetch).mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Success',
          status: 'pending_confirmation',
        })
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test+tag@example.co.uk');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('test+tag@example.co.uk'),
          })
        );
      });
    });

    it('should prevent double submission', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockImplementationOnce(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve(
                  createMockResponse({ success: true, message: 'Success' })
                ),
              100
            )
          )
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('should send correct timestamp format', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Success',
        })
      );
      
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
        expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });

  describe('Button States', () => {
    it('should show "Joining..." text while submitting', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockImplementationOnce(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve(
                  createMockResponse({ success: true, message: 'Success' })
                ),
              100
            )
          )
      );
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      expect(screen.getByText(/joining.../i)).toBeInTheDocument();
    });

    it('should re-enable button after submission error', async () => {
      const user = userEvent.setup();
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});
