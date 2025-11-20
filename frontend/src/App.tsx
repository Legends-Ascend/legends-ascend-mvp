import { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import styled from 'styled-components';
import { PlayerRoster } from './components/PlayerRoster/PlayerRoster';
import { TeamLineup } from './components/TeamLineup/TeamLineup';
import { MatchSimulator } from './components/MatchSimulator/MatchSimulator';
import { Leaderboard } from './components/Leaderboard/Leaderboard';
import { RouteGuard } from './components/RouteGuard';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { LogoutButton } from './components/auth/LogoutButton';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './components/dashboard/Dashboard';
import type { GameView } from './components/dashboard/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  color: #667eea;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid #E2E8F0;
`;

const UserEmail = styled.span`
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  min-height: calc(100vh - 100px);
`;

type View = 'landing' | 'privacy' | 'login' | 'register' | 'players' | 'lineup' | 'simulator' | 'leaderboard' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [dashboardView, setDashboardView] = useState<GameView>('lineup');
  const { isAuthenticated, user, loading } = useAuth();

  // Callback to redirect to landing page
  const redirectToLanding = useCallback(() => {
    setCurrentView('landing');
    window.history.pushState({}, '', '/');
  }, []);

  // Check URL path for routing (simple client-side routing)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/privacy-policy') {
      setCurrentView('privacy');
    } else if (path === '/login') {
      setCurrentView('login');
    } else if (path === '/register') {
      setCurrentView('register');
    } else if (path === '/game') {
      setCurrentView('dashboard');
      setDashboardView('lineup');
      window.history.replaceState({}, '', '/game/lineup');
    } else if (path.startsWith('/game/')) {
      // New dashboard routes
      const match = path.match(/\/game\/(\w+)/);
      if (match && match[1]) {
        const view = match[1] as GameView;
        if (['lineup', 'gacha', 'matches', 'inventory', 'profile'].includes(view)) {
          setCurrentView('dashboard');
          setDashboardView(view);
        }
      }
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <Dashboard initialView={dashboardView} />;
      case 'players':
        return <PlayerRoster />;
      case 'lineup':
        return <TeamLineup />;
      case 'simulator':
        return <MatchSimulator />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <LandingPage />;
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return null;
  }

  // If showing dashboard (new navigation), render the Dashboard component directly
  if (currentView === 'dashboard') {
    return (
      <RouteGuard
        currentView={currentView}
        onRedirectToLanding={redirectToLanding}
        isAuthenticated={isAuthenticated}
      >
        {renderView()}
      </RouteGuard>
    );
  }

  // If showing landing, privacy, login, or register page, render without game header
  if (currentView === 'landing' || currentView === 'privacy' || currentView === 'login' || currentView === 'register') {
    return (
      <RouteGuard
        currentView={currentView}
        onRedirectToLanding={redirectToLanding}
        isAuthenticated={isAuthenticated}
      >
        {renderView()}
      </RouteGuard>
    );
  }

  // Legacy game views with old header (backward compatibility)
  return (
    <RouteGuard
      currentView={currentView}
      onRedirectToLanding={redirectToLanding}
      isAuthenticated={isAuthenticated}
    >
      <AppContainer>
        <Header>
          <HeaderContent>
            <Logo onClick={() => setCurrentView('landing')}>⚽ Legends Ascend</Logo>
            <Nav>
              <NavButton
                active={currentView === 'players'}
                onClick={() => setCurrentView('players')}
              >
                Players
              </NavButton>
              <NavButton
                active={currentView === 'lineup'}
                onClick={() => setCurrentView('lineup')}
              >
                Team Lineup
              </NavButton>
              <NavButton
                active={currentView === 'simulator'}
                onClick={() => setCurrentView('simulator')}
              >
                Match Simulator
              </NavButton>
              <NavButton
                active={currentView === 'leaderboard'}
                onClick={() => setCurrentView('leaderboard')}
              >
                Leaderboard
              </NavButton>
              {isAuthenticated && (
                <UserInfo>
                  <UserEmail>{user?.email}</UserEmail>
                  <LogoutButton />
                </UserInfo>
              )}
            </Nav>
          </HeaderContent>
        </Header>
        <Main>{renderView()}</Main>
      </AppContainer>
    </RouteGuard>
  );
}

export default App;
