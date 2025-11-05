# User Story: Landing Page with Hero Background, EmailOctopus Signup, and GDPR Compliance

---

## Story Metadata

**Title:** Landing Page – Hero Background, EmailOctopus Signup, GDPR Compliance  
**ID:** US-001  
**Story Points:** 8 (Fibonacci scale)  
**Priority:** MUST (MoSCoW)  
**Epic/Feature:** Marketing Site / Landing Page  
**Created:** 2025-11-04  
**Status:** Ready for Development

---

## User Story

**As a** prospective Legends Ascend player visiting the website,  
**I want** to see an engaging hero section with background media and easily sign up for email updates with confidence that my data is protected,  
**so that** I can learn about the game, stay informed of launch updates, and trust that my privacy is respected in compliance with GDPR and international data protection standards.

---

## Context

### Summary
Create the MVP landing page for Legends Ascend featuring an immersive hero section with high-quality background media (image or video), an integrated email capture form using EmailOctopus API, and full GDPR compliance with international privacy standards. The page must provide a compelling first impression while respecting user privacy and accessibility.

### Scope

**In Scope:**
- Hero section with background image or video from AI-generated assets
- Email capture form integrated with EmailOctopus API
- GDPR-compliant consent mechanism with explicit checkbox
- Privacy policy link and regional disclosure (EU resident assumption)
- Responsive design for all device sizes
- WCAG 2.1 AA accessibility compliance
- SEO-friendly asset naming and meta tags
- UK English copy with metric units where applicable
- Core Web Vitals optimization (LCP < 2.5s on 3G Fast, CLS < 0.1)
- Reduced-motion support for users with motion sensitivity
- Double opt-in email subscription flow

**Out of Scope:**
- Full website content beyond landing page
- User authentication/login functionality
- Game features or gameplay demonstrations
- Advanced analytics beyond basic page tracking
- Multi-language support (i18n implementation for future, but strings must be externalisable)
- Cookie consent banner (separate story if needed)
- Multiple landing page variants/A-B testing

### Assumptions
- EmailOctopus account is set up with API access
- Environment variables (`EMAILOCTOPUS_LIST_ID`, `EMAILOCTOPUS_API_KEY`) will be provided by DevOps
- Privacy Policy page exists or will be created concurrently
- Hero media assets (image and/or video) are available in `/assets/` folder
- Next.js/React stack is the chosen framework per TECHNICAL_ARCHITECTURE.md
- Target audience is international with GDPR (EU) as primary jurisdiction baseline
- Double opt-in is enabled in EmailOctopus list settings
- Hosting environment supports serverless functions for API routes

### Dependencies

**Story Dependencies:**
- None (this is a foundational MVP feature)

**Technical Dependencies:**
- Next.js 14+ with App Router (per TECHNICAL_ARCHITECTURE.md)
- React 18+
- TypeScript (strict mode)
- EmailOctopus API (external service)
- Environment variable configuration system
- Node.js LTS (v20.x)

**Foundation Document Dependencies:**
- [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md) – Tech stack, naming conventions, API patterns
- [BRANDING_GUIDELINE.md](../BRANDING_GUIDELINE.md) – Colors, typography, logo usage
- [ACCESSIBILITY_REQUIREMENTS.md](../ACCESSIBILITY_REQUIREMENTS.md) – WCAG 2.1 AA compliance
- [AI_PROMPT_ENGINEERING.md](../AI_PROMPT_ENGINEERING.md) – AI integration patterns (if applicable)
- [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md) – Story quality standards

---

## Functional Requirements

### FR-1: Hero Section with Background Media
- Display full-viewport hero section with background image or video
- Image source: `/assets/hero/legends-ascend-football-stadium-hero.jpg` (renamed for SEO)
- Video source (if used): `/assets/hero/legends-ascend-stadium-intro.mp4` (renamed for SEO)
- If video is used:
  - Autoplay, loop, muted by default
  - Provide poster image for video placeholder
  - Lazy load video for performance
  - Respect `prefers-reduced-motion` media query (show static image instead)
- Overlay with semi-transparent gradient for text readability
- Hero content includes:
  - Legends Ascend logo (vectorized, from branding assets)
  - Headline: "Build Your Football Legacy" (UK English)
  - Subheadline: "The AI-powered football management game where every decision shapes your destiny"
  - Email signup form (see FR-2)

### FR-2: Email Capture Form
- Form fields:
  - Email address (required, validated)
  - Explicit GDPR consent checkbox (required, unchecked by default)
  - Submit button with clear CTA: "Join the Waitlist" or "Get Early Access"
- Form validation:
  - Email format validation (RFC 5322 compliant)
  - Require explicit checkbox consent before submission
  - Display clear error messages for invalid input
  - Prevent double-submission (disable button on submit)
- Accessibility:
  - All fields properly labeled with `<label>` elements
  - Error messages announced to screen readers (`role="alert"`)
  - Keyboard navigable with logical tab order
  - Focus indicators meet WCAG AA standards

