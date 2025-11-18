import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouteGuard } from '../RouteGuard';
import { isLandingPageEnabled } from '../../utils/routing';

describe('RouteGuard', () => {
  const mockOnRedirect = vi.fn();

  beforeEach(() => {
    mockOnRedirect.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('isLandingPageEnabled', () => {
    it('should return true when VITE_LANDING_PAGE_ENABLED is "true"', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');
      expect(isLandingPageEnabled()).toBe(true);
    });

    it('should return true when VITE_LANDING_PAGE_ENABLED is boolean true', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', true);
      expect(isLandingPageEnabled()).toBe(true);
    });

    it('should return false when VITE_LANDING_PAGE_ENABLED is "false"', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'false');
      expect(isLandingPageEnabled()).toBe(false);
    });

    it('should return false when VITE_LANDING_PAGE_ENABLED is not set', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', undefined);
      expect(isLandingPageEnabled()).toBe(false);
    });

    it('should return false when VITE_LANDING_PAGE_ENABLED is an empty string', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', '');
      expect(isLandingPageEnabled()).toBe(false);
    });
  });

  describe('Route Protection', () => {
    it('should render children without redirecting when landing page is disabled', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'false');

      render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Test Content</div>
        </RouteGuard>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(mockOnRedirect).not.toHaveBeenCalled();
    });

    it('should render children without redirecting when user is authenticated', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={true}
        >
          <div>Test Content</div>
        </RouteGuard>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(mockOnRedirect).not.toHaveBeenCalled();
    });

    it('should render children without redirecting when on landing page', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="landing"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Landing Page</div>
        </RouteGuard>
      );

      expect(screen.getByText('Landing Page')).toBeInTheDocument();
      expect(mockOnRedirect).not.toHaveBeenCalled();
    });

    it('should render children without redirecting when on privacy page', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="privacy"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Privacy Policy</div>
        </RouteGuard>
      );

      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(mockOnRedirect).not.toHaveBeenCalled();
    });

    it('should redirect to landing when landing page is enabled and user tries to access protected route', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Players Page</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should redirect when accessing lineup route while unauthenticated and landing enabled', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="lineup"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Lineup Page</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should redirect when accessing simulator route while unauthenticated and landing enabled', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="simulator"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Simulator Page</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should redirect when accessing leaderboard route while unauthenticated and landing enabled', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="leaderboard"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Leaderboard Page</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should only check route protection once on mount', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      const { rerender } = render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Content</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });

      // Rerender with same props
      rerender(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Content Updated</div>
        </RouteGuard>
      );

      // Should not call redirect again
      expect(mockOnRedirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined isAuthenticated prop (defaults to false)', async () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
        >
          <div>Test Content</div>
        </RouteGuard>
      );

      await waitFor(() => {
        expect(mockOnRedirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should render children correctly even when redirecting', () => {
      vi.stubEnv('VITE_LANDING_PAGE_ENABLED', 'true');

      render(
        <RouteGuard
          currentView="players"
          onRedirectToLanding={mockOnRedirect}
          isAuthenticated={false}
        >
          <div>Test Content</div>
        </RouteGuard>
      );

      // Children should still render even if redirect is triggered
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});
