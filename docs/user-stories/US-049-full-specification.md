# Email Confirmation Upon User Registration

**ID:** US-049  
**Story Points:** 8  
**Priority:** SHOULD  
**Epic/Feature:** Registration  
**Dependencies:** 
- US-045 (User Authentication System - Complete)
- US-048 (Newsletter Opt-In During Registration - Complete)
- Email delivery service configuration (SMTP or transactional email service)

---

## User Story

As a new Legends Ascend user who has just registered,  
I want to receive a confirmation email and verify my email address,  
So that my account is secure, the platform ensures valid user contact information, and I can safely access all game features.

---

## Context

### Summary
Currently, user registration creates accounts immediately without email verification, allowing users to log in with any email address (even invalid ones). This story implements a double opt-in email confirmation flow that verifies user email addresses, prevents spam registrations, ensures GDPR compliance, and enhances account security by confirming ownership of the provided email address.

### Scope

**In Scope:**
- Generate secure, time-limited email confirmation tokens upon registration
- Send confirmation email with verification link to newly registered users
- Implement email confirmation endpoint that validates tokens and activates accounts
- Prevent login for unconfirmed accounts (enforce email verification)
- Store email confirmation status and timestamps in user database
- Token expiration mechanism (default: 24 hours)
- Resend confirmation email functionality
- Secure token generation using cryptographically secure random values
- GDPR-compliant email content with unsubscribe mechanism
- Rate limiting on confirmation email sending to prevent abuse
- Accessible email templates per WCAG 2.1 AA guidelines
- Clear user feedback for confirmation success/failure states
- Integration with existing authentication flow (US-045)
- Minimal PII exposure in email content and URLs

**Out of Scope:**
- Password reset flow (separate user story)
- Email template design beyond functional requirements (handled by design team)
- Multi-language email templates (future enhancement)
- SMS/phone verification (alternative verification method for future)
- Account deletion for unconfirmed accounts (separate cleanup job)
- Email deliverability monitoring and bounce handling (operational concern)
- Custom email domains for different user segments
- Email marketing automation workflows

### Assumptions
- SMTP or transactional email service (e.g., SendGrid, AWS SES, Resend) is configured with valid credentials
- Email service can reliably deliver emails within 5 minutes
- Users have access to their email inbox within 24 hours of registration
- Frontend application can handle email confirmation callback URLs
- Database supports atomic operations for confirmation status updates
- Email confirmation is required for all users (no exemptions for MVP)
- Users understand they must confirm their email to access the platform
- Email service supports HTML and plain text multipart emails
- Email delivery failures are logged and monitored externally
- Unconfirmed accounts can be safely retained for 30 days before cleanup (out of scope for this story)

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All 10 sections satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - API patterns, TypeScript standards, JWT authentication, database schema
- ✅ BRANDING_GUIDELINE.md - Email template styling, typography, colour palette
- ✅ ACCESSIBILITY_REQUIREMENTS.md - Accessible email templates, plain text alternatives
- ✅ AI_PROMPT_ENGINEERING.md - Clear implementation context for AI agents

---

## Functional Requirements

### Registration Flow
- **[FR-1]** Upon successful registration, the system MUST generate a cryptographically secure random confirmation token (minimum 32 bytes, URL-safe)
- **[FR-2]** The system MUST store the confirmation token hash (not plain text) in the database with associated user_id and expiration timestamp
- **[FR-3]** The system MUST send a confirmation email to the user's registered email address within 30 seconds of registration
- **[FR-4]** The confirmation email MUST contain a unique verification link with the token: `{FRONTEND_URL}/confirm-email?token={TOKEN}`
- **[FR-5]** The confirmation email MUST be sent asynchronously (non-blocking) to avoid delaying registration response
- **[FR-6]** If email sending fails, the error MUST be logged but MUST NOT prevent registration completion
- **[FR-7]** Upon successful registration, the API MUST return user data with `email_confirmed: false` status

### Email Confirmation
- **[FR-8]** When a user clicks the confirmation link, the frontend MUST send the token to `POST /api/v1/auth/confirm-email`
- **[FR-9]** The backend MUST validate the token by comparing its hash against stored confirmation tokens
- **[FR-10]** The backend MUST verify the token has not expired (default expiration: 24 hours from generation)
- **[FR-11]** Upon successful token validation, the system MUST:
  - Update `email_confirmed` to `true`
  - Set `email_confirmed_at` timestamp to current time
  - Invalidate the confirmation token (delete or mark as used)
  - Return success response with user data
- **[FR-12]** If token is invalid, expired, or already used, the system MUST return a 400 error with appropriate message
- **[FR-13]** Token validation MUST be case-sensitive and exact match only

### Login Enforcement
- **[FR-14]** The login endpoint (`POST /api/v1/auth/login`) MUST check if user's email is confirmed before issuing JWT token
- **[FR-15]** If email is not confirmed, the login MUST fail with 403 status and message: "Please confirm your email address to log in. Check your inbox for the confirmation link."
- **[FR-16]** The error response MUST include a flag allowing frontend to show "Resend confirmation email" option
- **[FR-17]** Authenticated endpoints (requiring JWT) MUST verify email confirmation status and return 403 if unconfirmed (defense in depth)

### Resend Confirmation Email
- **[FR-18]** The system MUST provide `POST /api/v1/auth/resend-confirmation` endpoint for users to request a new confirmation email
- **[FR-19]** Resend endpoint MUST accept email address or JWT token as authentication
- **[FR-20]** Upon valid request, the system MUST:
  - Invalidate previous confirmation tokens for that user
  - Generate a new confirmation token with fresh expiration
  - Send a new confirmation email
- **[FR-21]** Resend endpoint MUST be rate-limited to 3 requests per email address per hour
- **[FR-22]** If email is already confirmed, resend endpoint MUST return 200 with message: "Email address is already confirmed"

### Email Content Requirements
- **[FR-23]** Confirmation email MUST include:
  - Subject line: "Confirm your Legends Ascend account"
  - Personalized greeting: "Hello, [email]" or generic "Hello" (no PII in subject line)
  - Clear call-to-action button/link: "Confirm Email Address"
  - Plain text version of the verification link for non-HTML email clients
  - Expiration notice: "This link expires in 24 hours"
  - Support contact information
  - Unsubscribe/opt-out mechanism per GDPR requirements