### FR-3: EmailOctopus API Integration
- Create serverless API route: `/api/v1/subscribe` (RESTful pattern per TECHNICAL_ARCHITECTURE.md)
- HTTP Method: POST
- Request payload:
  ```json
  {
    "email": "user@example.com",
    "gdprConsent": true,
    "timestamp": "2025-11-04T21:10:21.331Z"
  }
  ```
- API route responsibilities:
  - Validate email format server-side
  - Verify `gdprConsent` is explicitly `true`
  - Call EmailOctopus API to add subscriber to list (use env vars for credentials)
  - Handle EmailOctopus API responses (success, already subscribed, errors)
  - Return appropriate HTTP status codes (200, 400, 409, 500)
  - Log subscription attempts (email hash, timestamp, outcome) for audit trail
  - Rate limiting: max 5 requests per IP per 5 minutes to prevent abuse
- Response payload:
  ```json
  {
    "success": true,
    "message": "Thank you! Check your email to confirm your subscription.",
    "status": "pending_confirmation"
  }
  ```
- Error handling:
  - Network errors: "Unable to connect. Please try again later."
  - Already subscribed: "This email is already on our list. Check your inbox for updates."
  - Invalid email: "Please enter a valid email address."
  - Server errors: "Something went wrong. Please try again."

### FR-4: GDPR Compliance and Privacy
- Explicit consent checkbox with label text:
  - "I consent to receive marketing emails from Legends Ascend and understand that I can unsubscribe at any time. By providing my email, I acknowledge that my data will be processed in accordance with the [Privacy Policy](#)."
- Privacy Policy link opens in new tab (or inline modal)
- Regional disclosure statement (below form):
  - "For EU residents: Your data is protected under GDPR. We store only your email address and consent timestamp."
- Data minimization:
  - Store only: email, consent flag, timestamp, IP hash (for rate limiting)
  - Do NOT collect: name, location, phone, or other personal data
- Double opt-in flow:
  - EmailOctopus sends confirmation email
  - User must click confirmation link to complete subscription
  - Display message after form submission: "Thank you! Check your email to confirm your subscription."
- User rights information (in Privacy Policy):
  - Right to access data
  - Right to erasure (unsubscribe)
  - Right to data portability
  - Contact email for data requests: privacy@legends-ascend.com (placeholder)

### FR-5: Responsive Design and Device Support
- Breakpoints (Tailwind CSS standards per TECHNICAL_ARCHITECTURE.md):
  - Mobile: 320px – 639px
  - Tablet: 640px – 1023px
  - Desktop: 1024px+
- Hero section adapts to viewport:
  - Mobile: Single-column layout, logo smaller, shorter headline
  - Tablet: Maintain hero proportions, optimize typography
  - Desktop: Full cinematic effect, larger typography
- Form scales appropriately on all devices
- Touch-friendly tap targets (minimum 44x44px per WCAG)

### FR-6: SEO and Metadata
- Page title: "Legends Ascend – Build Your Football Legacy | AI-Powered Manager Game"
- Meta description: "Join the waitlist for Legends Ascend, the revolutionary AI-powered football management game. Build your dream team, make strategic decisions, and compete in immersive simulations."
- Open Graph tags for social sharing:
  - `og:title`, `og:description`, `og:image` (hero image)
  - `og:type`: website
- Twitter Card metadata
- Favicon package (from branding assets)
- Structured data (JSON-LD) for organization/website
- Canonical URL
- Language declaration: `<html lang="en-GB">`

---

## Non-Functional Requirements

### Performance
- **Core Web Vitals Targets:**
  - Largest Contentful Paint (LCP): < 2.5 seconds on 3G Fast connection
  - Cumulative Layout Shift (CLS): < 0.1
  - First Input Delay (FID) / Interaction to Next Paint (INP): < 100ms
- **Optimization Strategies:**
  - Image: Use Next.js `<Image>` component with optimization, WebP format, responsive sizes
  - Video: Lazy load, compress with H.264 codec, max 5MB file size
  - Poster image for video (optimized JPEG or WebP)
  - Inline critical CSS, defer non-critical scripts
  - Preload hero fonts (Inter/Poppins per BRANDING_GUIDELINE.md)
  - Use server-side rendering (SSR) for initial page load
  - Implement service worker for offline fallback (optional, nice-to-have)

### Security
- **Input Validation:**
  - Server-side validation for all form inputs
  - Sanitize email input to prevent XSS
  - Use Zod schema for TypeScript validation
- **API Security:**
  - Environment variables for sensitive credentials (never commit secrets)
  - Rate limiting on subscribe endpoint (5 requests per IP per 5 minutes)
  - CSRF protection via Next.js built-in mechanisms
  - HTTPS enforcement (redirect HTTP to HTTPS)
  - Security headers: CSP, X-Frame-Options, X-Content-Type-Options
- **Data Protection:**
  - Hash IP addresses before logging (SHA-256)
  - No logging of full email addresses in plain text (hash for audit trail)
  - Secure transmission: TLS 1.3 minimum

