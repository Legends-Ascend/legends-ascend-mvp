# Frontend Dashboard & Navigation

**ID:** US-046  
**Story Points:** 5  
**Priority:** MUST  
**Epic/Feature:** Foundation  
**Dependencies:** US-045 (Frontend Authentication & User Session Management)

---

## User Story

As a **football manager**,  
I want **a main dashboard with navigation that allows me to access all game sections**,  
So that **I can efficiently manage my squad, view matches, access my inventory, and navigate the game seamlessly**.

---

## Context

### Summary
This story establishes the core navigation and dashboard layout for the Legends Ascend frontend application. It provides the foundational UI structure that all game features will integrate into, including a responsive header with navigation menu, sidebar navigation, and page routing infrastructure. This is a P0 critical foundation story that must be completed before other game features can be properly accessed and integrated.

### Scope

**In Scope:**
- Main dashboard layout component with header and sidebar
- Navigation menu with links to: Lineup, Gacha, Matches, Inventory, Profile
- Page structure and routing setup (pages can be placeholder/empty components initially)
- Responsive design for mobile (320px+) and desktop (1024px+) breakpoints
- Branding compliance per BRANDING_GUIDELINE.md (colours, typography, logo)
- Accessibility compliance per ACCESSIBILITY_REQUIREMENTS.md (keyboard navigation, WCAG 2.1 AA)
- Integration with existing authentication context from US-045
- Sticky header with user information display
- Collapsible sidebar navigation for mobile devices
- Active route highlighting in navigation
- Logo placement and navigation to home/dashboard
- Environment-variable-based landing page routing protection (respects `VITE_LANDING_PAGE_ENABLED`)

**Out of Scope:**
- Actual implementation of game pages (Lineup, Gacha, Matches, Inventory, Profile) - these are placeholders
- Complex dashboard widgets (statistics, notifications, recent activity)
- User profile editing functionality
- Search functionality in navigation
- Breadcrumb navigation
- Dashboard customization/personalization
- Multi-language support (UK English only for MVP)
- Advanced animations or transitions
- Mobile app-specific navigation patterns (bottom tabs, etc.)
- Deep linking or URL-based routing (basic client-side routing only)

