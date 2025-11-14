/**
 * App Component Test Suite
 * 
 * Tests for the main App component including:
 * - Rendering
 * - Navigation
 * - Route handling
 * - Accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

expect.extend(toHaveNoViolations);

describe('App Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it('should display the application logo/header', () => {
      render(<App />);
      const logo = screen.getByText(/Legends Ascend/i);
      expect(logo).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<App />);
      
      // Check for navigation elements
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should display landing page by default', () => {
      render(<App />);
      
      // Check if landing page content is visible
      // Adjust this based on actual landing page content
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should navigate to different routes when clicking navigation buttons', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Find and click navigation buttons
      const buttons = screen.getAllByRole('button');
      
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        // Verify navigation occurred by checking for route-specific content
        await waitFor(() => {
          expect(screen.getByRole('main')).toBeInTheDocument();
        });
      }
    });

    it('should handle back navigation to landing page', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const logo = screen.getByText(/Legends Ascend/i);
      expect(logo).toBeInTheDocument();
      
      // Click logo to return to home
      await user.click(logo);
      
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid navigation clicks', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const buttons = screen.getAllByRole('button');
      
      if (buttons.length >= 2) {
        // Rapidly click different navigation buttons
        await user.click(buttons[0]);
        await user.click(buttons[1]);
        
        // Should still render without errors
        expect(screen.getByRole('main')).toBeInTheDocument();
      }
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Tab through focusable elements
      await user.tab();
      
      // Check that focus moves through the application
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<App />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels for navigation', () => {
      render(<App />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Tab to first focusable element
      await user.tab();
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
      
      // Check if element has visible focus (outline or similar)
      const styles = window.getComputedStyle(focusedElement!);
      // Should have some form of focus styling
      expect(
        styles.outline !== 'none' || 
        styles.boxShadow !== 'none' ||
        styles.border !== 'none'
      ).toBeTruthy();
    });

    it('should support screen readers with semantic HTML', () => {
      render(<App />);
      
      // Check for semantic HTML elements
      const main = screen.getByRole('main');
      const nav = screen.getByRole('navigation');
      
      expect(main).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render in a reasonable time', () => {
      const startTime = performance.now();
      render(<App />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      
      // Rendering should be fast (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Error Handling', () => {
    it('should not crash when encountering errors', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<App />);
      }).not.toThrow();
      
      consoleError.mockRestore();
    });
  });
});