### Accessibility
- **WCAG 2.1 Level AA Compliance** (per ACCESSIBILITY_REQUIREMENTS.md):
  - Color contrast: Minimum 4.5:1 for normal text, 3:1 for large text
  - Keyboard navigation: All interactive elements accessible via Tab/Shift+Tab
  - Focus indicators: 2px outline with 2px offset (Primary Blue or high contrast)
  - Screen reader support: Semantic HTML, ARIA labels where necessary
  - Alt text: Descriptive alt for logo, empty alt for decorative background
  - Form labels: All inputs properly labeled
  - Error messages: `role="alert"` for screen reader announcement
  - Scalable typography: Use rem units, support 200% zoom
- **Reduced Motion:**
  - Detect `prefers-reduced-motion` media query
  - If enabled, disable video autoplay and show static image
  - Disable any CSS animations/transitions

### Branding
- **Color Palette** (per BRANDING_GUIDELINE.md):
  - Primary Blue: `#1E3A8A` (CTA buttons, header elements)
  - Accent Gold: `#F59E0B` (highlights, hover states)
  - Dark Navy: `#0F172A` (text, overlay backgrounds)
  - Soft Gray: `#F1F5F9` (form background)
- **Typography**:
  - Headings: Inter or Poppins, 700 (Bold)
  - Body: Inter or System UI, 400 (Regular)
  - Hero headline: 48px / 3rem (desktop), 36px / 2.25rem (mobile)
  - Subheadline: 20px / 1.25rem
  - Form labels: 16px / 1rem
- **Logo Usage**:
  - Full-color logo on hero overlay
  - Maintain 20px clear space around logo
  - Use SVG format for scalability
- **Favicon**:
  - Use simplified icon version from `/assets/branding/`
  - Include multiple sizes (16x16, 32x32, 180x180, 512x512)

### Internationalization (i18n) Readiness
- **UK English Standard:**
  - All copy uses UK spelling: "Colour", "Optimise", "Customise"
  - Football terminology: "Football" (not "Soccer"), "Pitch" (not "Field"), "Manager" (not "Coach")
- **Metric System:**
  - Not directly applicable to landing page, but principle established
- **Date/Time Format:**
  - Timestamps in ISO 8601 format internally
  - Display format (if needed): DD/MM/YYYY
- **Localization Structure:**
  - All text strings externalized to constants/JSON files
  - Structure for future translation (en-GB as default locale)
  - No hard-coded strings in components

### Observability
- **Logging:**
  - Log all subscription attempts (timestamp, email hash, outcome, IP hash)
  - Log API errors with stack traces
  - Use structured logging (JSON format)
- **Metrics:**
  - Track form submission rate
  - Track EmailOctopus API success/failure rate
  - Track page load performance (Core Web Vitals)
  - Track error rates and types
- **Monitoring:**
  - Set up alerts for API failures (threshold: >5% failure rate)
  - Monitor rate limiting triggers
  - Track GDPR consent checkbox engagement

---

## Acceptance Criteria

### AC-1: Hero Section Renders with Background Media
**Given** a user visits the landing page,  
**When** the page loads,  
**Then** the hero section displays with:
- Full-viewport background image or video (based on available assets)
- Logo, headline, and subheadline visible with sufficient contrast
- Email signup form visible and interactive
- Semi-transparent overlay ensuring text readability (minimum 4.5:1 contrast)

**Edge Cases:**
- If video fails to load, fallback to static poster image
- If user has `prefers-reduced-motion` enabled, show static image only
- On slow connections, show optimized image first, lazy-load video

### AC-2: Email Form Validates and Requires GDPR Consent
**Given** a user interacts with the email signup form,  
**When** they attempt to submit without valid data,  
**Then** appropriate validation errors are displayed:
- "Please enter a valid email address" for invalid/empty email
- "You must consent to receive emails" if checkbox is unchecked
- Error messages are announced to screen readers
- Focus moves to the first invalid field

**Edge Cases:**
- Empty form submission shows both errors
- Valid email but no consent: only consent error shown
- Already subscribed email: user-friendly message displayed

### AC-3: Successful Subscription via EmailOctopus
**Given** a user enters a valid email and checks the GDPR consent checkbox,  
**When** they submit the form,  
**Then** the system:
- Disables the submit button (prevents double-click)
- Sends request to `/api/v1/subscribe` endpoint
- Receives success response from EmailOctopus
- Displays confirmation message: "Thank you! Check your email to confirm your subscription."
- Clears the form for potential re-use (or hides form entirely)

**Edge Cases:**
- EmailOctopus API timeout: "Unable to connect. Please try again later."
- Email already subscribed: "This email is already on our list. Check your inbox for updates."
- Network error: Graceful error message with retry option

### AC-4: GDPR Compliance Elements Present
**Given** a user views the email signup form,  
**When** they examine the form elements,  
**Then** they see:
- Explicit consent checkbox (unchecked by default, required)
- Consent label clearly explains data usage and links to Privacy Policy
- Privacy Policy link opens in new tab (or modal)
- Regional disclosure statement below form (EU resident information)
- No pre-checked consent boxes
- Double opt-in confirmation message after submission

**Edge Cases:**
- If Privacy Policy page doesn't exist, show placeholder modal with contact info
- Regional disclosure adapts if user location detection is implemented (future)

