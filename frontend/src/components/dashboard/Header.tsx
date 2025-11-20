/**
 * Header Component with Navigation
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-046 FR-2: Header Component
 */

import styled from 'styled-components';
import type { User } from '../../types/auth';
import type { GameView } from './Dashboard';
import { LogoutButton } from '../auth/LogoutButton';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 100%;
  height: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: #F1F5F9;
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const HamburgerIcon = styled.div<{ isOpen: boolean }>`
  width: 24px;
  height: 2px;
  background: #1E3A8A;
  position: relative;
  transition: background-color 0.3s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: #1E3A8A;
    transition: transform 0.3s;
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
  }

  ${props => props.isOpen && `
    background-color: transparent;

    &::before {
      transform: rotate(45deg);
      top: 0;
    }

    &::after {
      transform: rotate(-45deg);
      top: 0;
    }
  `}
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  min-width: 120px;
`;

const LogoText = styled.h1`
  margin: 0;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1E3A8A;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    gap: 8px;
  }
`;

const NavLink = styled.button<{ active: boolean }>`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '500'};
  padding: 10px 16px;
  background: ${props => props.active ? '#1E3A8A' : 'transparent'};
  color: ${props => props.active ? '#FFFFFF' : '#64748B'};
  border: none;
  border-bottom: ${props => props.active ? '2px solid #F59E0B' : '2px solid transparent'};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background: ${props => props.active ? '#1E3A8A' : '#F1F5F9'};
    color: ${props => props.active ? '#FFFFFF' : '#1E3A8A'};
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 16px;
    border-left: 2px solid #E2E8F0;
  }
`;

const UserEmail = styled.span`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
`;

interface HeaderProps {
  user: User | null;
  currentView: GameView;
  onNavigate: (view: GameView) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ user, currentView, onNavigate, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const navigationItems: Array<{ view: GameView; label: string }> = [
    { view: 'lineup', label: 'Lineup' },
    { view: 'gacha', label: 'Gacha' },
    { view: 'matches', label: 'Matches' },
    { view: 'inventory', label: 'Inventory' },
    { view: 'profile', label: 'Profile' },
  ];

  return (
    <HeaderContainer role="banner">
      <HeaderContent>
        <LeftSection>
          <HamburgerButton
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isSidebarOpen}
          >
            <HamburgerIcon isOpen={isSidebarOpen} />
          </HamburgerButton>

          <LogoLink
            href="/game/lineup"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('lineup');
            }}
            aria-label="Legends Ascend - Go to dashboard"
          >
            <LogoImage
              src="/assets/branding/legends-ascend-logo-transparent.png"
              alt="Legends Ascend logo"
            />
            <LogoText>Legends Ascend</LogoText>
          </LogoLink>
        </LeftSection>

        <Nav role="navigation" aria-label="Main navigation">
          {navigationItems.map(({ view, label }) => (
            <NavLink
              key={view}
              active={currentView === view}
              onClick={() => onNavigate(view)}
              aria-current={currentView === view ? 'page' : undefined}
            >
              {label}
            </NavLink>
          ))}
        </Nav>

        <RightSection>
          <UserInfo>
            <UserEmail>{user?.email || 'Guest'}</UserEmail>
            <LogoutButton />
          </UserInfo>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
