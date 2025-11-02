import { useState } from 'react';
import styled from 'styled-components';
import { PlayerRoster } from './components/PlayerRoster/PlayerRoster';
import { TeamLineup } from './components/TeamLineup/TeamLineup';
import { MatchSimulator } from './components/MatchSimulator/MatchSimulator';
import { Leaderboard } from './components/Leaderboard/Leaderboard';

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
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
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

type View = 'players' | 'lineup' | 'simulator' | 'leaderboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('players');

  const renderView = () => {
    switch (currentView) {
      case 'players':
        return <PlayerRoster />;
      case 'lineup':
        return <TeamLineup />;
      case 'simulator':
        return <MatchSimulator />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <PlayerRoster />;
    }
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>⚽ Legends Ascend</Logo>
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
          </Nav>
        </HeaderContent>
      </Header>
      <Main>{renderView()}</Main>
    </AppContainer>
  );
}

export default App;