### AC-5: Responsive Design Across All Devices
**Given** a user accesses the landing page on various devices,  
**When** the viewport size changes,  
**Then** the hero section and form adapt appropriately:
- Mobile (320px – 639px): Single-column, smaller logo, readable text
- Tablet (640px – 1023px): Balanced layout, optimized spacing
- Desktop (1024px+): Full cinematic experience, larger typography
- All tap targets are at least 44x44px on touch devices
- No horizontal scrolling at any breakpoint

**Edge Cases:**
- Very small screens (320px): Content remains readable without zoom
- Large screens (>1920px): Content scales without excessive whitespace
- Landscape orientation on mobile: Hero adapts height appropriately

### AC-6: Accessibility Standards Met (WCAG 2.1 AA)
**Given** a user with accessibility needs,  
**When** they interact with the landing page,  
**Then** all WCAG 2.1 AA requirements are met:
- All text meets 4.5:1 contrast ratio (3:1 for large text)
- Keyboard navigation works: Tab through logo, form fields, links, button
- Focus indicators are clearly visible (2px outline)
- Screen reader announces all labels, errors, and success messages
- Page scales to 200% zoom without loss of functionality
- Video respects `prefers-reduced-motion` (shows static image if enabled)
- Form fields have associated `<label>` elements
- Alt text provided for logo (empty alt for decorative background)

**Edge Cases:**
- High contrast mode (Windows): Maintains readability
- Screen reader testing (NVDA, JAWS, VoiceOver): All content accessible
- Keyboard-only navigation: No focus traps, logical tab order

### AC-7: Performance Targets Met
**Given** the landing page is deployed,  
**When** performance is measured,  
**Then** Core Web Vitals meet targets:
- LCP < 2.5 seconds on 3G Fast connection (simulated)
- CLS < 0.1 (no layout shifts during load)
- FID/INP < 100ms (form interactions are immediate)
- Hero image/video optimized (WebP, compressed, lazy-loaded)
- Lighthouse score: 90+ for Performance, Accessibility, Best Practices, SEO

**Edge Cases:**
- Slow connections (3G): Page remains functional, shows loading indicators
- High-latency networks: API requests timeout gracefully after 10 seconds
- Offline: Service worker provides cached version (nice-to-have)

### AC-8: SEO and Metadata Configured
**Given** the landing page is published,  
**When** it is crawled by search engines or shared on social media,  
**Then** appropriate metadata is present:
- Page title, meta description, Open Graph tags
- Favicon in all required sizes
- Structured data (JSON-LD) for organization
- Canonical URL set
- Language declared as `en-GB`
- Twitter Card metadata
- Robots.txt allows crawling (production only)

**Edge Cases:**
- Social media preview (LinkedIn, Twitter, Facebook): Shows hero image and description
- Google search result: Shows correct title and description snippet

---

## Test Scenarios

### TS-1: Happy Path – Successful Email Subscription (Maps to AC-3)
**Preconditions:** EmailOctopus API is accessible, list ID and API key configured  
**Steps:**
1. Navigate to landing page (`/`)
2. Observe hero section loads with background media
3. Enter valid email: `test@example.com`
4. Check GDPR consent checkbox
5. Click "Join the Waitlist" button
6. Observe button disables during submission
7. Observe success message: "Thank you! Check your email to confirm your subscription."
8. Verify form clears or hides

**Expected Result:**  
- EmailOctopus receives subscription request
- User receives confirmation email from EmailOctopus (double opt-in)
- Success message displayed on page
- No errors in browser console

### TS-2: Validation Error – Missing Consent (Maps to AC-2)
**Preconditions:** Landing page loaded  
**Steps:**
1. Enter valid email: `test@example.com`
2. Do NOT check GDPR consent checkbox
3. Click "Join the Waitlist" button

**Expected Result:**  
- Form does NOT submit
- Error message displayed: "You must consent to receive emails"
- Error is announced to screen readers (`role="alert"`)
- Consent checkbox has focus or visible error indicator

### TS-3: Validation Error – Invalid Email (Maps to AC-2)
**Preconditions:** Landing page loaded  
**Steps:**
1. Enter invalid email: `invalid-email`
2. Check GDPR consent checkbox
3. Click "Join the Waitlist" button

**Expected Result:**  
- Form does NOT submit
- Error message displayed: "Please enter a valid email address"
- Error is announced to screen readers
- Email input field has focus or visible error indicator

### TS-4: Network Error Handling (Maps to AC-3 Edge Cases)
**Preconditions:** EmailOctopus API is unreachable (mock network failure)  
**Steps:**
1. Enter valid email and check consent
2. Click submit button
3. Observe API request fails

**Expected Result:**  
- Error message displayed: "Unable to connect. Please try again later."
- Submit button re-enables for retry
- User can attempt submission again
- Error is logged (check server logs)

### TS-5: Keyboard Navigation (Maps to AC-6)
**Preconditions:** Landing page loaded, user uses keyboard only  
**Steps:**
1. Press Tab key repeatedly to navigate through:
   - Logo (if focusable)
   - Email input field
   - GDPR consent checkbox
   - Privacy Policy link
   - Submit button
2. Press Enter on submit button (with valid data)

**Expected Result:**  
- All interactive elements receive visible focus indicators
- Tab order is logical (top to bottom, left to right)
- Form submits successfully via keyboard
- No keyboard traps

