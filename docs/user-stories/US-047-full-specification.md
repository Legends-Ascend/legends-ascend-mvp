# Player Roster Retrieval & Display

**ID:** US-047  
**Story Points:** 8  
**Priority:** MUST  
**Epic/Feature:** Player Management  
**Dependencies:** US-044 (Backend Player Data Model & API), US-045 (Frontend Authentication & User Session Management), US-046 (Frontend Dashboard & Navigation)

---

## User Story

As a **player collector**,  
I want **to view my complete roster of acquired players with their stats, rarities, and evolution levels**,  
So that **I can make informed decisions about team composition and progression planning**.

---

## Context

### Summary
This story implements the frontend player roster display functionality, enabling users to view, filter, and sort their acquired player collection. It provides a comprehensive card-based interface showing player details, stats, and rarity information. This is a P0 critical story that forms the foundation for lineup management and player fusion decisions, as players must see their inventory before making strategic choices about team building.

### Scope

**In Scope:**
- Player inventory grid/card view displaying all owned players
- Player card UI showing: name, rarity (1-5 stars), level/tier, primary stat
- Filter functionality: by rarity, position (GK, DF, MF, FW, UT)
- Sort functionality: by level, rarity, acquisition date
- Detailed player stats popup/modal on card click
- Responsive grid layout (mobile 1-2 columns, tablet 3-4 columns, desktop 4-6 columns)
- Loading state with skeleton screens during data fetch
- Empty state message when user has no players
- Pagination for large inventories (>50 players)
- Integration with backend GET /api/v1/players/my-inventory endpoint from US-044
- WCAG 2.1 AA compliant UI with keyboard navigation and screen reader support
- Brand-compliant UI using approved colours, typography, and spacing

**Out of Scope:**
- Player acquisition/gacha system (separate story)
- Player fusion/upgrade functionality (separate story)
- Player trading/transfer market (separate story)
- Bulk player selection for actions (separate story)
- Player comparison tool (separate story)
- Advanced filtering (combined filters, search by name)
- Player favouriting/bookmarking (separate story)
- Squad assignment from roster view (handled in lineup editor)
- Player stats detailed breakdown charts/graphs (separate story)

### Assumptions
- Backend API endpoint GET /api/v1/players/my-inventory exists and returns player data per US-044 spec
- Authentication system from US-045 is functional and provides user token for API calls
- Dashboard navigation from US-046 provides route to `/game/inventory` or `/game/players`
- Player data structure matches US-044 schema: id, name, position, rarity, base_overall, tier, pace, shooting, passing, dribbling, defending, physical
- User inventory can contain 0 to 500+ players (design for scalability)
- Initial load fetches first 20-50 players with pagination for additional players
- Player cards display brief summary; modal shows full stats
- UK English terminology: "squad", "footballer", "position", "stats"
- All API requests use `VITE_API_URL` environment variable
- Frontend uses React 18+ with TypeScript strict mode
- Responsive breakpoints: mobile <768px, tablet 768-1024px, desktop >1024px

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All DoR requirements satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - React 18+, TypeScript strict mode, REST API patterns
- ✅ BRANDING_GUIDELINE.md - UI uses Primary Blue, Accent Gold, approved typography
- ✅ ACCESSIBILITY_REQUIREMENTS.md - WCAG 2.1 AA compliance, keyboard navigation, screen readers
- ✅ AI_PROMPT_ENGINEERING.md - Sufficient context for autonomous implementation

---

## Functional Requirements

- **[FR-1]** **Player Inventory Fetching:**
  - On component mount, call GET /api/v1/players/my-inventory with authentication token
  - Use query parameters: `page=1`, `limit=20` for initial load
  - Handle API response: success (200), unauthorized (401), server error (500)
  - Store fetched players in component state or context
  - Display loading indicator during fetch
  - Retry mechanism: 3 attempts with exponential backoff on network failure

- **[FR-2]** **Player Card Display:**
  - Each player displayed as a card showing: name, position badge, rarity stars (1-5), base overall rating (40-99), tier level (0-5)
  - Card design: background gradient or border based on rarity, rounded corners (8px), hover state with elevation/shadow
  - Click/tap to open detailed stats modal
  - Minimum touch target: 120x180px on mobile (WCAG 2.1 AA)

- **[FR-3]** **Filter Functionality:**
  - Filter controls: Rarity (All, 1★-5★), Position (All, GK, DF, MF, FW, UT)
  - Filters are cumulative (AND logic)
  - Applying filter triggers new API call with query params: `?rarity=5&position=FW`
  - Display filtered count: "Showing X of Y players"
  - Clear filters button to reset

