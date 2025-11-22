import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterSubscription } from '../NewsletterSubscription';

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

describe('NewsletterSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('Rendering with default props', () => {
    it('should render email input field', () => {
      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('should render GDPR consent checkbox', () => {
      render(<NewsletterSubscription />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should render submit button with default text', () => {
      render(<NewsletterSubscription />);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render EU regional disclosure', () => {
      render(<NewsletterSubscription />);
      
      const disclosure = screen.getByText(/for eu residents/i);
      expect(disclosure).toBeInTheDocument();
    });
  });

  describe('Custom props', () => {
    it('should render custom submit button text', () => {
      render(<NewsletterSubscription submitButtonText="Subscribe Now" />);
      
      const submitButton = screen.getByRole('button', { name: /subscribe now/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should apply custom className to form', () => {
      const { container } = render(<NewsletterSubscription className="custom-class" />);
      
      const form = container.querySelector('form');
      expect(form).toHaveClass('custom-class');
    });
  });

  describe('Form validation', () => {
    it('should validate GDPR consent is required', async () => {
      const user = userEvent.setup();
      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const error = screen.getByText(/you must consent to receive emails/i);
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe('Tag submission', () => {
    it('should send default "beta" tag when no tag prop provided', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/v1/subscribe'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('"tag":"beta"'),
          })
        );
      });
    });

    it('should send custom tag when tag prop is provided', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription tag="early-access" />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/v1/subscribe'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"tag":"early-access"'),
          })
        );
      });
    });

    it('should send newsletter tag for newsletter subscription', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription tag="newsletter" submitButtonText="Subscribe to Newsletter" />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'newsletter@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/v1/subscribe'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"tag":"newsletter"'),
          })
        );
      });
    });
  });

  describe('Success handling', () => {
    it('should display success message on successful subscription', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const successMessage = screen.getByText(/thank you! check your email/i);
        expect(successMessage).toBeInTheDocument();
      });
    });

    it('should call onSuccess callback with email on successful subscription', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      const onSuccess = vi.fn();
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Thank you! Check your email to confirm your subscription.',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription onSuccess={onSuccess} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should display custom success message when provided', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          message: 'Server message',
          status: 'pending_confirmation',
        })
      );

      render(<NewsletterSubscription successMessage="Custom success message!" />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const successMessage = screen.getByText(/custom success message!/i);
        expect(successMessage).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message on failed subscription', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse(
          {
            success: false,
            message: 'Subscription failed',
            status: 'error',
          },
          { ok: false, status: 500 }
        )
      );

      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/subscription failed/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should call onError callback on failed subscription', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      const onError = vi.fn();
      
      mockFetch.mockResolvedValueOnce(
        createMockResponse(
          {
            success: false,
            message: 'Subscription failed',
            status: 'error',
          },
          { ok: false, status: 500 }
        )
      );

      render(<NewsletterSubscription onError={onError} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Subscription failed');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on email input', () => {
      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('aria-required', 'true');
    });

    it('should mark submit button as busy during submission', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.mocked(fetch);
      
      // Make the promise never resolve to test loading state
      mockFetch.mockReturnValueOnce(new Promise(() => {}));

      render(<NewsletterSubscription />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).toHaveAttribute('aria-busy', 'true');
      });
    });
  });
});