- **[FR-24]** Email MUST be sent as multipart MIME (HTML + plain text alternatives)
- **[FR-25]** Email MUST follow branding guidelines for HTML version (colours, typography, logo)
- **[FR-26]** Email MUST NOT include sensitive information beyond the confirmation token
- **[FR-27]** Email footer MUST include: "Didn't register? You can safely ignore this email."

### Error Handling
- **[FR-28]** If email service is unavailable during registration, the system MUST:
  - Log the error with user_id and timestamp
  - Allow registration to complete successfully
  - Add user to a retry queue for confirmation email delivery
- **[FR-29]** Invalid token errors MUST NOT reveal whether the token exists (prevent enumeration attacks)
- **[FR-30]** System MUST log all confirmation token validation attempts (success and failure) for security auditing

---

## Non-Functional Requirements

### Performance
- **Token Generation:** <50ms for cryptographically secure random token generation
- **Email Sending:** Asynchronous, MUST NOT block registration response (fire-and-forget pattern)
- **Email Delivery:** Target <5 minutes from registration to inbox (depends on email service SLA)
- **Token Validation:** <100ms database lookup and hash comparison
- **Database Queries:**
  - Index on `confirmation_token_hash` for O(1) lookups
  - Index on `email` for user lookup during resend
  - Index on `email_confirmed` for filtering unconfirmed users
- **Concurrent Operations:** Support 100 concurrent registration + confirmation flows
- **Rate Limiting:** Resend confirmation endpoint limited to 3 requests/hour per email

### Security
- **Token Security:**
  - Minimum 32 bytes (256 bits) of cryptographically secure randomness
  - URL-safe encoding (Base64URL or hexadecimal)
  - Stored as one-way hash (SHA-256) in database, never plain text
  - Single-use tokens (invalidated immediately upon successful confirmation)
  - Time-limited expiration (default 24 hours, configurable via environment variable)
- **Authentication:**
  - Confirmation endpoint does not require JWT (user not logged in yet)
  - Resend endpoint requires email address (no auth) with strict rate limiting, or valid JWT token
  - Login endpoint enforces email confirmation check before issuing JWT
- **Authorization:**
  - Users can only confirm their own email (token binds to specific user_id)
  - No ability to confirm arbitrary email addresses
- **Input Validation:**
  - Token format validation (length, character set)
  - Email format validation (RFC 5322)
  - Expiration timestamp validation (server-side, not client-provided)
- **Data Isolation:**
  - Confirmation tokens scoped to individual users
  - No cross-user token reuse possible
- **Attack Prevention:**
  - Rate limiting on resend endpoint prevents spam attacks
  - Rate limiting on confirmation endpoint prevents brute force token guessing (100 requests per IP per hour)
  - Token enumeration prevention: generic error messages for invalid tokens
  - Timing attack prevention: constant-time hash comparison
- **GDPR Compliance:**
  - Email confirmation is part of legitimate interest in account security
  - Users can request account deletion even if email unconfirmed (separate flow)
  - Email includes unsubscribe mechanism
  - Minimal PII in emails (only email address, no names or other data)
- **Audit Logging:**
  - Log all confirmation token generation with user_id and timestamp
  - Log all confirmation attempts (success/failure) with IP address and user agent
  - Log all resend requests with email address and outcome
  - Do NOT log plain text tokens (only hashes)

### Accessibility
- **Email Accessibility (WCAG 2.1 AA compliance):**
  - HTML email uses semantic HTML structure
  - Headings hierarchy (h1 for title, h2 for sections)
  - Call-to-action button has 4.5:1 colour contrast ratio
  - Button text is descriptive: "Confirm Email Address" (not "Click Here")
  - Plain text alternative provided for screen readers and text-only email clients
  - Email width restricted to 600px for readability
  - Font size minimum 14px (body text), 16px for call-to-action
  - Line height 1.5 for readability
  - Alternative text for any images (logo)
  - No reliance on colour alone for information (e.g., use icons + text)
- **Frontend Confirmation Page:**
  - Clear success message: "Your email has been confirmed! You can now log in."
  - Clear error messages with recovery instructions
  - Keyboard accessible "Resend confirmation" button
  - Screen reader announcements for success/error states (ARIA live regions)
  - Focus management (auto-focus on success message or error recovery button)

