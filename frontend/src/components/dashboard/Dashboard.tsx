/**
 * Main Dashboard Layout Component
 * Following TECHNICAL_ARCHITECTURE.md - React 18+ patterns
 * Implements US-046 FR-1: Main Dashboard Layout
 * WCAG 2.1 AA compliant per ACCESSIBILITY_REQUIREMENTS.md
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LineupPage } from '../../pages/LineupPage';
import { GachaPage } from '../../pages/GachaPage';
import { MatchesPage } from '../../pages/MatchesPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { ProfilePage } from '../../pages/ProfilePage';

export type GameView = 'lineup' | 'gacha' | 'matches' | 'inventory' | 'profile';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FAFAFA;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  margin-top: 64px; /* Header height */
`;

const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  margin-left: 0;
  transition: margin-left 0.3s ease;
  
  @media (min-width: 768px) {
    margin-left: 240px; /* Sidebar width */
  }
`;

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: #1E3A8A;
  color: #FFFFFF;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 600;
  z-index: 1000;

  &:focus {
    top: 8px;
    outline: 2px solid #F59E0B;
    outline-offset: 2px;
  }
`;

interface DashboardProps {
  initialView?: GameView;
}

export function Dashboard({ initialView = 'lineup' }: DashboardProps) {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<GameView>(initialView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update URL when view changes
  const navigateTo = useCallback((view: GameView) => {
    setCurrentView(view);
    window.history.pushState({}, '', `/game/${view}`);
    // Close mobile menu after navigation
    setIsSidebarOpen(false);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/\/game\/(\w+)/);
      if (match && match[1]) {
        const view = match[1] as GameView;
        if (['lineup', 'gacha', 'matches', 'inventory', 'profile'].includes(view)) {
          setCurrentView(view);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize view from URL on mount (only if no initialView was provided as a specific override)
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/game\/(\w+)/);
    if (match && match[1]) {
      const view = match[1] as GameView;
      if (['lineup', 'gacha', 'matches', 'inventory', 'profile'].includes(view)) {
        setCurrentView(view);
        return; // Use URL view
      }
    }
    // If no valid URL path, update URL to match initialView
    window.history.replaceState({}, '', `/game/${initialView}`);
  }, []); // Only run on mount

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const renderPage = () => {
    switch (currentView) {
      case 'lineup':
        return <LineupPage />;
      case 'gacha':
        return <GachaPage />;
      case 'matches':
        return <MatchesPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <LineupPage />;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <DashboardContainer>
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      <Header
        user={user}
        currentView={currentView}
        onNavigate={navigateTo}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <MainLayout>
        <Sidebar
          currentView={currentView}
          onNavigate={navigateTo}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <MainContent id="main-content" role="main">
          {renderPage()}
        </MainContent>
      </MainLayout>
    </DashboardContainer>
  );
}