### TS-6: Screen Reader Compatibility (Maps to AC-6)
**Preconditions:** Screen reader enabled (NVDA, JAWS, or VoiceOver)  
**Steps:**
1. Navigate landing page with screen reader
2. Listen to announced content for:
   - Logo alt text
   - Headline and subheadline
   - Form field labels
   - Consent checkbox label and Privacy Policy link
   - Submit button text
3. Submit form with validation error
4. Listen for error announcement

**Expected Result:**  
- All content is announced clearly
- Form labels are properly associated with inputs
- Errors are announced via `role="alert"`
- Button states are announced (enabled/disabled)

### TS-7: Reduced Motion Support (Maps to AC-6)
**Preconditions:** User has `prefers-reduced-motion` enabled in OS settings  
**Steps:**
1. Enable reduced motion in OS accessibility settings
2. Navigate to landing page

**Expected Result:**  
- Video does NOT autoplay
- Static poster image or hero image is displayed instead
- All animations/transitions are disabled
- Page remains fully functional

### TS-8: Responsive Design – Mobile (Maps to AC-5)
**Preconditions:** Browser set to mobile viewport (375x667, iPhone SE)  
**Steps:**
1. Load landing page
2. Observe layout adapts to mobile view
3. Test form interaction with touch input
4. Verify all tap targets are at least 44x44px

**Expected Result:**  
- Hero section displays in single-column layout
- Logo, headline, subheadline are readable without zoom
- Form fields are touch-friendly
- No horizontal scrolling

### TS-9: Performance – Core Web Vitals (Maps to AC-7)
**Preconditions:** Landing page deployed, tested with Lighthouse or WebPageTest  
**Steps:**
1. Run Lighthouse audit (simulated 3G Fast)
2. Check Core Web Vitals scores
3. Verify LCP, CLS, FID/INP meet targets

**Expected Result:**  
- LCP < 2.5 seconds
- CLS < 0.1
- FID/INP < 100ms
- Overall Lighthouse scores: 90+ for Performance, Accessibility, Best Practices, SEO

### TS-10: GDPR Compliance – Privacy Policy and Disclosure (Maps to AC-4)
**Preconditions:** Landing page loaded  
**Steps:**
1. Locate GDPR consent checkbox
2. Read consent label text
3. Click Privacy Policy link
4. Read regional disclosure statement

**Expected Result:**  
- Consent checkbox is unchecked by default
- Consent label clearly explains data usage
- Privacy Policy link opens in new tab or modal
- Regional disclosure mentions GDPR and EU resident rights
- Double opt-in process is mentioned

---

## Technical Notes

### API Design

**Endpoint:** `/api/v1/subscribe`  
**Method:** POST  
**Content-Type:** `application/json`

**Request Schema (Zod):**
```typescript
import { z } from 'zod';

export const SubscribeRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'GDPR consent is required' }),
  }),
  timestamp: z.string().datetime(),
});

export type SubscribeRequest = z.infer<typeof SubscribeRequestSchema>;
```

**Response Schema:**
```typescript
export interface SubscribeResponse {
  success: boolean;
  message: string;
  status?: 'pending_confirmation' | 'already_subscribed' | 'error';
}
```

**EmailOctopus Integration:**
- API Base URL: `https://emailoctopus.com/api/1.6/`
- Endpoint: `POST /lists/{listId}/contacts`
- Authentication: API key via query parameter or header
- Payload:
  ```json
  {
    "email_address": "user@example.com",
    "status": "SUBSCRIBED",
    "fields": {
      "ConsentTimestamp": "2025-11-04T21:10:21.331Z"
    }
  }
  ```

**Rate Limiting:**
- Use in-memory cache (Redis in production) to track IP addresses
- Limit: 5 requests per IP per 5 minutes
- Response on limit exceeded: 429 Too Many Requests

### Data Model

**No persistent database needed for MVP landing page.** All subscription data managed by EmailOctopus.

**Optional Logging (for audit trail):**
- Log to file or cloud logging service (CloudWatch, Stackdriver)
- Log fields: timestamp, emailHash (SHA-256), consentGiven (boolean), outcome (success/error), ipHash (SHA-256), errorMessage (if applicable)

### Database/Migrations
- **Not applicable** for this story (no database schema changes)
- If logging to database in future, create `email_subscriptions` table with columns: id, email_hash, consent_given, subscribed_at, ip_hash, status

### Integration Points

**EmailOctopus API:**
- Documentation: https://emailoctopus.com/api-documentation
- Required credentials: EMAILOCTOPUS_API_KEY, EMAILOCTOPUS_LIST_ID
- Error handling: Handle 400 (validation errors), 401 (auth failure), 409 (already subscribed), 500 (server error)
- Retry logic: Exponential backoff for 5xx errors (max 3 retries)
- Timeout: 10 seconds

**Next.js API Routes:**
- Located at `apps/web/src/app/api/v1/subscribe/route.ts` (App Router)
- Export `POST` function handler
- Use Next.js built-in rate limiting or middleware