### Branding
- **Email Template Compliance:**
  - Use Primary Blue (#1E3A8A) for header and call-to-action button
  - Use Accent Gold (#F59E0B) for highlights or secondary elements
  - Use Dark Navy (#0F172A) for body text
  - Background: White (#FFFFFF) or Off-White (#FAFAFA)
  - Typography: Inter or Poppins font family (web-safe fallback: Arial, sans-serif)
  - Button styling: Primary Blue background, white text, rounded corners (8px)
  - Logo: Full-colour logo in email header (SVG or high-resolution PNG)
  - Footer: Medium Gray (#64748B) text on Soft Gray (#F1F5F9) background
- **Consistent Voice:**
  - Professional, friendly, and supportive tone
  - UK English terminology and spelling
  - Clear, concise instructions
  - Reassuring language for security-related actions

### Internationalization
- **UK English:**
  - Subject: "Confirm your Legends Ascend account" (not "Verify your account")
  - Button: "Confirm Email Address" (not "Verify Email")
  - Body text uses UK spelling (organise, colour, etc.)
- **Date/Time Formatting:**
  - Expiration time: "24 hours" (not specific timestamp to avoid timezone complexity)
  - Confirmation timestamp: ISO 8601 format in database, human-readable in UI
- **Future Translation Support:**
  - All email text externalizable as templates
  - Support for locale-specific email templates (not in MVP scope)
  - Database stores user locale preference for future use

### Observability
- **Structured Logging:**
  - Log email sending attempts: `{ event: 'email_confirmation_sent', user_id, email, timestamp }`
  - Log email failures: `{ event: 'email_confirmation_failed', user_id, email, error, timestamp }`
  - Log token confirmations: `{ event: 'email_confirmed', user_id, token_hash, timestamp }`
  - Log token validation failures: `{ event: 'email_confirmation_failed', reason, token_hash_prefix, timestamp }`
  - Log resend requests: `{ event: 'confirmation_resend', email, success, timestamp }`
- **Metrics/Telemetry:**
  - Track email confirmation rate: percentage of users confirming email within 24/48/72 hours
  - Track email delivery success rate: percentage of emails successfully delivered
  - Track time to confirmation: median and p95 time from registration to confirmation
  - Track resend request rate: number of resend requests per registration
  - Track unconfirmed account rate: percentage of active accounts with unconfirmed emails
- **Error Tracking:**
  - Alert on email service failures (>5% failure rate over 15 minutes)
  - Alert on low confirmation rate (<50% within 48 hours may indicate email delivery issues)
  - Alert on high invalid token rate (>1% may indicate attack or bug)
  - Send all email service errors to error tracking service (e.g., Sentry)
- **Audit Trails:**
  - Record all email confirmation status changes in database
  - Record all token generation and validation events
  - Maintain immutable log of security events for compliance

---

## Acceptance Criteria

### AC-1: User Registration Sends Confirmation Email
**Given** a new user registers with email "user@example.com" and password "SecurePass123"  
**When** the registration request is processed  
**Then** the system successfully creates the user account  
**And** generates a unique confirmation token  
**And** sends a confirmation email to "user@example.com" within 30 seconds  
**And** returns user data with `email_confirmed: false`  
**And** the email contains a working confirmation link

### AC-2: Unconfirmed User Cannot Log In
**Given** a user has registered but not confirmed their email  
**When** they attempt to log in with valid credentials  
**Then** the login request is rejected with 403 status  
**And** the error message states: "Please confirm your email address to log in. Check your inbox for the confirmation link."  
**And** the response includes a flag enabling the "Resend confirmation" option in the frontend

### AC-3: Email Confirmation Link Activates Account
**Given** a user has received a confirmation email with token "abc123xyz"  
**When** they click the confirmation link or visit `/confirm-email?token=abc123xyz`  
**Then** the frontend sends the token to `POST /api/v1/auth/confirm-email`  
**And** the backend validates the token successfully  
**And** updates the user's `email_confirmed` to `true`  
**And** sets `email_confirmed_at` timestamp  
**And** invalidates the confirmation token  
**And** returns success response  
**And** the user can now log in successfully

### AC-4: Expired Token is Rejected
**Given** a confirmation token was generated 25 hours ago (expiration is 24 hours)  
**When** a user attempts to confirm their email with the expired token  
**Then** the system returns a 400 error  
**And** the error message indicates the token has expired  
**And** the user is prompted to request a new confirmation email  
**And** the user's `email_confirmed` status remains `false`

### AC-5: Invalid Token is Rejected Securely
**Given** a user attempts to confirm with an invalid or non-existent token "invalidtoken123"  
**When** the token validation occurs  
**Then** the system returns a 400 error with generic message: "Invalid or expired confirmation token"  
**And** the error does NOT reveal whether the token exists in the database  
**And** the attempt is logged for security auditing  
**And** the user's email remains unconfirmed

### AC-6: Resend Confirmation Email Works Correctly
**Given** a user has registered but not confirmed their email  
**When** they request a new confirmation email via `POST /api/v1/auth/resend-confirmation` with their email address  
**Then** the system invalidates their previous confirmation token  
**And** generates a new confirmation token with fresh 24-hour expiration  
**And** sends a new confirmation email to their registered address  
**And** returns 200 success response  
**And** the new token works for email confirmation

### AC-7: Resend Endpoint is Rate Limited
**Given** a user has already requested 3 confirmation emails in the past hour  
**When** they attempt to resend again  
**Then** the system returns a 429 rate limit error  
**And** the error message indicates they must wait before requesting another email  
**And** no additional email is sent  
**And** the rate limit resets after 1 hour

### AC-8: Already Confirmed Email Handled Gracefully
**Given** a user has already confirmed their email  
**When** they attempt to confirm again with the same or a new token  
**Then** the system returns 200 with message: "Email address is already confirmed"  
**And** no database changes occur  
**And** the user can log in normally

### AC-9: Email Content Meets Requirements
**Given** a confirmation email is sent  
**Then** the email MUST include:
- Subject: "Confirm your Legends Ascend account"
- HTML and plain text versions
- Prominent "Confirm Email Address" button/link
- Clear expiration notice: "This link expires in 24 hours"
- Branding-compliant colours and typography
- Footer text: "Didn't register? You can safely ignore this email."
- Support contact information
- Unsubscribe mechanism

### AC-10: Email Sending Failure Does Not Block Registration
**Given** the email service is temporarily unavailable  
**When** a user registers  
**Then** the registration completes successfully  
**And** the user account is created with `email_confirmed: false`  
**And** the email failure is logged with error details  
**And** the user receives success response from registration endpoint  
**And** the system queues the email for retry (or manual intervention)

### AC-11: Confirmation Endpoint Has Rate Limiting
**Given** an attacker attempts to brute force confirmation tokens  
**When** they send more than 100 requests from a single IP within 1 hour  
**Then** the system returns 429 rate limit error  
**And** further requests are blocked until the rate limit window resets  
**And** all attempts are logged for security monitoring

### AC-12: Token Security Requirements Met
**Then** confirmation tokens MUST be:
- Minimum 32 bytes (256 bits) of cryptographically secure randomness
- URL-safe encoded (Base64URL or hex)
- Stored as SHA-256 hash in database (never plain text)
- Single-use (invalidated after successful confirmation)
- Time-limited (24-hour expiration)
- Impossible to guess or enumerate

---

## Test Scenarios

### TS-1: [Maps to AC-1] - Happy Path Registration Flow
**Steps:**
1. Send POST request to `/api/v1/auth/register` with email "test@example.com" and password "TestPass123"
2. Verify response is 201 with user data and JWT token
3. Verify `email_confirmed` field is `false` in response
4. Check email inbox for confirmation email (mock in tests)
5. Verify email contains confirmation link with token

**Expected Result:** 
- User created successfully
- Confirmation email sent with valid token
- User data reflects unconfirmed status

### TS-2: [Maps to AC-2] - Unconfirmed User Login Blocked
**Steps:**
1. Register user with email "unconfirmed@example.com"
2. Do NOT confirm email
3. Attempt login with correct credentials: POST `/api/v1/auth/login`
4. Verify response is 403 status
5. Verify error message: "Please confirm your email address to log in"
6. Verify response includes `resendAvailable: true` flag

**Expected Result:** 
- Login rejected
- Clear error message displayed
- Frontend can show resend option

### TS-3: [Maps to AC-3] - Successful Email Confirmation
**Steps:**
1. Register user and extract confirmation token from email
2. Send POST request to `/api/v1/auth/confirm-email` with token
3. Verify response is 200 with success message
4. Query user from database and verify `email_confirmed = true`
5. Verify `email_confirmed_at` timestamp is set
6. Attempt login with same credentials
7. Verify login succeeds and returns JWT token

**Expected Result:** 
- Email confirmed successfully
- Database updated correctly
- User can now log in

**Code Example:**
```typescript
// Jest/Supertest test snippet
const registerResponse = await request(app)
  .post('/api/v1/auth/register')
  .send({ email: 'test@example.com', password: 'SecurePass123' });

expect(registerResponse.status).toBe(201);
expect(registerResponse.body.data.user.email_confirmed).toBe(false);

const token = extractTokenFromEmail(); // Mock email service

const confirmResponse = await request(app)
  .post('/api/v1/auth/confirm-email')
  .send({ token });

expect(confirmResponse.status).toBe(200);

const loginResponse = await request(app)
  .post('/api/v1/auth/login')
  .send({ email: 'test@example.com', password: 'SecurePass123' });

expect(loginResponse.status).toBe(200);
expect(loginResponse.body.data.token).toBeDefined();
```

### TS-4: [Maps to AC-4] - Expired Token Rejected
**Steps:**
1. Register user and extract confirmation token
2. Mock system time to 25 hours in the future
3. Attempt to confirm email with expired token
4. Verify response is 400 with "expired" error message
5. Verify user's `email_confirmed` remains `false`
6. Request new confirmation email via resend endpoint
7. Confirm with new token successfully

**Expected Result:** 
- Expired token rejected
- User must request new token
- New token works correctly

### TS-5: [Maps to AC-5] - Invalid Token Security
**Steps:**
1. Attempt confirmation with random invalid token "notarealtoken123"
2. Verify response is 400 with generic error message
3. Verify error message does NOT reveal token existence
4. Check server logs for security audit entry
5. Verify no database changes occurred

**Expected Result:** 
- Invalid token rejected
- No information leakage
- Security event logged

### TS-6: [Maps to AC-6] - Resend Confirmation Email
**Steps:**
1. Register user with email "resend@example.com"
2. Extract initial confirmation token
3. Send POST to `/api/v1/auth/resend-confirmation` with email
4. Verify response is 200
5. Extract new token from new email
6. Verify old token no longer works (returns 400)
7. Confirm email with new token successfully

**Expected Result:** 
- Old token invalidated
- New token generated and sent
- New token works for confirmation

### TS-7: [Maps to AC-7] - Rate Limiting on Resend
**Steps:**
1. Register user
2. Send 3 resend requests successfully (within 1 hour)
3. Send 4th resend request immediately
4. Verify response is 429 rate limit error
5. Mock time to 61 minutes later
6. Send resend request again
7. Verify request succeeds (rate limit reset)

**Expected Result:** 
- Rate limit enforced after 3 requests
- Rate limit resets after 1 hour

### TS-8: [Maps to AC-8] - Already Confirmed Graceful Handling
**Steps:**
1. Register and confirm email successfully
2. Attempt to confirm again with same token
3. Verify response is 200 with "already confirmed" message
4. Verify no database changes
5. Verify user can log in normally

**Expected Result:** 
- Idempotent confirmation handling
- No errors for already confirmed users

### TS-9: [Maps to AC-10] - Email Service Failure Handling
**Steps:**
1. Mock email service to throw error
2. Register new user
3. Verify registration returns 201 success
4. Verify user created in database with `email_confirmed: false`
5. Verify error logged (check logs/error tracking)
6. Verify JWT token returned in registration response
7. Verify email failure does not expose error to user

**Expected Result:** 
- Registration succeeds despite email failure
- Error logged for monitoring
- User experience not degraded

### TS-10: [Maps to AC-11] - Confirmation Endpoint Rate Limiting
**Steps:**
1. Send 100 confirmation requests from same IP address within 1 hour
2. Verify first 100 requests processed (even if tokens invalid)
3. Send 101st request
4. Verify response is 429 rate limit error
5. Mock time to 61 minutes later
6. Send request again
7. Verify request succeeds

**Expected Result:** 
- Rate limit protects against brute force attacks
- Legitimate retries work after rate limit window

### TS-11: Email Content Validation
**Steps:**
1. Register user and capture sent email (mock)
2. Verify email has HTML and plain text parts
3. Verify HTML version includes:
   - Subject: "Confirm your Legends Ascend account"
   - Confirmation button with Primary Blue (#1E3A8A) background
   - Expiration notice: "This link expires in 24 hours"
   - Footer: "Didn't register? You can safely ignore this email."
   - Unsubscribe link
   - Support contact
4. Verify plain text version has all same information
5. Verify link format: `{FRONTEND_URL}/confirm-email?token={TOKEN}`

**Expected Result:** 
- Email meets all content requirements
- Branding and accessibility compliance
- Both HTML and plain text versions functional

---

## Technical Notes

### API Design

```
POST /api/v1/auth/register
  Request: { email, password, newsletterOptIn? }
  Response: { success, data: { token, user: { id, email, email_confirmed: false, created_at } } }
  Side Effect: Sends confirmation email asynchronously

POST /api/v1/auth/login
  Request: { email, password }
  Response (unconfirmed): 403 { success: false, error: "Please confirm your email...", resendAvailable: true }
  Response (confirmed): 200 { success, data: { token, user } }

POST /api/v1/auth/confirm-email
  Request: { token: string }
  Response (success): 200 { success: true, message: "Email confirmed successfully" }
  Response (invalid): 400 { success: false, error: "Invalid or expired confirmation token" }
  Response (already confirmed): 200 { success: true, message: "Email address is already confirmed" }
  Rate Limit: 100 requests per IP per hour

POST /api/v1/auth/resend-confirmation
  Request: { email: string } OR Authorization: Bearer {JWT}
  Response (success): 200 { success: true, message: "Confirmation email sent" }
  Response (already confirmed): 200 { success: true, message: "Email address is already confirmed" }
  Response (rate limited): 429 { success: false, error: "Too many requests. Please try again later." }
  Rate Limit: 3 requests per email per hour
```

### Data Model

```sql
-- Extend existing users table
ALTER TABLE users 
ADD COLUMN email_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN email_confirmed_at TIMESTAMP,
ADD COLUMN confirmation_token_hash VARCHAR(64),
ADD COLUMN confirmation_token_expires_at TIMESTAMP;

-- Create index for fast token lookups
CREATE INDEX idx_users_confirmation_token_hash ON users(confirmation_token_hash) WHERE confirmation_token_hash IS NOT NULL;

-- Create index for filtering unconfirmed users
CREATE INDEX idx_users_email_confirmed ON users(email_confirmed);

-- Create index for email lookups during resend
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

**Migration Strategy:**
1. Add new columns with defaults (allows existing users to continue functioning)
2. Existing users: default `email_confirmed = false` OR migrate to `true` with `email_confirmed_at = created_at` (business decision)
3. New registrations: `email_confirmed = false` until confirmed
4. Create indexes for performance
5. Deploy code changes
6. Optional: Send confirmation emails to existing unconfirmed users (separate data migration job)

**Rollback Plan:**
1. Disable email confirmation check in login endpoint (feature flag)
2. Allow unconfirmed users to log in temporarily
3. Fix issues
4. Re-enable email confirmation enforcement

### Validation Schemas

```typescript
import { z } from 'zod';

// Confirmation token validation
const ConfirmEmailSchema = z.object({
  token: z.string()
    .min(43) // Base64URL encoded 32 bytes = 43 chars
    .max(64) // Allow some buffer for different encoding schemes
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid token format'),
});

// Resend confirmation validation
const ResendConfirmationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Updated User schema with confirmation fields
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  email_confirmed: z.boolean(),
  email_confirmed_at: z.date().nullable(),
  password_hash: z.string(),
  confirmation_token_hash: z.string().nullable(),
  confirmation_token_expires_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});
```

### Token Generation Service

```typescript
import crypto from 'crypto';

/**
 * Generate cryptographically secure confirmation token
 * Returns: { token: string (plain), hash: string (for storage) }
 */
export function generateConfirmationToken(): { token: string; hash: string } {
  // Generate 32 bytes of cryptographically secure random data
  const tokenBytes = crypto.randomBytes(32);
  
  // Encode as URL-safe Base64
  const token = tokenBytes.toString('base64url');
  
  // Hash for storage (SHA-256)
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  
  return { token, hash };
}

/**
 * Hash a token for comparison with stored hash
 */
export function hashConfirmationToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

### Email Service Integration

```typescript
interface EmailService {
  sendConfirmationEmail(
    to: string,
    confirmationUrl: string,
    expiresInHours: number
  ): Promise<void>;
}

// Implementation could use SendGrid, AWS SES, Resend, Nodemailer, etc.
class SendGridEmailService implements EmailService {
  async sendConfirmationEmail(
    to: string,
    confirmationUrl: string,
    expiresInHours: number = 24
  ): Promise<void> {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Confirm your Legends Ascend account',
      html: renderConfirmationEmailHtml(confirmationUrl, expiresInHours),
      text: renderConfirmationEmailText(confirmationUrl, expiresInHours),
    };
    
    await sendgridClient.send(msg);
  }
}
```

**Email Template Structure:**
```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="font-family: Inter, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
    <!-- Header with logo -->
    <div style="background-color: #1E3A8A; padding: 20px; text-align: center;">
      <img src="{LOGO_URL}" alt="Legends Ascend" style="height: 40px;">
    </div>
    
    <!-- Body content -->
    <div style="padding: 40px 20px;">
      <h1 style="color: #0F172A; font-size: 24px; margin-bottom: 16px;">Confirm Your Email Address</h1>
      <p style="color: #0F172A; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Thank you for registering with Legends Ascend! Please confirm your email address to activate your account and start your football management journey.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{CONFIRMATION_URL}" style="display: inline-block; background-color: #1E3A8A; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Confirm Email Address
        </a>
      </div>
      
      <!-- Expiration notice -->
      <p style="color: #64748B; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
        This link expires in {EXPIRES_IN_HOURS} hours. If you didn't register for Legends Ascend, you can safely ignore this email.
      </p>
      
      <!-- Plain text link fallback -->
      <p style="color: #64748B; font-size: 14px; line-height: 1.5;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="{CONFIRMATION_URL}" style="color: #1E3A8A; word-break: break-all;">{CONFIRMATION_URL}</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #F1F5F9; padding: 20px; text-align: center;">
      <p style="color: #64748B; font-size: 12px; margin: 0 0 8px 0;">
        Need help? Contact us at support@legendsascend.com
      </p>
      <p style="color: #64748B; font-size: 12px; margin: 0;">
        <a href="{UNSUBSCRIBE_URL}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> | 
        <a href="{PRIVACY_URL}" style="color: #64748B; text-decoration: underline;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### Integration Points

**Auth System Integration:**
- Extends existing authentication service (US-045)
- Modifies registration flow to include token generation and email sending
- Modifies login flow to check email confirmation status
- Adds new endpoints for confirmation and resend

**Email Service Integration:**
- New email service abstraction layer (supports multiple providers)
- Environment-based configuration for email provider (SendGrid, SES, Resend, SMTP)
- Retry logic for failed email sends (exponential backoff)
- Monitoring and alerting for email delivery issues

**Database Integration:**
- Schema migration to add confirmation fields to users table
- Indexes for performance optimization
- Transaction support for atomic confirmation operations

**Frontend Integration:**
- New `/confirm-email` route to handle confirmation callback
- Updated registration flow UI to inform users about confirmation email
- Updated login error handling to detect unconfirmed accounts
- "Resend confirmation" UI component for unconfirmed users
- Loading states during confirmation process
- Success/error messages for confirmation outcomes

### Failure Modes & Resilience

**Email Service Unavailable:**
- **Detection:** Try/catch around email service calls, timeout after 10 seconds
- **Handling:** Log error, allow registration to complete, queue for retry
- **Retry Strategy:** Exponential backoff (1min, 5min, 15min, 1hr) for up to 24 hours
- **Fallback:** Manual email resend via support team if automated retry fails
- **User Impact:** User can request new email via resend endpoint

**Database Unavailable During Confirmation:**
- **Detection:** Database query timeout or connection error
- **Handling:** Return 503 Service Unavailable error
- **Retry Strategy:** User retries confirmation (token still valid)
- **Fallback:** User contacts support for manual email confirmation
- **User Impact:** Temporary inability to confirm, can retry when database recovers

**Token Already Used/Invalid:**
- **Detection:** Token hash not found in database or already null
- **Handling:** Return 400 error with resend instructions
- **Retry Strategy:** User requests new confirmation email
- **Fallback:** Support team can manually confirm email or send new token
- **User Impact:** Must request new confirmation email

**Expired Token:**
- **Detection:** `confirmation_token_expires_at < NOW()`
- **Handling:** Return 400 error indicating expiration
- **Retry Strategy:** User requests new confirmation email via resend endpoint
- **Fallback:** Support team can extend expiration or send new token
- **User Impact:** Must request new confirmation email (seamless UX)

**High Email Volume (Traffic Spike):**
- **Detection:** Email service rate limit errors
- **Handling:** Queue emails in background job queue (Redis-based)
- **Retry Strategy:** Process queue with respect to rate limits
- **Fallback:** Temporary delay in email delivery (still within 5-minute SLA)
- **User Impact:** Slight delay in receiving confirmation email (acceptable)

**Email Delivery Failure (Bounce/Spam):**
- **Detection:** Email service webhook for bounce/complaint notifications
- **Handling:** Mark email as undeliverable in database, alert user
- **Retry Strategy:** Do not retry (user must provide valid email)
- **Fallback:** User updates email address and requests new confirmation
- **User Impact:** User must provide deliverable email address

### Performance Targets

- **Registration Endpoint:** <500ms p95 (including token generation, excluding async email send)
- **Email Send (async):** <5 minutes to user inbox (depends on email service SLA)
- **Confirmation Endpoint:** <200ms p95 (token validation + database update)
- **Resend Endpoint:** <300ms p95 (token invalidation + generation + email trigger)
- **Login Endpoint:** <300ms p95 (includes email confirmation check)
- **Database Queries:**
  - Token lookup by hash: <50ms p95 (indexed)
  - User lookup by email: <50ms p95 (indexed)
  - Confirmation update: <100ms p95 (single UPDATE)
- **Concurrent Operations:** Support 100 concurrent confirmation requests without degradation

### Environment Variables

```bash
# Email Service Configuration
EMAIL_SERVICE_PROVIDER=sendgrid # Options: sendgrid, ses, resend, smtp
SENDGRID_API_KEY=SG.xxx # If using SendGrid
SENDGRID_FROM_EMAIL=noreply@legendsascend.com
SENDGRID_FROM_NAME=Legends Ascend

# AWS SES (alternative)
AWS_SES_REGION=eu-west-1
AWS_SES_ACCESS_KEY_ID=xxx
AWS_SES_SECRET_ACCESS_KEY=xxx
AWS_SES_FROM_EMAIL=noreply@legendsascend.com

# SMTP (alternative)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@legendsascend.com
SMTP_PASS=xxx

# Confirmation Settings
CONFIRMATION_TOKEN_EXPIRY_HOURS=24 # Default: 24 hours
FRONTEND_URL=https://legendsascend.com # For confirmation link generation
SUPPORT_EMAIL=support@legendsascend.com # For email footer

# Rate Limiting
CONFIRMATION_RATE_LIMIT_REQUESTS=100 # Per IP per hour
RESEND_RATE_LIMIT_REQUESTS=3 # Per email per hour

# Feature Flags
EMAIL_CONFIRMATION_REQUIRED=true # Set false to disable enforcement (for testing)
```

---

## Task Breakdown for AI Agents

### Phase 1: Design & Setup
- [ ] Review all foundation documents (DoR, Technical Architecture, Branding, Accessibility)
- [ ] Review existing authentication implementation (US-045)
- [ ] Design database schema updates (add confirmation fields to users table)
- [ ] Select email service provider (SendGrid, AWS SES, Resend, or SMTP)
- [ ] Create email service abstraction interface
- [ ] Define validation schemas for confirmation endpoints (Zod)
- [ ] Design email template HTML/plain text with branding compliance
- [ ] Update TECHNICAL_ARCHITECTURE.md if needed

### Phase 2: Backend Implementation (Coding Agent)
- [ ] **Database Migration:**
  - [ ] Create migration script to add email confirmation fields to users table
  - [ ] Add indexes for performance (token_hash, email_confirmed, email)
  - [ ] Test migration on development database
  - [ ] Test rollback procedure
- [ ] **Token Generation Service:**
  - [ ] Implement secure random token generation (32 bytes)
  - [ ] Implement SHA-256 hashing for storage
  - [ ] Implement constant-time comparison for validation
  - [ ] Add unit tests for token service
- [ ] **Email Service:**
  - [ ] Create email service interface abstraction
  - [ ] Implement email provider integration (SendGrid/SES/Resend/SMTP)
  - [ ] Create HTML email template with branding compliance
  - [ ] Create plain text email template
  - [ ] Implement retry logic for failed email sends
  - [ ] Add unit tests for email service
- [ ] **Registration Flow Updates:**
  - [ ] Modify `registerUser` to generate confirmation token
  - [ ] Store token hash and expiration in database
  - [ ] Trigger confirmation email asynchronously (fire-and-forget)
  - [ ] Update response to include `email_confirmed: false`
  - [ ] Add error handling for email failures (non-blocking)
  - [ ] Add unit tests for updated registration
- [ ] **Confirmation Endpoint:**
  - [ ] Implement `POST /api/v1/auth/confirm-email`
  - [ ] Add token validation logic (hash comparison, expiration check)
  - [ ] Update user record on successful confirmation
  - [ ] Invalidate token after use
  - [ ] Add rate limiting (100 requests/IP/hour)
  - [ ] Add integration tests
- [ ] **Login Flow Updates:**
  - [ ] Add email confirmation check before issuing JWT
  - [ ] Return 403 error for unconfirmed users
  - [ ] Include `resendAvailable: true` flag in error response
  - [ ] Add unit tests for login with unconfirmed account
- [ ] **Resend Endpoint:**
  - [ ] Implement `POST /api/v1/auth/resend-confirmation`
  - [ ] Invalidate old tokens
  - [ ] Generate new token and send email
  - [ ] Add rate limiting (3 requests/email/hour)
  - [ ] Handle already-confirmed case gracefully
  - [ ] Add integration tests
- [ ] **Error Handling & Logging:**
  - [ ] Add structured logging for all confirmation events
  - [ ] Implement security audit logging
  - [ ] Add error tracking integration (Sentry)
  - [ ] Ensure no PII in logs beyond necessary user_id

### Phase 3: Frontend Implementation (Coding Agent)
- [ ] **Email Confirmation Page:**
  - [ ] Create `/confirm-email` route component
  - [ ] Extract token from URL query parameter
  - [ ] Call `POST /api/v1/auth/confirm-email` API
  - [ ] Display loading state during confirmation
  - [ ] Display success message on successful confirmation
  - [ ] Display error message on failure with resend option
  - [ ] Implement keyboard navigation and focus management
  - [ ] Add ARIA live regions for screen reader announcements
  - [ ] Add unit tests for confirmation page
- [ ] **Registration Flow Updates:**
  - [ ] Update registration success message: "Check your email for a confirmation link"
  - [ ] Add informational text about email confirmation requirement
  - [ ] Ensure UI follows branding guidelines
  - [ ] Add unit tests
- [ ] **Login Error Handling:**
  - [ ] Detect 403 error for unconfirmed email
  - [ ] Display clear error message with resend link
  - [ ] Implement "Resend confirmation email" button
  - [ ] Call resend endpoint on button click
  - [ ] Display success/error feedback for resend
  - [ ] Add unit tests for login error handling
- [ ] **Resend Confirmation Component:**
  - [ ] Create reusable component for resending confirmation
  - [ ] Add rate limit handling (disable button after 3 requests)
  - [ ] Display countdown timer for rate limit reset
  - [ ] Ensure accessibility compliance (WCAG 2.1 AA)
  - [ ] Add unit tests

### Phase 4: Testing (Testing Agent)
- [ ] **Unit Tests:**
  - [ ] Token generation and hashing service
  - [ ] Email service (mocked provider)
  - [ ] Registration with email confirmation
  - [ ] Login with unconfirmed account
  - [ ] Confirmation endpoint logic
  - [ ] Resend endpoint logic
  - [ ] Frontend components (confirmation page, resend component)
- [ ] **Integration Tests:**
  - [ ] End-to-end registration + confirmation + login flow
  - [ ] Expired token rejection
  - [ ] Invalid token rejection
  - [ ] Already confirmed handling
  - [ ] Email service failure handling (non-blocking)
  - [ ] Rate limiting on confirmation endpoint
  - [ ] Rate limiting on resend endpoint
- [ ] **Database Tests:**
  - [ ] Migration script execution and rollback
  - [ ] Index creation and performance
  - [ ] Atomic confirmation updates (concurrent requests)
- [ ] **Security Tests:**
  - [ ] Token enumeration prevention (generic error messages)
  - [ ] Timing attack resistance (constant-time comparison)
  - [ ] Rate limit enforcement
  - [ ] Token cannot be reused after confirmation
  - [ ] No PII leakage in error messages or logs
- [ ] **Accessibility Tests:**
  - [ ] Email template WCAG 2.1 AA compliance (HTML version)
  - [ ] Confirmation page keyboard navigation
  - [ ] Screen reader compatibility
  - [ ] Colour contrast ratios
  - [ ] Focus indicators
- [ ] **Performance Tests:**
  - [ ] Registration endpoint <500ms p95
  - [ ] Confirmation endpoint <200ms p95
  - [ ] Database query performance (indexed lookups)
  - [ ] Concurrent confirmation requests (100 concurrent)
- [ ] **Email Deliverability Tests:**
  - [ ] Email sent successfully (integration with real service)
  - [ ] HTML and plain text versions rendered correctly
  - [ ] Links functional in various email clients
  - [ ] Spam score check (using tools like Mail Tester)

### Phase 5: Documentation & Deployment
- [ ] **API Documentation:**
  - [ ] Update OpenAPI spec with new endpoints
  - [ ] Document request/response schemas
  - [ ] Document rate limits
  - [ ] Document error codes and messages
- [ ] **Email Service Setup:**
  - [ ] Configure email service provider (SendGrid/SES/Resend account)
  - [ ] Set up SPF, DKIM, DMARC DNS records for deliverability
  - [ ] Configure bounce and complaint webhooks
  - [ ] Test email delivery to various providers (Gmail, Outlook, Yahoo)
- [ ] **Environment Configuration:**
  - [ ] Document all required environment variables
  - [ ] Create `.env.example` with email service configuration
  - [ ] Set environment variables in Vercel/deployment platform
  - [ ] Test email sending in staging environment
- [ ] **Database Migration:**
  - [ ] Run migration on staging database
  - [ ] Verify indexes created successfully
  - [ ] Test rollback procedure
  - [ ] Plan production migration with minimal downtime
- [ ] **Monitoring & Alerting:**
  - [ ] Set up email delivery success rate monitoring
  - [ ] Set up confirmation rate monitoring
  - [ ] Configure alerts for email service failures
  - [ ] Configure alerts for low confirmation rates
  - [ ] Set up error tracking (Sentry integration)
- [ ] **User-Facing Documentation:**
  - [ ] Update user onboarding documentation
  - [ ] Create FAQ entry for email confirmation
  - [ ] Document troubleshooting steps (email not received, expired link)
  - [ ] Update support documentation for common issues
- [ ] **TECHNICAL_ARCHITECTURE.md Updates:**
  - [ ] Document email confirmation flow
  - [ ] Document email service integration
  - [ ] Document token generation approach
  - [ ] Document database schema changes

### Phase 6: Deployment Readiness
- [ ] **Pre-Deployment Checklist:**
  - [ ] All tests passing (unit, integration, security, accessibility)
  - [ ] Code review completed
  - [ ] Database migration tested and ready
  - [ ] Email service configured and tested
  - [ ] Environment variables documented and set
  - [ ] Monitoring and alerting configured
  - [ ] Documentation updated
- [ ] **Migration Plan:**
  - [ ] Decide approach for existing users (auto-confirm or require confirmation)
  - [ ] Create data migration script if needed
  - [ ] Test migration on staging with production-like data
  - [ ] Create rollback plan
  - [ ] Schedule deployment window
- [ ] **Deployment Steps:**
  1. Deploy database migration (add columns, indexes)
  2. Deploy backend code with email confirmation logic
  3. Deploy frontend code with confirmation page
  4. Test end-to-end flow in production
  5. Monitor email delivery and confirmation rates
  6. Enable email confirmation enforcement (feature flag)
  7. Monitor error rates and user support requests
- [ ] **Post-Deployment Validation:**
  - [ ] Verify registration sends confirmation email
  - [ ] Verify unconfirmed users cannot log in
  - [ ] Verify email confirmation works end-to-end
  - [ ] Verify resend functionality works
  - [ ] Monitor error rates for first 24 hours
  - [ ] Monitor user support requests for confusion
  - [ ] Check email deliverability metrics (open rate, spam rate)

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (new user), goal (receive and verify email), benefit (secure account, valid contact info)
- ✅ **Acceptance Criteria:** 12 testable, specific ACs covering happy path, error cases, edge cases, security, and accessibility
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md patterns (TypeScript, Zod validation, PostgreSQL, JWT auth, API versioning)
- ✅ **Dependencies Identified:** Requires US-045 (auth system), US-048 (newsletter), email service configuration
- ✅ **Story Points Estimated:** 8 points (moderate complexity - 1-2 days effort for experienced team)
- ✅ **Priority Assigned:** SHOULD (important for security and data quality, not critical for MVP)
- ✅ **Non-Functional Requirements:** Performance targets, security measures, accessibility compliance, observability defined
- ✅ **Branding Compliance:** Email templates aligned with BRANDING_GUIDELINE.md colours, typography, logo usage
- ✅ **Accessibility:** WCAG 2.1 AA requirements specified for email templates and confirmation page
- ✅ **AI Agent Context:** Comprehensive technical notes, code examples, integration patterns, failure modes documented

**Story Points:** 8  
**Priority:** SHOULD  
**Risk Level:** Medium - Requires email service integration, database migration, and careful security implementation. Email deliverability can be challenging. However, well-defined requirements and existing authentication foundation reduce risk.

**Risk Mitigation:**
- Email service failures do not block registration (non-blocking async pattern)
- Comprehensive rate limiting prevents abuse
- Feature flag allows disabling enforcement if critical issues arise
- Retry logic handles transient email service failures
- Extensive test coverage reduces implementation bugs
- Existing authentication system provides solid foundation

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements email confirmation upon user registration (US-049), adding a double opt-in flow that verifies user email addresses and enhances account security.
> 
> **Key Deliverables:**
> - Secure token generation and validation system (32-byte random tokens, SHA-256 hashed storage)
> - Email confirmation flow with 24-hour token expiration
> - Login enforcement: unconfirmed users cannot log in
> - Resend confirmation email functionality with rate limiting
> - GDPR-compliant confirmation emails with branding compliance
> - Database migration adding email confirmation fields to users table
> - Frontend confirmation page with accessibility support (WCAG 2.1 AA)
> - Comprehensive error handling and security logging
> 
> **Testing:** All 12 acceptance criteria verified with 11 test scenarios covering happy path, error cases, security, accessibility, and performance.  
> **DoR Compliance:** ✅ All requirements met  
> **Security:** Rate limiting, constant-time comparison, token hashing, audit logging implemented  
> **Email Service:** Supports SendGrid, AWS SES, Resend, and SMTP providers via abstraction layer
> 
> **Breaking Change:** Existing users may be affected. Migration plan included for handling existing accounts.

---

## Open Questions & Clarifications

### Resolved Assumptions (Document for Reference):

**Q1: Should existing users (registered before this feature) be required to confirm their emails?**  
**A1 (Assumption):** For MVP simplicity, existing users will have `email_confirmed = TRUE` set during migration (grandfathered in). Only new registrations require confirmation. Future enhancement: send confirmation emails to existing unconfirmed users.

**Q2: What happens to unconfirmed accounts after 30 days? Should they be deleted?**  
**A2 (Assumption):** Out of scope for this story. Unconfirmed accounts will be retained indefinitely for MVP. Future enhancement: automated cleanup job to delete unconfirmed accounts after 30-90 days.

**Q3: Should users be able to change their email address after registration but before confirmation?**  
**A3 (Assumption):** Out of scope for MVP. Users must contact support to change email before confirmation. Future enhancement: email change flow with re-confirmation.

**Q4: Which email service provider should be used?**  
**A4 (Assumption):** Implementation will support multiple providers via abstraction layer. Recommended: SendGrid for MVP (mature, reliable, good free tier). Alternatives documented: AWS SES, Resend, SMTP.

**Q5: Should confirmation emails be sent if email service fails during registration?**  
**A5 (Assumption):** Yes, via retry queue (exponential backoff for 24 hours). If all retries fail, user must use resend endpoint. Support team can manually trigger confirmation emails if needed.

**Q6: Should there be a maximum number of confirmation tokens a user can generate?**  
**A6 (Assumption):** Rate limiting on resend endpoint (3 per hour) provides sufficient protection. No hard cap on total tokens. Previous tokens are invalidated when new ones are generated.

**Q7: Should the confirmation page allow users to log in immediately after confirmation?**  
**A7 (Assumption):** No auto-login for security. Confirmation page displays success message and "Continue to Login" button. User must explicitly log in with credentials.

### Outstanding Questions (if any):

_No outstanding questions at this time. All requirements are well-defined or have documented assumptions._

---

**End of User Story US-049**
