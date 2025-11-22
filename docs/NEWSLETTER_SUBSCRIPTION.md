# Newsletter Subscription Component

> **Component:** `NewsletterSubscription`  
> **Location:** `frontend/src/components/NewsletterSubscription.tsx`  
> **Version:** 1.0.0  
> **Last Updated:** November 22, 2025

## Overview

The `NewsletterSubscription` component is a reusable, fully-typed React component for capturing email subscriptions with GDPR compliance. It integrates with the EmailOctopus API and supports configurable tagging for subscriber segmentation.

## Features

- ✅ **Configurable Tags**: Apply custom EmailOctopus tags to segment subscribers
- ✅ **GDPR Compliant**: Built-in consent checkbox and data protection disclosure
- ✅ **Type-Safe**: Full TypeScript support with strict mode
- ✅ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- ✅ **Customizable**: Custom button text, success messages, and callbacks
- ✅ **Error Handling**: Comprehensive error handling per TECHNICAL_ARCHITECTURE.md patterns
- ✅ **Responsive**: Mobile-first design with brand-compliant styling

## Installation & Import

```typescript
import { NewsletterSubscription } from './components/NewsletterSubscription';
```

## Basic Usage

### Default Configuration (Beta Tag)

```tsx
import { NewsletterSubscription } from './components/NewsletterSubscription';

function LandingPage() {
  return (
    <div>
      <h1>Join Our Beta</h1>
      <NewsletterSubscription />
    </div>
  );
}
```

This uses the default `beta` tag and "Join the Waitlist" button text.

## Advanced Usage

### Custom Tag for Different Campaigns

```tsx
// Early Access Program
<NewsletterSubscription 
  tag="early-access" 
  submitButtonText="Get Early Access" 
/>

// Newsletter Subscription
<NewsletterSubscription 
  tag="newsletter" 
  submitButtonText="Subscribe to Newsletter" 
/>

// VIP Members
<NewsletterSubscription 
  tag="vip-members" 
  submitButtonText="Join VIP List" 
/>

// Product Launch Notification
<NewsletterSubscription 
  tag="product-launch" 
  submitButtonText="Notify Me at Launch" 
/>
```

### With Callbacks

```tsx
<NewsletterSubscription
  tag="newsletter"
  submitButtonText="Subscribe"
  onSuccess={(email) => {
    console.log(`Successfully subscribed: ${email}`);
    // Track analytics event
    analytics.track('Newsletter Subscription', { email });
  }}
  onError={(error) => {
    console.error('Subscription failed:', error);
    // Log to error tracking service
    errorTracker.log(error);
  }}
/>
```

### Custom Success Message

```tsx
<NewsletterSubscription
  tag="beta"
  successMessage="Welcome to the Legends Ascend beta! Check your inbox for next steps."
/>
```

### Custom Styling

```tsx
<NewsletterSubscription
  tag="newsletter"
  className="my-8 mx-auto shadow-2xl"
/>
```

## Props Reference

### `NewsletterSubscriptionProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `string` | `'beta'` | EmailOctopus tag to apply to subscribers. Used for segmentation. |
| `submitButtonText` | `string` | `'Join the Waitlist'` | Custom text for the submit button. |
| `successMessage` | `string` | API response message | Custom success message displayed after subscription. |
| `onSuccess` | `(email: string) => void` | `undefined` | Callback fired when subscription succeeds. Receives the subscribed email. |
| `onError` | `(error: string) => void` | `undefined` | Callback fired when subscription fails. Receives the error message. |
| `className` | `string` | `''` | Additional CSS classes for the form container. |

## API Integration

The component communicates with the backend API endpoint `/api/v1/subscribe` with the following payload:

```typescript
{
  email: string;           // User's email address
  gdprConsent: boolean;    // Must be true
  timestamp: string;       // ISO 8601 timestamp
  tag?: string;            // Optional EmailOctopus tag
}
```

### Backend Configuration

The backend `emailOctopusService.ts` accepts an optional `tag` parameter:

```typescript
subscribeToEmailList(email: string, consentTimestamp: string, tag?: string)
```