### Assumptions
- Authentication system from US-045 is functional and provides `isAuthenticated` and `user` context
- `RouteGuard` component exists and enforces route protection based on `VITE_LANDING_PAGE_ENABLED`
- Frontend uses React 18+ with TypeScript strict mode
- Vite is the build tool with environment variables via `VITE_` prefix
- Navigation uses simple client-side routing with state management (not React Router initially for MVP)
- All game pages will be developed in subsequent user stories
- Users must be authenticated to access dashboard and game pages
- Header and sidebar use brand colours from BRANDING_GUIDELINE.md
- Logo asset exists at `/assets/brand/logos/logo-full-color.svg`
- Mobile breakpoint: < 768px, Desktop: >= 768px
- UK English terminology throughout (e.g., "Colour" not "Color" in UI where applicable)

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All DoR requirements satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - React 18+, TypeScript strict mode, pnpm, component structure
- ✅ BRANDING_GUIDELINE.md - UI uses Primary Blue (#1E3A8A), Accent Gold (#F59E0B), approved typography
- ✅ ACCESSIBILITY_REQUIREMENTS.md - WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- ✅ AI_PROMPT_ENGINEERING.md - Sufficient context for AI agents to implement autonomously

---

## Functional Requirements

- **[FR-1]** **Main Dashboard Layout:**
  - Create a `Dashboard` component that serves as the main layout wrapper
  - Include a sticky header at the top with logo and navigation links
  - Include a sidebar (collapsible on mobile) with secondary navigation
  - Main content area adjusts to accommodate header and sidebar
  - Layout uses CSS Grid or Flexbox for responsive behavior

- **[FR-2]** **Header Component:**
  - Display Legends Ascend logo on the left (clickable, navigates to dashboard/home)
  - Horizontal navigation menu with links: Lineup, Gacha, Matches, Inventory, Profile
  - User information display on the right: email or username from auth context
  - Logout button integrated (using existing `LogoutButton` component from US-045)
  - Sticky positioning (remains visible during scroll)
  - Responsive: collapses to hamburger menu on mobile devices (< 768px)
  - Background: White (#FFFFFF) with subtle shadow for depth
  - Active route highlighted with Primary Blue (#1E3A8A) or Accent Gold (#F59E0B)

- **[FR-3]** **Sidebar Navigation:**
  - Vertical list of navigation links: Lineup, Gacha, Matches, Inventory, Profile
  - Active route highlighted with background color or border indicator
  - Icons for each navigation item (optional but recommended for visual clarity)
  - Collapsible/expandable on mobile via hamburger menu toggle
  - Fixed positioning on desktop, overlay on mobile
  - Width: 240px on desktop, full-width overlay on mobile
  - Background: Off-White (#FAFAFA) or Soft Gray (#F1F5F9)

- **[FR-4]** **Page Routing Structure:**
  - Implement client-side routing to navigate between views: `lineup`, `gacha`, `matches`, `inventory`, `profile`
  - Each route renders a placeholder component (can be simple div with page title)
  - Update URL path in browser (e.g., `/game/lineup`, `/game/gacha`) without full page reload
  - Navigation via state management (useState) or React Router if adopted
  - Default route: redirect authenticated users to `/game/lineup` or `/game/dashboard`
  - Preserve authentication state across navigation

- **[FR-5]** **Placeholder Pages:**
  - Create placeholder components for each game section:
    - `LineupPage` - "Lineup - Coming Soon"
    - `GachaPage` - "Gacha - Coming Soon"
    - `MatchesPage` - "Matches - Coming Soon"
    - `InventoryPage` - "Inventory - Coming Soon"
    - `ProfilePage` - "Profile - Coming Soon"
  - Each placeholder displays the page title and a brief description
  - Use brand typography and colors from BRANDING_GUIDELINE.md
  - Center-aligned content with minimum height to fill viewport

- **[FR-6]** **Responsive Design:**
  - Mobile (< 768px):
    - Hamburger menu icon to toggle sidebar visibility
    - Sidebar overlays content when open, dismisses on navigation or outside click
    - Header navigation collapses to menu icon
    - Logo scales appropriately (minimum 120px width)
  - Desktop (>= 768px):
    - Sidebar always visible on the left
    - Header navigation displayed horizontally
    - Logo at full size
  - All touch targets minimum 44x44px for mobile accessibility

- **[FR-7]** **Integration with Authentication:**
  - Use `useAuth()` hook from US-045 to access `isAuthenticated`, `user`, and `loading` states
  - Display user email or username in header
  - Integrate existing `LogoutButton` component
  - Redirect unauthenticated users to login page (enforced by `RouteGuard`)

- **[FR-8]** **Error Handling:**
  - Gracefully handle missing user data (display placeholder or "Guest" if user object incomplete)
  - Handle navigation errors (invalid routes default to dashboard)
  - Display loading state during initial authentication check

---

## Non-Functional Requirements

### Performance
- Dashboard layout renders in < 100ms after authentication check completes
- Navigation interactions (clicks, route changes) respond in < 50ms
- Sidebar toggle animation completes in < 300ms
- No layout shift during initial render (use skeleton screens if needed)
- Lighthouse performance score: > 90

### Security
- All routes protected via `RouteGuard` from US-045
- User data displayed from authenticated context only (no hardcoded values)
- No sensitive information exposed in browser history or local storage beyond auth token
- Navigation paths do not expose user IDs or sensitive parameters

### Accessibility
- WCAG 2.1 AA compliance per ACCESSIBILITY_REQUIREMENTS.md:
  - Keyboard navigation: Full navigation via Tab, Enter, Escape keys
  - Screen reader support: Proper ARIA labels, roles, and landmarks
  - Color contrast: All text meets 4.5:1 ratio, UI elements meet 3:1 ratio
  - Focus indicators: Visible 2px outline with 2px offset, using Primary Blue (#1E3A8A)
  - Semantic HTML: `<nav>`, `<header>`, `<main>`, `<aside>` for layout
  - Skip to main content link for keyboard users
  - Mobile menu announced to screen readers when opened/closed
  - Active route indicated via `aria-current="page"` attribute

### Branding
- UI components comply with BRANDING_GUIDELINE.md:
  - Primary colors: Primary Blue (#1E3A8A), Accent Gold (#F59E0B), Dark Navy (#0F172A)
  - Typography: Inter or Poppins font family, weights 400, 500, 600, 700
  - Logo: Full-color logo on light backgrounds, minimum clear space 20px
  - Typography scale: H1 (48px/3rem Bold), Body (16px/1rem Regular)
  - Spacing: Consistent padding/margin using 4px/8px grid system
  - Border radius: 6px for buttons, 8px for cards
  - Shadows: Subtle box-shadow for header and overlays

### Internationalization
- UK English terminology throughout
- Dates in DD/MM/YYYY format (if applicable)
- Metric system for any measurements (not applicable here)
- Externalizable strings for future translation (use constants for UI text)

### Observability
- Console logging for navigation events in development mode
- Error boundary for dashboard component to catch rendering errors
- Structured error logging for failed navigation or missing components
- Track active route in analytics (placeholder for future implementation)

---

## Acceptance Criteria

### AC-1: Dashboard Layout Renders Correctly
**Given** an authenticated user accessing the game dashboard  
**When** the dashboard component loads  
**Then** the layout displays:
  - Sticky header at the top with logo, navigation, and user info
  - Sidebar on the left (desktop) or collapsed (mobile)
  - Main content area for page-specific content
  - No layout shift or visual glitches during render

### AC-2: Header Navigation Functions
**Given** an authenticated user on the dashboard  
**When** the user clicks a navigation link (Lineup, Gacha, Matches, Inventory, Profile)  
**Then**:
  - The corresponding page content displays in the main area
  - The URL updates to reflect the new route (e.g., `/game/lineup`)
  - The active navigation item is visually highlighted
  - The page transition is smooth and responsive (< 50ms)

### AC-3: Sidebar Navigation Works on Desktop
**Given** an authenticated user on a desktop device (>= 768px width)  
**When** the dashboard loads  
**Then**:
  - The sidebar is visible on the left side
  - Sidebar displays navigation links: Lineup, Gacha, Matches, Inventory, Profile
  - Active route is highlighted in the sidebar
  - Clicking a sidebar link navigates to the corresponding page

### AC-4: Mobile Navigation Functions Correctly
**Given** an authenticated user on a mobile device (< 768px width)  
**When** the dashboard loads  
**Then**:
  - The sidebar is hidden by default
  - A hamburger menu icon is visible in the header
  
**When** the user clicks the hamburger menu icon  
**Then**:
  - The sidebar slides in as an overlay
  - Navigation links are accessible
  
**When** the user clicks a navigation link or outside the sidebar  
**Then**:
  - The sidebar closes
  - The selected page displays

### AC-5: Placeholder Pages Display
**Given** an authenticated user navigating to any game section  
**When** the user clicks Lineup, Gacha, Matches, Inventory, or Profile  
**Then**:
  - A placeholder page displays with the section title (e.g., "Lineup - Coming Soon")
  - The placeholder uses brand typography and colors
  - The layout is centered and readable

### AC-6: User Information Displays in Header
**Given** an authenticated user on the dashboard  
**When** the header renders  
**Then**:
  - The user's email or username displays in the header
  - The logout button is present and functional
  - Clicking logout redirects to the login page and clears authentication

### AC-7: Responsive Design at All Breakpoints
**Given** an authenticated user accessing the dashboard  
**When** the viewport is resized from mobile (320px) to desktop (1920px)  
**Then**:
  - The layout adapts smoothly at the 768px breakpoint
  - No horizontal scrolling occurs at any viewport size
  - All interactive elements remain accessible and usable
  - Text remains readable at 200% zoom (WCAG requirement)

### AC-8: Keyboard Navigation Works
**Given** an authenticated user using only keyboard navigation  
**When** the user presses Tab to navigate through interactive elements  
**Then**:
  - All navigation links, logo, and logout button are reachable via Tab
  - Focus indicators are clearly visible (2px outline, Primary Blue)
  - Pressing Enter on a focused navigation link navigates to that page
  - Pressing Escape on an open mobile menu closes it
  - Tab order is logical: logo -> navigation links -> user info -> logout button

### AC-9: Screen Reader Accessibility
**Given** a user with a screen reader (NVDA, JAWS, VoiceOver)  
**When** navigating the dashboard  
**Then**:
  - Header is announced as "navigation" landmark
  - Sidebar is announced as "complementary" or "navigation" landmark
  - Main content area is announced as "main" landmark
  - Active route is indicated with `aria-current="page"`
  - Logo has alt text "Legends Ascend logo"
  - Hamburger menu button has accessible label "Open navigation menu"

### AC-10: Branding Compliance
**Given** a designer reviewing the dashboard UI  
**When** comparing against BRANDING_GUIDELINE.md  
**Then**:
  - Primary Blue (#1E3A8A) used for active navigation items and primary actions
  - Accent Gold (#F59E0B) used for highlights or secondary CTAs if applicable
  - Typography uses Inter or Poppins font family
  - Logo follows spacing and sizing guidelines (minimum 120px width on mobile)
  - Color contrast meets WCAG 2.1 AA standards (verified with contrast checker)

---

## Test Scenarios

### TS-1: [Maps to AC-1, AC-2] - Dashboard Renders and Navigation Works
**Steps:**
1. Log in as an authenticated user
2. Observe the dashboard layout loading
3. Click "Lineup" navigation link
4. Observe URL changes to `/game/lineup` and Lineup page displays
5. Click "Gacha" navigation link
6. Observe URL changes to `/game/gacha` and Gacha page displays

**Expected Result:** 
- Dashboard layout renders with header, sidebar, and main content area
- Navigation links work smoothly, updating URL and page content
- Active route is highlighted in both header and sidebar

### TS-2: [Maps to AC-3] - Desktop Sidebar Navigation
**Steps:**
1. Open dashboard on a desktop browser (>= 768px width)
2. Observe sidebar visibility on the left
3. Click each sidebar navigation link (Lineup, Gacha, Matches, Inventory, Profile)
4. Observe active route highlighting in sidebar

**Expected Result:**
- Sidebar is always visible on desktop
- Clicking sidebar links navigates to corresponding pages
- Active route is visually distinct (background color or border)

### TS-3: [Maps to AC-4] - Mobile Hamburger Menu
**Steps:**
1. Open dashboard on a mobile device or resize browser to < 768px width
2. Observe sidebar is hidden and hamburger menu icon is visible
3. Click hamburger menu icon
4. Observe sidebar slides in as an overlay
5. Click "Lineup" navigation link
6. Observe sidebar closes and Lineup page displays

**Expected Result:**
- Sidebar is hidden on mobile by default
- Hamburger menu toggles sidebar visibility
- Sidebar closes after navigation or outside click

### TS-4: [Maps to AC-5] - Placeholder Pages
**Steps:**
1. Navigate to each game section: Lineup, Gacha, Matches, Inventory, Profile
2. Observe placeholder page content

**Expected Result:**
- Each page displays a centered title (e.g., "Gacha - Coming Soon")
- Typography and colors match branding guidelines

### TS-5: [Maps to AC-6] - User Information and Logout
**Steps:**
1. Log in as user with email `test@example.com`
2. Observe header displays email `test@example.com`
3. Click "Logout" button
4. Observe redirection to login page

**Expected Result:**
- User email displays in header
- Logout button clears authentication and redirects

### TS-6: [Maps to AC-7] - Responsive Design
**Steps:**
1. Open dashboard at 320px width (small mobile)
2. Resize to 768px (tablet breakpoint)
3. Resize to 1920px (large desktop)
4. Observe layout adaptations at each size

**Expected Result:**
- Layout adapts smoothly at 768px breakpoint
- No horizontal scrolling at any size
- All content remains accessible and readable

### TS-7: [Maps to AC-8] - Keyboard Navigation
**Steps:**
1. Open dashboard and use only keyboard (no mouse)
2. Press Tab repeatedly to navigate through interactive elements
3. Observe focus indicators on logo, navigation links, logout button
4. Press Enter on focused "Gacha" link
5. Observe navigation to Gacha page

**Expected Result:**
- All interactive elements reachable via Tab
- Focus indicators clearly visible (2px Primary Blue outline)
- Enter key activates focused links

### TS-8: [Maps to AC-9] - Screen Reader Accessibility
**Steps:**
1. Open dashboard with NVDA or VoiceOver screen reader enabled
2. Navigate through header, sidebar, and main content using screen reader shortcuts
3. Listen for landmark announcements and active route indication

**Expected Result:**
- Header announced as "navigation" landmark
- Sidebar announced appropriately
- Main content announced as "main" landmark
- Active route indicated with `aria-current="page"`

### TS-9: [Maps to AC-10] - Branding Verification
**Steps:**
1. Inspect dashboard UI elements in browser DevTools
2. Verify color HEX codes match BRANDING_GUIDELINE.md
3. Verify font family and weights
4. Run WebAIM Contrast Checker on all text elements

**Expected Result:**
- Primary Blue (#1E3A8A) used for active navigation
- Typography uses Inter or Poppins
- All color contrast ratios meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI elements)

### TS-10: [Maps to AC-2, AC-5] - URL Routing and Direct Access
**Steps:**
1. Log in and navigate to Lineup page
2. Copy URL (`/game/lineup`)
3. Refresh the page
4. Observe Lineup page loads directly with active navigation highlighting

**Expected Result:**
- Direct URL access works (if client-side routing supports it)
- Active route highlighting reflects current URL
- Authentication state persists across refresh

---

## Technical Notes

### Component Structure

```
Dashboard/
├── Dashboard.tsx          # Main layout wrapper
├── Header.tsx             # Header component with navigation
├── Sidebar.tsx            # Sidebar navigation component
├── MobileMenu.tsx         # Mobile hamburger menu (optional separate component)
└── __tests__/
    ├── Dashboard.test.tsx
    ├── Header.test.tsx
    └── Sidebar.test.tsx

pages/
├── LineupPage.tsx         # Placeholder
├── GachaPage.tsx          # Placeholder
├── MatchesPage.tsx        # Placeholder
├── InventoryPage.tsx      # Placeholder
└── ProfilePage.tsx        # Placeholder
```

### Routing Implementation

**Option 1: Simple State-Based Routing (MVP approach)**
```typescript
type GameView = 'lineup' | 'gacha' | 'matches' | 'inventory' | 'profile';

const [currentView, setCurrentView] = useState<GameView>('lineup');

const navigateTo = (view: GameView) => {
  setCurrentView(view);
  window.history.pushState({}, '', `/game/${view}`);
};
```

**Option 2: React Router (if adopted later)**
```typescript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/game/lineup" element={<LineupPage />} />
    <Route path="/game/gacha" element={<GachaPage />} />
    <Route path="/game/matches" element={<MatchesPage />} />
    <Route path="/game/inventory" element={<InventoryPage />} />
    <Route path="/game/profile" element={<ProfilePage />} />
  </Routes>
</BrowserRouter>
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '768px',
};

const MediaQuery = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  desktop: `@media (min-width: ${breakpoints.mobile})`,
};
```

### Accessibility Implementation

```typescript
// Header with semantic HTML and ARIA
<header role="banner">
  <nav aria-label="Main navigation">
    <ul>
      <li>
        <a href="/game/lineup" aria-current={currentView === 'lineup' ? 'page' : undefined}>
          Lineup
        </a>
      </li>
      {/* More navigation items */}
    </ul>
  </nav>
</header>

// Sidebar with ARIA
<aside role="navigation" aria-label="Secondary navigation">
  {/* Sidebar content */}
</aside>

// Main content with landmark
<main role="main" id="main-content">
  {/* Page content */}
</main>

// Skip to main content link (for keyboard users)
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Styling Approach

**Using styled-components (existing pattern in codebase):**
```typescript
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavLink = styled.a<{ active: boolean }>`
  color: ${props => props.active ? '#1E3A8A' : '#64748B'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: ${props => props.active ? '2px solid #F59E0B' : 'none'};
  
  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }
`;
```

### State Management

```typescript
// Dashboard context for shared navigation state
interface DashboardContextType {
  currentView: GameView;
  navigateTo: (view: GameView) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
```

### Integration with Authentication

```typescript
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<GameView>('lineup');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Header user={user} currentView={currentView} onNavigate={setCurrentView} />
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <Main>
        {currentView === 'lineup' && <LineupPage />}
        {currentView === 'gacha' && <GachaPage />}
        {currentView === 'matches' && <MatchesPage />}
        {currentView === 'inventory' && <InventoryPage />}
        {currentView === 'profile' && <ProfilePage />}
      </Main>
    </DashboardLayout>
  );
};
```

### Performance Optimizations

- Use `React.memo()` for Header and Sidebar components to prevent unnecessary re-renders
- Lazy load placeholder pages using `React.lazy()` and `Suspense` if needed
- Use CSS transforms for sidebar animations (hardware accelerated)
- Avoid inline styles, use styled-components or CSS modules for better performance
- Debounce window resize events if implementing responsive behavior in JS

### Error Boundary

```typescript
class DashboardErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard error:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          message="Something went wrong loading the dashboard" 
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}
```

---

## Task Breakdown for AI Agents

### Phase 1: Design & Setup
- [ ] Review foundation documents (TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md)
- [ ] Review existing authentication implementation from US-045
- [ ] Design component structure for Dashboard, Header, Sidebar
- [ ] Define TypeScript interfaces for navigation state and routing
- [ ] Create placeholder page components
- [ ] Plan responsive breakpoints and mobile menu behavior

### Phase 2: Implementation (Coding Agent)
- [ ] Create Dashboard layout component with Grid/Flexbox
- [ ] Implement Header component with logo, navigation, user info, logout button
- [ ] Implement Sidebar component with navigation links and active state highlighting
- [ ] Implement mobile hamburger menu toggle functionality
- [ ] Create placeholder pages: Lineup, Gacha, Matches, Inventory, Profile
- [ ] Implement client-side routing (state-based or React Router)
- [ ] Add responsive CSS for mobile/desktop breakpoints
- [ ] Integrate with `useAuth()` hook for authentication state
- [ ] Add keyboard navigation support (Tab, Enter, Escape)
- [ ] Add ARIA attributes for accessibility (landmarks, aria-current, labels)
- [ ] Style components per BRANDING_GUIDELINE.md (colors, typography, spacing)
- [ ] Add focus indicators for all interactive elements
- [ ] Implement error boundary for dashboard

### Phase 3: Testing (Testing Agent)
- [ ] Unit tests for Dashboard component (renders, navigation works)
- [ ] Unit tests for Header component (displays user info, navigation clicks)
- [ ] Unit tests for Sidebar component (active state, responsive behavior)
- [ ] Unit tests for mobile menu toggle functionality
- [ ] Unit tests for placeholder pages (renders correct content)
- [ ] Integration tests for full navigation flow (login -> dashboard -> pages)
- [ ] Accessibility tests (keyboard navigation, screen reader support, ARIA)
- [ ] Responsive design tests (mobile, tablet, desktop breakpoints)
- [ ] Color contrast tests (WCAG 2.1 AA compliance)
- [ ] Performance tests (Lighthouse score > 90)

### Phase 4: Documentation & Verification
- [ ] Update README with dashboard component usage
- [ ] Document navigation state management approach
- [ ] Document responsive breakpoints and mobile menu behavior
- [ ] Verify branding compliance (colors, typography, logo usage)
- [ ] Verify accessibility compliance (WCAG 2.1 AA, keyboard, screen reader)
- [ ] Create usage examples for future developers

### Phase 5: Deployment Readiness
- [ ] All tests passing (unit, integration, accessibility)
- [ ] Code review completed (branding, accessibility, performance)
- [ ] Lighthouse performance score > 90
- [ ] WCAG 2.1 AA compliance verified with automated tools (axe, WAVE)
- [ ] Manual keyboard and screen reader testing completed
- [ ] Responsive design tested across devices (mobile, tablet, desktop)
- [ ] Documentation updated

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (football manager), goal (main dashboard with navigation), benefit (efficient game management)
- ✅ **Acceptance Criteria:** 10 testable ACs covering layout, navigation, responsive design, accessibility, branding
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md (React 18+, TypeScript strict, styled-components)
- ✅ **Dependencies Identified:** Depends on US-045 (Frontend Authentication & User Session Management)
- ✅ **Story Points Estimated:** 5 points (moderate complexity, 1-2 days)
- ✅ **Priority Assigned:** MUST (P0 critical foundation story)
- ✅ **Non-Functional Requirements:** Performance, security, accessibility, branding, observability defined
- ✅ **Branding Compliance:** Aligned with BRANDING_GUIDELINE.md (Primary Blue, Accent Gold, Inter/Poppins typography)
- ✅ **Accessibility:** WCAG 2.1 AA requirements specified (keyboard nav, screen reader, contrast, focus indicators)
- ✅ **AI Agent Context:** Sufficient detail for autonomous implementation (component structure, routing, styling, tests)

**Story Points:** 5  
**Priority:** MUST  
**Risk Level:** Low - Foundation component, well-defined requirements, existing authentication integration

**Justification for Risk Level:**
- Low complexity: Standard UI layout with navigation
- Well-established patterns: Header, sidebar, routing are common React patterns
- Existing authentication: Integration with US-045 is straightforward
- Clear acceptance criteria: All behaviors well-defined
- Minimal external dependencies: No new APIs or third-party libraries required

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements the main dashboard layout and navigation system for the Legends Ascend frontend, providing the foundational UI structure for all game features.
> 
> **Key Deliverables:**
> - Dashboard layout component with sticky header and collapsible sidebar
> - Responsive navigation menu (desktop horizontal, mobile hamburger)
> - Placeholder pages for: Lineup, Gacha, Matches, Inventory, Profile
> - Client-side routing with active route highlighting
> - Full WCAG 2.1 AA accessibility (keyboard navigation, screen reader support)
> - Branding compliance (Primary Blue, Accent Gold, Inter/Poppins typography)
> - Integration with authentication context from US-045
> 
> **Testing:** All 10 acceptance criteria verified with comprehensive unit, integration, and accessibility tests
> **DoR Compliance:** ✅ All requirements met per DEFINITION_OF_READY.md
> **Performance:** Lighthouse score > 90, navigation interactions < 50ms
> **Accessibility:** WCAG 2.1 AA compliant, tested with keyboard and screen reader

---

## Open Questions & Clarifications

**All requirements are clear and well-defined. No open questions at this time.**

---

## Additional Notes

### UK English Terminology
- "Colour" in UI copy where applicable (though technical code uses American spelling per TypeScript/React conventions)
- "Authorisation" in user-facing text if applicable (not "Authorization")
- "Favourites" not "Favorites" (if applicable in future features)

### Future Enhancements (Out of Scope for US-046)
- Advanced dashboard widgets (match notifications, statistics cards)
- User profile customization (avatar upload, bio editing)
- Search functionality in navigation
- Breadcrumb navigation for deep page hierarchies
- Advanced animations and page transitions
- Mobile app-specific navigation (bottom tabs, swipe gestures)
- Multi-language support (currently UK English only)

### Integration Points for Future Stories
- **US-047: Lineup Page** - Will replace LineupPage placeholder
- **US-048: Gacha System** - Will replace GachaPage placeholder
- **US-049: Match History** - Will replace MatchesPage placeholder
- **US-050: Inventory Management** - Will replace InventoryPage placeholder
- **US-051: User Profile** - Will replace ProfilePage placeholder

This dashboard serves as the foundation that all subsequent game features will integrate into, ensuring a consistent navigation experience across the entire application.
