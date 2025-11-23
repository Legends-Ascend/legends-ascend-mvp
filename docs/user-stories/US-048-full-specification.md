# Newsletter Subscription Opt-In During User Registration

**ID:** US-048  
**Story Points:** 5  
**Priority:** SHOULD  
**Epic/Feature:** Registration  
**Dependencies:** 
- US-001 (Landing Page with Newsletter Subscription - Complete)
- Existing `NewsletterSubscription` component must support multiple tags
- Backend authentication system (US-045 - Complete)

---

## User Story

As a new Legends Ascend user registering for the game,  
I want to be able to opt-in to receive the newsletter with news and updates during registration,  
So that I can get relevant information based on my interest directly after creating my account, with privacy controls respected.

---

## Context

### Summary
Currently, user registration creates new accounts without newsletter opt-in at the registration stage. This story enhances the registration flow by adding an optional newsletter subscription checkbox that integrates with the existing EmailOctopus newsletter system. Users who opt-in will receive game updates and news, whilst maintaining full GDPR compliance and privacy controls.

### Scope

**In Scope:**
- Add newsletter opt-in checkbox to registration form UI
- Integrate with existing `NewsletterSubscription` component for backend subscription
- Support conditional tag assignment: `['registered']` always applied, `['news']` added if opted-in
- Ensure registration succeeds regardless of newsletter subscription status (non-blocking)
- Update newsletter component to support multiple tags if not already implemented
- Accessible implementation per ACCESSIBILITY_REQUIREMENTS.md
- Brand-compliant UI per BRANDING_GUIDELINE.md

**Out of Scope:**
- Email template design or content (handled by marketing team)
- Unsubscribe functionality (handled by EmailOctopus)
- Newsletter preferences management UI (future enhancement)
- Landing page newsletter logic (must not be affected)
- Marketing automation workflows beyond initial subscription

### Assumptions
- EmailOctopus service is already configured and operational
- Backend `/api/v1/subscribe` endpoint exists and accepts tag arrays
- Users understand newsletter opt-in is optional and not required for registration
- Privacy policy and data handling disclosures are already in place
- The `NewsletterSubscription` component can be refactored to support multiple tags without breaking landing page usage
- All newsletter subscriptions are handled asynchronously and do not block the registration flow

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All 10 sections satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - API patterns, TypeScript standards, error handling
- ✅ BRANDING_GUIDELINE.md - Colour palette, typography, accessibility integration
- ✅ ACCESSIBILITY_REQUIREMENTS.md - WCAG 2.1 AA compliance, keyboard navigation, screen readers
- ✅ AI_PROMPT_ENGINEERING.md - Clear context for AI agent implementation

---

## Functional Requirements

- **[FR-1]** Registration form MUST display a checkbox labelled "Sign me up for news and updates about Legends Ascend"
- **[FR-2]** Checkbox MUST be unchecked by default (opt-in, not opt-out)
- **[FR-3]** Newsletter opt-in checkbox MUST include a link or text referencing the privacy policy
- **[FR-4]** If checkbox is checked at registration, the system MUST subscribe the user with tags `['registered', 'news']`
- **[FR-5]** If checkbox is unchecked at registration, the system MUST subscribe the user with tag `['registered']` only
- **[FR-6]** Newsletter subscription MUST NOT block account creation - registration MUST succeed even if newsletter subscription fails
- **[FR-7]** Newsletter subscription errors MUST be logged but MUST NOT be displayed to the user during registration
- **[FR-8]** After successful registration, users MUST receive confirmation that includes their newsletter preference status
- **[FR-9]** Newsletter subscription MUST use the user's registration email address
- **[FR-10]** Newsletter subscription MUST capture GDPR consent timestamp at registration time
- **[FR-11]** The `NewsletterSubscription` component MUST be updated to accept an array of tags (e.g., `tags: string[]`)
- **[FR-12]** The newsletter component update MUST NOT break existing landing page newsletter functionality

---

## Non-Functional Requirements

### Performance
- Newsletter subscription API call: SHOULD complete in <1000ms p95 (non-blocking async operation)
- Registration flow: MUST NOT add more than 200ms to overall registration time (parallel processing)
- Database operations: Newsletter preference stored with user record, indexed on user_id
- Concurrent registrations: MUST support at least 50 concurrent registration requests with newsletter opt-in

### Security
- **Authentication**: Newsletter opt-in only processed for authenticated registration requests
- **Authorization**: Only the registering user's email can be subscribed (no third-party subscriptions)
- **Input Validation**: 
  - Email validation using existing registration schema
  - Newsletter opt-in boolean validation (true/false only)
  - Tag validation on backend (whitelist: 'registered', 'news', 'beta-access')
