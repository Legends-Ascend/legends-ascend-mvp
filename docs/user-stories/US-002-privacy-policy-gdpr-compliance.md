# User Story: Privacy Policy Page with GDPR Compliance

---

## Story Metadata

**Title:** Privacy Policy Page with GDPR Compliance and Regular Updates  
**ID:** US-002  
**Story Points:** 5 (Fibonacci scale)  
**Priority:** MUST (MoSCoW)  
**Epic/Feature:** Pre-Launch & Marketing Foundation  
**Created:** 2025-11-06  
**Status:** Ready for Development

---

## User Story

**As a** platform user (prospective or registered),  
**I want** a privacy policy page that is regularly updated to reflect changes as the platform evolves,  
**so that** I can stay informed about how my data is being used and ensure that the platform remains compliant with GDPR regulations.

---

## Context

### Summary
Create a comprehensive, GDPR-compliant Privacy Policy page for Legends Ascend that clearly explains data collection, usage, storage, and user rights. The page must be accessible, regularly maintainable, version-controlled, and designed to accommodate future updates as the platform evolves from MVP to full product.

### Scope

**In Scope:**
- Dedicated Privacy Policy page at `/privacy-policy` route
- Comprehensive GDPR-compliant privacy policy content
- Version control system with effective date and last updated timestamps
- Responsive design matching branding guidelines
- WCAG 2.1 AA accessibility compliance
- Table of Contents for easy navigation
- Contact information for privacy-related inquiries
- User rights section (access, rectification, erasure, portability, objection)
- Clear data collection and usage explanations
- Cookie and tracking technology disclosure
- Third-party service integration disclosure (EmailOctopus, analytics, etc.)
- Data retention policies
- Children's privacy statement (COPPA compliance if applicable)
- International data transfer disclosures
- Security measures overview
- Link integration with landing page consent checkbox (US-001 dependency)
- SEO-friendly metadata and structured data
- Print-friendly styling
- Shareable URL structure

**Out of Scope:**
- Cookie consent banner/popup (separate story if needed)
- User account-specific privacy settings dashboard
- Dynamic per-user privacy preferences (future feature)
- Multi-language translations (i18n structure prepared but not translated)
- Interactive privacy preference management
- Legal review and approval (assumed to be external process)
- Privacy policy generator tool/CMS integration

### Assumptions
- Legal team or external legal counsel will review and approve final content
- Privacy policy template will be based on industry best practices and GDPR requirements
- EmailOctopus privacy policy and data processing agreements are in place
- Privacy policy applies to MVP phase with placeholder sections for future features
- Updates to privacy policy will trigger email notifications to subscribed users (future feature)
- Current phase focuses primarily on email collection from landing page (US-001)
- UK GDPR and EU GDPR standards are the baseline compliance requirements
- Privacy policy will be accessible before users submit email on landing page
- Version control will be manual (content updated via code commits) for MVP

### Dependencies

**Story Dependencies:**
- US-001 (Landing Page with EmailOctopus integration) – Privacy Policy link must be functional before landing page goes live

**Technical Dependencies:**
- Next.js 14+ with App Router (per TECHNICAL_ARCHITECTURE.md)
- React 18+
- TypeScript (strict mode)
- Markdown or MDX for content management (preferred for version control)
- Node.js LTS (v20.x)
- Git for version control tracking

**Foundation Document Dependencies:**
- [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md) – Tech stack, naming conventions, routing patterns
- [BRANDING_GUIDELINE.md](../BRANDING_GUIDELINE.md) – Colors, typography, logo usage
- [ACCESSIBILITY_REQUIREMENTS.md](../ACCESSIBILITY_REQUIREMENTS.md) – WCAG 2.1 AA compliance
- [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md) – Story quality standards

---

## Functional Requirements

### FR-1: Privacy Policy Page Structure
- Route: `/privacy-policy` (accessible via Next.js App Router)
- Page structure:
  - Header with Legends Ascend logo and navigation back to home
  - Page title: "Privacy Policy"
  - Version information: Effective date and last updated date
  - Table of Contents with anchor links to sections
  - Main content sections (see FR-2)
  - Footer with contact information
- Responsive layout matching site branding
- Breadcrumb navigation: Home > Privacy Policy

### FR-2: GDPR-Compliant Content Sections
Privacy policy must include the following sections (minimum):

1. **Introduction**
   - Who we are (Legends Ascend)
   - Commitment to privacy
   - Scope of policy (what data, which services)

2. **Data Controller Information**
   - Legal entity name and contact details
   - Data Protection Officer contact (if applicable)
   - Registration number (if applicable)

3. **Data We Collect**
   - Email addresses (from landing page signup)
   - Consent timestamps
   - IP addresses (hashed for rate limiting and security)
   - Usage data (page views, interactions) – if analytics are implemented
   - Future: Account information, game progress, user preferences
   - Explicitly state what is NOT collected (passwords, payment info in MVP)

4. **How We Collect Data**
   - Direct submission (email signup form)
   - Automated technologies (cookies, analytics) – specify which
   - Third-party integrations (EmailOctopus)

5. **Legal Basis for Processing (GDPR Article 6)**
   - Consent (for marketing emails)
   - Legitimate interests (for service operation and security)
   - Contract fulfillment (future: when users create accounts)

6. **How We Use Your Data**
   - Send marketing emails and product updates
   - Improve user experience
   - Security and fraud prevention
   - Future: Game functionality, account management, customer support

7. **Data Sharing and Third-Party Services**
   - EmailOctopus (email service provider) – include link to their privacy policy
   - Analytics providers (if applicable: Google Analytics, Plausible, etc.)
   - Hosting providers (Vercel, AWS, etc.)
   - Explicitly state: No selling of personal data to third parties

