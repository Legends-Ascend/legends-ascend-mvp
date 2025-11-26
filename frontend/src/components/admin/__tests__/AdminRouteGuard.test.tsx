/**
 * Tests for AdminRouteGuard component
 * Following TECHNICAL_ARCHITECTURE.md - React testing patterns
 * Implements US-051 route protection verification
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminRouteGuard } from '../AdminRouteGuard';
import * as useAuthHook from '../../../hooks/useAuth';

// Mock useAuth hook
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock window.location
const originalLocation = window.location;

describe('AdminRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location mock
    delete (window as any).location;
    window.location = { 
      ...originalLocation, 
      href: '',
      pathname: '/admin',
    } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('shows loading spinner when auth is loading', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to login page', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    // Should redirect to login
    expect(window.location.href).toBe('/login');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('shows access denied for non-admin authenticated users', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: '123', email: 'user@example.com', role: 'user', created_at: '2024-01-01' },
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    // Should show access denied message
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/don't have permission/i)).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders children for admin users', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: '123', email: 'supersaiyan@admin.legendsascend.local', username: 'supersaiyan', role: 'admin', created_at: '2024-01-01' },
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    // Should render admin content
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  it('has Return to Game button for non-admin users', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: { id: '123', email: 'user@example.com', role: 'user', created_at: '2024-01-01' },
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    const backButton = screen.getByRole('button', { name: /return to game/i });
    expect(backButton).toBeInTheDocument();
  });

  it('stores admin redirect path in sessionStorage for unauthenticated users', () => {
    vi.mocked(useAuthHook.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const sessionStorageSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <AdminRouteGuard>
        <div>Admin Content</div>
      </AdminRouteGuard>
    );

    expect(sessionStorageSpy).toHaveBeenCalledWith('adminRedirect', '/admin');
    sessionStorageSpy.mockRestore();
  });
});