- **[FR-4]** **Sort Functionality:**
  - Sort options: Acquisition Date (newest first, default), Rarity (highest first), Base Overall (highest first), Name (A-Z)
  - Applying sort triggers new API call with query params: `?sort=base_overall&order=desc`
  - Visual indicator for active sort option

- **[FR-5]** **Detailed Player Stats Modal:**
  - Clicking a player card opens a modal overlay with full stats (pace, shooting, passing, dribbling, defending, physical)
  - Modal includes close button (X icon) and Escape key handler
  - Focus trapped within modal, announced to screen readers as dialog
  - Display acquisition date (DD/MM/YYYY format) and quantity owned

- **[FR-6]** **Responsive Grid Layout:**
  - Mobile (<768px): 1-2 column grid
  - Tablet (768-1024px): 3-4 column grid
  - Desktop (>1024px): 4-6 column grid
  - Grid uses CSS Grid or Flexbox with 16px gap
  - All text readable at 200% zoom

- **[FR-7]** **Loading State:**
  - Display skeleton screens (placeholder cards) during initial fetch
  - Loading indicator with accessible label: "Loading players..."
  - Minimum display time: 300ms to avoid flash

- **[FR-8]** **Empty State:**
  - When no players: "No players in your roster yet" with guidance message
  - When filters return no results: "No players match your filters" with "Clear Filters" button

- **[FR-9]** **Pagination:**
  - If inventory > 50 players, display pagination controls (Previous | Page X of Y | Next)
  - Fetch next page with query param: `?page=2&limit=20`
  - Preserve filters and sort across pages

- **[FR-10]** **Error Handling:**
  - Network Error: "Unable to load players. Please check your connection."
  - 401 Unauthorized: Redirect to login page
  - 500 Server Error: "Something went wrong. Please try again later."
  - Errors announced to screen readers with `role="alert"`

---

## Non-Functional Requirements

### Performance
- Initial Load Time: Players displayed within 1.5s at p95
- Filter/Sort Response: UI updates within 300ms
- Modal Open Animation: < 200ms
- Grid Render Performance: Smooth scrolling at 60fps
- Lighthouse Performance Score: > 85

### Security
- All API requests include `Authorization: Bearer <token>` header
- Users can only view their own inventory (enforced by backend)
- Input validation for filter/sort parameters
- Error messages do not expose sensitive data

### Accessibility
- WCAG 2.1 AA compliance: keyboard navigation, screen reader support, color contrast (4.5:1 text, 3:1 UI)
- Focus indicators: 2px solid Primary Blue outline, 2px offset
- Modal focus trapped, Escape to close
- ARIA labels for all interactive elements
- Semantic HTML: `<section>`, `<article>` for roster and cards