- **Data Isolation**: User's newsletter preference stored in user record, isolated per user_id
- **Error Messages**: Newsletter subscription errors logged server-side, generic success shown to user
- **GDPR Compliance**: 
  - Explicit opt-in (unchecked by default)
  - Consent timestamp captured and stored
  - Privacy policy link visible near checkbox
  - User data only sent to EmailOctopus upon explicit consent

### Accessibility
- **WCAG 2.1 AA Compliance**: All requirements per ACCESSIBILITY_REQUIREMENTS.md
- **Keyboard Navigation**: 
  - Checkbox accessible via Tab key
  - Checkbox toggleable with Space key
  - Privacy policy link accessible via keyboard
- **Screen Reader Compatibility**:
  - Checkbox label properly associated with `<input>` via `htmlFor` and `id`
  - Checkbox state announced (checked/unchecked)
  - Privacy policy link descriptive and navigable
- **Colour Contrast**: 
  - Checkbox label text: 4.5:1 ratio against background
  - Checkbox border: 3:1 ratio against background
  - Focus indicator: 2px Primary Blue outline with 2px offset
- **Visual Indicators**: Checkbox state indicated by visual checkmark, not colour alone
- **Error Handling**: If newsletter subscription fails silently, no accessibility barrier to completing registration

### Branding
- Checkbox styling MUST comply with BRANDING_GUIDELINE.md:
  - Checkbox: Border using Primary Blue (#1E3A8A) when focused, Medium Gray (#64748B) when unfocused
  - Checkbox checkmark: Accent Gold (#F59E0B) or Primary Blue (#1E3A8A)
  - Label text: Dark Navy (#0F172A) on light backgrounds
  - Typography: Inter or Poppins font, 16px body text
  - Spacing: 8px between checkbox and label, 16px margin from other form elements
- Privacy policy link: Underlined or styled as inline link per brand guidelines

### Internationalization
- UK English terminology: "Sign me up for news and updates" (not "Subscribe to newsletter")
- Date format for consent timestamp: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- Privacy policy link text: "Learn more about how we handle your data" or similar UK English phrasing
- All UI strings externalizable for future translation support

### Observability
- **Structured Logging**:
  - Log newsletter subscription attempts with user_id, email, tags, timestamp
  - Log newsletter subscription success/failure with EmailOctopus response
  - Log silent failures without exposing details to frontend
- **Metrics/Telemetry**:
  - Track newsletter opt-in rate: percentage of registrations with opt-in checked
  - Track newsletter subscription success rate: percentage of attempted subscriptions that succeed
  - Track registration completion time including newsletter subscription
- **Error Tracking**:
  - Alert on EmailOctopus API failures (>5% failure rate over 15 minutes)
  - Alert on newsletter subscription timeout (>1000ms p95)
  - Log all newsletter subscription errors to error tracking service (e.g., Sentry)
- **Audit Trails**:
  - Record user's newsletter opt-in preference in database (boolean field)
  - Record GDPR consent timestamp
  - Record EmailOctopus subscription ID if available

---

## Acceptance Criteria

### AC-1: Newsletter Opt-In Checkbox Appears on Registration Form
**Given** a new user is on the registration page  
**When** they view the registration form  
**Then** they MUST see a checkbox labelled "Sign me up for news and updates about Legends Ascend"  
**And** the checkbox MUST be unchecked by default  
**And** a link or text referencing the privacy policy MUST be visible near the checkbox

### AC-2: Opted-In User Subscribed with Correct Tags
**Given** a user is registering for a new account  
**And** they check the newsletter opt-in checkbox  
**When** they submit the registration form with valid credentials  
**Then** their account MUST be created successfully  
**And** a newsletter subscription request MUST be sent to EmailOctopus with tags `['registered', 'news']`  
**And** their email MUST appear in the EmailOctopus subscriber list with both tags applied

### AC-3: Not Opted-In User Subscribed with Registered Tag Only
**Given** a user is registering for a new account  
**And** they leave the newsletter opt-in checkbox unchecked  
**When** they submit the registration form with valid credentials  
**Then** their account MUST be created successfully  
**And** a newsletter subscription request MUST be sent to EmailOctopus with tag `['registered']` only  
**And** their email MUST appear in the EmailOctopus subscriber list with only the 'registered' tag

### AC-4: Registration Succeeds Even if Newsletter Subscription Fails
**Given** a user is registering for a new account  
**And** the EmailOctopus API is unavailable or returns an error  
**When** they submit the registration form with valid credentials  
**Then** their account MUST be created successfully  
**And** the user MUST be logged in  
**And** NO error message about newsletter subscription MUST be shown to the user  
**And** the failure MUST be logged on the backend for admin review

### AC-5: Newsletter Preference Stored in Database
**Given** a user completes registration  
**When** their account is created  
**Then** their newsletter opt-in preference (true/false) MUST be stored in the database  
**And** the GDPR consent timestamp MUST be recorded if they opted in  
**And** the preference MUST be queryable via user_id

### AC-6: Newsletter Component Supports Multiple Tags
**Given** the `NewsletterSubscription` component is used  
**When** it is called with `tags: ['registered', 'news']`  
**Then** it MUST send both tags to the backend API  
**And** both tags MUST be applied to the subscriber in EmailOctopus  
**And** the component MUST still work with single tag usage (e.g., `tag: 'beta'`) for backwards compatibility

### AC-7: Accessibility Compliance
**Given** a user navigating the registration form with keyboard only  
**When** they Tab to the newsletter checkbox  
**Then** the checkbox MUST receive visible focus with a 2px Primary Blue outline  
**And** they MUST be able to toggle the checkbox using the Space key  
**And** screen readers MUST announce the checkbox label and state (checked/unchecked)

### AC-8: Branding Compliance
**Given** the registration form is displayed  
**When** a designer reviews the newsletter checkbox  
**Then** the checkbox styling MUST match BRANDING_GUIDELINE.md specifications  
**And** font, colours, and spacing MUST be consistent with approved brand standards

### AC-9: Landing Page Newsletter Unaffected
**Given** the landing page newsletter subscription form exists  
**When** the `NewsletterSubscription` component is updated to support multiple tags  
**Then** the landing page newsletter MUST continue to function correctly  
**And** landing page newsletter subscriptions MUST apply the 'beta' or 'beta-access' tag as before  
**And** NO breaking changes MUST be introduced to the landing page

### AC-10: Performance Target Met
**Given** 50 concurrent user registrations with newsletter opt-in  
**When** the system processes these registrations  
**Then** each registration MUST complete in <5 seconds total (p95)  
**And** newsletter subscription MUST NOT add more than 200ms to registration time (parallel async processing)  
**And** newsletter API calls MUST complete in <1000ms p95

---

## Test Scenarios

### TS-1: Happy Path - User Opts In for Newsletter
**Steps:**
1. Navigate to registration page
2. Enter valid email address (e.g., `testuser@example.com`)
3. Enter valid password (meets password requirements)
4. Check the newsletter opt-in checkbox
5. Click "Register" or "Sign Up" button
6. Wait for registration to complete

**Expected Result:**
- Registration succeeds with "Account created successfully" message
- User is logged in automatically
- Database shows user record with `newsletter_optin: true` and consent timestamp
- EmailOctopus dashboard shows new subscriber with tags `['registered', 'news']`
- Backend logs show successful newsletter subscription

### TS-2: User Does Not Opt In for Newsletter
**Steps:**
1. Navigate to registration page
2. Enter valid email address (e.g., `testuser2@example.com`)
3. Enter valid password (meets password requirements)
4. Leave the newsletter opt-in checkbox unchecked (default state)
5. Click "Register" or "Sign Up" button
6. Wait for registration to complete

**Expected Result:**
- Registration succeeds with "Account created successfully" message
- User is logged in automatically
- Database shows user record with `newsletter_optin: false`
- EmailOctopus dashboard shows new subscriber with tag `['registered']` only (no 'news' tag)
- Backend logs show subscriber created without 'news' tag

### TS-3: Newsletter Subscription Fails, Registration Still Succeeds
**Steps:**
1. Mock EmailOctopus API to return 500 Internal Server Error
2. Navigate to registration page
3. Enter valid email address (e.g., `testuser3@example.com`)
4. Enter valid password
5. Check the newsletter opt-in checkbox
6. Click "Register" button
7. Wait for registration to complete

**Expected Result:**
- Registration succeeds (account created)
- User is logged in automatically
- User sees generic success message (NO newsletter error visible)
- Database shows user record created with `newsletter_optin: true`
- Backend logs show newsletter subscription failure
- Error tracking service (Sentry) records the newsletter API failure

### TS-4: Keyboard Navigation and Screen Reader
**Steps:**
1. Navigate to registration page using only keyboard (Tab, Shift+Tab, Enter, Space)
2. Tab through all form fields until reaching newsletter checkbox
3. Verify focus indicator is visible
4. Press Space to check the checkbox
5. Press Space again to uncheck the checkbox
6. Use screen reader (NVDA, JAWS, VoiceOver) to announce checkbox state

**Expected Result:**
- Newsletter checkbox is reachable via Tab key
- Focus indicator is clearly visible (2px Primary Blue outline)
- Space key toggles checkbox on/off
- Screen reader announces: "Sign me up for news and updates about Legends Ascend, checkbox, unchecked" (or similar)
- Screen reader announces checked/unchecked state change when toggled

### TS-5: Privacy Policy Link Accessible
**Steps:**
1. Navigate to registration page
2. Locate the privacy policy link near the newsletter checkbox
3. Verify link is keyboard accessible (Tab to focus)
4. Click or press Enter on the link
5. Verify privacy policy page loads

**Expected Result:**
- Privacy policy link is visible near checkbox
- Link is keyboard accessible (receives focus on Tab)
- Link opens privacy policy page in same or new tab
- Link text is descriptive (e.g., "Learn more about how we handle your data")

### TS-6: Multiple Tags Sent to Backend
**Steps:**
1. Instrument backend API to log incoming newsletter subscription requests
2. Navigate to registration page
3. Enter valid credentials
4. Check newsletter opt-in checkbox
5. Submit registration form
6. Review backend API logs

**Expected Result:**
- Backend API receives POST `/api/v1/subscribe` with payload containing `tags: ['registered', 'news']`
- EmailOctopus API receives both tags in the subscription request
- EmailOctopus dashboard shows subscriber with both tags applied

### TS-7: Landing Page Newsletter Still Works
**Steps:**
1. Navigate to landing page
2. Enter email in landing page newsletter form (e.g., `landinguser@example.com`)
3. Check GDPR consent checkbox on landing page
4. Submit landing page newsletter form

**Expected Result:**
- Landing page newsletter subscription succeeds
- EmailOctopus shows new subscriber with 'beta' or 'beta-access' tag (not 'registered' or 'news')
- NO errors or breaking changes
- Component still accepts single `tag` prop for backwards compatibility

### TS-8: Colour Contrast Verification
**Steps:**
1. Use WebAIM Contrast Checker or axe DevTools
2. Check contrast ratio of checkbox label text against background
3. Check contrast ratio of checkbox border against background
4. Check contrast ratio of focus indicator against background

**Expected Result:**
- Label text contrast ratio: ≥4.5:1 (WCAG AA for normal text)
- Checkbox border contrast ratio: ≥3:1 (WCAG AA for UI components)
- Focus indicator contrast ratio: ≥3:1 (WCAG AA)
- All contrast ratios pass WCAG 2.1 AA standards

### TS-9: Performance Under Load
**Steps:**
1. Use load testing tool (e.g., k6, Artillery) to simulate 50 concurrent registrations
2. Half of the requests have newsletter opt-in checked, half unchecked
3. Monitor registration completion time and newsletter API response time
4. Review backend performance metrics

**Expected Result:**
- All 50 registrations complete successfully
- p95 registration time: <5 seconds total
- p95 newsletter API call time: <1000ms
- Newsletter subscription does not block registration (async processing)
- No timeouts or failures under concurrent load

### TS-10: Newsletter Preference Queryable in Database
**Steps:**
1. Register a new user with newsletter opt-in checked
2. Query the database for the user's record (e.g., `SELECT * FROM users WHERE email = 'testuser@example.com'`)
3. Verify `newsletter_optin` field is `true`
4. Verify `newsletter_consent_timestamp` field contains ISO 8601 timestamp
5. Register another user with newsletter opt-in unchecked
6. Query database and verify `newsletter_optin` is `false`

**Expected Result:**
- Database schema includes `newsletter_optin` boolean field
- Database schema includes `newsletter_consent_timestamp` timestamp field (nullable, only set if opted in)
- Opted-in user: `newsletter_optin = true`, timestamp populated
- Not opted-in user: `newsletter_optin = false`, timestamp is null or not set

---

## Technical Notes

### API Design

**New/Modified Endpoint:**
```
POST /api/v1/auth/register
```

**Request Payload (Updated):**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "newsletterOptIn": true
}
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "createdAt": "2025-11-23T12:00:00.000Z",
      "newsletterOptIn": true
    }
  }
}
```

**Newsletter Subscription Call (Internal - Async):**
```
POST /api/v1/subscribe
```

**Newsletter Subscription Payload:**
```json
{
  "email": "user@example.com",
  "gdprConsent": true,
  "timestamp": "2025-11-23T12:00:00.000Z",
  "tags": ["registered", "news"]
}
```

**Note:** Newsletter subscription is called asynchronously after user account creation. Registration success is not dependent on newsletter subscription success.

---

### Data Model

**Updated `users` Table Schema:**
```sql
ALTER TABLE users
ADD COLUMN newsletter_optin BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN newsletter_consent_timestamp TIMESTAMP NULL;

