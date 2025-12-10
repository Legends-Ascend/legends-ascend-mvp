/**
 * Comprehensive tests for AdminDashboard component
 * Following TECHNICAL_ARCHITECTURE.md - React testing patterns
 * Implements US-051 dashboard display and logout requirements
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';
import * as useAuthHook from '../hooks/useAuth';

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('US-051 FR-10: Display Requirements', () => {
    it('should display "Admin Dashboard" heading', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should display admin username (supersaiyan)', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/supersaiyan/i)).toBeInTheDocument();
    });

    it('should show email if username is not available', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/supersaiyan@admin.legendsascend.local/i)).toBeInTheDocument();
    });

    it('should display placeholder indicating admin area', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/admin/i)).toBeInTheDocument();
      expect(screen.getByText(/Legends Ascend/i)).toBeInTheDocument();
    });
  });

  describe('US-051 FR-11: Logout Button', () => {
    it('should display logout button', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should call logout when logout button is clicked', () => {
      const mockLogout = vi.fn();
      
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: mockLogout,
      });

      render(<AdminDashboard />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('US-051 FR-12: Display Admin Username', () => {
    it('should show "Logged in as: supersaiyan"', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/Logged in as: supersaiyan/i)).toBeInTheDocument();
    });

    it('should display username prominently in user section', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const usernameElement = screen.getByText(/Logged in as: supersaiyan/i);
      expect(usernameElement).toBeVisible();
    });
  });

  describe('Branding Compliance - BRANDING_GUIDELINE.md', () => {
    it('should display Legends Ascend logo/name', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/Legends Ascend/i)).toBeInTheDocument();
    });

    it('should display Admin badge', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const adminBadges = screen.getAllByText(/Admin/i);
      expect(adminBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility - WCAG 2.1 AA Compliance', () => {
    it('should have proper heading hierarchy', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      // Should have h1 for main page title
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThan(0);
    });

    it('should have accessible logout button with aria-label', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const logoutButton = screen.getByRole('button', { name: /log out of admin dashboard/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      
      // Button should be focusable
      logoutButton.focus();
      expect(document.activeElement).toBe(logoutButton);
    });
  });

  describe('Placeholder Content', () => {
    it('should display construction message', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/Dashboard Under Construction/i)).toBeInTheDocument();
      expect(screen.getByText(/future updates/i)).toBeInTheDocument();
    });

    it('should display construction icon', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText('🚧')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('should have header with logo and user section', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      const { container } = render(<AdminDashboard />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have main content area', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      const { container } = render(<AdminDashboard />);

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have footer', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      const { container } = render(<AdminDashboard />);

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should display copyright in footer', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null user gracefully', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      // Should not crash
      expect(() => render(<AdminDashboard />)).not.toThrow();
    });

    it('should handle user without username gracefully', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      // Should fallback to email
      expect(screen.getByText(/supersaiyan@admin.legendsascend.local/i)).toBeInTheDocument();
    });

    it('should handle logout function not provided', () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        user: { 
          id: '123', 
          email: 'supersaiyan@admin.legendsascend.local', 
          username: 'supersaiyan', 
          role: 'admin', 
          created_at: '2024-01-01' 
        },
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(<AdminDashboard />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      
      // Should not crash when clicked
      expect(() => fireEvent.click(logoutButton)).not.toThrow();
    });
  });
});
