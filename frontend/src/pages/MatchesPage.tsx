/**
 * Matches Page Placeholder
 * Following BRANDING_GUIDELINE.md
 * Implements US-046 FR-5: Placeholder Pages
 */

import { PlaceholderPage } from '../components/PlaceholderPage';

export function MatchesPage() {
  return (
    <PlaceholderPage
      title="Matches"
      icon="🏆"
      iconLabel="Trophy icon"
      description="View upcoming fixtures, match results, and compete against other managers. Track your performance and climb the rankings."
    />
  );
}
