/**
 * Admin Dashboard Page
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-051 FR-9, FR-10, FR-11, FR-12
 */

import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const Container = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'Inter', 'Poppins', sans-serif;
`;

const Header = styled.header`
  background: #1E3A8A;
  color: #FFFFFF;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #FFFFFF;
`;

const Badge = styled.span`
  background: #F59E0B;
  color: #0F172A;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Username = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #E2E8F0;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #FFFFFF;
    color: #1E3A8A;
  }

  &:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  padding-bottom: 80px; /* Account for fixed footer */
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #64748B;
  margin: 0 0 40px 0;
`;

const PlaceholderCard = styled.div`
  background: #F8FAFC;
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const PlaceholderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
`;

const PlaceholderText = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 16px 40px;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.75rem;
  color: #64748B;
  margin: 0;
`;

export function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container>
      <Header>
        <Logo>
          <LogoText>⚽ Legends Ascend</LogoText>
          <Badge>Admin</Badge>
        </Logo>
        <UserSection>
          <Username>Logged in as: {user?.username || user?.email}</Username>
          <LogoutButton 
            onClick={handleLogout}
            aria-label="Log out of admin dashboard"
          >
            Log Out
          </LogoutButton>
        </UserSection>
      </Header>

      <Main>
        <PageTitle>Admin Dashboard</PageTitle>
        <PageDescription>
          Welcome to the Legends Ascend administration panel.
        </PageDescription>

        <PlaceholderCard>
          <PlaceholderIcon>🚧</PlaceholderIcon>
          <PlaceholderTitle>Dashboard Under Construction</PlaceholderTitle>
          <PlaceholderText>
            Admin features will be available in future updates. 
            This page serves as a placeholder for upcoming admin functionality.
          </PlaceholderText>
        </PlaceholderCard>
      </Main>

      <Footer>
        <FooterText>
          Legends Ascend Admin Dashboard • Version 1.0 • © 2024 All rights reserved
        </FooterText>
      </Footer>
    </Container>
  );
}
