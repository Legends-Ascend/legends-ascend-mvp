> **MANDATORY COMPLIANCE NOTICE**
> All code contributions, AI agent outputs, prompts, and automation workflows MUST actively reference and comply with BOTH ACCESSIBILITY_REQUIREMENTS.md and BRANDING_GUIDELINE.md in the docs folder. Compliance with these documents is mandatory for every PR, agent suggestion, and code merge. All contributors, including custom/copilot agents, must cross-check outputs and document brand and accessibility adherence in their change description.

# Technical Architecture and Unified Development Principles

> **Document Version:** Updated November 22, 2025  
> **Latest Update:** Added Reusable Components section documenting the NewsletterSubscription component pattern.

This document defines the unified technical standards for all contributors and agents (GitHub Copilot, OpenAI Codex, Databricks Spark/ML agents, and human developers) working in this repository. It establishes binding conventions for code, data, APIs, tooling, CI/CD, and change control. Agents MUST proactively cross-check outputs against this standard before proposing changes. Agents and humans MUST NOT silently introduce incompatible approaches. All architectural changes MUST go through the documented decision process below.

---

## 1. Tech Stack

- Languages: TypeScript (primary), Python (data/ML and automation), Bash (ops scripts).
- Runtimes: Node.js LTS (v20.x), Python 3.11.
- Frameworks: Express/Fastify (backend), React/Next.js (frontend) if applicable; PySpark/Spark 3.5 for data jobs.
- Package managers: pnpm (JS/TS), uv/pip (Python). No npm/yarn or conda.
- Datastores: PostgreSQL 15 (primary OLTP), Redis 7 (caching/queues). Local dev via Docker.
- Messaging/Events: Kafka (if used) with Protobuf schema registry.
- Infra: Docker + Docker Compose for dev; GitHub Actions for CI; IaC via Terraform (HCL2) if infra is managed here.

## 2. Repository Layout

```
/                                 Root
├─ apps/                          Executables and deployable services
│  ├─ api/                        Backend service(s)
│  └─ web/                        Frontend web app
├─ packages/                      Shared libraries (publishable or internal)
├─ data/                          Data jobs, ETL, Spark code
├─ infra/                         Terraform and deployment configs
├─ scripts/                       Dev/ops scripts
├─ docs/                          Documentation (this file lives here)
└─ .github/                       Workflows, issue/pr templates
```

- New code MUST fit this structure. If a folder is not present, propose its creation via PR with justification.

## 3. Naming Conventions

- Files: kebab-case for config and scripts (build-tools.mjs), PascalCase for React components, snake_case for Python.
- Folders: kebab-case.
- Types/Interfaces (TS): PascalCase, prefix domain where helpful (UserId, OrderId).
- Env vars: SCREAMING_SNAKE_CASE; app-specific prefix (API_, WEB_, DATA_).
- Branches: feature/<ticket-id>-<short-name>, fix/<ticket-id>-<short-name>, chore/<desc>.
- Commits: Conventional Commits (feat:, fix:, chore:, docs:, refactor:, test:, build:, ci:, perf:, revert:). Scope optional but encouraged.

## 4. APIs and Data Formats