**Tag Resolution Priority:**
1. Tag passed from component prop
2. `EMAILOCTOPUS_BETA_ACCESS_TAG` environment variable
3. Default `'beta'` tag

## Tag Strategy

### Recommended Tags

Use semantic, kebab-case tag names for clarity:

- `beta` - Beta program participants
- `early-access` - Early access program
- `newsletter` - General newsletter subscribers
- `vip-members` - VIP or premium members
- `product-launch` - Product launch notifications
- `tournament-alerts` - Tournament notifications
- `community-updates` - Community news

### Tag Management

Tags should be created in EmailOctopus dashboard before use. The component will apply them automatically, but EmailOctopus will create unknown tags on-the-fly if needed.

**Best Practice:** Pre-create tags in EmailOctopus for better organization and reporting.

## Form Validation

The component validates:

1. **Email Format**: Valid email address required
2. **GDPR Consent**: Checkbox must be checked
3. **Required Fields**: Email and consent are mandatory

Validation uses Zod schema defined in `frontend/src/types/subscribe.ts`:

```typescript
export const SubscribeFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to receive emails from us',
  }),
});
```

## Error Handling

The component handles:

- **Network Errors**: Connection failures, timeouts
- **API Errors**: 400, 405, 409, 500 status codes
- **Validation Errors**: Client-side and server-side validation
- **Configuration Errors**: Missing API URL or misconfigured environment

Error messages follow patterns defined in TECHNICAL_ARCHITECTURE.md.

## Accessibility

### WCAG 2.1 AA Compliance

- ✅ Semantic HTML with proper `<form>` structure
- ✅ Associated labels with `htmlFor` attributes
- ✅ ARIA attributes: `aria-required`, `aria-invalid`, `aria-describedby`, `aria-busy`
- ✅ Error messages with `role="alert"` for screen readers
- ✅ Keyboard navigation support (Tab, Enter)
- ✅ Focus indicators with 2px Primary Blue outline
- ✅ Color contrast meets 4.5:1 ratio for text, 3:1 for UI elements

### Screen Reader Support

The component announces:
- Form validation errors
- Submission status (loading, success, error)
- Success state with `role="status"` and `aria-live="polite"`

## Branding Compliance

Styling follows BRANDING_GUIDELINE.md:

