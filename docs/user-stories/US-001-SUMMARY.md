# US-001 Quick Summary

**Full Document:** [US-001-landing-page-hero-emailoctopus-gdpr.md](./US-001-landing-page-hero-emailoctopus-gdpr.md)

---

## At a Glance

**Story ID:** US-001  
**Title:** Landing Page – Hero Background, EmailOctopus Signup, GDPR Compliance  
**Priority:** MUST  
**Story Points:** 8  
**Epic:** Marketing Site / Landing Page  
**Status:** ✅ Ready for Development

---

## What We're Building

An MVP landing page for Legends Ascend featuring:

- 🎬 **Hero section** with full-viewport background image/video
- 📧 **Email signup form** integrated with EmailOctopus API
- 🔒 **GDPR compliance** with explicit consent and Privacy Policy
- ♿ **WCAG 2.1 AA accessibility** (keyboard nav, screen readers, contrast)
- 📱 **Responsive design** (mobile, tablet, desktop)
- ⚡ **Performance optimized** (LCP < 2.5s, CLS < 0.1)
- 🎨 **Brand compliant** (colors, typography, logo per guidelines)
- 🌍 **UK English** with international football terminology

---

## User Story

> **As a** prospective Legends Ascend player visiting the website,  
> **I want** to see an engaging hero section with background media and easily sign up for email updates with confidence that my data is protected,  
> **so that** I can learn about the game, stay informed of launch updates, and trust that my privacy is respected in compliance with GDPR.

---

## Key Requirements

### Hero Section
- Full-viewport background (image or video from `/assets/hero/`)
- Logo, headline: "Build Your Football Legacy"
- Subheadline: "The AI-powered football management game where every decision shapes your destiny"
- Email signup form overlay
- Reduced-motion support (no video if user prefers reduced motion)

### Email Form
- Email input (required, validated)
- GDPR consent checkbox (explicit, unchecked by default, required)
- Submit button: "Join the Waitlist" or "Get Early Access"
- Client-side and server-side validation
- Error messages with screen reader announcements

### EmailOctopus Integration
- API endpoint: `POST /api/v1/subscribe`
- Rate limiting: 5 requests per IP per 5 minutes
- Double opt-in flow (EmailOctopus sends confirmation email)
- Success message: "Thank you! Check your email to confirm your subscription."
- Handle errors gracefully (timeout, already subscribed, network failures)

### GDPR Compliance
- Explicit consent checkbox with clear labeling
- Privacy Policy link (opens in new tab or modal)
- Regional disclosure: "For EU residents: Your data is protected under GDPR. We store only your email address and consent timestamp."
- No pre-checked boxes
- Data minimization (only email, consent, timestamp)

### Technical Stack
- Next.js 14+ (App Router)
- React 18+
- TypeScript (strict mode)
- TailwindCSS
- Zod (validation)
- EmailOctopus API

---

## 8 Acceptance Criteria

1. ✅ **AC-1:** Hero section renders with background media, logo, headline, form
2. ✅ **AC-2:** Form validates email and requires GDPR consent
3. ✅ **AC-3:** Successful subscription via EmailOctopus with confirmation message
4. ✅ **AC-4:** GDPR compliance elements present (consent, Privacy Policy, disclosure)
5. ✅ **AC-5:** Responsive design across mobile, tablet, desktop
6. ✅ **AC-6:** WCAG 2.1 AA accessibility standards met
7. ✅ **AC-7:** Performance targets met (LCP < 2.5s, CLS < 0.1, FID/INP < 100ms)
8. ✅ **AC-8:** SEO and metadata configured (Open Graph, Twitter Cards, structured data)

---

## 10 Test Scenarios

1. **TS-1:** Happy path – successful subscription
2. **TS-2:** Validation error – missing consent
3. **TS-3:** Validation error – invalid email
4. **TS-4:** Network error handling
5. **TS-5:** Keyboard navigation
6. **TS-6:** Screen reader compatibility
7. **TS-7:** Reduced motion support
8. **TS-8:** Responsive design – mobile
9. **TS-9:** Performance – Core Web Vitals
10. **TS-10:** GDPR compliance – Privacy Policy and disclosure

---

## Task Breakdown (9 Phases)

### Phase 1: Design & Setup
- Set up Next.js 14 project, TypeScript, TailwindCSS
- Rename and organize assets (SEO-friendly names)
- Create `.env.example` with required environment variables

### Phase 2: API Implementation
- Create `/api/v1/subscribe` route
- Implement Zod validation
- Integrate EmailOctopus API
- Add rate limiting (5 req/5min)
- Write unit and integration tests

### Phase 3: Frontend Components
- `Hero.tsx` with background image/video
- `EmailSignupForm.tsx` with validation
- `GdprConsentCheckbox.tsx` with Privacy Policy link
- Reduced-motion support
- Brand styling (colors, typography)
- Responsive design

### Phase 4: SEO & Metadata
- Configure Next.js metadata (title, description, Open Graph)
- Add Twitter Card metadata
- Implement favicon package (multiple sizes)
- Add structured data (JSON-LD)