**Frontend Components:**
- Hero component: `apps/web/src/components/landing/Hero.tsx`
- Email form component: `apps/web/src/components/landing/EmailSignupForm.tsx`
- Consent checkbox: `apps/web/src/components/landing/GdprConsentCheckbox.tsx`
- Privacy modal/link: `apps/web/src/components/landing/PrivacyPolicyLink.tsx`

### Failure Modes and Resilience

**Failure Mode:** EmailOctopus API is down or unreachable  
**Detection:** API request timeout (10s) or 5xx response  
**Fallback:** Display error message, allow retry, log incident for manual follow-up  
**Retry Strategy:** Exponential backoff (1s, 2s, 4s), max 3 retries  
**User Impact:** Temporary inability to subscribe, clear messaging

**Failure Mode:** Invalid API credentials (401 Unauthorized)  
**Detection:** 401 response from EmailOctopus  
**Fallback:** Display generic error, alert DevOps (critical)  
**Retry Strategy:** None (requires configuration fix)  
**User Impact:** No subscriptions processed until fixed

**Failure Mode:** Rate limit exceeded by malicious bot  
**Detection:** Rate limiting middleware triggered  
**Fallback:** Return 429 status, display "Too many requests. Please try again later."  
**Retry Strategy:** User must wait 5 minutes  
**User Impact:** Legitimate users on shared IP may be affected (edge case)

**Failure Mode:** User already subscribed  
**Detection:** 409 response from EmailOctopus  
**Fallback:** Display friendly message: "This email is already on our list."  
**Retry Strategy:** None (not an error condition)  
**User Impact:** Confirmation that they're already subscribed

### Environment Variables

```bash
# .env.local (development) / Production environment config
EMAILOCTOPUS_API_KEY=your_api_key_here
EMAILOCTOPUS_LIST_ID=your_list_id_here
NEXT_PUBLIC_SITE_URL=https://legends-ascend.com
NODE_ENV=production
```

**Security Note:** Never commit `.env` files to version control. Use `.env.example` as template.

---

## Task Breakdown

### Phase 1: Design & Setup (Coding Agent)
- [ ] Set up Next.js 14 project structure with App Router (if not already present)
- [ ] Configure TypeScript with strict mode
- [ ] Install dependencies: `zod`, `@emailoctopus/api` (or use native fetch), TailwindCSS
- [ ] Create environment variable structure (`.env.example`)
- [ ] Rename hero media assets to SEO-friendly names:
  - `legends-ascend-football-stadium-hero.jpg`
  - `legends-ascend-stadium-intro.mp4` (if video is used)
- [ ] Place assets in `/public/assets/hero/` directory
- [ ] Set up branding assets (logo, favicon) in `/public/assets/brand/`

### Phase 2: API Implementation (Coding Agent)
- [ ] Create API route: `apps/web/src/app/api/v1/subscribe/route.ts`
- [ ] Implement Zod validation schema for request
- [ ] Integrate EmailOctopus API client
- [ ] Add rate limiting middleware (IP-based, 5 req/5min)
- [ ] Implement error handling and logging
- [ ] Add unit tests for API route logic (mocked EmailOctopus)
- [ ] Add integration tests with mocked EmailOctopus responses

### Phase 3: Frontend Components (Coding Agent)
- [ ] Create `Hero.tsx` component with background image/video support
- [ ] Implement `EmailSignupForm.tsx` with validation
- [ ] Create `GdprConsentCheckbox.tsx` with Privacy Policy link
- [ ] Implement `PrivacyPolicyLink.tsx` (modal or new tab)
- [ ] Add loading states, error states, success states
- [ ] Implement `prefers-reduced-motion` support for video
- [ ] Style components per BRANDING_GUIDELINE.md (colors, typography)
- [ ] Ensure responsive design (mobile, tablet, desktop)
- [ ] Add focus indicators and keyboard navigation support

### Phase 4: SEO & Metadata (Coding Agent)
- [ ] Configure Next.js metadata in `layout.tsx` or `page.tsx`
- [ ] Add page title, meta description, Open Graph tags
- [ ] Add Twitter Card metadata
- [ ] Implement favicon package (multiple sizes)
- [ ] Add structured data (JSON-LD) for organization
- [ ] Set canonical URL
- [ ] Configure `robots.txt` and `sitemap.xml`

### Phase 5: Performance Optimization (Coding Agent)
- [ ] Optimize hero image with Next.js `<Image>` component (WebP, responsive sizes)
- [ ] Optimize video: compress with H.264, max 5MB, lazy-load
- [ ] Add poster image for video placeholder
- [ ] Preload critical fonts (Inter/Poppins)
- [ ] Inline critical CSS, defer non-critical scripts
- [ ] Test Core Web Vitals with Lighthouse (target: LCP < 2.5s, CLS < 0.1)
- [ ] Implement service worker for offline fallback (optional)

### Phase 6: Accessibility Verification (Coding Agent + Manual Testing)
- [ ] Run automated accessibility tests (axe-core, WAVE)
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter)
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast ratios (WCAG AA: 4.5:1, 3:1)
- [ ] Test reduced motion support
- [ ] Test at 200% browser zoom
- [ ] Ensure focus indicators are visible
- [ ] Verify all form labels and error announcements