-- Index for querying newsletter preferences
CREATE INDEX idx_users_newsletter_optin ON users(newsletter_optin);

-- Comment for documentation
COMMENT ON COLUMN users.newsletter_optin IS 'User opted in to receive newsletter during registration';
COMMENT ON COLUMN users.newsletter_consent_timestamp IS 'Timestamp when user consented to newsletter (GDPR compliance)';
```

**Indexes:**
- `idx_users_newsletter_optin` on `newsletter_optin` for querying opted-in users
- Existing `idx_users_email` for email lookups (already exists from auth implementation)

**Migration Notes:**
- Existing users: `newsletter_optin` defaults to `false`, `newsletter_consent_timestamp` is `NULL`
- New users: Fields populated based on registration form input

---

### Validation Schemas

**Backend Registration Schema Update (Zod):**
```typescript
import { z } from 'zod';

// Update existing CreateUserSchema to include newsletter opt-in
export const CreateUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  newsletterOptIn: z.boolean().optional().default(false), // Optional, defaults to false
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

**Frontend Registration Form Schema:**
```typescript
import { z } from 'zod';

export const RegistrationFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  newsletterOptIn: z.boolean().optional().default(false),
});

export type RegistrationFormData = z.infer<typeof RegistrationFormSchema>;
```

**Newsletter Subscription Component Props Update:**
```typescript
export interface NewsletterSubscriptionProps {
  tag?: string; // Deprecated: Use tags array instead
  tags?: string[]; // New: Array of tags to apply
  submitButtonText?: string;
  successMessage?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
  className?: string;
}
```