8. **International Data Transfers**
   - Disclosure if data is transferred outside EU/UK
   - Safeguards in place (Standard Contractual Clauses, Privacy Shield alternatives)
   - EmailOctopus data processing agreement reference

9. **Data Retention**
   - How long data is kept (e.g., "Email addresses retained until unsubscribe")
   - Automated deletion policies
   - Backup retention periods

10. **Your Rights Under GDPR**
    - Right to access your data
    - Right to rectification (correction)
    - Right to erasure (deletion/"right to be forgotten")
    - Right to restrict processing
    - Right to data portability
    - Right to object to processing
    - Right to withdraw consent
    - Right to lodge complaint with supervisory authority (ICO for UK)
    - How to exercise these rights (contact email: privacy@legends-ascend.com)

11. **Cookies and Tracking Technologies**
    - Types of cookies used (strictly necessary, analytics, marketing)
    - How to manage cookie preferences
    - Link to separate Cookie Policy if applicable

12. **Security Measures**
    - Overview of security practices (encryption, access controls)
    - Breach notification procedures
    - User responsibilities (if applicable)

13. **Children's Privacy**
    - Statement on COPPA compliance (if applicable)
    - Minimum age requirements (GDPR: 13-16 depending on member state)
    - Parental consent requirements

14. **Changes to This Privacy Policy**
    - How users will be notified of changes (email to subscribers, notice on website)
    - Effective date of changes
    - Version history link (optional for MVP)

15. **Contact Us**
    - Privacy-specific email: privacy@legends-ascend.com
    - General contact information
    - Data Protection Officer contact (if applicable)
    - Postal address (if required by jurisdiction)

### FR-3: Version Control and Update Mechanism
- Effective date displayed prominently at top of page
- Last updated date displayed (format: DD/MM/YYYY per UK standards)
- Version number (e.g., "Version 1.0") optional but recommended
- Content stored in version-controlled format:
  - **Option A:** Markdown/MDX file in repository with git history
  - **Option B:** Structured data (JSON/YAML) rendered by component
  - **Preferred:** MDX for content + frontmatter for metadata
- Automated timestamp update mechanism when content changes
- Future: Version history page showing all past versions

### FR-4: Table of Contents and Navigation
- Sticky/fixed Table of Contents on desktop (sidebar or top)
- Collapsible Table of Contents on mobile
- Anchor links to each section (e.g., `/privacy-policy#data-we-collect`)
- Smooth scroll behavior for internal navigation
- "Back to top" button on long page
- Breadcrumb trail: Home > Privacy Policy

### FR-5: Accessibility Features
- Semantic HTML structure (`<nav>`, `<main>`, `<section>`, `<article>`)
- Proper heading hierarchy (h1 for page title, h2 for main sections, h3 for subsections)
- All links are descriptive and accessible via keyboard
- Focus indicators on all interactive elements
- ARIA labels where necessary (e.g., "Table of Contents navigation")
- Skip link to main content
- Sufficient color contrast for all text (4.5:1 for normal, 3:1 for large)
- Page scales to 200% zoom without loss of functionality
- Print stylesheet for clean printed output

### FR-6: SEO and Metadata
- Page title: "Privacy Policy | Legends Ascend"
- Meta description: "Learn how Legends Ascend collects, uses, and protects your personal data in compliance with GDPR and international privacy regulations."
- Canonical URL: `https://legends-ascend.com/privacy-policy`
- Robots meta tag: `index, follow` (allow search engines to index)
- Structured data (JSON-LD) for webpage
- Open Graph tags for social sharing
- Language declaration: `<html lang="en-GB">`

### FR-7: Print-Friendly Styling
- Print stylesheet that:
  - Removes navigation and non-essential UI elements
  - Displays full URLs for links (using `::after` pseudo-element)
  - Optimizes font sizes and spacing for print
  - Ensures page breaks don't split sections awkwardly
  - Adds header with document title and print date

---

## Non-Functional Requirements

### Performance
- **Page Load Time:**
  - LCP < 2.5 seconds (text-based content, should be fast)
  - FID/INP < 100ms
  - CLS < 0.1
- **Optimization Strategies:**
  - Static page generation (SSG) via Next.js `generateStaticParams`
  - Minimal JavaScript (content-focused page)
  - Optimized fonts (same as site-wide branding)
  - No external dependencies beyond core framework
  - Lazy load Table of Contents JavaScript if needed

### Security
- **Content Security:**
  - No user-generated content (static policy text)
  - XSS prevention via Next.js built-in sanitization
  - Secure headers (CSP, X-Frame-Options)
- **Privacy Contact Email:**
  - Spam-protected email display (obfuscation or contact form link)
  - SPF/DKIM/DMARC configured for privacy@legends-ascend.com domain

### Accessibility
- **WCAG 2.1 Level AA Compliance** (per ACCESSIBILITY_REQUIREMENTS.md):
  - Color contrast: Minimum 4.5:1 for body text, 3:1 for headings
  - Keyboard navigation: All TOC links and anchors accessible via Tab
  - Focus indicators: 2px outline with 2px offset
  - Screen reader support: Semantic HTML, proper headings, descriptive links
  - Alt text: Not applicable (text-based content)
  - Scalable typography: Use rem units, support 200% zoom
  - No content solely conveyed by color

### Branding
- **Color Palette** (per BRANDING_GUIDELINE.md):
  - Primary Blue: `#1E3A8A` (headings, links)
  - Dark Navy: `#0F172A` (body text)
  - Soft Gray: `#F1F5F9` (backgrounds, dividers)
  - Accent Gold: `#F59E0B` (highlights, hover states)
