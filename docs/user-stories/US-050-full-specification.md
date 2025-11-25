# Reusable Email Service Component

**ID:** US-050  
**Story Points:** 8  
**Priority:** MUST  
**Epic/Feature:** Authentication & Communication Infrastructure  
**Dependencies:**
- Namecheap Private Email account configured (hello@legendsascend.com)
- Vercel deployment platform
- DNS records configured (SPF, DKIM, DMARC) - Pre-configured and verified
- US-049 (Email Confirmation - depends on this service)

---

## User Story

As a developer,  
I want a reusable email service component that sends transactional emails via Namecheap Private Email SMTP from Vercel serverless functions,  
So that players can receive password resets, account verifications, and game notifications reliably.

---

## Context

### Summary
This story implements a foundational email service component that provides reliable transactional email delivery for the Legends Ascend platform. The service uses Namecheap Private Email SMTP for sending emails from `hello@legendsascend.com`, supporting essential authentication flows (password resets, email verification) and future game notifications. All DNS authentication records (SPF, DKIM, DMARC) are pre-configured and verified.

### Scope

**In Scope:**
- Reusable email service abstraction for Vercel serverless functions
- SMTP integration with Namecheap Private Email (TLS on port 587)
- Support for HTML and plain text multipart emails
- Dynamic email templates with variable substitution
- Email validation (format validation, disposable domain detection)
- Rate limiting to prevent abuse (configurable per-user limits)
- Input sanitisation to prevent injection attacks
- Comprehensive error handling and structured logging
- Environment variable-based configuration
- TypeScript implementation with strict mode
- Password reset email template
- Email verification email template
- Extensible template system for future email types

**Out of Scope:**
- Email queuing system (send synchronously for MVP)
- Advanced analytics (open rates, click tracking)
- Email scheduling (future time delivery)
- Attachment support
- Multi-language templates (future enhancement)
- Template management UI
- A/B testing for emails
- Webhook integration for delivery status
- SMS/phone verification (separate story)
- Marketing email automation
- Advanced bounce handling and reputation management

### Assumptions
- Namecheap Private Email credentials are available and stored securely in environment variables
- DNS records (SPF, DKIM, DMARC) are already configured and verified for `legendsascend.com`
- Vercel serverless functions have network access to SMTP port 587
- Daily sending limit within Namecheap plan limits (typically 500-1000 emails/day)
- Email delivery within 5 seconds for 95th percentile is acceptable
- In-memory rate limiting is acceptable for MVP (resets on cold start)
- Promise-based SMTP client pattern is required for Vercel serverless
- Application-layer retry logic handles transient failures
- New domain requires warm-up period (4 weeks) for optimal deliverability

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All 10 sections satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - TypeScript, Node.js LTS, API patterns, Vercel conventions
- ✅ BRANDING_GUIDELINE.md - Email template colours, typography, logo usage
- ✅ ACCESSIBILITY_REQUIREMENTS.md - Accessible email templates, plain text alternatives
- ✅ AI_PROMPT_ENGINEERING.md - Clear implementation context for AI agents

---

## Functional Requirements

### Email Sending Core
- **[FR-1]** The service MUST send transactional emails from `hello@legendsascend.com` via Namecheap Private Email SMTP
- **[FR-2]** The service MUST use TLS/STARTTLS on port 587 for secure SMTP connections
- **[FR-3]** The service MUST support both HTML and plain text email formats (always include both as multipart MIME)
- **[FR-4]** The service MUST support dynamic email content using template variables (e.g., `{{name}}`, `{{resetLink}}`)
- **[FR-5]** The service MUST support standard email fields: To, From, Subject, Reply-To
- **[FR-6]** The service MUST use promise-based SMTP sending (async/await) for Vercel serverless compatibility

### Email Validation & Protection
- **[FR-7]** The service MUST validate email addresses against RFC 5322 format before sending
- **[FR-8]** The service MUST validate email address length (maximum 254 characters, local part maximum 64 characters)
- **[FR-9]** The service SHOULD detect and reject disposable email domains (configurable list)
- **[FR-10]** The service MUST normalise email addresses (lowercase, trim whitespace)
- **[FR-11]** The service MUST sanitise user-provided content to prevent HTML/script injection
- **[FR-12]** The service MUST limit subject line length (maximum 200 characters)

### Rate Limiting
- **[FR-13]** The service MUST implement per-user rate limiting (configurable, default 10 emails per hour per user)
- **[FR-14]** Rate limit exceeded requests MUST return HTTP 429 with `Retry-After` header
- **[FR-15]** Rate limiting MUST be implemented in-memory for MVP (acceptable cold start reset)
- **[FR-16]** Rate limiting MUST be bypassed for system-critical emails (configurable priority levels)