---

### Migrations

**Required:** Yes  
**Type:** Schema change (add columns to `users` table)  
**Migration File:** `migrations/YYYYMMDDHHMMSS_add_newsletter_optin_to_users.sql`

**Migration SQL:**
```sql
-- Add newsletter opt-in fields to users table
ALTER TABLE users
ADD COLUMN newsletter_optin BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN newsletter_consent_timestamp TIMESTAMP NULL;

-- Create index for querying newsletter preferences
CREATE INDEX idx_users_newsletter_optin ON users(newsletter_optin);

-- Add comments for documentation
COMMENT ON COLUMN users.newsletter_optin IS 'User opted in to receive newsletter during registration';
COMMENT ON COLUMN users.newsletter_consent_timestamp IS 'Timestamp when user consented to newsletter (GDPR compliance)';
```

**Rollback Plan:**
```sql
-- Remove newsletter opt-in fields from users table
DROP INDEX IF EXISTS idx_users_newsletter_optin;
ALTER TABLE users
DROP COLUMN IF EXISTS newsletter_optin,
DROP COLUMN IF EXISTS newsletter_consent_timestamp;
```

**Testing Migration:**
1. Apply migration to local development database
2. Verify columns exist: `\d users` (PostgreSQL) or `DESCRIBE users;` (MySQL)
3. Test inserting new users with `newsletter_optin` set to `true` and `false`
4. Test querying users by `newsletter_optin` status
5. Test rollback migration to ensure clean reversion

