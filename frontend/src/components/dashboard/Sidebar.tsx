/**
 * Sidebar Navigation Component
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-046 FR-3: Sidebar Navigation
 */

import styled from 'styled-components';
import type { GameView } from './Dashboard';
import { LogoutButton } from '../auth/LogoutButton';
import { useAuth } from '../../hooks/useAuth';

const SidebarContainer = styled.aside.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 240px;
  background: #F1F5F9;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 900;
  overflow-y: auto;

  @media (max-width: 767px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }

  @media (min-width: 768px) {
    transform: translateX(0);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 899;

  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarNav = styled.nav`
  padding: 24px 0;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavButton = styled.button<{ $active: boolean }>`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: ${props => props.$active ? '600' : '500'};
  width: 100%;
  padding: 12px 24px;
  text-align: left;
  background: ${props => props.$active ? '#1E3A8A' : 'transparent'};
  color: ${props => props.$active ? '#FFFFFF' : '#64748B'};
  border: none;
  border-left: ${props => props.$active ? '4px solid #F59E0B' : '4px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;

  &:hover {
    background: ${props => props.$active ? '#1E3A8A' : '#E2E8F0'};
    color: ${props => props.$active ? '#FFFFFF' : '#1E3A8A'};
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: -2px;
  }
`;

const IconPlaceholder = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const MobileUserSection = styled.div`
  padding: 16px 24px;
  border-top: 2px solid #E2E8F0;
  margin-top: 16px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileUserEmail = styled.div`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  margin-bottom: 12px;
`;

interface SidebarProps {
  currentView: GameView;
  onNavigate: (view: GameView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onNavigate, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const navigationItems: Array<{ view: GameView; label: string; icon: string }> = [
    { view: 'lineup', label: 'Lineup', icon: '⚽' },
    { view: 'gacha', label: 'Gacha', icon: '🎰' },
    { view: 'matches', label: 'Matches', icon: '🏆' },
    { view: 'inventory', label: 'Inventory', icon: '🎒' },
    { view: 'profile', label: 'Profile', icon: '👤' },
  ];

  const handleNavigation = (view: GameView) => {
    onNavigate(view);
    // onClose is called by the Dashboard component after navigation
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} aria-hidden="true" />
      
      <SidebarContainer
        isOpen={isOpen}
        role="navigation"
        aria-label="Secondary navigation"
      >
        <SidebarNav>
          <NavList>
            {navigationItems.map(({ view, label, icon }) => (
              <NavItem key={view}>
                <NavButton
                  $active={currentView === view}
                  onClick={() => handleNavigation(view)}
                  aria-current={currentView === view ? 'page' : undefined}
                >
                  <IconPlaceholder role="img" aria-label={`${label} icon`}>
                    {icon}
                  </IconPlaceholder>
                  {label}
                </NavButton>
              </NavItem>
            ))}
          </NavList>
        </SidebarNav>

        <MobileUserSection>
          <MobileUserEmail>{user?.email || 'Guest'}</MobileUserEmail>
          <LogoutButton />
        </MobileUserSection>
      </SidebarContainer>
    </>
  );
}