### Error Handling
- **[FR-17]** The service MUST provide graceful error handling with meaningful error messages
- **[FR-18]** The service MUST validate SMTP credentials on service initialisation
- **[FR-19]** Error responses MUST NOT expose sensitive information (credentials, internal paths)
- **[FR-20]** SMTP connection failures MUST be logged with error details for debugging
- **[FR-21]** The service MUST return structured error responses with error codes

### Email Templates
- **[FR-22]** The service MUST support password reset email template with time-limited link
- **[FR-23]** The service MUST support email verification template for new account registration
- **[FR-24]** Templates MUST be extensible for future email types via a template registry pattern
- **[FR-25]** All templates MUST include:
  - Personalisation with user name or greeting
  - Clear call-to-action button
  - Plain text alternative link
  - Expiration time for time-sensitive links
  - Company branding (logo, colours)
  - Physical address in footer (for compliance)
  - Unsubscribe mechanism (even for transactional)
  - Mobile-responsive design

### Configuration
- **[FR-26]** All SMTP credentials MUST be stored in environment variables (never hardcoded)
- **[FR-27]** The service MUST support environment-based configuration for all settings
- **[FR-28]** Configuration validation MUST occur on service startup with clear error messages

---

## Non-Functional Requirements

### Performance
- **Email Delivery Time:** <5 seconds p95 from API call to SMTP acceptance
- **API Response Time:** <500ms (excluding SMTP send for async operations)
- **Concurrent Capacity:** Support 10+ simultaneous email sends
- **Throughput:** Handle 1000+ emails per day (within Namecheap plan limits)
- **Cold Start Impact:** First request may have 1-2 second delay for SMTP connection establishment

### Reliability
- **Success Rate:** 99%+ delivery rate for valid email addresses
- **Uptime:** 99.9% availability (dependent on Vercel and Namecheap)
- **Failure Recovery:** Application layer must handle retries for transient failures
- **SMTP Connection Pooling:** Consider connection reuse within single function invocation

### Scalability
- **Volume Growth:** Architecture supports migration to dedicated email provider (SendGrid, Mailgun) if volume exceeds Namecheap limits
- **Template Extensibility:** Easy addition of new email types without code restructuring
- **Rate Limit Flexibility:** Configurable per-user and global limits via environment variables

### Security
- **Credential Storage:** SMTP password stored only in environment variables (Vercel encrypted storage)
- **Input Validation:**
  - Email address format validation (RFC 5322)
  - Content sanitisation (HTML escape, script removal)
  - URL validation in email content
  - Length limits on all user input
- **Authentication Required:** Email sending endpoints require user authentication
- **No Sensitive Data in Logs:** Never log SMTP passwords, full email content, or tokens
- **Rate Limiting:** Prevent abuse and stay within provider limits
- **Token Security:** Password reset/verification tokens are separate concern (see US-049)
- **CSRF Protection:** Email endpoints protected against cross-site request forgery

### Accessibility
- **Email Accessibility (WCAG 2.1 AA compliance):**
  - Semantic HTML structure with proper heading hierarchy
  - Call-to-action buttons with 4.5:1 colour contrast ratio
  - Descriptive button text (not "Click Here")
  - Plain text alternative for all HTML emails
  - Email width restricted to 600px for readability
  - Font size minimum 14px body, 16px for CTAs
  - Line height 1.5 for readability
  - Alt text for all images (logo)
  - No reliance on colour alone for information

