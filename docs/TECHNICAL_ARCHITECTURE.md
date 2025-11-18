> **MANDATORY COMPLIANCE NOTICE**
> All code contributions, AI agent outputs, prompts, and automation workflows MUST actively reference and comply with BOTH ACCESSIBILITY_REQUIREMENTS.md and BRANDING_GUIDELINE.md in the docs folder. Compliance with these documents is mandatory for every PR, agent suggestion, and code merge. All contributors, including custom/copilot agents, must cross-check outputs and document brand and accessibility adherence in their change description.

# Technical Architecture and Unified Development Principles

> **Document Version:** Updated November 18, 2025  
> **Latest Update:** Added Frontend Routing Protection section documenting the RouteGuard pattern for landing page protection.

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