---

### Integration Points

**Registration Flow Integration:**
1. User submits registration form with `newsletterOptIn: true/false`
2. Backend validates registration data (email, password, newsletterOptIn)
3. Backend creates user account in database with `newsletter_optin` and `newsletter_consent_timestamp` fields
4. Backend returns auth token and user object to frontend
5. **After** user account creation succeeds, backend asynchronously calls newsletter subscription service
6. Newsletter service determines tags based on `newsletterOptIn` value:
   - If `true`: `tags = ['registered', 'news']`
   - If `false`: `tags = ['registered']`
7. Newsletter service calls EmailOctopus API with email and tags
8. If newsletter subscription fails, error is logged but not surfaced to user
9. User proceeds to post-registration flow (onboarding, dashboard, etc.)

**NewsletterSubscription Component Integration:**
- Update component to accept `tags: string[]` prop (plural)
- Maintain backwards compatibility with `tag: string` prop (singular) for landing page
- If both `tag` and `tags` are provided, `tags` takes precedence
- Component sends `tags` array to backend `/api/v1/subscribe` endpoint
- Backend `emailOctopusService` applies all tags to subscriber in EmailOctopus

**Backend Service Integration:**
```typescript
// In authService.ts or authController.ts

import { subscribeToEmailList } from '../services/emailOctopusService';

export async function registerUser(email: string, password: string, newsletterOptIn: boolean) {
  // 1. Create user account
  const user = await createUserInDatabase(email, hashedPassword, newsletterOptIn);
  
  // 2. Generate auth token
  const token = generateAuthToken(user);
  
  // 3. Subscribe to newsletter asynchronously (non-blocking)
  const tags = newsletterOptIn ? ['registered', 'news'] : ['registered'];
  const consentTimestamp = newsletterOptIn ? new Date().toISOString() : null;
  
  // Don't await - fire and forget
  subscribeToEmailList(email, consentTimestamp || new Date().toISOString(), tags)
    .catch((error) => {
      // Log error but don't throw (non-blocking)
      console.error('Newsletter subscription failed:', error);
      // TODO: Send to error tracking service (Sentry, etc.)
    });
  
  // 4. Return user and token immediately
  return { user, token };
}
```