- **Typography:**
  - Headings: Inter or Poppins, 700 (Bold)
  - Body: Inter or System UI, 400 (Regular)
  - Line height: 1.6 for body text (readability)
  - Font sizes:
    - h1: 36px / 2.25rem
    - h2: 24px / 1.5rem
    - h3: 20px / 1.25rem
    - Body: 16px / 1rem
- **Logo Usage:**
  - Legends Ascend logo in header (links back to home)
  - Maintain 20px clear space around logo
  - Use SVG format

### Internationalization (i18n) Readiness
- **UK English Standard:**
  - All text uses UK spelling: "Personalise", "Utilise", "Recognise"
  - Date format: DD/MM/YYYY (e.g., "Last Updated: 06/11/2025")
- **Localization Structure:**
  - Content externalizable for future translation
  - MDX/Markdown files can be duplicated for locales (e.g., `privacy-policy.en-GB.mdx`, `privacy-policy.de.mdx`)
  - No hard-coded strings in components (use i18n constants)

### Observability
- **Logging:**
  - Log page access (basic analytics) if tracking is implemented
  - Monitor 404 errors for broken privacy policy links
- **Metrics:**
  - Track page views
  - Track time spent on page (engagement metric)
  - Monitor "Contact Us" link clicks
- **Monitoring:**
  - Alert if privacy policy page returns errors
  - Monitor for accessibility violations (automated testing)

---

## Acceptance Criteria

### AC-1: Privacy Policy Page is Accessible and Renders Correctly
**Given** a user navigates to `/privacy-policy`,  
**When** the page loads,  
**Then** the privacy policy page displays with:
- Legends Ascend header with logo and navigation
- Page title "Privacy Policy"
- Effective date and last updated date prominently displayed
- Table of Contents with clickable links to sections
- All required GDPR-compliant sections (see FR-2)
- Footer with contact information
- Responsive design adapting to mobile, tablet, and desktop viewports

**Edge Cases:**
- Page loads within 2.5 seconds on 3G Fast connection
- No layout shift during page load (CLS < 0.1)
- All images (logo) load correctly or have fallback

### AC-2: GDPR-Compliant Content Sections are Complete
**Given** a user reads the privacy policy,  
**When** they scroll through the content,  
**Then** all required sections are present and comprehensive:
- Introduction and Data Controller Information
- Data We Collect (specific and clear)
- Legal Basis for Processing (GDPR Article 6 compliance)
- How We Use Your Data
- Data Sharing and Third-Party Services (EmailOctopus disclosed)
- International Data Transfers
- Data Retention policies
- User Rights Under GDPR (all 7+ rights listed with instructions)
- Cookies and Tracking Technologies
- Security Measures
- Children's Privacy
- Changes to This Privacy Policy
- Contact Us section with privacy@legends-ascend.com

**Edge Cases:**
- Content is clear and understandable (not legalese-heavy, but legally compliant)
- Links to third-party policies (EmailOctopus) open in new tabs
- All sections are accurately reflect MVP scope (note features "coming soon" if applicable)

### AC-3: Version Control Information is Displayed
**Given** a user views the privacy policy,  
**When** they look at the top of the page,  
**Then** they see:
- Effective Date: DD/MM/YYYY format
- Last Updated: DD/MM/YYYY format
- Version number (optional: "Version 1.0")
- Dates update automatically when content changes (via git commit date or manual update)

**Edge Cases:**
- If no updates have been made, "Effective Date" and "Last Updated" are the same
- Future: Link to version history page (out of scope for MVP but prepare structure)

### AC-4: Table of Contents Navigation Works
**Given** a user interacts with the Table of Contents,  
**When** they click on a section link,  
**Then** the page smoothly scrolls to the corresponding section
- Anchor links work correctly (`#data-we-collect`, etc.)
- Active section is highlighted in TOC (optional but nice-to-have)
- TOC is sticky on desktop for easy navigation
- TOC is collapsible on mobile to save space
- "Back to top" button appears on scroll

**Edge Cases:**
- Clicking TOC link does not cause page to jump abruptly
- Browser back button works correctly after navigating via anchors
- TOC remains accessible on all viewport sizes

### AC-5: Accessibility Standards Met (WCAG 2.1 AA)
**Given** a user with accessibility needs,  
**When** they interact with the privacy policy page,  
**Then** all WCAG 2.1 AA requirements are met:
- Semantic HTML structure (headings, sections, lists)
- Proper heading hierarchy (h1 > h2 > h3)
- All links are keyboard accessible and have visible focus indicators
- Color contrast meets 4.5:1 for body text, 3:1 for headings
- Page scales to 200% zoom without loss of content or functionality
- Screen reader announces all content correctly
- Skip link to main content is present and functional
- ARIA labels used appropriately (e.g., `<nav aria-label="Table of Contents">`)

**Edge Cases:**
- High contrast mode (Windows) maintains readability
- Screen reader testing (NVDA, JAWS, VoiceOver): All sections announced correctly
- Keyboard-only navigation: Logical tab order through TOC, sections, and links

### AC-6: Responsive Design Across All Devices
**Given** a user accesses the privacy policy on various devices,  
**When** the viewport size changes,  
**Then** the layout adapts appropriately:
- Mobile (320px – 639px): Single-column, collapsible TOC, readable text
- Tablet (640px – 1023px): Balanced layout, TOC may be inline or sidebar
- Desktop (1024px+): Sidebar TOC (sticky), optimized reading width (max 800px for body)
- All text remains readable at all breakpoints
- No horizontal scrolling

**Edge Cases:**
- Very small screens (320px): Content remains readable without excessive zoom
- Large screens (>1920px): Content doesn't stretch excessively (max-width container)