### Branding
- **Email Template Compliance per BRANDING_GUIDELINE.md:**
  - Header: Primary Blue (#1E3A8A)
  - Call-to-action buttons: Primary Blue (#1E3A8A) background, white text
  - Accent/highlights: Accent Gold (#F59E0B)
  - Body text: Dark Navy (#0F172A)
  - Background: White (#FFFFFF) or Off-White (#FAFAFA)
  - Footer: Medium Gray (#64748B) text on Soft Gray (#F1F5F9)
  - Typography: Inter or Poppins (web-safe fallback: Arial, sans-serif)
  - Button styling: Rounded corners (8px)
  - Logo: Full-colour logo in email header
- **Consistent Voice:**
  - Professional, friendly, supportive tone
  - UK English terminology and spelling
  - Clear, concise instructions

### Internationalization
- **UK English Standard:**
  - UK spelling throughout (organise, colour, defence)
  - UK terminology (not American alternatives)
- **Metric System:** All measurements in metric units
- **Date Format:** DD/MM/YYYY for dates in emails
- **Currency:** £ (GBP) where applicable
- **Future Translation Support:**
  - All email text externalizable as templates
  - Template variables support locale-specific content

### Observability
- **Structured Logging:**
  - Log email sending attempts: `{ event: 'email_sent', messageId, to, subject, timestamp, deliveryTime }`
  - Log email failures: `{ event: 'email_failed', error, to, subject, timestamp }`
  - Log rate limit hits: `{ event: 'rate_limit_exceeded', email, retryAfter, timestamp }`
  - Do NOT log: SMTP passwords, full email content, tokens
- **Metrics:**
  - Email delivery success rate
  - Average delivery time
  - Rate limit hit frequency
  - Error rate by type
- **Alerting Thresholds:**
  - Error rate >5%
  - Delivery time >10 seconds
  - Rate limit hits >10/hour

---

## Acceptance Criteria

### AC-1: Basic Email Sending Works
**Given** valid SMTP credentials are configured in environment variables  
**When** the email service sends a test email to a valid address  
**Then** the email is successfully delivered to the recipient's inbox  
**And** the email passes SPF, DKIM, and DMARC authentication checks  
**And** delivery completes within 5 seconds (p95)

### AC-2: HTML and Plain Text Both Sent
**Given** an email is composed with HTML content  
**When** the email is sent via the service  
**Then** the email contains both HTML and plain text MIME parts  
**And** both parts are readable and properly formatted  
**And** links work correctly in both versions

### AC-3: Template Variable Substitution Works
**Given** a password reset template with variables `{{name}}` and `{{resetLink}}`  
**When** the service sends the email with data `{ name: "John", resetLink: "https://..." }`  
**Then** all variables are correctly substituted in both HTML and plain text versions  
**And** no raw template syntax appears in the final email

### AC-4: Email Validation Rejects Invalid Addresses
**Given** an invalid email address (e.g., "notanemail", "user@", "@domain.com")  
**When** the service attempts to send an email  
**Then** the request is rejected with a validation error before SMTP connection  
**And** the error message clearly indicates the validation failure  
**And** no email is sent

### AC-5: Rate Limiting Prevents Abuse
**Given** a user has sent 10 emails in the past hour (default limit)  
**When** they attempt to send another email  
**Then** the request is rejected with HTTP 429 status  
**And** the response includes a `Retry-After` header with seconds until reset  
**And** the error message clearly indicates rate limiting

### AC-6: SMTP Credential Validation on Startup
**Given** invalid or missing SMTP credentials in environment variables  
**When** the email service initialises  
**Then** a clear error is logged indicating credential misconfiguration  
**And** the service fails fast with an informative error  
**And** no sensitive credential information is exposed in logs

### AC-7: Error Handling Returns Safe Messages
**Given** an SMTP connection failure occurs  
**When** the error is returned to the calling code  
**Then** the error message does not expose internal server details  
**And** the error is logged with full details for debugging  
**And** a meaningful error code is returned for application handling

### AC-8: Password Reset Email Template Correct
**Given** a password reset email is triggered  
**Then** the email includes:
  - Subject: "Reset Your Legends Ascend Password"
  - Greeting with user name or generic "Hello"
  - Clear "Reset Password" call-to-action button
  - Plain text link as fallback
  - Expiration notice (e.g., "This link expires in 1 hour")
  - "Didn't request this? You can safely ignore this email."
  - Footer with company info and support contact

### AC-9: Email Verification Template Correct
**Given** an email verification email is triggered  
**Then** the email includes:
  - Subject: "Verify Your Legends Ascend Email"
  - Welcome message with user name
  - Clear "Verify Email" call-to-action button
  - Plain text link as fallback
  - Expiration notice (e.g., "This link expires in 24 hours")
  - "Didn't register? You can safely ignore this email."
  - Footer with company info and support contact

### AC-10: Emails Pass Authentication Checks
**Given** an email is sent via the service  
**When** the email is received by Gmail, Outlook, or Yahoo  
**Then** the email headers show:
  - SPF: PASS
  - DKIM: PASS
  - DMARC: PASS
**And** the email lands in the inbox (not spam folder)

### AC-11: Input Sanitisation Prevents Injection
**Given** user-provided content contains malicious HTML or script tags  
**When** the content is included in an email  
**Then** the HTML/scripts are escaped or removed  
**And** the email content is safe and displays correctly  
**And** no executable code is present

### AC-12: Disposable Email Detection Works
**Given** an email address from a known disposable domain (e.g., guerrillamail.com)  
**When** validation is performed  
**Then** the address is flagged as potentially disposable  
**And** the sending can be configured to reject or allow based on settings

### AC-13: Branding Compliance in Templates
**Given** any email template is rendered  
**Then** the email uses:
  - Primary Blue (#1E3A8A) for header and CTA buttons
  - Accent Gold (#F59E0B) for highlights (if applicable)
  - Dark Navy (#0F172A) for body text
  - Correct typography (Inter/Poppins with web-safe fallback)
  - Legends Ascend logo in header
  - Proper footer styling per branding guidelines

### AC-14: Promise-Based Sending for Serverless
**Given** the email service is invoked in a Vercel serverless function  
**When** `sendEmail()` is called  
**Then** the function uses async/await pattern (not callbacks)  
**And** the function waits for SMTP completion before returning  
**And** the serverless function does not terminate prematurely

---

## Test Scenarios

### TS-1: [Maps to AC-1] - Happy Path Email Sending
**Steps:**
1. Configure valid SMTP credentials in environment variables
2. Call `emailService.send()` with a valid recipient and template
3. Verify the function returns successfully with a message ID
4. Check recipient inbox for the email
5. Extract email headers and verify authentication

**Expected Result:**
- Email delivered successfully
- SPF/DKIM/DMARC all show PASS
- Delivery time <5 seconds

```typescript
// Jest/Supertest test snippet
const result = await emailService.send({
  to: 'test@example.com',
  template: 'password-reset',
  data: { name: 'John', resetLink: 'https://legendsascend.com/reset?token=abc' }
});

expect(result.success).toBe(true);
expect(result.messageId).toBeDefined();
expect(result.deliveryTime).toBeLessThan(5000);
```

### TS-2: [Maps to AC-2] - Multipart Email Format
**Steps:**
1. Send an email via the service
2. Capture the raw email content (mock SMTP or test mailbox)
3. Parse MIME structure
4. Verify HTML and plain text parts exist

**Expected Result:**
- Email has `Content-Type: multipart/alternative`
- HTML part with proper formatting
- Plain text part with readable content
- Both parts contain same information

### TS-3: [Maps to AC-4] - Email Validation Rejection
**Steps:**
1. Attempt to send email to "notanemail"
2. Attempt to send email to "user@"
3. Attempt to send email to "@domain.com"
4. Attempt to send email to address >254 characters

**Expected Result:**
- All attempts rejected before SMTP connection
- Error message indicates validation failure
- No SMTP connection attempted

```typescript
await expect(emailService.send({
  to: 'notanemail',
  template: 'test'
})).rejects.toThrow('Invalid email format');

await expect(emailService.send({
  to: 'a'.repeat(255) + '@example.com',
  template: 'test'
})).rejects.toThrow('Email address too long');
```

### TS-4: [Maps to AC-5] - Rate Limiting Enforcement
**Steps:**
1. Send 10 emails successfully (within 1 hour)
2. Attempt to send 11th email
3. Verify rejection with 429 status
4. Verify `Retry-After` header present
5. Wait for rate limit window to reset
6. Verify next email succeeds

**Expected Result:**
- First 10 emails succeed
- 11th email rejected with 429
- Rate limit resets after configured window

```typescript
// Send 10 emails
for (let i = 0; i < 10; i++) {
  await emailService.send({ to: 'user@example.com', template: 'test' });
}

// 11th should fail
await expect(emailService.send({
  to: 'user@example.com',
  template: 'test'
})).rejects.toMatchObject({
  statusCode: 429,
  retryAfter: expect.any(Number)
});
```

### TS-5: [Maps to AC-6] - Invalid Credential Detection
**Steps:**
1. Configure invalid SMTP password
2. Attempt to initialise email service
3. Verify startup failure with clear error

**Expected Result:**
- Service fails to initialise
- Error message indicates credential problem
- No sensitive data in error message

### TS-6: [Maps to AC-7] - Safe Error Messages
**Steps:**
1. Mock SMTP server to return connection error
2. Attempt to send email
3. Capture returned error
4. Verify error is logged with details
5. Verify returned error is sanitised

**Expected Result:**
- Error logged with full SMTP error details
- Returned error does not expose server internals
- Error has meaningful code for handling

### TS-7: [Maps to AC-11] - XSS Prevention
**Steps:**
1. Create email with template data containing `<script>alert('xss')</script>`
2. Send email and capture content
3. Verify script tag is escaped or removed

**Expected Result:**
- Malicious script is neutralised
- Email content is safe
- No executable code in email

```typescript
const result = await emailService.send({
  to: 'test@example.com',
  template: 'notification',
  data: { 
    message: '<script>alert("xss")</script>Click here!'
  }
});

const content = capturedEmailContent();
expect(content).not.toContain('<script>');
expect(content).toContain('&lt;script&gt;'); // Escaped
```

### TS-8: [Maps to AC-10] - Email Authentication Headers
**Steps:**
1. Send email to a test account (Gmail recommended)
2. View original email headers
3. Check Authentication-Results header

**Expected Result:**
- `spf=pass` present
- `dkim=pass` present
- `dmarc=pass` present
- Email in inbox, not spam

### TS-9: [Maps to AC-3] - Template Variable Substitution
**Steps:**
1. Define template with multiple variables
2. Send email with data object
3. Verify all variables replaced in final content

**Expected Result:**
- All `{{variable}}` syntax replaced
- No unsubstituted variables visible
- Data correctly inserted in HTML and plain text

### TS-10: [Maps to AC-14] - Serverless Compatibility
**Steps:**
1. Deploy email service to Vercel
2. Call email endpoint via HTTP request
3. Verify email is sent before function terminates
4. Verify no "email not sent" issues from callback patterns

**Expected Result:**
- Email successfully sent in serverless environment
- No premature function termination
- Response includes delivery confirmation

---

## Technical Notes

### API Design

```
POST /api/v1/email/send
  Authorization: Bearer {JWT}
  Request: {
    to: string,
    template: 'password-reset' | 'email-verification' | string,
    data: Record<string, any>,
    priority?: 'normal' | 'high'  // High bypasses rate limit
  }
  Response (success): 200 {
    success: true,
    messageId: string,
    deliveryTime: number
  }
  Response (validation error): 400 {
    success: false,
    error: string,
    code: 'INVALID_EMAIL' | 'INVALID_TEMPLATE' | 'VALIDATION_ERROR'
  }
  Response (rate limited): 429 {
    success: false,
    error: 'Rate limit exceeded. Please try again later.',
    retryAfter: number
  }
  Response (SMTP error): 503 {
    success: false,
    error: 'Email service temporarily unavailable',
    code: 'SMTP_ERROR'
  }

# Internal service - not exposed as API
POST /api/v1/auth/password-reset
  Request: { email: string }
  Uses: emailService.send({ template: 'password-reset', ... })

POST /api/v1/auth/resend-confirmation
  Request: { email: string }
  Uses: emailService.send({ template: 'email-verification', ... })
```

### Service Architecture

```typescript
// emailService.ts - Main service interface
interface EmailService {
  send(options: SendEmailOptions): Promise<EmailResult>;
  validateEmail(email: string): ValidationResult;
  getTemplateNames(): string[];
}

interface SendEmailOptions {
  to: string;
  template: string;
  data: Record<string, unknown>;
  priority?: 'normal' | 'high';
  userId?: string;  // For rate limiting
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  deliveryTime?: number;
  error?: string;
  code?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  isDisposable?: boolean;
}
```

### SMTP Configuration

```typescript
// config/email.ts
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // mail.privateemail.com
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.SMTP_USER, // hello@legendsascend.com
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });
};

// ✅ CORRECT - Promise-based for serverless
export const sendEmail = async (options: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> => {
  const transporter = createTransporter();
  const info = await transporter.sendMail(options);
  await transporter.close();
  return info;
};

// ❌ WRONG - Callback pattern (do NOT use in Vercel)
// transporter.sendMail(options, (error, info) => { ... });
```

### Rate Limiting Implementation

```typescript
// services/rateLimiter.ts
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  identifier: string,
  limit: number = 10,
  windowMs: number = 3600000 // 1 hour
): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const entry = rateLimits.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { 
      allowed: false, 
      retryAfter: Math.ceil((entry.resetAt - now) / 1000)
    };
  }

  entry.count++;
  return { allowed: true };
};
```

### Email Validation

```typescript
// services/emailValidator.ts
import { z } from 'zod';

const EmailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email address too long')
  .transform(email => email.toLowerCase().trim());

const DISPOSABLE_DOMAINS = [
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'fakeinbox.com',
  '10minutemail.com',
  // Add more as needed
];

export const validateEmail = (email: string): ValidationResult => {
  try {
    const normalised = EmailSchema.parse(email);
    const domain = normalised.split('@')[1];
    const isDisposable = DISPOSABLE_DOMAINS.includes(domain);
    
    return {
      valid: true,
      email: normalised,
      isDisposable,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0].message,
      };
    }
    return {
      valid: false,
      error: 'Email validation failed',
    };
  }
};
```

### Input Sanitisation

```typescript
// services/sanitizer.ts
import { escape } from 'html-escaper';

export const sanitizeForEmail = (input: string): string => {
  // Remove script tags completely
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Escape remaining HTML
  sanitized = escape(sanitized);
  
  // Limit length
  return sanitized.substring(0, 1000);
};

export const sanitizeSubject = (subject: string): string => {
  // Remove newlines (prevent header injection)
  let sanitized = subject.replace(/[\r\n]/g, ' ');
  
  // Limit length
  return sanitized.substring(0, 200);
};
```

### Email Template Structure

```typescript
// templates/password-reset.ts
export const passwordResetTemplate = {
  subject: 'Reset Your Legends Ascend Password',
  html: (data: { name?: string; resetLink: string; expiresIn: string }) => `
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Inter, Arial, sans-serif; background-color: #FAFAFA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">
    <!-- Header -->
    <tr>
      <td style="background-color: #1E3A8A; padding: 24px; text-align: center;">
        <img src="https://legendsascend.com/assets/logo-white.png" alt="Legends Ascend" style="height: 40px;" />
      </td>
    </tr>
    
    <!-- Body -->
    <tr>
      <td style="padding: 40px 24px;">
        <h1 style="color: #0F172A; font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">
          Reset Your Password
        </h1>
        <p style="color: #0F172A; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
          Hello${data.name ? ` ${data.name}` : ''},
        </p>
        <p style="color: #0F172A; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
          We received a request to reset your password for your Legends Ascend account. 
          Click the button below to create a new password.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px auto;">
          <tr>
            <td style="border-radius: 8px; background-color: #1E3A8A;">
              <a href="${data.resetLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color: #64748B; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
          This link expires in ${data.expiresIn}. If you didn't request a password reset, you can safely ignore this email.
        </p>
        
        <p style="color: #64748B; font-size: 14px; line-height: 1.5; margin: 0;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${data.resetLink}" style="color: #1E3A8A; word-break: break-all;">${data.resetLink}</a>
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #F1F5F9; padding: 24px; text-align: center;">
        <p style="color: #64748B; font-size: 12px; margin: 0 0 8px 0;">
          Need help? Contact us at <a href="mailto:support@legendsascend.com" style="color: #64748B;">support@legendsascend.com</a>
        </p>
        <p style="color: #64748B; font-size: 12px; margin: 0 0 8px 0;">
          © ${new Date().getFullYear()} Legends Ascend. All rights reserved.
        </p>
        <p style="color: #64748B; font-size: 12px; margin: 0;">
          <a href="https://legendsascend.com/unsubscribe" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> |
          <a href="https://legendsascend.com/privacy" style="color: #64748B; text-decoration: underline;">Privacy Policy</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  
  text: (data: { name?: string; resetLink: string; expiresIn: string }) => `
Reset Your Legends Ascend Password

Hello${data.name ? ` ${data.name}` : ''},

We received a request to reset your password for your Legends Ascend account.

To reset your password, visit this link:
${data.resetLink}

This link expires in ${data.expiresIn}. If you didn't request a password reset, you can safely ignore this email.

---
Need help? Contact us at support@legendsascend.com
© ${new Date().getFullYear()} Legends Ascend. All rights reserved.

Unsubscribe: https://legendsascend.com/unsubscribe
Privacy Policy: https://legendsascend.com/privacy
`,
};
```

### Environment Variables

```bash
# SMTP Configuration
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false  # Use STARTTLS, not implicit SSL

# Authentication
SMTP_USER=hello@legendsascend.com
SMTP_PASSWORD=<SECURE_PASSWORD>

# Email Display
SMTP_FROM_EMAIL=hello@legendsascend.com
SMTP_FROM_NAME=Legends Ascend

# Rate Limiting
EMAIL_RATE_LIMIT_PER_HOUR=10
EMAIL_RATE_LIMIT_WINDOW_MS=3600000

# URLs for email content
FRONTEND_URL=https://legendsascend.com
SUPPORT_EMAIL=support@legendsascend.com

# Token expiration (used by templates)
PASSWORD_RESET_EXPIRY_HOURS=1
EMAIL_VERIFICATION_EXPIRY_HOURS=24

# Feature flags
EMAIL_VALIDATION_REJECT_DISPOSABLE=true
EMAIL_DEBUG_MODE=false
```

### Integration Points

**Authentication System (US-045):**
- Email service used by login/registration flows
- Password reset endpoint triggers password-reset template
- Email verification endpoint triggers email-verification template

**Rate Limiting Integration:**
- User ID passed from authenticated endpoints
- Rate limiting based on user ID or email address
- Priority flag allows bypassing for critical emails

**Logging Integration:**
- Structured logs compatible with existing logging infrastructure
- Integration with error tracking (Sentry) for failures
- Metrics export for monitoring dashboard

### Failure Modes & Resilience

**SMTP Connection Timeout:**
- Detection: Connection attempt exceeds 10 seconds
- Handling: Return error to caller, log with full details
- Retry Strategy: Application layer handles retry (not in service)
- Fallback: User can request email resend via UI

**Invalid Credentials:**
- Detection: SMTP authentication failure on first send attempt
- Handling: Log error, fail startup validation
- Recovery: Fix environment variables, redeploy

**Rate Limit Exceeded:**
- Detection: In-memory counter exceeds threshold
- Handling: Return 429 with Retry-After header
- Recovery: Wait for rate limit window reset

**Email Service Down (Namecheap):**
- Detection: Repeated SMTP failures
- Handling: Return 503 to caller, log errors
- Fallback: Manual intervention, consider backup provider for future

**Malformed Email Content:**
- Detection: Nodemailer validation error
- Handling: Return validation error before SMTP attempt
- Recovery: Fix template or input data

**DNS Resolution Failure:**
- Detection: Cannot resolve mail.privateemail.com
- Handling: Return error, log with details
- Recovery: Typically transient, retry later

### Performance Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Email Delivery Time (p95) | <5 seconds | >10 seconds |
| API Response Time (p95) | <500ms | >1 second |
| Success Rate | 99%+ | <95% |
| Error Rate | <1% | >5% |
| Rate Limit Hits | <10/day | >50/day |

### DNS Authentication (Pre-Configured)

**SPF Record:**
```
TXT @ v=spf1 include:spf.privateemail.com ~all
```

**DKIM Record:**
```
TXT default._domainkey v=DKIM1;k=rsa;p=MIIBIj...
```

**DMARC Record:**
```
TXT _dmarc v=DMARC1; p=none; rua=mailto:dmarc@legendsascend.com; pct=100; adkim=r; aspf=r
```

All DNS records are pre-configured and verified for `legendsascend.com`.

---

## Task Breakdown for AI Agents

### Phase 1: Design & Setup
- [ ] Review all foundation documents (DoR, Technical Architecture, Branding, Accessibility)
- [ ] Review nodemailer documentation for TypeScript and promise-based usage
- [ ] Design email service interface and types
- [ ] Define Zod validation schemas for email addresses and options
- [ ] Create environment variable configuration schema
- [ ] Design email template structure and registry pattern

### Phase 2: Core Implementation (Coding Agent)
- [ ] **Email Service Core:**
  - [ ] Create `backend/src/services/emailService.ts` with interface
  - [ ] Implement SMTP transporter creation with Namecheap config
  - [ ] Implement promise-based `sendEmail()` function
  - [ ] Add proper error handling and structured logging
  - [ ] Implement credential validation on startup
  - [ ] Add unit tests with mocked SMTP
- [ ] **Email Validation:**
  - [ ] Create `backend/src/services/emailValidator.ts`
  - [ ] Implement RFC 5322 email validation with Zod
  - [ ] Implement disposable domain detection
  - [ ] Add email normalization (lowercase, trim)
  - [ ] Add length validation (254 chars max)
  - [ ] Add unit tests for validation
- [ ] **Input Sanitisation:**
  - [ ] Create `backend/src/utils/sanitizer.ts`
  - [ ] Implement HTML/script tag removal
  - [ ] Implement HTML entity escaping
  - [ ] Implement subject line sanitisation (newline removal)
  - [ ] Add unit tests for sanitisation
- [ ] **Rate Limiting:**
  - [ ] Create `backend/src/services/rateLimiter.ts`
  - [ ] Implement in-memory rate limiting
  - [ ] Support per-user rate limits
  - [ ] Support priority bypass for critical emails
  - [ ] Add unit tests for rate limiting

### Phase 3: Templates Implementation (Coding Agent)
- [ ] **Template System:**
  - [ ] Create `backend/src/templates/index.ts` with template registry
  - [ ] Define template interface with `html()` and `text()` functions
  - [ ] Implement variable substitution with sanitisation
- [ ] **Password Reset Template:**
  - [ ] Create `backend/src/templates/password-reset.ts`
  - [ ] Implement HTML template with branding compliance
  - [ ] Implement plain text template
  - [ ] Add unit tests for template rendering
- [ ] **Email Verification Template:**
  - [ ] Create `backend/src/templates/email-verification.ts`
  - [ ] Implement HTML template with branding compliance
  - [ ] Implement plain text template
  - [ ] Add unit tests for template rendering

### Phase 4: API Integration (Coding Agent)
- [ ] **API Endpoint:**
  - [ ] Create internal email sending function (not exposed as public API)
  - [ ] Integrate with authentication endpoints (US-045)
  - [ ] Add rate limiting middleware integration
  - [ ] Add proper error response formatting
- [ ] **Configuration:**
  - [ ] Create `.env.example` with all required variables
  - [ ] Add environment variable validation on startup
  - [ ] Document configuration in README

### Phase 5: Testing (Testing Agent)
- [ ] **Unit Tests:**
  - [ ] Email service (mocked SMTP)
  - [ ] Email validation (valid/invalid cases)
  - [ ] Rate limiting (limits, reset, bypass)
  - [ ] Input sanitisation (XSS, injection)
  - [ ] Template rendering (variable substitution)
- [ ] **Integration Tests:**
  - [ ] End-to-end email sending (with test SMTP or mock)
  - [ ] Rate limiting enforcement
  - [ ] Error handling and logging
- [ ] **Manual Testing:**
  - [ ] Send test emails to Gmail, Outlook, Yahoo
  - [ ] Verify SPF/DKIM/DMARC headers
  - [ ] Verify inbox placement (not spam)
  - [ ] Test template rendering on various email clients

### Phase 6: Documentation & Deployment
- [ ] **Documentation:**
  - [ ] Update TECHNICAL_ARCHITECTURE.md with email service section
  - [ ] Create email service usage guide
  - [ ] Document environment variable configuration
  - [ ] Document template creation process
- [ ] **Deployment:**
  - [ ] Configure environment variables in Vercel
  - [ ] Test email sending in staging environment
  - [ ] Verify DNS authentication passing
  - [ ] Monitor initial email deliverability

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (developer), goal (reusable email service), benefit (reliable transactional email delivery)
- ✅ **Acceptance Criteria:** 14 testable, specific ACs covering core functionality, validation, security, templates, and compliance
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md patterns (TypeScript, Zod validation, Vercel serverless, environment variables)
- ✅ **Dependencies Identified:** Namecheap Private Email, Vercel deployment, pre-configured DNS records
- ✅ **Story Points Estimated:** 8 points (moderate complexity - new service layer with templates, validation, rate limiting)
- ✅ **Priority Assigned:** MUST (critical infrastructure for authentication flows)
- ✅ **Non-Functional Requirements:** Performance targets, security measures, accessibility compliance, observability defined
- ✅ **Branding Compliance:** Email templates aligned with BRANDING_GUIDELINE.md colours, typography, logo usage
- ✅ **Accessibility:** WCAG 2.1 AA requirements specified for email templates
- ✅ **AI Agent Context:** Comprehensive technical notes, code examples, integration patterns, failure modes documented

**Story Points:** 8  
**Priority:** MUST  
**Risk Level:** Medium - Requires SMTP integration with external provider, email deliverability can be challenging for new domains. Well-defined requirements, pre-configured DNS, and detailed implementation guidance reduce risk.

**Risk Mitigation:**
- DNS records pre-configured and verified
- Nodemailer is a mature, well-documented library
- Promise-based pattern prevents serverless termination issues
- Comprehensive test coverage planned
- Rate limiting prevents abuse during warm-up period
- Detailed deliverability guidance provided

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements a reusable email service component (US-050) that provides transactional email delivery via Namecheap Private Email SMTP from Vercel serverless functions.
> 
> **Key Deliverables:**
> - Email service with promise-based SMTP sending for Vercel compatibility
> - Email validation (RFC 5322, disposable domain detection)
> - Input sanitisation to prevent injection attacks
> - Rate limiting to prevent abuse (configurable per-user limits)
> - Password reset email template with branding compliance
> - Email verification email template with branding compliance
> - Comprehensive error handling and structured logging
> - TypeScript implementation with strict mode and Zod validation
> 
> **Testing:** All 14 acceptance criteria verified with 10 test scenarios covering happy path, validation, rate limiting, security, and deliverability.  
> **DoR Compliance:** ✅ All requirements met  
> **Security:** Rate limiting, input sanitisation, credential protection, no sensitive data in logs  
> **Deliverability:** DNS authentication (SPF, DKIM, DMARC) pre-configured and verified
> 
> **Dependencies:** This service is required by US-049 (Email Confirmation) and future authentication flows.

---

## Open Questions & Clarifications

### Resolved Assumptions (Document for Reference):

**Q1: Which SMTP port should be used?**  
**A1 (Resolved):** Port 587 with TLS/STARTTLS. Port 25 is blocked by Vercel. Port 465 (implicit SSL) is an alternative.

**Q2: Should emails be sent synchronously or queued?**  
**A2 (Assumption):** Synchronous for MVP. Queue system (Redis-based) is future enhancement for high-volume scenarios.

**Q3: How should rate limiting handle serverless cold starts?**  
**A3 (Assumption):** In-memory rate limiting acceptable for MVP. Rate limits reset on cold start. Persistent rate limiting (Redis/database) is future enhancement.

**Q4: Should disposable email domains be rejected or just flagged?**  
**A4 (Assumption):** Configurable via environment variable. Default to flag (not reject) for MVP.

**Q5: What is the sender name for emails?**  
**A5 (Resolved):** "Legends Ascend" as display name, `hello@legendsascend.com` as sender address.

**Q6: What happens if Namecheap sending limits are exceeded?**  
**A6 (Assumption):** Conservative rate limiting prevents this. If exceeded, SMTP errors are logged and returned to caller. Consider backup provider migration for future.

### Outstanding Questions (if any):

_No outstanding questions at this time. All requirements are well-defined or have documented assumptions based on the comprehensive issue specification._

---

## Email Deliverability Warm-Up Strategy

**Critical for New Domains:** `legendsascend.com` requires gradual volume increase to build reputation.

| Week | Daily Volume | Focus |
|------|-------------|-------|
| 1 | 10-20 emails | Team testing, verification |
| 2 | 30-50 emails | Beta users, engaged users |
| 3 | 75-100 emails | Expanding user base |
| 4+ | 150+ emails | Normal operations |

**Warm-Up Rules:**
- ✅ Start with engaged users (high open/reply rate)
- ✅ Monitor bounce rate (<2%) and spam complaints (0%)
- ✅ Ask recipients to mark as "Not Spam" and add to contacts
- ❌ Do NOT send to unverified/cold email addresses
- ❌ Do NOT use aggressive promotional language

---

## Verification Checklist (Before Production)

- [ ] Send test email and verify SPF/DKIM/DMARC pass
- [ ] Score 8/10+ on [Mail-Tester.com](https://www.mail-tester.com/)
- [ ] Test delivery to Gmail, Outlook, Yahoo (inbox placement)
- [ ] Verify mobile email client rendering
- [ ] Verify plain text version readability
- [ ] Confirm all links work correctly
- [ ] Verify unsubscribe link functions

---

**End of User Story US-050**