### Branding
- Primary Blue (#1E3A8A) for active filters and CTAs
- Accent Gold (#F59E0B) for 5-star rarity indicators
- Rarity colour coding: 1★ Gray, 2★ Light Blue, 3★ Medium Blue, 4★ Purple, 5★ Gold
- Typography: Inter or Poppins, H4/H5 for names, Body (16px) for stats
- Spacing: 16px gap, 20px padding, 8px border radius

### Internationalization
- UK English terminology: "roster", "footballer", "position", "stats"
- Date format: DD/MM/YYYY
- Externalizable strings for future i18n

### Observability
- Structured logging: API calls, errors, user interactions
- Metrics: page load time, API response times, filter/sort usage
- Error tracking with monitoring service (e.g., Sentry)

---

## Acceptance Criteria

### AC-1: User Can View Player Inventory
**Given** an authenticated user with 15 players  
**When** navigating to the roster page  
**Then** all 15 players displayed as cards with name, position, rarity, overall rating

### AC-2: Loading State Displays During Fetch
**Given** an authenticated user  
**When** the component mounts  
**Then** skeleton screens displayed with accessible label "Loading players..."

### AC-3: Empty State Displays When No Players
**Given** a user with no players  
**When** the roster page loads  
**Then** empty state message: "No players in your roster yet" with guidance

### AC-4: Filter by Rarity Works
**Given** players of various rarities  
**When** selecting "5★" filter  
**Then** only 5-star players displayed, filtered count shown, API called with `?rarity=5`

### AC-5: Filter by Position Works
**Given** players in multiple positions  
**When** selecting "FW" filter  
**Then** only Forwards displayed, API called with `?position=FW`

### AC-6: Sort Functionality Works
**Given** multiple players  
**When** selecting "Base Overall (highest first)"  
**Then** players reordered, API called with `?sort=base_overall&order=desc`

### AC-7: Detailed Stats Modal Opens
**Given** a user viewing the roster  
**When** clicking a player card  
**Then** modal opens with full stats, close button, Escape key closes, focus trapped

### AC-8: Responsive Grid Layout Adapts
**Given** different viewport sizes  
**Then** mobile: 1-2 cols, tablet: 3-4 cols, desktop: 4-6 cols, no horizontal scrolling, text readable at 200% zoom

### AC-9: Pagination Works for Large Inventories
**Given** 100 players  
**When** initial page loads  
**Then** first 20 players shown, pagination controls appear, clicking Next fetches page 2

### AC-10: Keyboard Navigation Works
**Given** keyboard-only navigation  
**When** pressing Tab  
**Then** all elements reachable, focus indicators visible, Enter opens modal, Escape closes it

### AC-11: Screen Reader Accessibility
**Given** a screen reader user  
**When** navigating the roster  
**Then** cards announced as "Player card: [Name], [Position], [Rarity] stars, [Overall] rating"

### AC-12: Branding Compliance
**Given** a designer reviewing the UI  
**Then** colors match guidelines (Primary Blue #1E3A8A, Accent Gold #F59E0B, rarity colors), typography uses Inter/Poppins, contrast meets WCAG 2.1 AA

### AC-13: Error Handling and Retry
**Given** no internet connection  
**When** API request fails  
**Then** error message "Unable to load players..." with Retry button, error announced to screen readers

### AC-14: Data Isolation and Security
**Given** multiple users  
**Then** each user sees only their own players, API requests include auth token

### AC-15: Performance Targets Met
**Given** 50 players  
**Then** page load <1.5s, filter/sort <300ms, modal <200ms, 60fps scrolling, Lighthouse >85

---

## Test Scenarios

### TS-1: Initial Load and Display
1. Navigate to roster page
2. Observe loading state with skeleton screens
3. Wait for API response
4. Verify all players displayed correctly

### TS-2: Filter Functionality
1. Load roster with mixed players
2. Select "5★" rarity filter
3. Select "FW" position filter
4. Verify only 5-star Forwards shown
5. Click "Clear Filters", verify all players shown

### TS-3: Detailed Stats Modal
1. Click player card
2. Verify modal opens with all stats
3. Press Escape
4. Verify modal closes

### TS-4: Keyboard Navigation
1. Press Tab to navigate elements
2. Verify focus indicators visible
3. Press Enter on card to open modal
4. Press Escape to close

### TS-5: Responsive Design
1. Resize from mobile (320px) to desktop (1920px)
2. Verify grid adapts: 1-2 cols → 3-4 cols → 4-6 cols
3. Zoom to 200%, verify text readable

### TS-6: Error Handling
1. Mock API to return 500 error
2. Verify error message displayed
3. Click Retry button
4. Verify API re-attempted

---

## Technical Notes

### API Design

**GET /api/v1/players/my-inventory**

Query Parameters:
- `position` (optional): GK, DF, MF, FW, UT
- `rarity` (optional): 1-5
- `sort` (optional): name, base_overall, rarity, acquired_at
- `order` (optional): asc, desc
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "inventory_id": "uuid",
        "player": {
          "id": "uuid",
          "name": "Cristiano Ronaldo",
          "position": "FW",
          "rarity": 5,
          "base_overall": 95,
          "tier": 2,
          "pace": 92,
          "shooting": 95,
          "passing": 82,
          "dribbling": 90,
          "defending": 34,
          "physical": 78
        },
        "quantity": 3,
        "acquired_at": "2025-11-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 45,
      "total_pages": 3
    }
  }
}
```

### Component Structure

```
PlayerRoster/
├── PlayerRosterPage.tsx          # Main page
├── PlayerGrid.tsx                # Grid layout
├── PlayerCard.tsx                # Individual card
├── PlayerDetailModal.tsx         # Stats modal
├── FilterControls.tsx            # Filter UI
├── SortControls.tsx              # Sort dropdown
├── PaginationControls.tsx        # Pagination
├── EmptyState.tsx                # Empty state
├── LoadingState.tsx              # Skeletons
├── hooks/
│   └── usePlayerInventory.ts    # Custom hook for API
└── __tests__/
    ├── PlayerRosterPage.test.tsx
    ├── PlayerCard.test.tsx
    └── PlayerDetailModal.test.tsx
