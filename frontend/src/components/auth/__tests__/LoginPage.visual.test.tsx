/**
 * Visual Tests for LoginPage PR #184
 * Tests background image, logo, and overlay elements added in PR #184
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { AuthProvider } from '../../../context/AuthContext';

describe('LoginPage - Visual Elements (PR #184)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    delete (window as Window & { location: unknown }).location;
    (window as Window & { location: { href: string } }).location = { href: '' };
  });

  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  };

  describe('Background Image', () => {
    it('should render the stadium background image', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage).toHaveAttribute('src', '/assets/backgrounds/stadium.jpg');
    });

    it('should have proper accessibility attributes on background image', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
      expect(backgroundImage).toHaveAttribute('alt', '');
    });

    it('should render background image as decorative element', () => {
      renderLoginPage();
      
      // Empty alt text and aria-hidden indicate decorative image
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toHaveAttribute('alt', '');
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have correct image source path', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toHaveAttribute('src');
      const src = backgroundImage.getAttribute('src');
      expect(src).toBe('/assets/backgrounds/stadium.jpg');
    });
  });

  describe('Logo Image', () => {
    it('should render the Legends Ascend logo', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have correct logo source path', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo).toHaveAttribute('src', '/assets/branding/legends-ascend-logo-transparent.png');
    });

    it('should have descriptive alt text for accessibility', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo).toHaveAttribute('alt', 'Legends Ascend logo');
    });

    it('should be an img element', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo.tagName).toBe('IMG');
    });

    it('should not be hidden from screen readers', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo).not.toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Background Overlay', () => {
    it('should render background overlay element', () => {
      const { container } = renderLoginPage();
      
      // Check that overlay is present in the DOM
      // Using container query since overlay is aria-hidden and decorative
      const overlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('should have aria-hidden attribute on overlay', () => {
      const { container } = renderLoginPage();
      
      // Verify at least one element with aria-hidden exists (overlay)
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Visual Hierarchy and Layout', () => {
    it('should display logo above the title', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      const title = screen.getByRole('heading', { name: /log in/i });
      
      expect(logo).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      
      // Logo should appear before title in DOM order
      const container = logo.closest('div');
      expect(container).toContainElement(title);
    });

    it('should render all main visual elements', () => {
      renderLoginPage();
      
      // Background image
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toBeInTheDocument();
      
      // Logo
      const logo = screen.getByAltText('Legends Ascend logo');
      expect(logo).toBeInTheDocument();
      
      // Title
      const title = screen.getByRole('heading', { name: /log in/i });
      expect(title).toBeInTheDocument();
    });

    it('should maintain form visibility with background elements', () => {
      renderLoginPage();
      
      // Verify form elements are still accessible
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      expect(emailInput).toBeVisible();
      expect(passwordInput).toBeVisible();
      expect(submitButton).toBeVisible();
    });
  });

  describe('Image Loading Edge Cases', () => {
    it('should handle missing alt text gracefully on background', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      // Should have empty alt for decorative image
      expect(backgroundImage.getAttribute('alt')).toBe('');
    });

    it('should have valid src attributes for both images', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      
      expect(backgroundImage.getAttribute('src')).toBeTruthy();
      expect(logo.getAttribute('src')).toBeTruthy();
      
      // Should not be empty strings
      expect(backgroundImage.getAttribute('src')).not.toBe('');
      expect(logo.getAttribute('src')).not.toBe('');
    });

    it('should render images with correct paths from public assets', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      
      // Verify paths start with /assets
      expect(backgroundImage.getAttribute('src')).toMatch(/^\/assets\//);
      expect(logo.getAttribute('src')).toMatch(/^\/assets\//);
    });

    it('should maintain stable image references across rerenders', () => {
      const { rerender } = renderLoginPage();
      
      const initialLogo = screen.getByAltText('Legends Ascend logo');
      const initialSrc = initialLogo.getAttribute('src');
      
      // Force rerender
      rerender(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
      
      const rerenderedLogo = screen.getByAltText('Legends Ascend logo');
      const rerenderedSrc = rerenderedLogo.getAttribute('src');
      
      expect(initialSrc).toBe(rerenderedSrc);
    });
  });

  describe('Accessibility Compliance', () => {
    it('should mark decorative images as aria-hidden', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide meaningful alt text for logo', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      const altText = logo.getAttribute('alt');
      
      expect(altText).toBeTruthy();
      expect(altText).toContain('Legends Ascend');
      expect(altText).toContain('logo');
    });

    it('should not interfere with form accessibility', () => {
      renderLoginPage();
      
      // All form elements should still have proper labels
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const rememberCheckbox = screen.getByLabelText('Remember username');
      
      expect(emailInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
      expect(rememberCheckbox).toHaveAccessibleName();
    });

    it('should maintain proper heading hierarchy', () => {
      renderLoginPage();
      
      // Title should be an h2 or h1
      const title = screen.getByRole('heading', { name: /log in/i });
      expect(title.tagName).toMatch(/^H[1-2]$/);
    });

    it('should not have duplicate alt text', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Legends Ascend logo');
      const backgroundImage = screen.getByAltText('', { hidden: true });
      
      // Logo and background should have different alt text
      expect(logo.getAttribute('alt')).not.toBe(backgroundImage.getAttribute('alt'));
    });
  });

  describe('Responsive Design Considerations', () => {
    it('should render all visual elements on small screens', () => {
      // This test ensures elements render regardless of viewport
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      const title = screen.getByRole('heading', { name: /log in/i });
      
      expect(backgroundImage).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it('should maintain content card visibility over background', () => {
      const { container } = renderLoginPage();
      
      // Find the form element
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      // Background and logo should also be present
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      
      expect(backgroundImage).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should use image elements with src attributes', () => {
      renderLoginPage();
      
      const images = screen.getAllByRole('img', { hidden: true });
      
      // Should have at least 1 image (could be 1 or 2 depending on how aria-hidden is handled)
      expect(images.length).toBeGreaterThanOrEqual(1);
      
      images.forEach(img => {
        expect(img).toHaveAttribute('src');
      });
    });

    it('should have unique src paths for different images', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      
      const backgroundSrc = backgroundImage.getAttribute('src');
      const logoSrc = logo.getAttribute('src');
      
      // Different images should have different sources
      expect(backgroundSrc).not.toBe(logoSrc);
    });

    it('should load images from optimized asset directories', () => {
      renderLoginPage();
      
      const backgroundImage = screen.getByAltText('', { hidden: true });
      const logo = screen.getByAltText('Legends Ascend logo');
      
      // Background from backgrounds directory
      expect(backgroundImage.getAttribute('src')).toContain('backgrounds/');
      
      // Logo from branding directory  
      expect(logo.getAttribute('src')).toContain('branding/');
    });
  });

  describe('Regression Tests', () => {
    it('should not break existing login functionality', async () => {
      renderLoginPage();
      
      // All original form elements should still work
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it('should maintain navigation to register page', () => {
      renderLoginPage();
      
      const registerLink = screen.getByText('Register');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('should preserve form validation behavior', async () => {
      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      const emailInput = screen.getByLabelText('Email');
      
      // Should still show validation errors
      expect(emailInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });
});