- External APIs MUST be versioned with URI or header: /v1/...
- Wire formats: JSON for REST; if streaming or events, use Protobuf with versioned schemas.
- OpenAPI 3.1 specs for REST endpoints under docs/openapi/*.yaml kept in lockstep with implementation.
- Pagination: cursor-based (preferred) or limit/offset with max page size documented.
- Idempotency: unsafe endpoints MUST support idempotency keys via Idempotency-Key header.
- Authentication: OAuth2/OIDC or signed tokens (JWT) with short TTL; rotate keys regularly.

## 5. Frontend Routing Protection

The frontend implements a RouteGuard pattern to ensure proper landing page behavior and prevent unauthorized route access.

### 5.1 RouteGuard Component

**Purpose:** Provides routing protection to ensure the landing page remains the default entry point when enabled, and prevents accidental route hijacking.

**Location:** `frontend/src/components/RouteGuard.tsx`

**Key Features:**
- Environment variable driven: Controlled by `VITE_LANDING_PAGE_ENABLED`
- Authentication-aware: Respects user authentication state
- Non-intrusive: Wraps children without modifying render output
- Single check: Performs route protection check only once on mount for performance

### 5.2 Configuration

**Environment Variable:**
- **Name:** `VITE_LANDING_PAGE_ENABLED`
- **Type:** String or Boolean
- **Values:**
  - `"true"` or `true`: Landing page protection enabled (default behavior)
  - `"false"` or any other value: Landing page protection disabled
- **Location:** `.env` or `.env.local` files (see `.env.example`)

### 5.3 Behavior

**When `VITE_LANDING_PAGE_ENABLED` is `true`:**
- Unauthenticated users attempting to access protected routes are redirected to the landing page
- Authenticated users can access all routes
- Landing page and privacy policy are always accessible

**When `VITE_LANDING_PAGE_ENABLED` is `false` or not set:**
- All routes are accessible without landing page enforcement
- Allows for development/testing scenarios

### 5.4 Usage Pattern

```typescript
import { RouteGuard } from './components/RouteGuard';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  
  const redirectToLanding = useCallback(() => {
    setCurrentView('landing');
    window.history.pushState({}, '', '/');
  }, []);

  return (
    <RouteGuard
      currentView={currentView}
      onRedirectToLanding={redirectToLanding}
      isAuthenticated={userIsAuthenticated}
    >
      {/* Your app content */}
    </RouteGuard>
  );
}
```

### 5.5 Protected Routes

The following routes are protected when landing page is enabled:
- `/game` and all game-related views (players, lineup, simulator, leaderboard)
- Any custom application routes added in the future

**Exempt Routes (always accessible):**
- `/` (landing page)
- `/privacy-policy` (privacy policy page)

### 5.6 Testing

All routing protection behavior is covered by comprehensive unit tests in `frontend/src/components/__tests__/RouteGuard.test.tsx`. Tests verify:
- Environment variable parsing
- Route protection enforcement
- Authentication state handling
- Redirect behavior
- Edge cases and boundary conditions

### 5.7 Best Practices

1. **Always set `VITE_LANDING_PAGE_ENABLED` explicitly** in production environments
2. **Use `true` for production** to ensure landing page is the entry point
3. **Use `false` for development** only when bypassing landing page is needed
4. **Update `isAuthenticated` prop** when implementing actual authentication
5. **Test both enabled and disabled states** when modifying routing logic
6. **Add new protected routes** to the RouteGuard logic and tests when expanding the application

## 5.8 Reusable Components

### NewsletterSubscription Component

**Purpose:** Provides a reusable, type-safe component for capturing email subscriptions with GDPR compliance and configurable EmailOctopus tagging.

**Location:** `frontend/src/components/NewsletterSubscription.tsx`

**Documentation:** See detailed usage guide in `/docs/NEWSLETTER_SUBSCRIPTION.md`

**Key Features:**
- Configurable EmailOctopus tags for subscriber segmentation
- GDPR compliant with consent checkbox and disclosure
- Full TypeScript support with strict mode
- WCAG 2.1 AA accessible
- Customizable button text, success messages, and callbacks
- Comprehensive error handling per architecture standards

**Basic Usage:**

```typescript
import { NewsletterSubscription } from './components/NewsletterSubscription';

// Default usage with 'beta' tag
<NewsletterSubscription />

// Custom tag for different campaigns
<NewsletterSubscription tag="early-access" submitButtonText="Get Early Access" />
<NewsletterSubscription tag="newsletter" submitButtonText="Subscribe" />
<NewsletterSubscription tag="tournament-alerts" submitButtonText="Notify Me" />

// With callbacks for analytics and error tracking
<NewsletterSubscription
  tag="beta"
  onSuccess={(email) => analytics.track('Subscription', { email })}
  onError={(error) => errorTracker.log(error)}
/>
```

**Backend Integration:**

The component sends requests to `/api/v1/subscribe` with an optional `tag` parameter. The backend service `emailOctopusService.ts` accepts the tag and applies it to the subscriber:

```typescript
// Backend service signature
subscribeToEmailList(email: string, consentTimestamp: string, tag?: string)
```

**Tag Resolution Priority:**
1. Tag passed from component prop
2. `EMAILOCTOPUS_BETA_ACCESS_TAG` environment variable
3. Default `'beta'` tag

**Environment Variables:**
- Frontend: `VITE_API_URL` (API endpoint), `VITE_ENABLE_EMAILOCTOPUS_DEBUG` (debug logging)
- Backend: `EMAILOCTOPUS_API_KEY`, `EMAILOCTOPUS_LIST_ID`, `EMAILOCTOPUS_BETA_ACCESS_TAG`, `EMAILOCTOPUS_DEBUG`

**Testing:** Comprehensive test coverage in `frontend/src/components/__tests__/NewsletterSubscription.test.tsx`

For complete documentation, examples, and troubleshooting, see `/docs/NEWSLETTER_SUBSCRIPTION.md`.



## 6. API Restructure and Vercel Conventions

### 6.1 Overview

The API has been restructured to follow Vercel's conventions for serverless functions. This ensures compatibility with Vercel's deployment platform and enables automatic API route discovery.

### 6.2 Root Cause and Solution

**Problem:**
- Backend API was returning 404 errors
- Vercel couldn't find serverless functions
- Custom builds configuration wasn't working

**Root Cause:** Vercel requires API functions to be in the `/api` directory at the repository root.

**Solution:** Restructured the project to follow Vercel conventions with functions auto-discovered in `/api` directory.

### 6.3 Key Changes

- Main API handler moved to `/api/index.ts`
- Backend services organized as importable modules
- Configuration files (`vercel.json`) simplified
- Removed custom builds configuration for automatic handling

## 7. Deployment and Infrastructure

### 7.1 Deployment Strategy

The project uses Vercel for deployment with the following approach:

**Monorepo Deployment:**
- Single Vercel project manages both frontend and API
- Automatic detection of deployable services
- Shared dependencies via pnpm workspaces

### 7.2 Pre-Deployment Verification

Before deploying, verify:

1. **API Configuration:** Environment variables set correctly, database connections validated
2. **Build Status:** TypeScript compilation succeeds, no linting errors, tests pass
3. **Dependencies:** pnpm lock file up to date, no missing peer dependencies
4. **Security:** No console.log statements in production, secrets in environment variables only

### 7.3 Environment Management

**Development:** Use `.env` file, reference `.env.example` for required variables
**Production:** Environment variables set in Vercel dashboard, `VITE_LANDING_PAGE_ENABLED=true`

## 8. Deployment Troubleshooting & Common Issues

### Issue: Subscription API Returns 405 Error

**Symptoms:**
- Form submission fails
- Browser console shows: `POST https://your-frontend.vercel.app/api/v1/subscribe net::ERR_ABORTED 405 (Method Not Allowed)`
- Error message: "The subscription service is not configured correctly"

