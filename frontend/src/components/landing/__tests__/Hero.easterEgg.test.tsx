import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero Component - Easter Egg Feature', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    // Reset window.location
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
  });

  describe('Logo Click Counter', () => {
    it('should increment click counter on logo click', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // First click
      fireEvent.click(logo);
      // Visual feedback should be applied (brightness-110 scale-105)
      expect(logo.className).toContain('brightness-110');
      expect(logo.className).toContain('scale-105');
    });

    it('should reset click counter after 3 seconds of inactivity', async () => {
      vi.useFakeTimers();
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // First click
      fireEvent.click(logo);
      expect(logo.className).toContain('brightness-110');

      // Wait more than 3 seconds
      vi.advanceTimersByTime(3001);

      // Second click should reset the counter
      fireEvent.click(logo);
      expect(logo.className).toContain('brightness-110');

      vi.useRealTimers();
    });

    it('should activate Easter egg on 5th consecutive click within 3 seconds', async () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Click 5 times quickly
      for (let i = 0; i < 5; i++) {
        fireEvent.click(logo);
      }

      // Easter egg should be activated
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });

    it('should not activate Easter egg if clicks are too slow', async () => {
      vi.useFakeTimers();
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Click 4 times within 3 seconds
      for (let i = 0; i < 4; i++) {
        fireEvent.click(logo);
        vi.advanceTimersByTime(700); // 700ms between clicks
      }

      // Wait more than 3 seconds before the 5th click
      vi.advanceTimersByTime(3001);

      // 5th click (but counter was reset)
      fireEvent.click(logo);

      // Easter egg should NOT be activated
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Create Account')).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('SessionStorage Persistence', () => {
    it('should save activation state to sessionStorage', async () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Click 5 times to activate
      for (let i = 0; i < 5; i++) {
        fireEvent.click(logo);
      }

      // Check sessionStorage
      await waitFor(() => {
        expect(sessionStorage.getItem('easterEggActivated')).toBe('true');
      });
    });

    it('should restore Easter egg state from sessionStorage on mount', () => {
      // Pre-set sessionStorage
      sessionStorage.setItem('easterEggActivated', 'true');

      render(<Hero />);

      // Easter egg should already be visible
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('should not show Easter egg if sessionStorage is not set', () => {
      render(<Hero />);

      // Easter egg should not be visible
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
    });
  });

  describe('Visual Feedback', () => {
    it('should apply glow effect when Easter egg is activated', async () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Click 5 times to activate
      for (let i = 0; i < 5; i++) {
        fireEvent.click(logo);
      }

      // Logo should have cyan glow effect
      await waitFor(() => {
        expect(logo.className).toContain('drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]');
      });
    });

    it('should apply brightness and scale on click', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      fireEvent.click(logo);

      expect(logo.className).toContain('brightness-110');
      expect(logo.className).toContain('scale-105');
    });

    it('should have cursor-pointer class to indicate clickability', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      expect(logo.className).toContain('cursor-pointer');
    });
  });

  describe('Login/Register Links Display', () => {
    beforeEach(() => {
      sessionStorage.setItem('easterEggActivated', 'true');
    });

    it('should render Sign In button when Easter egg is active', () => {
      render(<Hero />);
      const signInButton = screen.getByText('Sign In');

      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toHaveAttribute('aria-label', 'Sign in to your account');
    });

    it('should render Create Account button when Easter egg is active', () => {
      render(<Hero />);
      const createAccountButton = screen.getByText('Create Account');

      expect(createAccountButton).toBeInTheDocument();
      expect(createAccountButton).toHaveAttribute('aria-label', 'Create a new account');
    });

    it('should navigate to /login when Sign In is clicked', () => {
      render(<Hero />);
      const signInButton = screen.getByText('Sign In');

      fireEvent.click(signInButton);

      expect(window.location.href).toContain('/login');
    });

    it('should navigate to /register when Create Account is clicked', () => {
      render(<Hero />);
      const createAccountButton = screen.getByText('Create Account');

      fireEvent.click(createAccountButton);

      expect(window.location.href).toContain('/register');
    });

    it('should have proper styling for login/register buttons', () => {
      render(<Hero />);
      const signInButton = screen.getByText('Sign In');
      const createAccountButton = screen.getByText('Create Account');

      // Check for Tailwind classes
      expect(signInButton.className).toContain('bg-cyan-500');
      expect(signInButton.className).toContain('hover:bg-cyan-600');
      expect(createAccountButton.className).toContain('bg-purple-600');
      expect(createAccountButton.className).toContain('hover:bg-purple-700');
    });

    it('should have fade-in animation on Easter egg links', () => {
      render(<Hero />);
      const container = screen.getByText('Sign In').parentElement;

      expect(container?.className).toContain('animate-[fadeIn_0.6s_ease-in-out]');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should have tabIndex for keyboard navigation', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      expect(logo).toHaveAttribute('tabIndex', '0');
    });

    it('should trigger Easter egg on Enter key press', async () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Press Enter 5 times
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(logo, { key: 'Enter' });
      }

      // Easter egg should be activated
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });

    it('should not trigger on other key presses', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      // Press space key
      fireEvent.keyDown(logo, { key: ' ' });

      // Easter egg should not be activated
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('should have proper role and aria-label', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      expect(logo).toHaveAttribute('role', 'button');
      expect(logo).toHaveAttribute('aria-label', 'Legends Ascend logo (click 5 times for hidden menu)');
    });

    it('should have focus ring styles on login/register buttons', () => {
      sessionStorage.setItem('easterEggActivated', 'true');
      render(<Hero />);
      
      const signInButton = screen.getByText('Sign In');
      
      expect(signInButton.className).toContain('focus:outline-none');
      expect(signInButton.className).toContain('focus:ring-2');
    });
  });

  describe('Responsive Design', () => {
    it('should stack buttons vertically on mobile', () => {
      sessionStorage.setItem('easterEggActivated', 'true');
      render(<Hero />);
      
      const container = screen.getByText('Sign In').parentElement;
      
      // Should have flex-col for mobile, sm:flex-row for larger screens
      expect(container?.className).toContain('flex-col');
      expect(container?.className).toContain('sm:flex-row');
    });

    it('should have responsive gap between buttons', () => {
      sessionStorage.setItem('easterEggActivated', 'true');
      render(<Hero />);
      
      const container = screen.getByText('Sign In').parentElement;
      
      expect(container?.className).toContain('gap-4');
    });
  });

  describe('Integration with Existing Hero Features', () => {
    it('should not interfere with email signup form rendering', () => {
      render(<Hero />);

      // Email signup form should still be visible (check for submit button)
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should not interfere with headline rendering', () => {
      render(<Hero />);

      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toHaveTextContent('Forge Your Football Legacy');
    });

    it('should maintain logo alt text for accessibility', () => {
      render(<Hero />);

      const logo = screen.getByAltText('Legends Ascend');
      expect(logo).toBeInTheDocument();
    });

    it('should preserve existing logo responsive classes', () => {
      render(<Hero />);
      const logo = screen.getByRole('button', { name: /Legends Ascend logo/i });

      expect(logo.className).toContain('h-32');
      expect(logo.className).toContain('sm:h-40');
      expect(logo.className).toContain('md:h-56');
    });
  });
});
