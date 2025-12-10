/**
 * Admin Route Guard Component
 * Following TECHNICAL_ARCHITECTURE.md - React 18+ patterns
 * Implements US-051 FR-13, FR-14, FR-15, FR-16 (frontend route protection)
 */

import { useAuth } from '../../hooks/useAuth';
import styled from 'styled-components';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  font-family: 'Inter', 'Poppins', sans-serif;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #E2E8F0;
  border-top-color: #1E3A8A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AccessDeniedContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  font-family: 'Inter', 'Poppins', sans-serif;
  padding: 20px;
`;

const AccessDeniedIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const AccessDeniedTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
`;

const AccessDeniedMessage = styled.p`
  font-size: 1rem;
  color: #64748B;
  margin: 0 0 24px 0;
  text-align: center;
  max-width: 400px;
`;

const BackButton = styled.button`
  background: #1E3A8A;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1e40af;
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }
`;

/**
 * AdminRouteGuard protects admin-only routes
 * 
 * Behavior per US-051:
 * - Unauthenticated users: Redirected to login page
 * - Non-admin users: Shown access denied message (403)
 * - Admin users: Allowed to view content
 */
export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <LoadingContainer role="status" aria-label="Loading">
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // Redirect unauthenticated users to login (US-051 FR-15)
  if (!isAuthenticated) {
    // Store the intended destination for post-login redirect
    sessionStorage.setItem('adminRedirect', window.location.pathname);
    window.location.href = '/login';
    return null;
  }

  // Show access denied for non-admin users (US-051 FR-14)
  if (!isAdmin) {
    const handleGoBack = () => {
      window.location.href = '/game/lineup';
    };

    return (
      <AccessDeniedContainer role="alert">
        <AccessDeniedIcon>🔒</AccessDeniedIcon>
        <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
        <AccessDeniedMessage>
          You don't have permission to access the admin area. 
          This page is restricted to administrators only.
        </AccessDeniedMessage>
        <BackButton onClick={handleGoBack}>
          Return to Game
        </BackButton>
      </AccessDeniedContainer>
    );
  }

  // Allow admin users to access content
  return <>{children}</>;
}