### AC-7: Print-Friendly Styling Works
**Given** a user wants to print the privacy policy,  
**When** they use browser print function (Ctrl+P or Cmd+P),  
**Then** the print preview shows:
- Clean layout without navigation or non-essential elements
- Full URLs displayed for external links
- Optimized font sizes and spacing for print
- Page breaks don't awkwardly split sections
- Header with document title and print date

**Edge Cases:**
- Multi-page print: Header/footer on each page (browser default)
- Links to anchors within document don't show full URLs
- Images (logo) print correctly

### AC-8: SEO and Metadata Configured
**Given** the privacy policy page is published,  
**When** it is crawled by search engines or shared on social media,  
**Then** appropriate metadata is present:
- Page title: "Privacy Policy | Legends Ascend"
- Meta description describing privacy policy content
- Canonical URL set to `/privacy-policy`
- Robots meta tag allows indexing
- Open Graph tags for social sharing
- Language declared as `en-GB`
- Structured data (JSON-LD) for webpage

**Edge Cases:**
- Social media preview (LinkedIn, Twitter): Shows title and description
- Google search result: Shows correct title and description snippet

### AC-9: Integration with Landing Page (US-001)
**Given** a user on the landing page (US-001) clicks the Privacy Policy link in the consent checkbox label,  
**When** the link is clicked,  
**Then** the privacy policy page opens:
- In a new tab (target="_blank" with rel="noopener noreferrer")
- Or in a modal overlay (alternative implementation)
- User can easily return to landing page

**Edge Cases:**
- If modal implementation, modal is accessible (keyboard, screen reader, Esc to close)
- If new tab, tab has proper title for easy identification

---

## Test Scenarios

### TS-1: Happy Path – Access Privacy Policy from Landing Page (Maps to AC-9)
**Preconditions:** Landing page (US-001) is deployed with Privacy Policy link  
**Steps:**
1. Navigate to landing page (`/`)
2. Locate GDPR consent checkbox with Privacy Policy link
3. Click "Privacy Policy" link
4. Observe privacy policy page opens (new tab or modal)
5. Read privacy policy content
6. Verify all sections are present and readable
7. Close tab or modal and return to landing page

**Expected Result:**  
- Privacy policy page loads successfully
- All required sections are visible
- User can easily navigate back to landing page
- No broken links or missing content

### TS-2: Direct URL Access to Privacy Policy (Maps to AC-1)
**Preconditions:** Privacy policy page is deployed  
**Steps:**
1. Navigate directly to `/privacy-policy`
2. Observe page loads with full layout
3. Verify header with logo and navigation
4. Verify all content sections render correctly
5. Check responsive behavior on mobile and desktop

**Expected Result:**  
- Page loads within 2.5 seconds
- All content is readable and properly formatted
- Responsive design works across devices
- No console errors

### TS-3: Table of Contents Navigation (Maps to AC-4)
**Preconditions:** Privacy policy page loaded  
**Steps:**
1. Scroll to Table of Contents
2. Click on "Data We Collect" link
3. Observe page scrolls smoothly to "Data We Collect" section
4. Click on "Your Rights Under GDPR" link
5. Observe page scrolls to that section
6. Click "Back to top" button (if visible)
7. Observe page scrolls to top

**Expected Result:**  
- All TOC links navigate to correct sections
- Smooth scroll animation (if implemented)
- No page jumps or broken anchors
- "Back to top" button works correctly

### TS-4: Keyboard Navigation (Maps to AC-5)
**Preconditions:** Privacy policy page loaded, user uses keyboard only  
**Steps:**
1. Press Tab key to navigate through:
   - Logo/header navigation
   - Table of Contents links
   - Section headings (if focusable)
   - External links (EmailOctopus privacy policy, etc.)
   - Contact email link
2. Press Enter on a TOC link
3. Observe navigation works via keyboard

**Expected Result:**  
- All interactive elements receive visible focus indicators
- Tab order is logical (top to bottom)
- TOC links navigate correctly via Enter key
- No keyboard traps

### TS-5: Screen Reader Compatibility (Maps to AC-5)
**Preconditions:** Screen reader enabled (NVDA, JAWS, or VoiceOver)  
**Steps:**
1. Navigate privacy policy page with screen reader
2. Listen to announced content for:
   - Page title
   - Section headings
   - TOC links
   - Body text
   - External links
3. Verify all content is announced clearly

**Expected Result:**  
- Semantic HTML ensures correct announcement order
- Headings are announced with level (h1, h2, h3)
- Links have descriptive text
- No missing alt text or labels

### TS-6: Responsive Design – Mobile (Maps to AC-6)
**Preconditions:** Browser set to mobile viewport (375x667, iPhone SE)  
**Steps:**
1. Load privacy policy page
2. Observe layout adapts to mobile view
3. Test TOC collapsibility (if collapsible)
4. Scroll through all sections
5. Verify all text is readable without horizontal scrolling

**Expected Result:**  
- Single-column layout
- TOC is accessible (collapsible or inline)
- No horizontal scrolling
- Text remains readable without pinch-to-zoom

### TS-7: Print Functionality (Maps to AC-7)
**Preconditions:** Privacy policy page loaded  
**Steps:**
1. Open browser print dialog (Ctrl+P or Cmd+P)
2. Preview print output
3. Verify layout is clean (no nav, optimized for print)
4. Verify links show full URLs
5. Print to PDF or paper

**Expected Result:**  
- Print preview shows clean layout
- Navigation and non-essential elements hidden
- External links display full URLs
- Page breaks are appropriate
- Header with document title visible