---

### Failure Modes & Resilience

**EmailOctopus API Unavailable:**
- **Scenario:** EmailOctopus API returns 500 or times out during subscription
- **Handling:** Log error, do NOT block registration, return success to user
- **Recovery:** Implement retry queue or manual admin review of failed subscriptions
- **User Impact:** None - user's account is created successfully

**EmailOctopus API Rate Limit Exceeded:**
- **Scenario:** Too many subscription requests in short time, API returns 429 Too Many Requests
- **Handling:** Log error, implement exponential backoff retry (3 attempts max)
- **Recovery:** Queue failed subscriptions for retry after rate limit window
- **User Impact:** None - user's account is created successfully

**Database Unavailable During Registration:**
- **Scenario:** Database connection fails when creating user account
- **Handling:** Return 500 error to user, do NOT create account, do NOT subscribe to newsletter
- **Recovery:** User retries registration, ensure idempotency (check if email already exists)
- **User Impact:** Registration fails, user must retry

**Invalid Email Format:**
- **Scenario:** User enters invalid email address in registration form
- **Handling:** Client-side validation shows error immediately, backend validation rejects with 400 Bad Request
- **Recovery:** User corrects email format and resubmits
- **User Impact:** Clear error message: "Please enter a valid email address"

**Newsletter Tag Not Recognized by EmailOctopus:**
- **Scenario:** EmailOctopus doesn't recognize 'registered' or 'news' tag
- **Handling:** EmailOctopus auto-creates tags on first use (no error), OR log warning if tag creation disabled
- **Recovery:** Pre-create tags in EmailOctopus dashboard before launch
- **User Impact:** None - subscription succeeds, tags applied

**User Already Subscribed in EmailOctopus:**
- **Scenario:** User previously subscribed (e.g., via landing page), then registers with same email
- **Handling:** EmailOctopus updates existing subscriber, adds new tags (merge tags)
- **Recovery:** No action needed - EmailOctopus handles deduplication
- **User Impact:** None - user receives newsletter with all applicable tags

---

### Performance Targets

**Database Queries:**
- User creation insert: <50ms p95
- User lookup by email: <20ms p95 (indexed on email)
- Newsletter preference query: <20ms p95 (indexed on newsletter_optin)

**API Endpoints:**
- `POST /api/v1/auth/register`: <3000ms p95 total (including password hashing)
- Newsletter subscription (async): <1000ms p95, does NOT block registration response

**Concurrent Users:**
- Support at least 50 concurrent registrations per second
- Newsletter subscription queue handles at least 100 requests per second
- No degradation in registration success rate under load

**Optimization Strategies:**
- Newsletter subscription is fully asynchronous (fire and forget)
- Database indexes on `email` and `newsletter_optin` for fast queries
- Password hashing uses bcrypt with appropriate work factor (10-12 rounds)
- EmailOctopus API calls have 5-second timeout to prevent hanging
- Retry queue for failed newsletter subscriptions (max 3 retries with exponential backoff)

---

## Task Breakdown for AI Agents

### Phase 1: Database & Backend Foundation
- [ ] Review existing `users` table schema in PostgreSQL
- [ ] Create database migration to add `newsletter_optin` and `newsletter_consent_timestamp` columns
- [ ] Test migration on local development database
- [ ] Update `CreateUserSchema` in `backend/src/models/User.ts` to include `newsletterOptIn` field
- [ ] Add Zod validation for `newsletterOptIn` (boolean, optional, defaults to false)
- [ ] Document migration in `TECHNICAL_ARCHITECTURE.md` if needed

