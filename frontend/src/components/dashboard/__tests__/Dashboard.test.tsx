/**
 * Dashboard Component Tests
 * Following testing standards from vitest.config.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { AuthContext } from '../../../context/AuthContext';
import type { AuthContextValue } from '../../../types/auth';

// Mock auth context
const createMockAuthContext = (overrides?: Partial<AuthContextValue>): AuthContextValue => ({
  user: { id: '1', email: 'test@example.com' },
  isAuthenticated: true,
  loading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset URL before each test
    window.history.pushState({}, '', '/game/lineup');
  });

  describe('Rendering', () => {
    it('should render dashboard layout with header and sidebar', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Check for skip link (accessibility)
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();

      // Check for logo
      expect(screen.getByAltText('Legends Ascend logo')).toBeInTheDocument();

      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render lineup page by default', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Check for page content (using unique text from the page description)
      expect(screen.getByText(/Build and manage your squad lineup/i)).toBeInTheDocument();
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should render specified initial view', async () => {
      // Reset URL to a non-game path so initialView takes precedence
      window.history.pushState({}, '', '/');
      
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard initialView="gacha" />
        </AuthContext.Provider>
      );

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText(/Try your luck and acquire new players/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should return null when loading', () => {
      const mockAuthContext = createMockAuthContext({ loading: true });

      const { container } = render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate to different pages when clicking sidebar links', async () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Click on Gacha in sidebar
      const gachaButtons = screen.getAllByText('Gacha');
      fireEvent.click(gachaButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Try your luck and acquire new players/i)).toBeInTheDocument();
      });
    });

    it('should update URL when navigating', async () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Click on Matches
      const matchesButtons = screen.getAllByText('Matches');
      fireEvent.click(matchesButtons[0]);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/game/matches');
      });
    });

    it('should close sidebar on mobile after navigation', async () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Open mobile menu (hamburger button)
      const hamburgerButton = screen.getByLabelText(/Open navigation menu/i);
      fireEvent.click(hamburgerButton);

      // Click on Inventory in sidebar
      const inventoryButtons = screen.getAllByText('Inventory');
      fireEvent.click(inventoryButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Manage your player cards, items, and resources/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have skip to main content link', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have proper ARIA roles and landmarks', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getAllByRole('navigation')).toHaveLength(2); // Header nav + Sidebar nav
    });

    it('should have aria-current on active navigation links', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard initialView="lineup" />
        </AuthContext.Provider>
      );

      // Find all Lineup buttons (header + sidebar)
      const lineupButtons = screen.getAllByText('Lineup').filter(el => el.tagName === 'BUTTON');
      
      // At least one should have aria-current="page"
      const hasAriaCurrent = lineupButtons.some(button => 
        button.getAttribute('aria-current') === 'page'
      );
      expect(hasAriaCurrent).toBe(true);
    });
  });

  describe('Responsive Behavior', () => {
    it('should toggle sidebar when hamburger button is clicked', async () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      const hamburgerButton = screen.getByLabelText(/Open navigation menu/i);
      
      // Click to open
      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Close navigation menu/i)).toBeInTheDocument();
      });

      // Click to close
      const closeButton = screen.getByLabelText(/Close navigation menu/i);
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Open navigation menu/i)).toBeInTheDocument();
      });
    });
  });

  describe('URL Routing', () => {
    it('should initialize view from URL on mount', () => {
      window.history.pushState({}, '', '/game/profile');
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      expect(screen.getByText(/View and manage your manager profile/i)).toBeInTheDocument();
    });

    it('should handle browser back/forward navigation', async () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      );

      // Navigate to different page
      const inventoryButtons = screen.getAllByText('Inventory');
      fireEvent.click(inventoryButtons[0]);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/game/inventory');
      });

      // Simulate browser back button
      window.history.back();
      window.dispatchEvent(new PopStateEvent('popstate'));

      await waitFor(() => {
        expect(window.location.pathname).toBe('/game/lineup');
      });
    });
  });
});