### TS-8: SEO Metadata Verification (Maps to AC-8)
**Preconditions:** Privacy policy page deployed in production  
**Steps:**
1. Inspect page source (`view-source:/privacy-policy`)
2. Verify `<title>` tag: "Privacy Policy | Legends Ascend"
3. Verify meta description is present
4. Verify Open Graph tags (`og:title`, `og:description`, `og:url`)
5. Verify canonical URL
6. Test social media sharing (LinkedIn, Twitter)

**Expected Result:**  
- All metadata tags present and correct
- Social media preview shows title and description
- No duplicate or missing meta tags

### TS-9: Version Control Display (Maps to AC-3)
**Preconditions:** Privacy policy page loaded  
**Steps:**
1. Locate version information at top of page
2. Verify "Effective Date" is displayed (DD/MM/YYYY format)
3. Verify "Last Updated" is displayed
4. If version number present, verify it's correct (e.g., "Version 1.0")

**Expected Result:**  
- Dates are formatted correctly (UK standard)
- Dates are prominently displayed
- Version information is clear

### TS-10: Content Completeness – GDPR Sections (Maps to AC-2)
**Preconditions:** Privacy policy page loaded  
**Steps:**
1. Scroll through entire privacy policy
2. Verify presence of all required sections:
   - Introduction
   - Data Controller Information
   - Data We Collect
   - Legal Basis for Processing
   - How We Use Your Data
   - Data Sharing and Third-Party Services
   - International Data Transfers
   - Data Retention
   - Your Rights Under GDPR (all 7+ rights)
   - Cookies and Tracking Technologies
   - Security Measures
   - Children's Privacy
   - Changes to This Privacy Policy
   - Contact Us
3. Verify EmailOctopus is disclosed as third-party service
4. Verify privacy@legends-ascend.com email is present

**Expected Result:**  
- All required sections are present
- Content is comprehensive and clear
- EmailOctopus and other third parties disclosed
- Contact information is correct and accessible

---

## Technical Notes

### Content Management Approach

**Recommended: MDX (Markdown + JSX)**

**File Structure:**
```
apps/web/src/content/
  privacy-policy.mdx
```

**MDX Frontmatter:**
```yaml
---
title: Privacy Policy
effectiveDate: 2025-11-06
lastUpdated: 2025-11-06
version: 1.0
language: en-GB
---
```

**Component:**
```typescript
// apps/web/src/app/privacy-policy/page.tsx
import { PrivacyPolicyContent } from '@/content/privacy-policy.mdx';
import { PrivacyPolicyLayout } from '@/components/legal/PrivacyPolicyLayout';

export const metadata = {
  title: 'Privacy Policy | Legends Ascend',
  description: 'Learn how Legends Ascend collects, uses, and protects your personal data in compliance with GDPR.',
  // ... other metadata
};

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicyLayout>
      <PrivacyPolicyContent />
    </PrivacyPolicyLayout>
  );
}
```

**Alternative: Pure React Component**

If MDX is not preferred, create a structured React component:
```typescript
// apps/web/src/components/legal/PrivacyPolicyContent.tsx
export const PrivacyPolicyContent = () => {
  const effectiveDate = '06/11/2025';
  const lastUpdated = '06/11/2025';
  const version = '1.0';

  return (
    <article>
      <header>
        <h1>Privacy Policy</h1>
        <p>Effective Date: {effectiveDate}</p>
        <p>Last Updated: {lastUpdated}</p>
        <p>Version: {version}</p>
      </header>
      
      <nav aria-label="Table of Contents">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          {/* ... other TOC items */}
        </ul>
      </nav>
      
      <section id="introduction">
        <h2>Introduction</h2>
        {/* Content */}
      </section>
      
      {/* ... other sections */}
    </article>
  );
};
```

### Routing
- **Next.js App Router:** `apps/web/src/app/privacy-policy/page.tsx`
- **URL:** `https://legends-ascend.com/privacy-policy`
- **Layout:** Inherits from root layout or custom legal pages layout

### Styling
- Use Tailwind CSS classes matching branding guidelines
- Custom styles for print media:
  ```css
  @media print {
    nav, header, footer { display: none; }
    a::after { content: " (" attr(href) ")"; }
    /* ... other print styles */}
  }
  ```

### Data Model
- **Not applicable:** No database schema needed
- Content stored in version-controlled files (MDX or React components)
- Metadata (effectiveDate, lastUpdated, version) in frontmatter or constants

### Database/Migrations
- **Not applicable:** No database changes required

### Integration Points

**EmailOctopus Privacy Policy Link:**
- Link to: `https://emailoctopus.com/legal/privacy`
- Open in new tab: `target="_blank" rel="noopener noreferrer"`

**Landing Page Integration (US-001):**
- Update consent checkbox label in `EmailSignupForm.tsx`:
  ```tsx
  <label>
    <input type="checkbox" required />
    I consent to receive marketing emails and acknowledge the{' '}
    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
      Privacy Policy
    </a>
    .
  </label>
  ```

**Navigation Links:**
- Add Privacy Policy link to footer (if footer exists)
- Ensure Privacy Policy is accessible from all pages

### Version Control Strategy
- **Git-based versioning:**
  - Each content update is a git commit
  - Commit message: "docs(privacy): [brief description of change]"
  - Example: "docs(privacy): add cookie policy section"
- **Automated Last Updated Date:**
  - Option A: Manual update in frontmatter
  - Option B: Use git commit date (requires build-time script)
  - Recommended: Manual update for accuracy and control
- **Future Enhancement:** 
  - Create `/privacy-policy/history` page showing all versions
  - Link to specific git commits for transparency

### Failure Modes and Resilience
- **Failure Mode:** Privacy policy page fails to load (404 or 500 error)  
  **Detection:** Monitoring alerts on 4xx/5xx errors for `/privacy-policy`  
  **Fallback:** Serve static HTML version from CDN or show generic error page with contact info  
  **User Impact:** Cannot access privacy policy, blocks landing page signups (Privacy Policy link broken)