**Root Cause:** Frontend calling API on its own domain instead of backend API domain. Occurs when `VITE_API_URL` not set during build.

**Solution:**
1. Deploy backend first and note the URL
2. Set `VITE_API_URL` in Vercel dashboard → Frontend Project → Settings → Environment Variables
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.vercel.app/api` (for separate deployments) or `/api` (for monorepo)
3. Set for all environments: Production, Preview, Development
4. Redeploy frontend

**Common Mistakes:**
- ❌ Setting `VITE_API_URL` to frontend URL instead of backend
- ❌ Not redeploying after setting environment variable
- ❌ Setting variable in backend project instead of frontend
- ❌ Forgetting `/api` suffix in URL

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS policy errors
- Requests blocked before reaching backend

**Solution:**
1. Update backend `ALLOWED_ORIGINS` environment variable
2. Include all frontend domains (with and without www)
3. Ensure no trailing slashes in origins
4. Redeploy backend after changing environment variables

### Issue: Database Connection Errors

**Symptoms:**
- 500 errors from API
- Backend logs show database connection failures

**Solution:**
1. Verify `LA_POSTGRES_URL` or `DATABASE_URL` set correctly
2. Check database credentials and network access
3. For Vercel + Neon: ensure connection pooling enabled
4. Verify database accepts connections from Vercel IPs

### Issue: vercel.json Routing Conflicts

**Symptoms:**
- 404 errors on API routes
- Frontend routes not working
- API returning wrong responses

**Root Cause:** Conflicting `vercel.json` files at frontend and root levels

**Solution:**
- For monorepo deployment: **delete** `frontend/vercel.json`, use only root `vercel.json`
- Root `vercel.json` must route:
  - `/api/*` → backend serverless function
  - Everything else → frontend static files (`frontend/dist/index.html`)

### Issue: VITE_API_URL Environment Variable Not Recognized

**Symptoms:**
- Console warning: "VITE_API_URL is not configured"
- API calls going to wrong URL
- Monorepo deployments showing 405 errors

**Solution:**
1. Verify variable set in Vercel dashboard (not in vercel.json)
2. Set `VITE_API_URL=/api` for monorepo
3. Set `VITE_API_URL=https://backend-url.vercel.app/api` for separate deployments
4. Redeploy frontend to apply changes

## 9. Deployment Verification Checklist

**Backend Health Check:**
```bash
curl https://your-backend.vercel.app/api/health
# Expected: {"status":"ok","message":"Legends Ascend API is running"}
```

**Frontend Access:**
- Open `https://your-frontend.vercel.app` (or `https://your-app.vercel.app` for monorepo)
- Verify landing page loads
- Check browser console for errors

**Subscription Flow:**
- Submit "Join Waitlist" form
- Verify success message appears
- Check EmailOctopus dashboard for new subscriber
- Verify network tab shows successful POST to `/api/v1/subscribe`

**CORS Verification:**
- Open browser developer tools → Network tab
- Submit form and verify:
  - OPTIONS preflight request succeeds (204 status)
  - POST request succeeds (200 status)
  - No CORS errors in console

**Security Checklist:**
- ✓ `NODE_ENV=production` set on backend
- ✓ HTTPS enabled on both frontend and backend
- ✓ `ALLOWED_ORIGINS` configured with production domains only
- ✓ Database credentials secure (not hardcoded)
- ✓ All sensitive environment variables in hosting dashboard, not code
- ✓ CORS configured correctly
- ✓ Rate limiting enabled on API endpoints
- ✓ No console.log statements in production code

## 10. Monorepo vs Separate Deployments

**Monorepo Deployment (Recommended for MVP):**
- Single Vercel project, one domain
- `VITE_API_URL=/api` (relative URL)
- CORS not strictly required
- Lower complexity, single configuration
- Uses root `/api/*` routes for backend

**Separate Deployments:**
- Two Vercel projects, two domains
- `VITE_API_URL=https://backend.vercel.app/api` (absolute URL)
- CORS required and must be configured
- Higher complexity, coordinate deployments
- More flexibility for independent scaling

**Migration Path:**
If scaling requires separate deployments:
1. Deploy backend as separate Vercel project
2. Update `VITE_API_URL` to backend's absolute URL
3. Configure CORS on backend with frontend domain
4. Remove backend build/routes from root `vercel.json`