### Phase 7: Testing (Testing Agent)
- [ ] Write unit tests for API route (Jest)
- [ ] Write integration tests for EmailOctopus API (mocked)
- [ ] Write unit tests for React components (React Testing Library)
- [ ] Write E2E tests for user flows (Playwright or Cypress)
  - Happy path: successful subscription
  - Validation errors: invalid email, missing consent
  - Network errors: API timeout, EmailOctopus down
  - Already subscribed scenario
- [ ] Test rate limiting behavior
- [ ] Test responsive design on multiple devices/browsers
- [ ] Performance testing: Lighthouse CI, WebPageTest

### Phase 8: Documentation (All Teams)
- [ ] Update README.md with setup instructions
- [ ] Document environment variables in `.env.example`
- [ ] Add API documentation (OpenAPI spec or inline docs)
- [ ] Document GDPR compliance approach
- [ ] Add comments in code for complex logic
- [ ] Create deployment checklist (production readiness)

### Phase 9: Final Verification (All Teams)
- [ ] Code review for architecture compliance
- [ ] Code review for branding compliance
- [ ] Code review for accessibility compliance
- [ ] Smoke test on staging environment
- [ ] Security review (no secrets committed, rate limiting works)
- [ ] Performance review (Lighthouse score 90+)
- [ ] GDPR compliance review (consent flow, Privacy Policy link)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Cross-device testing (mobile, tablet, desktop)

---

## Definition of Ready Confirmation

This user story has been validated against all DoR checklist items per [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md):

### ✅ Story Structure
- [x] User story format: "As a [role], I want [goal], so that [benefit]"
- [x] Clear, concise title with story ID (US-001)
- [x] Story points estimated: 8 (Fibonacci scale)
- [x] Priority assigned: MUST (MoSCoW)
- [x] Epic/Feature linked: Marketing Site / Landing Page

### ✅ Acceptance Criteria Completeness
- [x] Clear & testable acceptance criteria (8 ACs)
- [x] Test scenarios documented (10 scenarios mapping to ACs)
- [x] Edge cases identified (network errors, validation failures, already subscribed, etc.)
- [x] Football management context: Landing page is entry point for prospective players
- [x] UI/UX requirements specified with branding/accessibility references

### ✅ Internationalization & Localization
- [x] UK English standard applied
- [x] International football terminology (where applicable)
- [x] Metric system noted (not directly applicable to landing page, but principle established)
- [x] Date/time formatting specified (ISO 8601, DD/MM/YYYY display)
- [x] Localization ready: strings externalisable

### ✅ Technical Requirements & Architecture
- [x] Architecture compliance: References TECHNICAL_ARCHITECTURE.md
- [x] Technology stack fit: Next.js 14+, React 18+, TypeScript, Node.js LTS
- [x] API design: RESTful pattern `/api/v1/subscribe`, versioned
- [x] Database impact: None (EmailOctopus handles data)
- [x] Performance considerations: Core Web Vitals targets specified
- [x] Security requirements: Input validation, rate limiting, HTTPS, no secrets in code

### ✅ Dependencies & Integration
- [x] Story dependencies: None (foundational feature)
- [x] Technical dependencies: Next.js, EmailOctopus API, environment variables
- [x] Third-party services: EmailOctopus API documented

### ✅ Testing & Quality Assurance
- [x] Test strategy: Unit, integration, E2E, accessibility, performance tests
- [x] Browser compatibility: Chrome, Firefox, Safari, Edge
- [x] Performance benchmarks: LCP < 2.5s, CLS < 0.1, FID/INP < 100ms
- [x] Accessibility testing: Automated tools + manual screen reader testing

### ✅ AI Development Considerations
- [x] AI implementation context: Detailed requirements, examples, edge cases
- [x] Business logic examples: Form validation, API integration, error handling
- [x] Integration patterns: EmailOctopus API, Next.js API routes, React components
- [x] Expected behavior: User flows, success/error states documented
- [x] Error handling: Network errors, validation errors, API failures

### ✅ Compliance & Standards
- [x] Branding compliance: References BRANDING_GUIDELINE.md (colors, typography, logo)
- [x] Accessibility compliance: References ACCESSIBILITY_REQUIREMENTS.md (WCAG 2.1 AA)
- [x] Code standards: TypeScript strict mode, naming conventions from TECHNICAL_ARCHITECTURE.md
- [x] Documentation requirements: README updates, API docs, code comments

### ✅ Definition of Done Alignment
- [x] DoD compatibility: Story can meet all DoD criteria (tests, docs, reviews)
- [x] Review process: Code review, accessibility review, security review, performance review
- [x] Deployment considerations: Environment variables, production readiness checklist

---

## Reporting & Handover

### PR Description Template (for Implementation)