- **Failure Mode:** Privacy policy content outdated (stale information)  
  **Detection:** Manual review cadence (quarterly or when features change)  
  **Fallback:** Update content and deploy new version  
  **User Impact:** Users may receive outdated privacy information (compliance risk)

- **Failure Mode:** Broken links to third-party policies (EmailOctopus)  
  **Detection:** Automated link checker (CI/CD pipeline)  
  **Fallback:** Update links or add warning if third-party policy moved  
  **User Impact:** Users cannot verify third-party data handling

### Environment Variables
- **Not applicable:** No sensitive configuration needed for static content page
- Future: If using CMS or dynamic content, may require API keys

---

## Task Breakdown

### Phase 1: Content Creation and Legal Review
- [ ] Draft comprehensive privacy policy content covering all GDPR requirements
- [ ] Include all sections listed in FR-2
- [ ] Use clear, user-friendly language (avoid excessive legalese)
- [ ] Disclose all data collection practices (EmailOctopus, analytics, etc.)
- [ ] Specify user rights and how to exercise them
- [ ] Submit content for legal review and approval (external to development)
- [ ] Incorporate legal feedback and finalize content

### Phase 2: Technical Setup (Coding Agent)
- [ ] Create privacy policy route: `apps/web/src/app/privacy-policy/page.tsx`
- [ ] Set up content management approach (MDX or React component)
- [ ] Create `PrivacyPolicyLayout` component with header, TOC, and footer
- [ ] Implement Table of Contents with anchor links
- [ ] Configure Next.js metadata for SEO
- [ ] Set up version control frontmatter (effectiveDate, lastUpdated, version)

### Phase 3: Frontend Implementation (Coding Agent)
- [ ] Implement responsive layout matching branding guidelines
- [ ] Style all content sections with Tailwind CSS (colors, typography per BRANDING_GUIDELINE.md)
- [ ] Create sticky/collapsible Table of Contents
- [ ] Implement smooth scroll for anchor links
- [ ] Add "Back to top" button
- [ ] Implement print stylesheet
- [ ] Ensure keyboard navigation and focus indicators
- [ ] Add breadcrumb navigation (Home > Privacy Policy)

### Phase 4: Accessibility Implementation (Coding Agent)
- [ ] Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)
- [ ] Ensure proper heading hierarchy (h1 > h2 > h3)
- [ ] Add ARIA labels where necessary (TOC navigation)
- [ ] Implement skip link to main content
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter)
- [ ] Ensure page scales to 200% zoom

### Phase 5: Integration with Landing Page (Coding Agent)
- [ ] Update landing page consent checkbox to link to `/privacy-policy`
- [ ] Decide on link behavior (new tab vs. modal)
- [ ] If modal: Implement accessible modal component
- [ ] If new tab: Add `target="_blank" rel="noopener noreferrer"`
- [ ] Test integration flow: Landing page → Privacy Policy → Back to Landing

### Phase 6: SEO and Metadata (Coding Agent)
- [ ] Configure Next.js metadata in `page.tsx`
- [ ] Add page title, meta description, Open Graph tags
- [ ] Add Twitter Card metadata
- [ ] Set canonical URL
- [ ] Configure robots meta tag (index, follow)
- [ ] Add structured data (JSON-LD) for webpage
- [ ] Test social media preview (LinkedIn, Twitter)

### Phase 7: Testing (Testing Agent)
- [ ] Write unit tests for PrivacyPolicyLayout component (React Testing Library)
- [ ] Write E2E tests for privacy policy page access (Playwright)
- [ ] Test TOC navigation (anchor links)
- [ ] Test keyboard navigation
- [ ] Test responsive design on mobile, tablet, desktop
- [ ] Test print functionality
- [ ] Run automated accessibility tests (axe-core, WAVE, Lighthouse)
- [ ] Manual screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Phase 8: Content Verification
- [ ] Verify all required GDPR sections are present (FR-2 checklist)
- [ ] Verify EmailOctopus disclosure is accurate
- [ ] Verify user rights section includes all 7+ GDPR rights
- [ ] Verify contact information is correct (privacy@legends-ascend.com)
- [ ] Verify dates are formatted correctly (DD/MM/YYYY)
- [ ] Proofread for spelling, grammar, and clarity
- [ ] Ensure UK English spelling throughout

### Phase 9: Performance and Security Review
- [ ] Run Lighthouse audit (target: 90+ for Performance, Accessibility, Best Practices, SEO)
- [ ] Verify LCP < 2.5s, CLS < 0.1, FID/INP < 100ms
- [ ] Security review: No XSS vulnerabilities, secure headers configured
- [ ] Test privacy email link (spam-protected if needed)
- [ ] Verify no sensitive information exposed in page source

### Phase 10: Documentation and Deployment
- [ ] Update README.md with privacy policy update process
- [ ] Document how to update privacy policy content (MDX file or component)
- [ ] Create `.env.example` entry if any env vars needed (unlikely for MVP)
- [ ] Add comments in code for complex logic (TOC generation, anchor links)
- [ ] Create deployment checklist:
  - [ ] Legal approval received for content
  - [ ] Privacy email configured (privacy@legends-ascend.com)
  - [ ] Landing page link tested and functional
  - [ ] All tests passing
  - [ ] Lighthouse score 90+

### Phase 11: Final Verification
- [ ] Code review for technical compliance (TECHNICAL_ARCHITECTURE.md)
- [ ] Code review for branding compliance (BRANDING_GUIDELINE.md)
- [ ] Code review for accessibility compliance (ACCESSIBILITY_REQUIREMENTS.md)
- [ ] Smoke test on staging environment
- [ ] Verify integration with landing page (US-001)
- [ ] Cross-browser and cross-device testing
- [ ] Legal final approval (external)

