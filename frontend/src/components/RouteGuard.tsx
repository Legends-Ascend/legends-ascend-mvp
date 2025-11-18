import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { isLandingPageEnabled } from '../utils/routing';

/**
 * RouteGuard Component
 * 
 * Provides routing protection to ensure landing page behavior is controlled
 * by the VITE_LANDING_PAGE_ENABLED environment variable.
 * 
 * Behavior:
 * - If VITE_LANDING_PAGE_ENABLED is 'true': Landing page loads first for unauthenticated users
 * - If VITE_LANDING_PAGE_ENABLED is 'false' or not set: Allows direct access to app routes
 * 
 * This prevents accidental route hijacking and maintains the landing page as
 * the default entry point when enabled.
 */

interface RouteGuardProps {
  children: ReactNode;
  currentView: string;
  onRedirectToLanding: () => void;
  isAuthenticated?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  currentView,
  onRedirectToLanding,
  isAuthenticated = false,
}) => {
  const [hasCheckedRoute, setHasCheckedRoute] = useState(false);

  useEffect(() => {
    // Only check once on mount
    if (hasCheckedRoute) {
      return;
    }

    const landingEnabled = isLandingPageEnabled();
    
    // If landing page is enabled and user is not authenticated
    // and trying to access a non-landing, non-privacy view, redirect to landing
    if (
      landingEnabled &&
      !isAuthenticated &&
      currentView !== 'landing' &&
      currentView !== 'privacy'
    ) {
      onRedirectToLanding();
    }

    setHasCheckedRoute(true);
  }, [hasCheckedRoute, currentView, isAuthenticated, onRedirectToLanding]);

  return <>{children}</>;
};