### Phase 5: Performance Optimization
- Optimize hero image (Next.js `<Image>`, WebP, responsive)
- Optimize video (H.264, 5MB max, lazy-load)
- Preload critical fonts
- Test with Lighthouse (target: 90+ scores)

### Phase 6: Accessibility Verification
- Run automated tests (axe-core, WAVE)
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Verify contrast ratios (4.5:1, 3:1)
- Test at 200% zoom

### Phase 7: Testing
- Unit tests (API, form validation, components)
- Integration tests (EmailOctopus mocked)
- E2E tests (Playwright/Cypress)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive testing

### Phase 8: Documentation
- Update README.md
- Document environment variables
- Add API documentation
- Document GDPR approach
- Add code comments

### Phase 9: Final Verification
- Code review (architecture, branding, accessibility)
- Smoke test on staging
- Security review (no secrets, rate limiting)
- Performance review (Lighthouse 90+)
- GDPR compliance review

---

## Environment Variables Required

```bash
EMAILOCTOPUS_API_KEY=your_api_key_here
EMAILOCTOPUS_LIST_ID=your_list_id_here
NEXT_PUBLIC_SITE_URL=https://legends-ascend.com
NODE_ENV=production
```

---

## API Design

**Endpoint:** `POST /api/v1/subscribe`  
**Content-Type:** `application/json`

**Request:**
```json
{
  "email": "user@example.com",
  "gdprConsent": true,
  "timestamp": "2025-11-04T21:10:21.331Z"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you! Check your email to confirm your subscription.",
  "status": "pending_confirmation"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Please enter a valid email address.",
  "status": "error"
}
```

---

## Performance Targets

- **LCP (Largest Contentful Paint):** < 2.5 seconds on 3G Fast
- **CLS (Cumulative Layout Shift):** < 0.1
- **FID/INP (Interaction Delay):** < 100ms
- **Lighthouse Scores:** 90+ for Performance, Accessibility, Best Practices, SEO

---

## Accessibility Standards

- **WCAG 2.1 Level AA Compliance**
- Color contrast: 4.5:1 (normal), 3:1 (large text)
- Keyboard navigation: All elements Tab/Shift+Tab accessible
- Screen reader support: Semantic HTML, ARIA labels, error announcements
- Focus indicators: 2px outline with 2px offset
- Reduced motion: Respect `prefers-reduced-motion` media query
- Scalable typography: Support 200% zoom

---

## Branding

**Colors:**
- Primary Blue: `#1E3A8A` (CTA buttons)
- Accent Gold: `#F59E0B` (highlights, hover)
- Dark Navy: `#0F172A` (text, overlay)
- Soft Gray: `#F1F5F9` (form background)

**Typography:**
- Headings: Inter/Poppins, 700 Bold
- Body: Inter, 400 Regular
- Hero headline: 48px (desktop), 36px (mobile)

**Logo:**
- Full-color SVG from `/assets/branding/`
- 20px clear space around logo

---

## Security Measures

- ✅ Server-side validation with Zod
- ✅ Email sanitization (prevent XSS)
- ✅ Rate limiting (5 req/IP/5min)
- ✅ IP address hashing (SHA-256)
- ✅ No plain-text email logging
- ✅ Environment variables for secrets
- ✅ HTTPS enforcement
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ CSRF protection (Next.js built-in)
- ✅ TLS 1.3 minimum

---

## DoR Compliance

✅ **All Definition of Ready criteria satisfied:**

- Story Structure (format, points, priority)
- Acceptance Criteria (8 ACs, 10 test scenarios, edge cases)
- Internationalization (UK English, football terminology)
- Technical Requirements (Next.js 14, TypeScript, API design)
- Dependencies (Next.js, EmailOctopus, env vars)
- Testing Strategy (unit, integration, E2E, accessibility)
- AI Development Considerations (detailed requirements, examples)
- Compliance (branding, accessibility, code standards)
- Definition of Done Alignment (deployable, documented, tested)

---

## Foundation Documents Referenced

- ✅ [DEFINITION_OF_READY.md](../DEFINITION_OF_READY.md)
- ✅ [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)
- ✅ [BRANDING_GUIDELINE.md](../BRANDING_GUIDELINE.md)
- ✅ [ACCESSIBILITY_REQUIREMENTS.md](../ACCESSIBILITY_REQUIREMENTS.md)
- ✅ [AI_PROMPT_ENGINEERING.md](../AI_PROMPT_ENGINEERING.md)

---

## Next Steps

1. **Assign to Coding Agent:** Implement Phase 1-6 per task breakdown
2. **Assign to Testing Agent:** Implement Phase 7 per task breakdown
3. **Final Verification:** Phase 9 - code review, security, performance
4. **Deploy to Staging:** Smoke test before production
5. **Production Deployment:** Verify EmailOctopus credentials, Privacy Policy page

---

## Questions or Clarifications?

- Review [full user story document](./US-001-landing-page-hero-emailoctopus-gdpr.md)
- Open an issue with the `user-story` label
- Contact Technical Business Analyst Agent

---

**Document Version:** 1.0  
**Created:** 2025-11-05  
**Status:** Ready for Implementation
