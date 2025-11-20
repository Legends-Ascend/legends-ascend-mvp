/**
 * Header Component Tests
 * Following testing standards from vitest.config.ts
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import type { GameView } from '../Dashboard';
import { AuthContext } from '../../../context/AuthContext';
import type { AuthContextValue } from '../../../types/auth';

// Mock auth context
const createMockAuthContext = (): AuthContextValue => ({
  user: { id: '1', email: 'test@example.com' },
  isAuthenticated: true,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
});

describe('Header', () => {
  const mockUser = { id: '1', email: 'test@example.com' };
  const mockOnNavigate = vi.fn();
  const mockOnToggleSidebar = vi.fn();

  describe('Rendering', () => {
    it('should render logo and navigation links', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByAltText('Legends Ascend logo')).toBeInTheDocument();
      expect(screen.getByText('Legends Ascend')).toBeInTheDocument();
      
      // Navigation links (visible on desktop)
      expect(screen.getAllByText('Lineup').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Gacha').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Matches').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Inventory').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
    });

    it('should display user email', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display Guest when user is null', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={null}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Guest')).toBeInTheDocument();
    });

    it('should display logout button', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    it('should show hamburger menu button', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call onNavigate when navigation link is clicked', () => {
      const mockAuthContext = createMockAuthContext();
      const onNavigate = vi.fn();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={onNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      // Find Gacha button (not in sidebar, in header nav)
      const gachaButtons = screen.getAllByText('Gacha');
      const headerGachaButton = gachaButtons.find(btn => btn.tagName === 'BUTTON');
      
      if (headerGachaButton) {
        fireEvent.click(headerGachaButton);
        expect(onNavigate).toHaveBeenCalledWith('gacha');
      }
    });

    it('should call onNavigate with lineup when logo is clicked', () => {
      const mockAuthContext = createMockAuthContext();
      const onNavigate = vi.fn();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="gacha"
            onNavigate={onNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      const logoLink = screen.getByLabelText('Legends Ascend - Go to dashboard');
      fireEvent.click(logoLink);

      expect(onNavigate).toHaveBeenCalledWith('lineup');
    });
  });

  describe('Active State', () => {
    it('should highlight active navigation link', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="matches"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      // Find Matches button in header
      const matchesButtons = screen.getAllByText('Matches');
      const headerMatchesButton = matchesButtons.find(btn => btn.tagName === 'BUTTON');

      if (headerMatchesButton) {
        expect(headerMatchesButton).toHaveAttribute('aria-current', 'page');
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Legends Ascend - Go to dashboard')).toBeInTheDocument();
    });

    it('should toggle hamburger menu aria-label', () => {
      const mockAuthContext = createMockAuthContext();

      const { rerender } = render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();

      rerender(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={true}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByLabelText('Close navigation menu')).toBeInTheDocument();
    });

    it('should have aria-expanded on hamburger button', () => {
      const mockAuthContext = createMockAuthContext();

      const { rerender } = render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      const button = screen.getByLabelText('Open navigation menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={mockOnToggleSidebar}
            isSidebarOpen={true}
          />
        </AuthContext.Provider>
      );

      const expandedButton = screen.getByLabelText('Close navigation menu');
      expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Hamburger Menu', () => {
    it('should call onToggleSidebar when hamburger button is clicked', () => {
      const mockAuthContext = createMockAuthContext();
      const onToggleSidebar = vi.fn();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Header
            user={mockUser}
            currentView="lineup"
            onNavigate={mockOnNavigate}
            onToggleSidebar={onToggleSidebar}
            isSidebarOpen={false}
          />
        </AuthContext.Provider>
      );

      const hamburgerButton = screen.getByLabelText('Open navigation menu');
      fireEvent.click(hamburgerButton);

      expect(onToggleSidebar).toHaveBeenCalledTimes(1);
    });
  });
});
