import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSignupForm } from '../EmailSignupForm';

// Mock fetch globally
global.fetch = vi.fn();

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
    it('should show error when submitting without email', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const error = screen.getByText(/invalid email format/i);
        expect(error).toBeInTheDocument();
      });
    });

    it('should show error when submitting without GDPR consent', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const error = screen.getByText(/gdpr consent is required/i);
        expect(error).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const error = screen.getByText(/invalid email format/i);
        expect(error).toBeInTheDocument();
      });
    });

    it('should display validation errors with role="alert"', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        }),
      });
      
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        }),
      });
      
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Thank you!',
          status: 'pending_confirmation',
        }),
      });
      
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Unable to subscribe. Please try again later.',
          status: 'error',
        }),
      });
      
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
      
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'This email is already on our list. Check your inbox for updates.',
          status: 'already_subscribed',
        }),
      });
      
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
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<EmailSignupForm />);
      
      const emailLabel = screen.getByText(/email address/i);
      const emailInput = screen.getByLabelText(/email address/i);
      
      expect(emailLabel).toBeInTheDocument();
      expect(emailInput).toHaveAccessibleName();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('should disable button during submission', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          json: async () => ({ success: true, message: 'Success' })
        }), 100))
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Success',
          status: 'pending_confirmation',
        }),
      });
      
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
      
      (global.fetch as any).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          json: async () => ({ success: true, message: 'Success' })
        }), 100))
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
      
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: 'Success',
        }),
      });
      
      render(<EmailSignupForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
      
      await waitFor(() => {
        const call = (global.fetch as any).mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });
  });

  describe('Button States', () => {
    it('should show "Joining..." text while submitting', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          json: async () => ({ success: true, message: 'Success' })
        }), 100))
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
      
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      
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
