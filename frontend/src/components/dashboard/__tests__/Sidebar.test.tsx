/**
 * Sidebar Component Tests
 * Following testing standards from vitest.config.ts
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import type { GameView } from '../Dashboard';
import { AuthContext } from '../../../context/AuthContext';
import type { AuthContextValue } from '../../../types/auth';

// Mock auth context
const createMockAuthContext = (email = 'test@example.com'): AuthContextValue => ({
  user: { id: '1', email },
  isAuthenticated: true,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
});

describe('Sidebar', () => {
  const mockOnNavigate = vi.fn();
  const mockOnClose = vi.fn();

  describe('Rendering', () => {
    it('should render all navigation items', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Lineup')).toBeInTheDocument();
      expect(screen.getByText('Gacha')).toBeInTheDocument();
      expect(screen.getByText('Matches')).toBeInTheDocument();
      expect(screen.getByText('Inventory')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should display user email on mobile', () => {
      const mockAuthContext = createMockAuthContext('mobile@example.com');

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('mobile@example.com')).toBeInTheDocument();
    });

    it('should display Guest when user is null', () => {
      const mockAuthContext = createMockAuthContext();
      mockAuthContext.user = null;

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Guest')).toBeInTheDocument();
    });

    it('should render icons for each navigation item', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByLabelText('Lineup icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Gacha icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Matches icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Inventory icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Profile icon')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call onNavigate when navigation item is clicked', () => {
      const mockAuthContext = createMockAuthContext();
      const onNavigate = vi.fn();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={onNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      const gachaButton = screen.getByText('Gacha').closest('button');
      if (gachaButton) {
        fireEvent.click(gachaButton);
        expect(onNavigate).toHaveBeenCalledWith('gacha');
      }
    });

    it('should navigate to all different views', () => {
      const mockAuthContext = createMockAuthContext();
      const onNavigate = vi.fn();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={onNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      const views: Array<{ view: GameView; label: string }> = [
        { view: 'lineup', label: 'Lineup' },
        { view: 'gacha', label: 'Gacha' },
        { view: 'matches', label: 'Matches' },
        { view: 'inventory', label: 'Inventory' },
        { view: 'profile', label: 'Profile' },
      ];

      views.forEach(({ view, label }) => {
        const button = screen.getByText(label).closest('button');
        if (button) {
          fireEvent.click(button);
          expect(onNavigate).toHaveBeenCalledWith(view);
        }
      });

      expect(onNavigate).toHaveBeenCalledTimes(views.length);
    });
  });

  describe('Active State', () => {
    it('should highlight active navigation item', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="inventory"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      const inventoryButton = screen.getByText('Inventory').closest('button');
      expect(inventoryButton).toHaveAttribute('aria-current', 'page');
    });

    it('should only highlight one active item at a time', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="profile"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      const lineupButton = screen.getByText('Lineup').closest('button');
      const profileButton = screen.getByText('Profile').closest('button');

      expect(lineupButton).not.toHaveAttribute('aria-current', 'page');
      expect(profileButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByLabelText('Secondary navigation')).toBeInTheDocument();
    });

    it('should have aria-current on active navigation item', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="matches"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      const matchesButton = screen.getByText('Matches').closest('button');
      expect(matchesButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Overlay', () => {
    it('should call onClose when overlay is clicked', () => {
      const mockAuthContext = createMockAuthContext();
      const onClose = vi.fn();

      const { container } = render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={onClose}
          />
        </AuthContext.Provider>
      );

      // Find overlay by aria-hidden attribute
      const overlay = container.querySelector('[aria-hidden="true"]');
      if (overlay) {
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Mobile User Section', () => {
    it('should display logout button on mobile', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Sidebar
            currentView="lineup"
            onNavigate={mockOnNavigate}
            isOpen={true}
            onClose={mockOnClose}
          />
        </AuthContext.Provider>
      );

      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });
  });
});
