import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmailSignupForm } from '../EmailSignupForm';
import { GdprConsentCheckbox } from '../GdprConsentCheckbox';

/**
 * Accessibility and Contrast Tests for Landing Page Form
 * Verifies WCAG 2.1 AA compliance for form elements
 */
describe('Form Contrast and Accessibility', () => {
  describe('EmailSignupForm Visual Accessibility', () => {
    it('should have visible form container with proper styling', () => {
      const { container } = render(<EmailSignupForm />);
      const form = container.querySelector('form');
      
      expect(form).toBeInTheDocument();
      expect(form?.className).toContain('bg-white/95');
      expect(form?.className).toContain('shadow-xl');
      expect(form?.className).toContain('border-2');
      expect(form?.className).toContain('border-dark-navy/10');
    });

    it('should have email input with enhanced border contrast', () => {
      render(<EmailSignupForm />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Verify enhanced border styling for better contrast
      expect(emailInput.className).toContain('border-2');
      expect(emailInput.className).toContain('border-dark-navy');
      expect(emailInput.className).toContain('bg-white');
    });

    it('should have explicit text color for input field', () => {
      render(<EmailSignupForm />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      expect(emailInput.className).toContain('text-dark-navy');
      expect(emailInput.className).toContain('placeholder:text-medium-gray');
    });

    it('should have proper focus indicator on email input', () => {
      render(<EmailSignupForm />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Verify focus ring styles meet WCAG requirements
      expect(emailInput.className).toContain('focus:ring-2');
      expect(emailInput.className).toContain('focus:ring-primary-blue');
      expect(emailInput.className).toContain('focus-visible:outline-2');
      expect(emailInput.className).toContain('focus-visible:outline-offset-2');
      expect(emailInput.className).toContain('focus-visible:outline-primary-blue');
    });

    it('should have accessible button with proper contrast', () => {
      render(<EmailSignupForm />);
      const button = screen.getByRole('button', { name: /join the waitlist/i });
      
      // Verify button has proper styling for contrast
      // Using inline style for bg color to ensure visibility
      expect(button).toHaveStyle({ backgroundColor: '#1E3A8A', color: '#FFFFFF' });
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('shadow-lg');
      expect(button.className).toContain('border-2');
    });

    it('should have accessible hover state for button', () => {
      render(<EmailSignupForm />);
      const button = screen.getByRole('button', { name: /join the waitlist/i });
      
      // Verify button has inline style and hover classes
      expect(button).toHaveStyle({ backgroundColor: '#1E3A8A' });
      expect(button.className).toContain('hover:shadow-xl');
      expect(button.className).toContain('font-bold');
    });

    it('should have proper focus indicator on button', () => {
      render(<EmailSignupForm />);
      const button = screen.getByRole('button', { name: /join the waitlist/i });
      
      expect(button.className).toContain('focus-visible:outline-2');
      expect(button.className).toContain('focus-visible:outline-offset-2');
      expect(button.className).toContain('focus-visible:outline-primary-blue');
    });
  });

  describe('GdprConsentCheckbox Visual Accessibility', () => {
    it('should have checkbox with enhanced border contrast', () => {
      const { container } = render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );
      
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox?.className).toContain('border-2');
      expect(checkbox?.className).toContain('border-dark-navy');
    });

    it('should have proper focus indicator on checkbox', () => {
      const { container } = render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );
      
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox?.className).toContain('focus:ring-2');
      expect(checkbox?.className).toContain('focus:ring-primary-blue');
      expect(checkbox?.className).toContain('focus-visible:outline-2');
    });

    it('should have accessible Privacy Policy link with proper contrast', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );
      
      const link = screen.getByRole('link', { name: /privacy policy/i });
      expect(link.className).toContain('text-primary-blue');
      expect(link.className).toContain('underline');
      expect(link.className).toContain('font-semibold');
    });

    it('should have accessible hover state for Privacy Policy link', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );
      
      const link = screen.getByRole('link', { name: /privacy policy/i });
      // Verify hover maintains good contrast (darker blue, not gold)
      expect(link.className).toContain('hover:text-primary-blue/80');
    });

    it('should have proper focus indicator on Privacy Policy link', () => {
      render(
        <GdprConsentCheckbox
          checked={false}
          onChange={() => {}}
        />
      );
      
      const link = screen.getByRole('link', { name: /privacy policy/i });
      expect(link.className).toContain('focus-visible:outline-2');
      expect(link.className).toContain('focus-visible:outline-offset-2');
      expect(link.className).toContain('focus-visible:outline-primary-blue');
    });
  });

  describe('Form Label Contrast', () => {
    it('should have high contrast labels', () => {
      const { container } = render(<EmailSignupForm />);
      const label = container.querySelector('label[for="email"]');
      
      expect(label?.className).toContain('text-dark-navy');
      expect(label?.className).toContain('font-medium');
    });

    it('should have visible required field indicator', () => {
      render(<EmailSignupForm />);
      const label = screen.getByText('Email Address');
      const requiredIndicator = label.parentElement?.querySelector('.text-error-red');
      
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent('*');
    });
  });
});
