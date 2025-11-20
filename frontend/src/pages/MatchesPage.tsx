/**
 * Matches Page Placeholder
 * Following BRANDING_GUIDELINE.md
 * Implements US-046 FR-5: Placeholder Pages
 */

import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #1E3A8A;
  margin: 0 0 16px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const PageIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
`;

const PageDescription = styled.p`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #64748B;
  margin: 0;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  background: #F59E0B;
  color: #FFFFFF;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 24px;
`;

export function MatchesPage() {
  return (
    <PageContainer>
      <PageIcon role="img" aria-label="Trophy icon">
        🏆
      </PageIcon>
      <PageTitle>Matches</PageTitle>
      <PageDescription>
        View upcoming fixtures, match results, and compete against other managers.
        Track your performance and climb the rankings.
      </PageDescription>
      <ComingSoonBadge>Coming Soon</ComingSoonBadge>
    </PageContainer>
  );
}
