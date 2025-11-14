# US-001: Landing Page Setup Guide

This document provides setup instructions for the Legends Ascend MVP landing page with EmailOctopus integration and GDPR compliance.

## Features Implemented

✅ Full-viewport hero section with background video/image
✅ Prefers-reduced-motion accessibility support
✅ Email signup form with client and server-side validation
✅ GDPR-compliant consent mechanism with explicit checkbox
✅ Privacy Policy page
✅ EmailOctopus API integration with rate limiting
✅ SEO metadata (Open Graph, Twitter Cards)
✅ Responsive design (mobile, tablet, desktop)
✅ Brand-compliant styling (colors, typography, logo)

## Prerequisites

- Node.js v20.x (LTS)
- npm or pnpm
- EmailOctopus account with API credentials

## Environment Setup

### Backend (.env)

Create a `.env` file in the `backend` directory:

```bash
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/legends_ascend
NODE_ENV=development

# EmailOctopus Configuration (required for US-001)
EMAILOCTOPUS_API_KEY=your_api_key_here
EMAILOCTOPUS_LIST_ID=your_list_id_here
```

### Frontend (.env)

The frontend uses Vite environment variables. Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Installation

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## EmailOctopus Setup

1. Sign up for an EmailOctopus account at https://emailoctopus.com
2. Create a new email list
3. Enable "Double opt-in" in list settings (GDPR requirement)
4. Get your API key from Settings > API
5. Get your List ID from the list settings
6. Add both to your backend `.env` file

## Testing the Landing Page

### Manual Testing

1. Navigate to `http://localhost:5173`
2. Verify hero section displays with background video/image
3. Test email form validation:
   - Try submitting without email → should show error
   - Try submitting without GDPR consent → should show error
   - Enter valid email and check consent → should call API
4. Test Privacy Policy link (should open in new tab)
5. Test keyboard navigation (Tab through form elements)

### API Testing

Test the subscription endpoint directly:

```bash
curl -X POST http://localhost:3000/api/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "gdprConsent": true,
    "timestamp": "2025-11-07T06:00:00.000Z"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you! Check your email to confirm your subscription.",
  "status": "pending_confirmation"
}
```

### Rate Limiting Test

The API is rate-limited to 5 requests per IP per 5 minutes. Test by making 6 requests rapidly:

```bash
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/v1/subscribe \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\",\"gdprConsent\":true,\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}"
  echo ""
done
```

The 6th request should return a 429 status code.

## Accessibility Features

✅ **WCAG 2.1 AA Compliant**
- Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Screen reader support with ARIA labels
- Focus indicators on all interactive elements
- Color contrast ratios meet 4.5:1 (normal text) and 3:1 (large text)
- Prefers-reduced-motion support (disables video autoplay)

### Testing Keyboard Navigation

1. Press Tab to navigate through:
   - Email input field
   - GDPR consent checkbox
   - Privacy Policy link
   - Submit button
2. Press Shift+Tab to navigate backwards
3. Press Space to check/uncheck checkbox
4. Press Enter on submit button to submit form

## Security Features

✅ Input validation (client and server-side)
✅ Rate limiting (5 requests per IP per 5 minutes)
✅ Email sanitization (prevents XSS)
✅ HTTPS enforcement (production)
✅ Environment variables for secrets (never committed)

## Performance

Target metrics:
- LCP (Largest Contentful Paint): < 2.5 seconds
- CLS (Cumulative Layout Shift): < 0.1
- FID/INP (First Input Delay): < 100ms

Run Lighthouse audit:
```bash
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

## Production Deployment

### Checklist

- [ ] Set environment variables in production
- [ ] Verify EmailOctopus API credentials
- [ ] Enable HTTPS/TLS 1.3
- [ ] Verify Privacy Policy page is accessible
- [ ] Enable EmailOctopus double opt-in
- [ ] Test on production domain
- [ ] Run Lighthouse audit
- [ ] Test with real email submissions

## Troubleshooting

### Issue: "EmailOctopus configuration missing"

**Solution:** Ensure `EMAILOCTOPUS_API_KEY` and `EMAILOCTOPUS_LIST_ID` are set in backend `.env` file

### Issue: Form submission fails with CORS error

**Solution:** Verify backend CORS is configured to allow frontend origin

### Issue: Video doesn't play on mobile

**Solution:** This is expected behavior for users with "Reduce Motion" enabled. They will see a static image instead.

### Issue: Rate limit triggered too quickly

**Solution:** Rate limiting is IP-based. During development, you may hit the limit if testing repeatedly. Wait 5 minutes or restart the backend to reset.

## Documentation

For complete technical specifications, see:
- `/docs/user-stories/US-001-landing-page-hero-emailoctopus-gdpr.md`
- `/docs/TECHNICAL_ARCHITECTURE.md`
- `/docs/BRANDING_GUIDELINE.md`
- `/docs/ACCESSIBILITY_REQUIREMENTS.md`

## Support

For issues or questions:
- Open a GitHub issue with the `user-story` label
- Reference US-001 in the issue title