### Phase 2: Backend API Implementation
- [ ] Update `authController.ts` `register` function to accept `newsletterOptIn` parameter
- [ ] Update `authService.ts` `registerUser` function to:
  - Accept `newsletterOptIn` boolean parameter
  - Store `newsletter_optin` and `newsletter_consent_timestamp` in database
  - Asynchronously call newsletter subscription service after user creation
  - Determine tags based on `newsletterOptIn`: `['registered', 'news']` or `['registered']`
  - Implement error handling for newsletter subscription failures (log but don't throw)
- [ ] Update `emailOctopusService.ts` to accept `tags: string[]` instead of single `tag: string`
- [ ] Maintain backwards compatibility: if `tag` provided, convert to `tags: [tag]`
- [ ] Add unit tests for newsletter tag logic
- [ ] Add integration tests for registration with newsletter opt-in scenarios

### Phase 3: Frontend Newsletter Component Update
- [ ] Review existing `NewsletterSubscription` component in `frontend/src/components/NewsletterSubscription.tsx`
- [ ] Add `tags?: string[]` prop to `NewsletterSubscriptionProps` interface
- [ ] Update component logic to send `tags` array to backend API
- [ ] Maintain backwards compatibility with `tag?: string` prop (single tag)
- [ ] If both `tag` and `tags` provided, `tags` takes precedence
- [ ] Update component documentation in `/docs/NEWSLETTER_SUBSCRIPTION.md`
- [ ] Add unit tests for multiple tags functionality
- [ ] Verify landing page newsletter still works (regression testing)

### Phase 4: Registration Form UI Implementation
- [ ] Locate existing registration form component (likely `frontend/src/components/Auth/RegistrationForm.tsx` or similar)
- [ ] Add `newsletterOptIn` boolean state variable (default: `false`)
- [ ] Add checkbox input element with:
  - Label: "Sign me up for news and updates about Legends Ascend"
  - `id` and `htmlFor` association for accessibility
  - `checked` bound to `newsletterOptIn` state
  - `onChange` handler to toggle state
  - Unchecked by default (opt-in, not opt-out)
- [ ] Add privacy policy link/text near checkbox (e.g., "Learn more about how we handle your data")
- [ ] Apply branding styles per BRANDING_GUIDELINE.md:
  - Checkbox border: Primary Blue (#1E3A8A) when focused, Medium Gray (#64748B) when unfocused
  - Checkbox checkmark: Accent Gold (#F59E0B) or Primary Blue
  - Label text: Dark Navy (#0F172A)
  - Typography: Inter or Poppins, 16px
  - Spacing: 8px between checkbox and label
- [ ] Implement accessibility requirements:
  - Keyboard navigation (Tab, Space)
  - Focus indicator (2px Primary Blue outline)
  - ARIA attributes (`aria-label`, `aria-describedby` if needed)
  - Screen reader compatibility
- [ ] Update registration form submission to include `newsletterOptIn` in request payload
- [ ] Add frontend validation for `newsletterOptIn` (boolean validation)

### Phase 5: Frontend Registration Service Update
- [ ] Update `frontend/src/services/authService.ts` `registerUser` function
- [ ] Modify `RegisterRequest` type to include `newsletterOptIn?: boolean`
- [ ] Update request payload to send `newsletterOptIn` to backend
- [ ] Ensure error handling doesn't expose newsletter subscription failures to user
- [ ] Add unit tests for registration with newsletter opt-in

### Phase 6: Testing & Quality Assurance
- [ ] Run all existing auth tests to ensure no regressions
- [ ] Add integration tests for registration with newsletter opt-in (TS-1, TS-2)
- [ ] Add integration tests for newsletter subscription failure scenarios (TS-3)
- [ ] Add accessibility tests (keyboard navigation, screen reader, TS-4)
- [ ] Add performance tests for concurrent registrations (TS-9)
- [ ] Test landing page newsletter to verify no breaking changes (TS-7)
- [ ] Test colour contrast with automated tools (axe DevTools, WAVE) (TS-8)
- [ ] Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Manual testing with keyboard-only navigation

### Phase 7: Documentation & Verification
- [ ] Update `/docs/NEWSLETTER_SUBSCRIPTION.md` with multiple tags usage examples
- [ ] Update `/docs/TECHNICAL_ARCHITECTURE.md` with newsletter registration integration details
- [ ] Add code comments explaining newsletter opt-in logic
- [ ] Update API documentation (OpenAPI/Swagger) for `/api/v1/auth/register` endpoint
- [ ] Update database schema documentation
- [ ] Create or update user-facing documentation (if applicable)
- [ ] Document newsletter tag strategy ('registered', 'news', 'beta-access')

### Phase 8: Pre-Deployment Checklist
- [ ] All unit tests passing (>90% code coverage for new code)
- [ ] All integration tests passing
- [ ] All accessibility tests passing (WCAG 2.1 AA compliance)
- [ ] All performance benchmarks met (<5s registration p95, <1s newsletter API p95)
- [ ] Code review completed (automated + manual review)
- [ ] Database migration tested and rollback verified
- [ ] Error tracking configured (Sentry or equivalent)
- [ ] Monitoring and alerts configured (newsletter subscription failures, API errors)
- [ ] GDPR compliance verified (opt-in default, consent timestamp, privacy policy link)
- [ ] Branding compliance verified (design team review)
- [ ] Landing page newsletter regression testing passed (no breaking changes)

### Phase 9: Deployment & Monitoring
- [ ] Deploy database migration to staging environment
- [ ] Deploy backend changes to staging environment
- [ ] Deploy frontend changes to staging environment
- [ ] Smoke test registration flow in staging
- [ ] Verify EmailOctopus subscriptions in staging (test tags applied correctly)
- [ ] Monitor error logs for newsletter subscription failures
- [ ] Monitor performance metrics (registration time, newsletter API latency)
- [ ] Deploy to production (blue-green or canary deployment)
- [ ] Monitor production metrics for 24-48 hours post-deployment
- [ ] Verify opt-in rate metrics (track percentage of users opting in)

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format: "As a new user, I want to opt-in to newsletter during registration, so that I can receive updates"
- ✅ **Acceptance Criteria:** 10 testable acceptance criteria with specific pass/fail conditions and edge cases (AC-1 through AC-10)
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md patterns (TypeScript, Zod validation, async processing, error handling)
- ✅ **Dependencies Identified:** Requires NewsletterSubscription component update, depends on existing auth system (US-045)
- ✅ **Story Points Estimated:** 5 points (Fibonacci scale) - Moderate complexity, 1-2 days work
- ✅ **Priority Assigned:** SHOULD (MoSCoW method) - Important for user engagement but not critical for MVP launch
- ✅ **Non-Functional Requirements:** Performance (<5s registration, <1s newsletter API), security (GDPR compliance, data isolation), accessibility (WCAG 2.1 AA), observability (logging, metrics, alerts)
- ✅ **Branding Compliance:** Aligned with BRANDING_GUIDELINE.md (colours, typography, spacing, focus indicators)
- ✅ **Accessibility:** WCAG 2.1 AA requirements specified (keyboard navigation, screen readers, colour contrast, focus indicators)
- ✅ **AI Agent Context:** Comprehensive technical notes, API design, data models, integration points, failure modes, performance targets - sufficient detail for autonomous implementation

**Story Points:** 5  
**Priority:** SHOULD  
**Risk Level:** Medium - Requires updating shared newsletter component without breaking landing page, asynchronous processing adds complexity, GDPR compliance must be maintained

**Risk Mitigation:**
- Maintain backwards compatibility with `tag` prop in NewsletterSubscription component
- Comprehensive regression testing of landing page newsletter
- Asynchronous newsletter subscription prevents registration blocking
- Silent failure handling ensures user experience not degraded
- Database migration rollback plan documented

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements newsletter subscription opt-in during user registration, allowing users to receive game updates and news whilst maintaining full GDPR compliance.
> 
> **Key Deliverables:**
> - Database migration adding `newsletter_optin` and `newsletter_consent_timestamp` columns to `users` table
> - Backend API update to accept `newsletterOptIn` parameter in registration request
> - Asynchronous newsletter subscription service integration (non-blocking)
> - `NewsletterSubscription` component updated to support multiple tags (`['registered', 'news']`)
> - Registration form UI with accessible newsletter opt-in checkbox
> - Conditional tag assignment: `['registered']` always, `['news']` if opted-in
> - WCAG 2.1 AA compliant implementation (keyboard navigation, screen readers, colour contrast)
> - Brand-compliant styling per BRANDING_GUIDELINE.md
> - Comprehensive test coverage (10 test scenarios covering happy path, error handling, accessibility, performance)
> - Zero breaking changes to landing page newsletter functionality
> 
> **Testing:** All 10 acceptance criteria verified with test scenarios covering:
> - Happy path: user opts in and gets both tags
> - User doesn't opt in: gets 'registered' tag only
> - Newsletter API failure: registration still succeeds (non-blocking)
> - Accessibility: keyboard navigation, screen reader compatibility, colour contrast
> - Performance: <5s registration p95, <1s newsletter API p95
> - Backwards compatibility: landing page newsletter unaffected
> 
> **DoR Compliance:** ✅ All Definition of Ready requirements met (WCAG 2.1 AA, GDPR compliance, branding, performance, security, observability)

---

## Open Questions & Clarifications

**No outstanding questions** - All requirements are clear and implementation is well-defined.

If during implementation any ambiguities arise:
- [ ] EmailOctopus tag naming: Confirm 'registered' and 'news' tag names with marketing team
- [ ] Privacy policy link: Confirm exact wording and destination URL
- [ ] Newsletter content strategy: Confirm frequency and content type for 'news' tag subscribers (handled by marketing, not blocking)
- [ ] Retry strategy: Confirm retry queue implementation details (3 retries with exponential backoff suggested, can be refined during implementation)

---

**Document Version:** 1.0  
**Created:** 23 November 2025  
**Epic:** Registration  
**Related Issues:** Implements GitHub issue for newsletter subscription upon user registration  
**Foundation Documents Referenced:** DEFINITION_OF_READY.md, TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md, NEWSLETTER_SUBSCRIPTION.md
