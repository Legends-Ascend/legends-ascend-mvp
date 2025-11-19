import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSignupForm } from '../EmailSignupForm';
import { GdprConsentCheckbox } from '../GdprConsentCheckbox';

/**
 * Consent Error Visibility Tests
 * Tests for UX improvement: Enhanced consent validation error message visibility
 * Ensures WCAG 2.1 AA compliance and brand guideline adherence
 */

// Mock fetch globally
global.fetch = vi.fn();

describe('Consent Error Visibility Enhancement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('Enhanced Error Message Display', () => {
    it('should display error message with error icon when consent is not provided', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/you must consent to receive emails/i);
        expect(errorMessage).toBeInTheDocument();
        
        // Check that error message has proper styling classes
        const errorContainer = errorMessage.closest('div');
        expect(errorContainer?.className).toContain('bg-error-red/15');
        expect(errorContainer?.className).toContain('border-l-4');
        expect(errorContainer?.className).toContain('border-error-red');
      });
    });

    it('should display warning icon (⚠️) alongside error message', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = screen.getByRole('alert');
        // Check for warning icon with aria-hidden
        const icon = errorContainer.querySelector('[aria-hidden="true"]');
        expect(icon).toBeInTheDocument();
        expect(icon?.textContent).toBe('⚠️');
      });
    });

    it('should display error message with increased font weight (font-semibold)', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/you must consent to receive emails/i);
        expect(errorMessage.className).toContain('font-semibold');
        expect(errorMessage.className).toContain('text-error-red');
      });
    });

    it('should use error-red color (#EF4444) for error message per branding guidelines', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/you must consent to receive emails/i);
        expect(errorMessage.className).toContain('text-error-red');
      });
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have role="alert" for error message', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        // Should have at least one alert for the consent error
        expect(alerts.length).toBeGreaterThan(0);
        
        // Find the consent error alert specifically
        const consentAlert = alerts.find(alert => 
          alert.textContent?.includes('You must consent to receive emails')
        );
        expect(consentAlert).toBeInTheDocument();
      });
    });

    it('should have aria-live="polite" for screen reader announcements', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = screen.getByRole('alert');
        expect(errorContainer).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should properly associate error with consent field via aria-describedby', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        const ariaDescribedBy = checkbox.getAttribute('aria-describedby');
        
        expect(ariaDescribedBy).toContain('gdpr-consent-error');
        expect(ariaDescribedBy).toContain('gdpr-consent-description');
      });
    });

    it('should set aria-invalid="true" on checkbox when error is present', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Visual Error State on Consent Field', () => {
    it('should add background highlight to consent field when in error state', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        const wrapper = checkbox.closest('div.p-3');
        
        expect(wrapper).toBeInTheDocument();
        expect(wrapper?.className).toContain('bg-error-red/10');
      });
    });

    it('should add border highlight to consent field when in error state', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        const wrapper = checkbox.closest('div.p-3');
        
        expect(wrapper?.className).toContain('border-2');
        expect(wrapper?.className).toContain('border-error-red');
      });
    });

    it('should change checkbox border color to error-red when in error state', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.className).toContain('border-error-red');
      });
    });

    it('should remove error state visuals when error is cleared', async () => {
      const user = userEvent.setup();
      render(<EmailSignupForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      // Submit without consent to trigger error
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      await user.click(submitButton);

      // Verify error is present
      await waitFor(() => {
        const errorMessage = screen.queryByText(/you must consent to receive emails/i);
        expect(errorMessage).toBeInTheDocument();
      });

      // Check consent to clear error
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Submit again - should succeed (assuming valid email)
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

      await user.click(submitButton);

      // Verify error is cleared
      await waitFor(() => {
        const errorMessage = screen.queryByText(/you must consent to receive emails/i);
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
  });

  describe('GdprConsentCheckbox Component Direct Tests', () => {
    it('should display enhanced error styling when error prop is provided', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
          error="You must consent to receive emails"
        />
      );

      const errorMessage = screen.getByText(/you must consent to receive emails/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.className).toContain('text-error-red');
      expect(errorMessage.className).toContain('font-semibold');

      // Check for error container styling
      const errorContainer = errorMessage.closest('div');
      expect(errorContainer?.className).toContain('bg-error-red/15');
      expect(errorContainer?.className).toContain('border-l-4');
    });

    it('should not display error styling when no error prop is provided', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('should display warning icon when error is present', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
          error="You must consent to receive emails"
        />
      );

      const errorContainer = screen.getByRole('alert');
      const icon = errorContainer.querySelector('[aria-hidden="true"]');
      expect(icon?.textContent).toBe('⚠️');
    });
  });
});
