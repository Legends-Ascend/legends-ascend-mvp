/**
 * Logout Button Component
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-045 FR-5
 */

import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const Button = styled.button`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  background: transparent;
  color: #1E3A8A;
  border: 2px solid #1E3A8A;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1E3A8A;
    color: #FFFFFF;
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }
`;

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} aria-label="Log out">
      Log Out
    </Button>
  );
}