```markdown
## Summary
Implements US-001: Landing Page with Hero Background, EmailOctopus Signup, and GDPR Compliance.

## Changes
- ✅ Created landing page (`/`) with hero section and background image/video
- ✅ Integrated EmailOctopus API for email subscription
- ✅ Implemented GDPR-compliant consent mechanism with explicit checkbox
- ✅ Added serverless API route `/api/v1/subscribe` with rate limiting
- ✅ Ensured WCAG 2.1 AA accessibility compliance
- ✅ Applied branding guidelines (colors, typography, logo)
- ✅ Optimized performance (LCP < 2.5s, CLS < 0.1)
- ✅ Implemented responsive design for mobile/tablet/desktop
- ✅ Added reduced-motion support
- ✅ Configured SEO metadata and Open Graph tags

## Testing
- ✅ Unit tests: API route, form validation, components
- ✅ Integration tests: EmailOctopus API (mocked)
- ✅ E2E tests: User flows (successful subscription, validation errors, network errors)
- ✅ Accessibility tests: axe-core, keyboard navigation, screen reader testing
- ✅ Performance tests: Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO)
- ✅ Cross-browser testing: Chrome, Firefox, Safari, Edge
- ✅ Responsive testing: Mobile, tablet, desktop viewports

## Compliance
- ✅ TECHNICAL_ARCHITECTURE.md: Next.js 14, TypeScript strict, RESTful API
- ✅ BRANDING_GUIDELINE.md: Colors, typography, logo usage
- ✅ ACCESSIBILITY_REQUIREMENTS.md: WCAG 2.1 AA (keyboard, screen reader, contrast)
- ✅ DEFINITION_OF_READY.md: All DoR criteria met
- ✅ GDPR compliance: Explicit consent, Privacy Policy link, double opt-in

## Screenshots
[Include screenshots of landing page on desktop, tablet, mobile]

## Deployment Notes
- Requires environment variables: `EMAILOCTOPUS_API_KEY`, `EMAILOCTOPUS_LIST_ID`
- Ensure Privacy Policy page is published before deploying
- Verify EmailOctopus double opt-in is enabled in list settings
```

---

## Security Summary

**Vulnerabilities Discovered:** None (new feature)

**Security Measures Implemented:**
- Server-side input validation with Zod schema
- Email sanitization to prevent XSS
- Rate limiting to prevent abuse (5 requests per IP per 5 minutes)
- IP address hashing before logging (SHA-256)
- No plain-text email logging (hashed for audit trail)
- Environment variables for sensitive credentials (not committed)
- HTTPS enforcement (redirect HTTP to HTTPS)
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options
- CSRF protection via Next.js built-in mechanisms
- TLS 1.3 minimum for secure transmission

**Ongoing Security Considerations:**
- Regularly rotate EmailOctopus API keys
- Monitor rate limiting logs for abuse patterns
- Conduct periodic security audits of API route
- Keep dependencies updated (npm audit)

---

## Clarification Questions

**None at this time.** All requirements are sufficiently detailed based on the problem statement and foundation documents. If implementation uncovers ambiguities, the team should raise them during development.

**Optional Future Enhancements (Out of Scope for MVP):**
- Multi-language support (i18n implementation beyond string externalization)
- A/B testing for different hero variants
- Cookie consent banner (if cookies are used beyond essential)
- Advanced analytics integration (Google Analytics, Mixpanel)
- Social media login options for quicker signup
- Animated hero transitions or parallax effects (pending performance impact)

---

## Notes

### UK English and Football Terminology
- **Correct:** Football, pitch, manager, kit, goalkeeper, midfielder, defender, striker
- **Incorrect:** Soccer, field, coach, jersey, goalie

### Metric System
- Not directly applicable to landing page content, but principle established for future features (e.g., player height in cm, pitch dimensions in metres)

### Regional Privacy Standards
- **Primary:** GDPR (EU) as baseline
- **Future Consideration:** UK GDPR (post-Brexit alignment), CCPA/CPRA (California), PIPEDA (Canada), LGPD (Brazil)
- **Approach:** Design for strictest standard (GDPR) and extend as needed

### EmailOctopus Double Opt-In
- Ensure double opt-in is enabled in EmailOctopus list settings
- Users receive confirmation email immediately after subscribing
- Subscription is only active after user clicks confirmation link
- This is a GDPR best practice and reduces spam complaints

### Asset Optimization
- **Hero Image:** Compress to WebP format, max 500KB, responsive sizes (mobile: 768w, tablet: 1280w, desktop: 1920w)
- **Hero Video:** H.264 codec, max 5MB, resolution 1920x1080, 30fps, bitrate 2Mbps
- **Logo:** SVG format (scalable, small file size)
- **Favicon:** PNG and ICO formats, sizes 16x16, 32x32, 180x180 (Apple), 512x512 (PWA)

### Accessibility Testing Tools
- **Automated:** axe DevTools, WAVE, Lighthouse
- **Manual:** NVDA (free, Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
- **Contrast:** WebAIM Contrast Checker, Colour Contrast Analyser

---

**Document Status:** ✅ Ready for Development  
**Next Steps:** Assign to Coding Agent and Testing Agent for implementation per task breakdown.

---

*This user story complies with all requirements specified in DEFINITION_OF_READY.md and references all mandatory foundation documents: TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md, AI_PROMPT_ENGINEERING.md.*

**Version:** 1.0  
**Author:** Technical Business Analyst Agent  
**Created:** 2025-11-04  
**Last Updated:** 2025-11-05
