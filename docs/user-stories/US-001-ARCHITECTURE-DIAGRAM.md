# US-001 Architecture & Flow Diagram

This document provides visual representations of the landing page architecture, data flow, and component hierarchy.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │               Landing Page (/)                          │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │           Hero Component                          │  │   │
│  │  │  - Background Image/Video                        │  │   │
│  │  │  - Logo                                          │  │   │
│  │  │  - Headline & Subheadline                        │  │   │
│  │  │  - EmailSignupForm Component                     │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │     EmailSignupForm Component                     │  │   │
│  │  │  ┌──────────────────────────────────────────┐    │  │   │
│  │  │  │ Email Input (validated)                   │    │  │   │
│  │  │  └──────────────────────────────────────────┘    │  │   │
│  │  │  ┌──────────────────────────────────────────┐    │  │   │
│  │  │  │ GdprConsentCheckbox Component             │    │  │   │
│  │  │  │ - Checkbox (required, unchecked default)  │    │  │   │
│  │  │  │ - Label with Privacy Policy Link          │    │  │   │
│  │  │  └──────────────────────────────────────────┘    │  │   │
│  │  │  ┌──────────────────────────────────────────┐    │  │   │
│  │  │  │ Submit Button                             │    │  │   │
│  │  │  │ "Join the Waitlist"                       │    │  │   │
│  │  │  └──────────────────────────────────────────┘    │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS POST /api/v1/subscribe
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Route Layer                      │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │      API Route: /api/v1/subscribe/route.ts             │   │
│  │                                                          │   │
│  │  1. Rate Limiting Middleware (5 req/IP/5min)           │   │
│  │     │                                                    │   │
│  │     ▼                                                    │   │
│  │  2. Request Validation (Zod Schema)                     │   │
│  │     - Email format (RFC 5322)                           │   │
│  │     - GDPR consent = true                               │   │
│  │     - Timestamp present                                 │   │
│  │     │                                                    │   │
│  │     ▼                                                    │   │
│  │  3. EmailOctopus API Integration                        │   │
│  │     - POST /lists/{listId}/contacts                     │   │
│  │     - Authentication: API key from env vars             │   │
│  │     │                                                    │   │
│  │     ▼                                                    │   │
│  │  4. Response Handling                                   │   │
│  │     - 200: Success → pending_confirmation               │   │
│  │     - 409: Already subscribed                           │   │
│  │     - 400/500: Error handling                           │   │
│  │     │                                                    │   │
│  │     ▼                                                    │   │
│  │  5. Audit Logging                                       │   │
│  │     - Email hash (SHA-256)                              │   │
│  │     - IP hash (SHA-256)                                 │   │
│  │     - Timestamp, outcome                                │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS POST (EmailOctopus API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EmailOctopus API                           │
│                                                                 │
│  - Receives subscription request                               │
│  - Stores email + consent timestamp                            │
│  - Sends double opt-in confirmation email to user              │
│  - Returns success/error response                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Confirmation Email
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          User's Email                           │
│                                                                 │
│  - User receives confirmation email                            │
│  - User clicks confirmation link                               │
│  - Subscription activated in EmailOctopus                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow: Email Subscription

```
┌───────────┐
│   START   │
│ User lands │
│  on page  │
└─────┬─────┘
      │
      ▼
┌───────────────────┐
│ Hero Section      │
│ Loads with:       │
│ - Background media│
│ - Logo & text     │
│ - Email form      │
└─────┬─────────────┘
      │
      ▼
┌───────────────────┐      ┌──────────────────┐
│ User enters email │─────▶│ Client-side      │
│                   │      │ validation runs  │
└─────┬─────────────┘      │ - Email format   │
      │                    └──────┬───────────┘
      │                           │
      │            ┌──────────────┘
      │            │ Valid?
      │            │
      │      No ───┴─── Yes
      │       │          │
      │       ▼          ▼
      │  ┌────────┐  ┌────────────────┐
      │  │ Show   │  │ User checks    │
      │  │ error  │  │ GDPR consent   │
      │  │ message│  │ checkbox       │
      │  └────────┘  └────┬───────────┘
      │       │            │
      │       └────────────┘
      │
      ▼
┌───────────────────┐      ┌──────────────────┐
│ User clicks       │─────▶│ Validate consent │
│ "Join Waitlist"   │      │ is checked       │
└─────┬─────────────┘      └──────┬───────────┘
      │                           │
      │            ┌──────────────┘
      │            │ Checked?
      │            │
      │      No ───┴─── Yes
      │       │          │
      │       ▼          ▼
      │  ┌────────┐  ┌────────────────┐
      │  │ Show   │  │ Disable button │
      │  │ error  │  │ Send POST to   │
      │  │ message│  │ /api/v1/       │
      │  └────────┘  │ subscribe      │
      │       │      └────┬───────────┘
      │       └───────────┘
      │
      ▼
┌───────────────────┐
│ API Route:        │
│ 1. Rate limiting  │
│ 2. Validation     │
│ 3. Call EmailOcto │
│ 4. Log result     │
└─────┬─────────────┘
      │
      │
      ▼
┌───────────────────┐
│ EmailOctopus API  │
│ processes request │
└─────┬─────────────┘
      │
      │
      ▼
┌───────────────────────────────────┐
│ Response?                         │
│                                   │
│ ┌───────────┬────────────┬──────┐│
│ │  Success  │  Already   │Error ││
│ │  (200)    │  Subbed    │(4xx/ ││
│ │           │  (409)     │ 5xx) ││
│ └─────┬─────┴──────┬─────┴───┬──┘│
└───────┼────────────┼─────────┼───┘
        │            │         │
        ▼            ▼         ▼
  ┌──────────┐ ┌──────────┐ ┌────────┐
  │ Show     │ │ Show     │ │ Show   │
  │ success  │ │ "already │ │ error  │
  │ message  │ │ on list" │ │ with   │
  │ "Check   │ │ message  │ │ retry  │
  │ email to │ └──────────┘ └────────┘
  │ confirm" │
  └─────┬────┘
        │
        ▼
  ┌──────────┐
  │ Clear    │
  │ form or  │
  │ hide it  │
  └─────┬────┘
        │
        ▼
  ┌──────────┐
  │ User     │
  │ receives │
  │ confirm  │
  │ email    │
  └─────┬────┘
        │
        ▼
  ┌──────────┐
  │ User     │
  │ clicks   │
  │ confirm  │
  │ link     │
  └─────┬────┘
        │
        ▼
  ┌──────────┐
  │ Subscri- │
  │ ption    │
  │ active!  │
  └──────────┘
        │
        ▼
   ┌────────┐
   │  END   │
   └────────┘
```

---

## Component Hierarchy

```
apps/web/src/
├── app/
│   ├── page.tsx                    # Landing page (uses Hero)
│   ├── layout.tsx                  # Root layout (metadata, fonts, favicon)
│   └── api/
│       └── v1/
│           └── subscribe/
│               └── route.ts         # API route for subscription
│
├── components/
│   └── landing/
│       ├── Hero.tsx                # Hero section container
│       ├── EmailSignupForm.tsx     # Form component
│       ├── GdprConsentCheckbox.tsx # Consent checkbox with label
│       └── PrivacyPolicyLink.tsx   # Privacy Policy link/modal
│
├── lib/
│   ├── validations/
│   │   └── subscribe.ts            # Zod schemas for validation
│   ├── api/
│   │   └── emailoctopus.ts         # EmailOctopus API client
│   └── utils/
│       ├── rate-limiter.ts         # Rate limiting logic
│       └── hash.ts                 # Hashing utilities (SHA-256)
│
└── styles/
    └── globals.css                 # Global styles, Tailwind config
```

---

## Data Flow: API Request/Response

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/v1/subscribe
                              │
                              ▼
                    ┌──────────────────┐
                    │ Request Payload: │
                    │ {                │
                    │   email: string, │
                    │   gdprConsent:   │
                    │     true,        │
                    │   timestamp:     │
                    │     ISO-8601     │
                    │ }                │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Route Handler                         │
│                                                             │
│  Step 1: Rate Limiting                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Check IP address in cache/Redis                    │    │
│  │ - If > 5 requests in 5 min → 429 Too Many Requests │    │
│  │ - Else → Continue                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                     │                                       │
│                     ▼                                       │
│  Step 2: Validation (Zod)                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Validate email format (RFC 5322)                   │    │
│  │ Validate gdprConsent === true (explicit)           │    │
│  │ Validate timestamp is valid ISO-8601               │    │
│  │ - Invalid → 400 Bad Request                        │    │
│  │ - Valid → Continue                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                     │                                       │
│                     ▼                                       │
│  Step 3: EmailOctopus API Call                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ POST https://emailoctopus.com/api/1.6/             │    │
│  │      lists/{listId}/contacts                       │    │
│  │                                                     │    │
│  │ Headers:                                           │    │
│  │   - Authorization: API key from env               │    │
│  │   - Content-Type: application/json                │    │
│  │                                                     │    │
│  │ Body:                                              │    │
│  │ {                                                  │    │
│  │   email_address: "user@example.com",              │    │
│  │   status: "SUBSCRIBED",                           │    │
│  │   fields: {                                        │    │
│  │     ConsentTimestamp: "2025-11-04T21:10:21.331Z" │    │
│  │   }                                                │    │
│  │ }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                     │                                       │
│                     ▼                                       │
│  Step 4: Handle EmailOctopus Response                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Response Status:                                   │    │
│  │ - 200: Success → Return pending_confirmation       │    │
│  │ - 409: Already subscribed → Return friendly msg    │    │
│  │ - 401: Auth failure → Log critical error, retry    │    │
│  │ - 5xx: Server error → Retry with backoff           │    │
│  │ - Timeout: Return "Unable to connect"              │    │
│  └────────────────────────────────────────────────────┘    │
│                     │                                       │
│                     ▼                                       │
│  Step 5: Audit Logging                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Log to structured logging service:                 │    │
│  │ {                                                  │    │
│  │   timestamp: "2025-11-04T21:10:21.331Z",          │    │
│  │   emailHash: "sha256(email)",                     │    │
│  │   ipHash: "sha256(ip)",                           │    │
│  │   consentGiven: true,                             │    │
│  │   outcome: "success" | "error",                   │    │
│  │   errorMessage: "..." (if applicable)             │    │
│  │ }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
                    ┌──────────────────┐
                    │ Response Payload:│
                    │ {                │
                    │   success: true, │
                    │   message:       │
                    │     "Thank you!  │
                    │      Check email"│
                    │   status:        │
                    │   "pending_      │
                    │    confirmation" │
                    │ }                │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
│                                                             │
│  - Receive response                                         │
│  - Display success message                                  │
│  - Clear/hide form                                          │
│  - Enable submit button (if retry needed)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌────────────────┐
│ Error Occurs   │
└───────┬────────┘
        │
        ▼
┌────────────────────────────┐
│ Error Type?                │
│                            │
│ ┌──────────┬──────────┬───┴────┐
│ │ Client   │ Network  │ Server │
│ │ (400)    │ Timeout  │ (5xx)  │
│ └─────┬────┴────┬─────┴────┬───┘
└───────┼─────────┼──────────┼────┘
        │         │          │
        ▼         ▼          ▼
  ┌──────────┐ ┌─────────┐ ┌──────────┐
  │ Show     │ │ Retry   │ │ Retry    │
  │ specific │ │ with    │ │ with     │
  │ error    │ │ expone- │ │ expone-  │
  │ message  │ │ ntial   │ │ ntial    │
  │          │ │ backoff │ │ backoff  │
  │ - Invalid│ │ (1s, 2s,│ │ (1s, 2s, │
  │   email  │ │ 4s)     │ │ 4s)      │
  │ - Missing│ │ Max 3   │ │ Max 3    │
  │   consent│ │ retries │ │ retries  │
  └─────┬────┘ └────┬────┘ └────┬─────┘
        │           │           │
        │           │ After     │ After
        │           │ max       │ max
        │           │ retries   │ retries
        │           │           │
        └───────────┴───────────┘
                    │
                    ▼
              ┌──────────┐
              │ Display  │
              │ user-    │
              │ friendly │
              │ error    │
              │ message  │
              └─────┬────┘
                    │
                    ▼
              ┌──────────┐
              │ Log      │
              │ error to │
              │ logging  │
              │ service  │
              └─────┬────┘
                    │
                    ▼
              ┌──────────┐
              │ Enable   │
              │ retry    │
              │ (button  │
              │ enabled) │
              └──────────┘
```

---

## Accessibility Flow: Keyboard Navigation

```
Page Load
    │
    ▼
┌───────────────┐
│ Focus on body │
│ (initial)     │
└───────┬───────┘
        │
        │ User presses Tab
        ▼
┌──────────────────┐
│ 1. Logo/Link     │ ◄─── Focus indicator visible (2px outline)
│    (if focusable)│      Screen reader: "Legends Ascend logo, link"
└───────┬──────────┘
        │ Tab
        ▼
┌──────────────────┐
│ 2. Email Input   │ ◄─── Focus indicator visible
│    Field         │      Screen reader: "Email address, edit text, required"
└───────┬──────────┘
        │ Tab
        ▼
┌──────────────────┐
│ 3. GDPR Consent  │ ◄─── Focus indicator visible
│    Checkbox      │      Screen reader: "I consent to receive marketing
│                  │       emails... checkbox, not checked"
└───────┬──────────┘
        │ Space (to check)
        │
        │ Screen reader: "Checked"
        │
        │ Tab
        ▼
┌──────────────────┐
│ 4. Privacy Policy│ ◄─── Focus indicator visible
│    Link          │      Screen reader: "Privacy Policy, link"
└───────┬──────────┘
        │ Tab
        ▼
┌──────────────────┐
│ 5. Submit Button │ ◄─── Focus indicator visible
│    "Join Waitlist│      Screen reader: "Join the Waitlist, button"
│                  │
└───────┬──────────┘
        │ Enter or Space (to submit)
        │
        │ (If form valid)
        ▼
┌──────────────────┐
│ Success message  │ ◄─── role="alert" triggers immediate announcement
│ displayed        │      Screen reader: "Thank you! Check your email
│                  │       to confirm your subscription."
└──────────────────┘

Note: Shift+Tab moves focus backwards through elements
```

---

## Performance Optimization Strategy

```
┌────────────────────────────────────────────────────────────┐
│                  Performance Targets                        │
│                                                            │
│  LCP (Largest Contentful Paint) < 2.5s                     │
│  CLS (Cumulative Layout Shift) < 0.1                       │
│  FID/INP (First Input Delay) < 100ms                       │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│              Optimization Techniques                        │
│                                                            │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 1. Hero Image Optimization                       │     │
│  │    - Next.js <Image> component                   │     │
│  │    - WebP format with JPEG fallback              │     │
│  │    - Responsive sizes: 768w, 1280w, 1920w        │     │
│  │    - Priority loading (preload)                  │     │
│  │    - Max file size: 500KB                        │     │
│  └──────────────────────────────────────────────────┘     │
│                       │                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 2. Hero Video Optimization (if used)             │     │
│  │    - H.264 codec, 1080p, 30fps                   │     │
│  │    - Max file size: 5MB                          │     │
│  │    - Lazy loading (below fold)                   │     │
│  │    - Poster image placeholder                    │     │
│  │    - Respect prefers-reduced-motion              │     │
│  └──────────────────────────────────────────────────┘     │
│                       │                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 3. Font Optimization                             │     │
│  │    - Preload Inter/Poppins (woff2)               │     │
│  │    - font-display: swap                          │     │
│  │    - Subset fonts (Latin only)                   │     │
│  └──────────────────────────────────────────────────┘     │
│                       │                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 4. CSS Optimization                              │     │
│  │    - Inline critical CSS                         │     │
│  │    - Defer non-critical CSS                      │     │
│  │    - Tailwind CSS purge unused styles            │     │
│  └──────────────────────────────────────────────────┘     │
│                       │                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 5. JavaScript Optimization                       │     │
│  │    - Server-side rendering (SSR) for hero        │     │
│  │    - Code splitting (dynamic imports)            │     │
│  │    - Minimize client-side JavaScript             │     │
│  └──────────────────────────────────────────────────┘     │
│                       │                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 6. Layout Stability (Prevent CLS)                │     │
│  │    - Explicit width/height for images            │     │
│  │    - Reserve space for dynamic content           │     │
│  │    - No layout shifts on form interaction        │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Lighthouse Score │
                    │   90+ Target     │
                    └──────────────────┘
```

---

## GDPR Compliance Checklist

```
┌────────────────────────────────────────────────────────────┐
│              GDPR Compliance Requirements                   │
└────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│ Lawful Basis:    │                    │ Data Minimization│
│ Consent (Art. 6) │                    │ (Art. 5)         │
│                  │                    │                  │
│ ✅ Explicit      │                    │ ✅ Collect only: │
│   checkbox       │                    │   - Email        │
│ ✅ Unchecked by  │                    │   - Consent flag │
│   default        │                    │   - Timestamp    │
│ ✅ Clear purpose │                    │ ❌ Do NOT collect│
│   stated         │                    │   name, location,│
│ ✅ Can withdraw  │                    │   phone          │
│   (unsubscribe)  │                    └──────────────────┘
└──────────────────┘
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│ Transparency     │                    │ Security         │
│ (Art. 12-14)     │                    │ (Art. 32)        │
│                  │                    │                  │
│ ✅ Privacy Policy│                    │ ✅ HTTPS/TLS 1.3 │
│   link           │                    │ ✅ Input sanitize│
│ ✅ Regional      │                    │ ✅ Hash PII      │
│   disclosure     │                    │   before logging │
│ ✅ Explain data  │                    │ ✅ Secure env    │
│   usage          │                    │   vars for API   │
│ ✅ Right to      │                    │   keys           │
│   access, erase  │                    └──────────────────┘
└──────────────────┘
        │                                           │
        └───────────────────┬───────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Double Opt-In    │
                  │ (Best Practice)  │
                  │                  │
                  │ ✅ EmailOctopus  │
                  │   sends confirm  │
                  │   email          │
                  │ ✅ User must     │
                  │   click link to  │
                  │   activate       │
                  │ ✅ Reduces spam  │
                  │   complaints     │
                  └──────────────────┘
```

---

**Document Version:** 1.0  
**Created:** 2025-11-04  
**Purpose:** Visual representation of US-001 architecture, flows, and compliance
