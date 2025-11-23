import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

/**
 * Tests for Hero Component Contrast Improvements
 * Validates the semi-opaque overlay container implementation per Issue #[BUG|ENH]
 * Landing Page Text and Form Visibility: Improve Contrast, Add Opacity Overlay
 */
describe('Hero - Contrast and Visibility Improvements', () => {
  describe('Semi-Opaque Overlay Container', () => {
    it('should render content within a semi-opaque container', () => {
      const { container } = render(<Hero />);
      
      // Test for the overlay container by checking computed styles or structure
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer).toBeInTheDocument();
      expect(overlayContainer?.className).toContain('bg-dark-navy');
    });

    it('should apply backdrop blur to the container for improved readability', () => {
      const { container } = render(<Hero />);
      
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer?.className).toContain('backdrop-blur');
    });

    it('should have rounded corners on the overlay container', () => {
      const { container } = render(<Hero />);
      
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer?.className).toContain('rounded');
    });

    it('should apply shadow to the container for depth', () => {
      const { container } = render(<Hero />);
      
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer?.className).toContain('shadow');
    });

    it('should have a subtle border for definition', () => {
      const { container } = render(<Hero />);
      
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer?.className).toContain('border');
    });
  });

  describe('Content Padding and Spacing', () => {
    it('should have adequate padding on all screen sizes', () => {
      const { container } = render(<Hero />);
      
      // Check for responsive padding classes on the overlay container
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      
      // Check for padding classes (px-6, py-10, etc.)
      expect(overlayContainer?.className).toMatch(/p[xy]-\d+/);
    });
  });

  describe('Text Contrast and Drop Shadow', () => {
    it('should apply enhanced drop shadow to headline for better contrast', () => {
      render(<Hero />);
      
      const headline = screen.getByRole('heading', { name: /forge your football legacy/i });
      expect(headline.className).toContain('drop-shadow');
    });

    it('should apply enhanced drop shadow to subheadline', () => {
      render(<Hero />);
      
      const subheadline = screen.getByText(/experience the/i);
      expect(subheadline.className).toContain('drop-shadow');
    });

    it('should maintain white text color for maximum contrast against dark background', () => {
      render(<Hero />);
      
      const headline = screen.getByRole('heading', { name: /forge your football legacy/i });
      expect(headline.className).toContain('text-white');
      
      const subheadline = screen.getByText(/experience the/i);
      expect(subheadline.className).toContain('text-white');
    });
  });

  describe('Branding Compliance', () => {
    it('should use dark-navy color from branding guidelines (#0F172A)', () => {
      const { container } = render(<Hero />);
      
      // Container uses dark-navy (reference to branding color)
      const overlayContainer = container.querySelector('.text-center.max-w-4xl');
      expect(overlayContainer?.className).toContain('bg-dark-navy');
    });

    it('should maintain cyan-400 accent color for AI-powered text', () => {
      render(<Hero />);
      
      const aiPowered = screen.getByText('AI-powered');
      expect(aiPowered.className).toContain('text-cyan-400');
    });
  });

  describe('Accessibility', () => {
    it('should maintain all ARIA labels and roles', () => {
      render(<Hero />);
      
      // Logo should have proper ARIA label
      const logo = screen.getByRole('button', { name: /legends ascend logo/i });
      expect(logo).toBeInTheDocument();
      
      // Heading should be accessible
      const heading = screen.getByRole('heading', { name: /forge your football legacy/i });
      expect(heading).toBeInTheDocument();
    });

    it('should maintain keyboard navigation with tabIndex', () => {
      render(<Hero />);
      
      const logo = screen.getByRole('button', { name: /legends ascend logo/i });
      expect(logo).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Background Elements', () => {
    it('should render background image with proper alt text (empty for decorative)', () => {
      const { container } = render(<Hero />);
      
      // Find the background image by its class
      const backgroundImage = container.querySelector('img.absolute.inset-0');
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
      expect(backgroundImage).toHaveAttribute('alt', '');
    });

    it('should maintain gradient overlay for additional readability', () => {
      const { container } = render(<Hero />);
      
      // Check for gradient overlay div
      const gradientOverlay = container.querySelector('.bg-gradient-to-b');
      expect(gradientOverlay).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should render email signup form within the container', () => {
      render(<Hero />);
      
      // Form should be present
      const emailInput = screen.getByRole('textbox', { name: /email address/i });
      expect(emailInput).toBeInTheDocument();
      
      // Button should be present
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      expect(submitButton).toBeInTheDocument();
    });
  });
});