---

## Definition of Ready Confirmation

This user story has been validated against all DoR checklist items per [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md):

### ✅ Story Structure
- [x] User story format: "As a [role], I want [goal], so that [benefit]"
- [x] Clear, concise title with story ID (US-002)
- [x] Story points estimated: 5 (Fibonacci scale)
- [x] Priority assigned: MUST (MoSCoW)
- [x] Epic/Feature linked: Pre-Launch & Marketing Foundation

### ✅ Acceptance Criteria Completeness
- [x] Clear & testable acceptance criteria (9 ACs)
- [x] Test scenarios documented (10 scenarios mapping to ACs)
- [x] Edge cases identified (broken links, slow loads, print issues, etc.)
- [x] Football management context: Privacy policy applies to all platform users (managers, players)
- [x] UI/UX requirements specified with branding/accessibility references

### ✅ Internationalization & Localization
- [x] UK English standard applied
- [x] International football terminology (not directly applicable to legal page)
- [x] Metric system noted (not directly applicable)
- [x] Date/time formatting specified (DD/MM/YYYY display)
- [x] Localization ready: content externalizable via MDX or i18n structure

### ✅ Technical Requirements & Architecture
- [x] Architecture compliance: References TECHNICAL_ARCHITECTURE.md
- [x] Technology stack fit: Next.js 14+, React 18+, TypeScript
- [x] API design: Not applicable (static content page)
- [x] Database impact: None (content in version-controlled files)
- [x] Performance considerations: LCP < 2.5s, CLS < 0.1, text-based content
- [x] Security requirements: Secure headers, spam-protected email, no XSS

### ✅ Dependencies & Integration
- [x] Story dependencies: US-001 (Landing Page) – Privacy Policy link integration
- [x] Technical dependencies: Next.js, MDX or React components, git for version control
- [x] Third-party services: EmailOctopus (disclosed in policy)

### ✅ Testing & Quality Assurance
- [x] Test strategy: Unit tests (components), E2E tests (page access, navigation), accessibility tests
- [x] Browser compatibility: Chrome, Firefox, Safari, Edge
- [x] Performance benchmarks: LCP < 2.5s, CLS < 0.1, FID/INP < 100ms
- [x] Accessibility testing: Automated tools + manual screen reader testing

### ✅ AI Development Considerations
- [x] AI implementation context: Detailed requirements, content sections, integration points
- [x] Business logic examples: TOC navigation, anchor links, responsive design
- [x] Integration patterns: Next.js routing, MDX content management, landing page linking
- [x] Expected behavior: User flows, navigation, responsive design
- [x] Error handling: 404 errors, broken links, fallback content

### ✅ Compliance & Standards
- [x] Branding compliance: References BRANDING_GUIDELINE.md (colors, typography, logo)
- [x] Accessibility compliance: References ACCESSIBILITY_REQUIREMENTS.md (WCAG 2.1 AA)
- [x] Code standards: TypeScript, naming conventions from TECHNICAL_ARCHITECTURE.md
- [x] Documentation requirements: README updates, code comments, update process docs

### ✅ Definition of Done Alignment
- [x] DoD compatibility: Story can meet all DoD criteria (tests, docs, reviews)
- [x] Review process: Code review, accessibility review, legal review, performance review
- [x] Deployment considerations: Legal approval required, privacy email setup

---

## Reporting & Handover

### PR Description Template (for Implementation)

```markdown
## Summary
Implements US-002: Privacy Policy Page with GDPR Compliance and Regular Updates.

## Changes
- ✅ Created privacy policy page at `/privacy-policy` route
- ✅ Implemented GDPR-compliant content covering all required sections
- ✅ Added version control with effective date and last updated timestamp
- ✅ Created Table of Contents with anchor link navigation
- ✅ Ensured WCAG 2.1 AA accessibility compliance
- ✅ Applied branding guidelines (colors, typography, logo)
- ✅ Implemented responsive design for mobile/tablet/desktop
- ✅ Added print-friendly styling
- ✅ Configured SEO metadata and Open Graph tags
- ✅ Integrated privacy policy link with landing page (US-001)

## Testing
- ✅ Unit tests: PrivacyPolicyLayout and TOC components
- ✅ E2E tests: Page access, TOC navigation, responsive design
- ✅ Accessibility tests: axe-core, keyboard navigation, screen reader testing
- ✅ Performance tests: Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO)
- ✅ Cross-browser testing: Chrome, Firefox, Safari, Edge
- ✅ Print testing: Verified clean print output
- ✅ Integration testing: Landing page Privacy Policy link works

## Compliance
- ✅ TECHNICAL_ARCHITECTURE.md: Next.js 14, TypeScript, routing patterns
- ✅ BRANDING_GUIDELINE.md: Colors, typography, logo usage
- ✅ ACCESSIBILITY_REQUIREMENTS.md: WCAG 2.1 AA (keyboard, screen reader, contrast)
- ✅ DEFINITION_OF_READY.md: All DoR criteria met
- ✅ GDPR compliance: All required sections, user rights, third-party disclosures
- ✅ Legal review: Content approved by legal team/counsel (external)

## Content Summary
Privacy policy includes:
- Data collection transparency (email, consent, IP hashing)
- Legal basis for processing (GDPR Article 6)
- User rights (access, rectification, erasure, portability, objection, withdraw consent, complain)
- Third-party disclosures (EmailOctopus with link to their privacy policy)
- Data retention policies
- Security measures overview
- International data transfer disclosures
- Children's privacy statement
- Contact information (privacy@legends-ascend.com)

## Screenshots
[Include screenshots of privacy policy page on desktop, tablet, mobile, and print preview]

## Deployment Notes
- Privacy policy content has received legal approval (confirm before merging)
- Privacy email (privacy@legends-ascend.com) must be configured and monitored
- Landing page (US-001) must be updated to link to privacy policy
- Verify link integration works before deploying to production
```