- **Colors**: Primary Blue (#1E3A8A), Accent Gold (#F59E0B), Dark Navy (#0F172A)
- **Typography**: Inter or Poppins font family
- **Spacing**: Consistent 4px/8px grid system
- **Border Radius**: 6px for buttons, 8px for forms
- **Shadows**: Subtle elevation for depth

## Testing

Comprehensive test coverage in `frontend/src/components/__tests__/NewsletterSubscription.test.tsx`:

### Test Scenarios

- ✅ Renders with default props
- ✅ Renders with custom props (tag, button text, className)
- ✅ Validates GDPR consent requirement
- ✅ Sends correct tag to backend API
- ✅ Displays success message on successful subscription
- ✅ Calls onSuccess callback with email
- ✅ Displays custom success message when provided
- ✅ Displays error message on failed subscription
- ✅ Calls onError callback with error message
- ✅ Has proper ARIA attributes
- ✅ Marks button as busy during submission

### Running Tests

```bash
# Run all tests
pnpm test

# Run NewsletterSubscription tests only
pnpm test NewsletterSubscription

# Run with coverage
pnpm test:coverage
```

## Migrating from EmailSignupForm

The original `EmailSignupForm` component has been refactored to use `NewsletterSubscription`:

**Before:**
```tsx
import { EmailSignupForm } from './components/landing/EmailSignupForm';

<EmailSignupForm />
```

**After (no change required):**
```tsx
import { EmailSignupForm } from './components/landing/EmailSignupForm';

<EmailSignupForm /> {/* Still works - now uses NewsletterSubscription internally */}
```

Or use `NewsletterSubscription` directly:

```tsx
import { NewsletterSubscription } from './components/NewsletterSubscription';

<NewsletterSubscription tag="beta" submitButtonText="Join the Waitlist" />
```

## Environment Variables

### Frontend

- `VITE_API_URL`: Backend API URL (default: `/api` for monorepo deployments)
- `VITE_ENABLE_EMAILOCTOPUS_DEBUG`: Enable debug logging (default: `true` in dev, `false` in prod)

### Backend

- `EMAILOCTOPUS_API_KEY`: EmailOctopus API key (required)
- `EMAILOCTOPUS_LIST_ID`: EmailOctopus list ID (required)
- `EMAILOCTOPUS_BETA_ACCESS_TAG`: Default tag if none specified (optional, defaults to `'beta'`)
- `EMAILOCTOPUS_DEBUG`: Enable debug logging (default: `true`)

## Troubleshooting

### Issue: "The subscription service is not configured correctly"

**Cause:** `VITE_API_URL` not set or incorrect.

**Solution:**
1. Check `.env` file has `VITE_API_URL=/api` (monorepo) or `VITE_API_URL=https://backend-url.vercel.app/api`
2. Restart Vite dev server: `pnpm dev`
3. For production: set `VITE_API_URL` in Vercel dashboard → Settings → Environment Variables

### Issue: 405 Method Not Allowed

**Cause:** Frontend calling wrong URL or backend not deployed.

**Solution:** See TECHNICAL_ARCHITECTURE.md section 8 for detailed troubleshooting.

### Issue: Tags not appearing in EmailOctopus

**Cause:** Tags are case-sensitive and must exist or be auto-created.

**Solution:** Pre-create tags in EmailOctopus dashboard or verify spelling matches exactly.

## Examples

### Example 1: Landing Page Beta Signup

```tsx
import { NewsletterSubscription } from './components/NewsletterSubscription';

export default function LandingPage() {
  return (
    <section className="hero">
      <h1>Join the Legends Ascend Beta</h1>
      <p>Be among the first to experience the game.</p>
      <NewsletterSubscription 
        tag="beta" 
        submitButtonText="Join Beta Waitlist"
      />
    </section>
  );
}
```

### Example 2: Newsletter Sidebar Widget

```tsx
import { NewsletterSubscription } from './components/NewsletterSubscription';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Stay Updated</h3>
      <NewsletterSubscription 
        tag="newsletter"
        submitButtonText="Subscribe"
        className="sidebar-newsletter"
        onSuccess={(email) => {
          console.log(`Newsletter subscription: ${email}`);
        }}
      />
    </aside>
  );
}
```

### Example 3: Tournament Notifications

```tsx
import { NewsletterSubscription } from './components/NewsletterSubscription';

export default function TournamentPage() {
  const handleTournamentSignup = (email: string) => {
    // Track tournament interest
    analytics.track('Tournament Interest', { email });
    // Show additional onboarding
    showTournamentOnboarding();
  };

  return (
    <div className="tournament">
      <h2>Get Notified for Upcoming Tournaments</h2>
      <NewsletterSubscription 
        tag="tournament-alerts"
        submitButtonText="Notify Me"
        successMessage="You'll receive tournament notifications!"
        onSuccess={handleTournamentSignup}
      />
    </div>
  );
}
```

## Related Documentation

- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - Architecture patterns and standards
- [BRANDING_GUIDELINE.md](./BRANDING_GUIDELINE.md) - Brand colors, typography, design system
- [ACCESSIBILITY_REQUIREMENTS.md](./ACCESSIBILITY_REQUIREMENTS.md) - WCAG compliance guidelines
- [EmailOctopus API Documentation](https://emailoctopus.com/api-documentation) - External API reference

## Changelog

### Version 1.0.0 (November 22, 2025)
- Initial release
- Configurable tag support
- GDPR compliance
- Full TypeScript support
- WCAG 2.1 AA accessibility
- Comprehensive test coverage
- Custom callbacks and styling

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review TECHNICAL_ARCHITECTURE.md deployment section
3. Verify environment variables are set correctly
4. Check browser console for detailed error messages (debug mode)
5. Review test files for usage examples

---

**Component Maintainer:** Legends Ascend Development Team  
**Last Review:** November 22, 2025