```

### Custom Hook Example

```typescript
export const usePlayerInventory = () => {
  const { token } = useAuth();
  const [state, setState] = useState({
    inventory: [],
    loading: true,
    error: null,
    filters: { rarity: null, position: null },
    sort: { field: 'acquired_at', order: 'desc' },
    pagination: { page: 1, limit: 20, total_items: 0, total_pages: 0 },
  });

  const fetchInventory = async () => {
    // API call logic
  };

  useEffect(() => {
    fetchInventory();
  }, [state.filters, state.sort, state.pagination.page]);

  return {
    ...state,
    setFilter, setSort, setPage, retry
  };
};
```

### Responsive Grid CSS

```typescript
const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 20px;
  
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;
```

### Rarity Colors

```typescript
export const getRarityColor = (rarity: number): string => {
  const colorMap = {
    1: '#94A3B8',  // Gray
    2: '#60A5FA',  // Light Blue
    3: '#3B82F6',  // Medium Blue
    4: '#8B5CF6',  // Purple
    5: '#F59E0B',  // Accent Gold
  };
  return colorMap[rarity] || '#94A3B8';
};
```

---

## Task Breakdown for AI Agents

### Phase 1: Design & Setup
- [ ] Review foundation documents
- [ ] Review US-044 backend API spec
- [ ] Design component hierarchy
- [ ] Define TypeScript interfaces
- [ ] Plan responsive breakpoints

### Phase 2: Implementation (Coding Agent)
- [ ] Implement usePlayerInventory custom hook
- [ ] Create PlayerCard component with rarity styling
- [ ] Create PlayerDetailModal with focus trapping
- [ ] Create FilterControls and SortControls
- [ ] Create PaginationControls
- [ ] Create PlayerGrid with responsive layout
- [ ] Implement loading and empty states
- [ ] Add keyboard navigation and ARIA labels
- [ ] Apply brand styling

### Phase 3: Testing (Testing Agent)
- [ ] Unit tests for all components
- [ ] Integration tests for full page flow
- [ ] Accessibility tests (axe-core, keyboard, screen reader)
- [ ] Performance tests (Lighthouse)
- [ ] Branding compliance verification

### Phase 4: Documentation & Verification
- [ ] Add JSDoc comments
- [ ] Update README
- [ ] Verify branding and accessibility compliance
- [ ] Create usage examples

### Phase 5: Deployment Readiness
- [ ] All tests passing
- [ ] Code review completed
- [ ] Lighthouse score > 85
- [ ] WCAG 2.1 AA compliant
- [ ] Documentation updated

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Role (player collector), goal (view roster with stats/rarities), benefit (informed decisions)
- ✅ **Acceptance Criteria:** 15 testable ACs covering all functionality
- ✅ **Technical Alignment:** React 18+, TypeScript strict, REST API patterns
- ✅ **Dependencies Identified:** US-044, US-045, US-046
- ✅ **Story Points Estimated:** 8 points (1-2 days)
- ✅ **Priority Assigned:** MUST (P0 critical)
- ✅ **Non-Functional Requirements:** Performance, security, accessibility, branding
- ✅ **Branding Compliance:** Primary Blue, Accent Gold, rarity colors, Inter/Poppins
- ✅ **Accessibility:** WCAG 2.1 AA, keyboard nav, screen reader
- ✅ **AI Agent Context:** Comprehensive specs, API details, component structure

**Story Points:** 8  
**Priority:** MUST  
**Risk Level:** Medium - Depends on US-044/US-045, responsive grid and modal require careful implementation

---

## Handover Notes for Pull Request

> **US-047: Player Roster Retrieval & Display**
> 
> Implements frontend player roster display with filtering, sorting, and detailed stats modal.
> 
> **Key Deliverables:**
> - Responsive player card grid (mobile 1-2 col, tablet 3-4 col, desktop 4-6 col)
> - Filter by rarity and position
> - Sort by acquisition date, rarity, overall rating, name
> - Detailed stats modal with focus trapping
> - Pagination for large inventories
> - Loading and empty states
> - WCAG 2.1 AA compliant
> - Brand-compliant UI
> 
> **Testing:** 15 ACs verified with 6 test scenarios
> **Performance:** <1.5s load, >85 Lighthouse score
> **Accessibility:** WCAG 2.1 AA, keyboard/screen reader tested

---

## Open Questions & Clarifications

**All requirements are clear. Assumptions documented align with issue description and related stories.**

---

**This comprehensive specification provides all necessary context for autonomous AI agent implementation while maintaining compliance with all foundation documents.**