---

## Security Summary

**Vulnerabilities Discovered:** None (new feature, static content page)

**Security Measures Implemented:**
- Secure HTTP headers (CSP, X-Frame-Options, X-Content-Type-Options)
- XSS prevention via Next.js built-in sanitization (no user-generated content)
- Spam-protected email display for privacy@legends-ascend.com
- External links use `rel="noopener noreferrer"` to prevent tabnabbing
- HTTPS enforcement (redirect HTTP to HTTPS)
- No sensitive information exposed in page source or metadata
- Print stylesheet doesn't expose sensitive internal routes

**Ongoing Security Considerations:**
- Regularly review and update privacy policy content (quarterly or when features change)
- Monitor for broken links to third-party policies (automated link checker)
- Ensure privacy email is monitored and responses are timely
- Keep Next.js and dependencies updated (npm audit)
- Conduct periodic security audits of page and content

---

## Clarification Questions

**None at this time.** All requirements are sufficiently detailed based on the problem statement, foundation documents, and GDPR compliance standards. If implementation uncovers ambiguities (e.g., specific legal phrasing required by counsel), the team should raise them during development and consult with legal advisor.

**Optional Future Enhancements (Out of Scope for MVP):**
- Privacy policy version history page (`/privacy-policy/history`)
- Automated email notifications to subscribers when policy updates (requires user database)
- Interactive privacy preference management dashboard
- Multi-language support (translations beyond UK English)
- Cookie consent banner integration (separate story)
- Downloadable PDF version of privacy policy
- Privacy policy change comparison tool (diff view)
- Integration with Privacy-as-a-Service platforms (e.g., OneTrust, TrustArc)

---

## Notes

### GDPR Compliance Checklist (Reminder for Content)
- ✅ Transparency: Clear explanation of data collection and use
- ✅ Lawful basis: Consent, legitimate interests, contract (as applicable)
- ✅ Data minimization: Only collect what's necessary
- ✅ Purpose limitation: Use data only for stated purposes
- ✅ Accuracy: Explain how users can correct data
- ✅ Storage limitation: Define retention periods
- ✅ Integrity and confidentiality: Describe security measures
- ✅ Accountability: Provide contact for data protection officer or privacy inquiries
- ✅ User rights: Access, rectification, erasure, restriction, portability, objection, withdraw consent
- ✅ Breach notification: Explain procedures (if applicable)
- ✅ International transfers: Disclose and explain safeguards
- ✅ Automated decision-making: Disclose if applicable (not in MVP)
- ✅ Children's data: Address age requirements and parental consent

### UK GDPR vs. EU GDPR
- UK GDPR (post-Brexit) closely mirrors EU GDPR with minor differences
- For MVP, follow strictest interpretation (EU GDPR) to cover both jurisdictions
- Supervisory authority for UK: Information Commissioner's Office (ICO)
- Supervisory authority for EU: Varies by member state (e.g., CNIL in France, BfDI in Germany)
- Include language: "For UK residents, you have the right to lodge a complaint with the ICO."

### Privacy Policy Update Cadence
- **Minimum:** Review and update when significant features launch (e.g., user accounts, payments, game data collection)
- **Recommended:** Quarterly review to ensure accuracy
- **Trigger events:** New third-party integrations, data processing changes, legal requirement changes
- **Communication:** Email subscribers about material changes (future feature)

### Third-Party Service Disclosures
- **EmailOctopus:** Email service provider for marketing emails
  - Link: https://emailoctopus.com/legal/privacy
  - Data shared: Email address, consent timestamp
  - Location: UK/EU servers (verify with EmailOctopus)
- **Future Third Parties:** Analytics (Google Analytics, Plausible), hosting (Vercel, AWS), payment processors (Stripe), etc.

### Content Tone and Style
- **Tone:** Professional, transparent, user-friendly
- **Style:** Clear and concise, avoid excessive legal jargon
- **Example Good:** "We collect your email address when you sign up for updates."
- **Example Bad:** "The Data Controller shall process personal data in accordance with applicable data protection legislation."
- **Balance:** Legally compliant but understandable to average user

### Accessibility Best Practices for Legal Pages
- Long-form content requires extra attention to readability
- Use short paragraphs (3-5 sentences max)
- Use bullet points and numbered lists for clarity
- Break up text with headings and subheadings
- Provide Table of Contents for easy navigation
- Use sufficient line-height (1.6) for body text
- Avoid justified text alignment (use left-aligned)
- Ensure sufficient color contrast throughout

### Print Stylesheet Considerations
- Hide navigation, headers, footers, and non-essential UI
- Display full URLs for external links using `::after { content: " (" attr(href) ")"; }`
- Use black text on white background for print economy
- Adjust font sizes for print readability (slightly smaller than screen)
- Ensure page breaks don't split headings from content
- Add header with document title and print date on each page (if possible)

---

**Document Status:** ✅ Ready for Development  
**Next Steps:** Assign to Coding Agent and Testing Agent for implementation per task breakdown. **Legal review and approval required before deployment.**

---

*This user story complies with all requirements specified in DEFINITION_OF_READY.md and references all mandatory foundation documents: TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md.*

**Version:** 1.0  
**Author:** Technical Business Analyst Agent  
**Created:** 2025-11-06  
**Last Updated:** 2025-11-06
