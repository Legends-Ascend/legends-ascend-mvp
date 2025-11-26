# Admin Account and Dashboard

**ID:** US-051  
**Story Points:** 5  
**Priority:** SHOULD  
**Epic/Feature:** Admin  
**Dependencies:** 
- US-045 (Authentication System - completed)
- Existing login page and authentication flow

---

## User Story

As an administrator,  
I want a dedicated admin account with secure credentials and access to an admin dashboard,  
So that I can manage administrative configurations, settings, and access admin-only pages within the application.

---

## Context

### Summary
This story implements the foundational admin account and dashboard infrastructure for Legends Ascend. During the first deployment, an admin account is created with pre-defined credentials. The admin user can access the admin area via the existing login page (with a different post-login route), which provides a centralised location for all administrative functions. For this initial implementation, the admin dashboard is an empty page that serves as a placeholder for future admin features.

### Scope

**In Scope:**
- Creation of an admin account with username: `supersaiyan` and password: `wh4t15myd35t1ny!` during first deployment
- Admin role designation in the user model
- Admin-only dashboard page (empty placeholder for now)
- Admin route protection middleware
- Leveraging the existing login page for admin authentication
- Post-login redirect to admin dashboard for admin users
- Route guard for admin-only routes

**Out of Scope:**
- Admin configuration panels (future stories)
- User management features (future stories)
- System settings management (future stories)
- Admin-specific UI components beyond the empty dashboard
- Multi-admin support (future stories)
- Admin activity logging (future stories)
- Password change functionality for admin (future stories)
- Separate admin login page (uses existing login page)

### Assumptions
- The admin account uses a username (`supersaiyan`) instead of email for identification
- The admin password `wh4t15myd35t1ny!` is provided as a requirement and meets security standards
- The existing login page can be extended to support username-based login alongside email-based login
- Admin users will be distinguished by a role field in the users table
- The admin dashboard will be accessible at `/admin` route
- Regular users cannot access admin routes (returns 403 Forbidden)
- Admin account is created via a database seed script or migration
- Only one admin account is created for MVP (future stories will handle multi-admin)

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All 10 sections satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - TypeScript, Node.js LTS, React 18+, API patterns
- ✅ BRANDING_GUIDELINE.md - Admin dashboard follows brand colours and typography
- ✅ ACCESSIBILITY_REQUIREMENTS.md - WCAG 2.1 AA compliant admin interface
- ✅ AI_PROMPT_ENGINEERING.md - Clear implementation context for AI agents

---

## Functional Requirements

### Admin Account Creation
- **[FR-1]** The system MUST create an admin account with username `supersaiyan` during first deployment if it doesn't exist
- **[FR-2]** The admin account password MUST be `wh4t15myd35t1ny!` (hashed using bcrypt before storage)
- **[FR-3]** The admin account MUST have a role of `admin` stored in the database
- **[FR-4]** The admin account MUST NOT be createable via the public registration endpoint

### Admin Authentication
- **[FR-5]** Admin users MUST be able to log in using the existing login page
- **[FR-6]** The login form MUST support both email-based login (for regular users) and username-based login (for admin)
- **[FR-7]** Admin users MUST be redirected to `/admin` after successful login
- **[FR-8]** Regular users MUST continue to be redirected to `/game/lineup` after login

### Admin Dashboard
- **[FR-9]** The admin dashboard MUST be accessible at the `/admin` route
- **[FR-10]** The admin dashboard page MUST display a simple placeholder indicating it's the admin area
- **[FR-11]** The admin dashboard MUST include a logout button
- **[FR-12]** The admin dashboard MUST show the admin username (supersaiyan)

### Route Protection
- **[FR-13]** All routes under `/admin/*` MUST be protected and require admin role
- **[FR-14]** Non-admin users attempting to access admin routes MUST receive a 403 Forbidden response
- **[FR-15]** Unauthenticated users attempting to access admin routes MUST be redirected to the login page
- **[FR-16]** Admin route protection MUST be implemented both on frontend (route guard) and backend (middleware)

### Database Changes
- **[FR-17]** The users table MUST be extended to include a `role` column (enum: 'user', 'admin')
- **[FR-18]** The users table MUST be extended to include an optional `username` column for admin accounts
- **[FR-19]** Existing users MUST default to role 'user' after migration

---

## Non-Functional Requirements

### Performance
- Admin login response time: <500ms p95
- Admin dashboard page load: <1 second
- Route protection check: <50ms

### Security
- **Password Hashing:** Admin password MUST be hashed with bcrypt (10 salt rounds) - never stored in plaintext
- **Role Verification:** Backend MUST verify admin role on every admin endpoint request
- **Token Security:** JWT token MUST include role claim for frontend verification
- **Input Validation:** Login endpoint MUST validate both email and username formats
- **Error Messages:** Login errors MUST NOT reveal whether username/email exists (prevent enumeration)
- **Rate Limiting:** Admin login attempts MUST follow existing rate limiting (5 failed attempts per 15 minutes)
- **No Hardcoded Secrets:** Admin credentials MUST only be set via seed script/migration, not hardcoded in application code

### Accessibility
- WCAG 2.1 AA compliance per ACCESSIBILITY_REQUIREMENTS.md
- Keyboard navigation support on admin dashboard
- Screen reader compatibility for all admin UI elements
- Focus indicators on interactive elements
- Proper heading hierarchy (h1 for page title)

### Branding
- Admin dashboard follows BRANDING_GUIDELINE.md
- Primary Blue (#1E3A8A) for header and navigation
- Dark Navy (#0F172A) for text
- White (#FFFFFF) background
- Inter/Poppins typography

### Internationalisation
- UK English terminology and spelling
- Date format: DD/MM/YYYY where applicable
- Externalizable strings for future translation

### Observability
- Structured logging for admin login attempts
- Log format: `{ event: 'admin_login', username: '***', success: boolean, timestamp }`
- No sensitive data in logs (password never logged)

---

## Acceptance Criteria

### AC-1: Admin Account Exists After Deployment
**Given** a fresh deployment of the application  
**When** the database seed/migration runs  
**Then** an admin account exists with username `supersaiyan`  
**And** the account has role `admin`  
**And** the password hash validates against `wh4t15myd35t1ny!`

### AC-2: Admin Can Log In Via Existing Login Page
**Given** the admin user is on the login page  
**When** they enter username `supersaiyan` and password `wh4t15myd35t1ny!`  
**Then** they are successfully authenticated  
**And** redirected to the admin dashboard at `/admin`

### AC-3: Admin Dashboard Accessible
**Given** an authenticated admin user  
**When** they navigate to `/admin`  
**Then** they see the admin dashboard page  
**And** the page displays "Admin Dashboard" heading  
**And** shows the admin username  
**And** includes a logout button

### AC-4: Regular Users Cannot Access Admin Routes
**Given** a regular user is authenticated  
**When** they attempt to navigate to `/admin`  
**Then** they receive a 403 Forbidden error  
**And** are shown an access denied message

### AC-5: Unauthenticated Users Redirected from Admin Routes
**Given** an unauthenticated user  
**When** they attempt to navigate to `/admin`  
**Then** they are redirected to the login page

### AC-6: Regular User Login Still Works
**Given** a regular user with email and password  
**When** they log in via the existing login page  
**Then** they are redirected to `/game/lineup` (not admin dashboard)  
**And** their experience is unchanged

### AC-7: Admin Logout Works
**Given** an authenticated admin user on the admin dashboard  
**When** they click the logout button  
**Then** they are logged out  
**And** redirected to the landing page

### AC-8: Database Schema Updated
**Given** the migration has run  
**Then** the users table has a `role` column with values 'user' or 'admin'  
**And** the users table has an optional `username` column  
**And** existing users have role 'user'

### AC-9: JWT Token Includes Role
**Given** an admin user successfully authenticates  
**Then** the JWT token includes the user's role  
**And** the frontend can determine admin status from the token

### AC-10: Admin Account Cannot Be Registered Publicly
**Given** a user attempts to register with username `supersaiyan`  
**When** they submit the registration form  
**Then** the registration is rejected  
**And** they cannot create an admin account via public API

---

## Test Scenarios

### TS-1: [Maps to AC-1] - Admin Account Creation
**Steps:**
1. Run database migration/seed script
2. Query users table for username `supersaiyan`
3. Verify role is `admin`
4. Test password hash against `wh4t15myd35t1ny!`

**Expected Result:**
- Admin account exists
- Role is `admin`
- Password validates correctly

```typescript
// Jest test snippet
describe('Admin Account Seed', () => {
  it('creates admin account with correct credentials', async () => {
    await runSeed();
    
    const result = await query(
      "SELECT username, role, password_hash FROM users WHERE username = 'supersaiyan'"
    );
    
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].role).toBe('admin');
    
    const passwordValid = await bcrypt.compare('wh4t15myd35t1ny!', result.rows[0].password_hash);
    expect(passwordValid).toBe(true);
  });
});
```

### TS-2: [Maps to AC-2] - Admin Login Success
**Steps:**
1. Navigate to login page
2. Enter username `supersaiyan`
3. Enter password `wh4t15myd35t1ny!`
4. Submit form

**Expected Result:**
- Login successful
- Redirected to `/admin`
- Token contains admin role

```typescript
// Supertest integration test
describe('POST /api/v1/auth/login', () => {
  it('authenticates admin with username', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'supersaiyan', password: 'wh4t15myd35t1ny!' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.role).toBe('admin');
    expect(response.body.data.user.username).toBe('supersaiyan');
  });
});
```

### TS-3: [Maps to AC-4] - Regular User Admin Access Denied
**Steps:**
1. Log in as regular user
2. Navigate to `/admin`
3. Verify access denied

**Expected Result:**
- 403 Forbidden response
- Access denied message displayed

```typescript
describe('GET /api/v1/admin', () => {
  it('returns 403 for non-admin users', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'regular@example.com', password: 'password123' });
    
    const token = loginResponse.body.data.token;
    
    await request(app)
      .get('/api/v1/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
```

### TS-4: [Maps to AC-5] - Unauthenticated Admin Access Redirect
**Steps:**
1. Clear any authentication tokens
2. Navigate directly to `/admin`
3. Verify redirect

**Expected Result:**
- Redirected to login page
- Original URL preserved for post-login redirect

### TS-5: [Maps to AC-6] - Regular User Login Unchanged
**Steps:**
1. Log in as regular user with email/password
2. Verify redirect

**Expected Result:**
- Redirected to `/game/lineup`
- No change in behaviour

### TS-6: [Maps to AC-10] - Admin Registration Prevention
**Steps:**
1. Attempt to register with username `supersaiyan`
2. Verify rejection

**Expected Result:**
- Registration rejected
- Error message displayed

```typescript
describe('POST /api/v1/auth/register', () => {
  it('rejects admin username registration', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'supersaiyan@example.com', password: 'password123' })
      .expect(400);
    
    expect(response.body.success).toBe(false);
  });
});
```

---

## Technical Notes

### API Design

```
POST /api/v1/auth/login
  Request: { email: string } // Can be email OR username for admin
  Request: { password: string }
  Response (success): 200 {
    success: true,
    data: {
      token: string,
      user: { id, email?, username?, role, created_at }
    }
  }

GET /api/v1/admin
  Authorization: Bearer {JWT with admin role}
  Response (success): 200 { success: true, data: { message: 'Admin dashboard' } }
  Response (forbidden): 403 { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } }
  Response (unauthorized): 401 { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }
```

### Data Model Changes

```sql
-- Migration: Add role and username columns to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE;

-- Index for username lookups
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;
```

**Updated Users Table Schema:**

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| username | VARCHAR(50) | UNIQUE, NULL (only for admin) |
| role | VARCHAR(20) | DEFAULT 'user', CHECK ('user', 'admin') |
| newsletter_optin | BOOLEAN | DEFAULT false |
| newsletter_consent_timestamp | TIMESTAMP | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Validation Schemas

```typescript
import { z } from 'zod';

// Extended login schema to support username OR email
const LoginSchema = z.object({
  email: z.string().refine(
    (val) => val.includes('@') ? z.string().email().safeParse(val).success : val.length >= 3,
    { message: 'Invalid email or username format' }
  ),
  password: z.string().min(8),
});

// Admin check - reserved usernames
const RESERVED_USERNAMES = ['supersaiyan', 'admin', 'administrator', 'root'];

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).refine(
  (data) => !RESERVED_USERNAMES.some(u => data.email.toLowerCase().includes(u)),
  { message: 'This email cannot be used for registration' }
);
```

### Admin Seed Script

```typescript
// backend/src/seed.ts (update existing)
import bcrypt from 'bcrypt';
import { query } from './config/database';

const ADMIN_USERNAME = 'supersaiyan';
const ADMIN_PASSWORD = 'wh4t15myd35t1ny!';
const SALT_ROUNDS = 10;

export async function seedAdminAccount(): Promise<void> {
  // Check if admin already exists
  const existing = await query(
    'SELECT id FROM users WHERE username = $1',
    [ADMIN_USERNAME]
  );
  
  if (existing.rows.length > 0) {
    console.log('Admin account already exists, skipping seed');
    return;
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  
  // Create admin account (no email required for admin)
  await query(
    `INSERT INTO users (username, email, password_hash, role) 
     VALUES ($1, $2, $3, 'admin')`,
    [ADMIN_USERNAME, `${ADMIN_USERNAME}@admin.legendsascend.local`, passwordHash]
  );
  
  console.log('Admin account created successfully');
}
```

### Frontend Admin Route Guard

```typescript
// frontend/src/components/AdminRouteGuard.tsx
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }
  
  return <>{children}</>;
}
```

### Backend Admin Middleware

```typescript
// backend/src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
    }
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
    });
  }
}
```

### Integration Points

- **Auth System:** Extends existing login to support username-based auth for admin
- **JWT Service:** Token includes role claim for frontend/backend verification
- **Database:** Migration adds role and username columns
- **Frontend Router:** New admin routes with protection

### Failure Modes & Resilience

- **Invalid Admin Credentials:** Standard login failure with rate limiting
- **Missing Admin Account:** Seed script creates on startup if missing
- **Database Migration Failure:** Rollback migration, admin features unavailable
- **Token Tampering:** Backend always verifies role from database, not just token

### Performance Targets

| Metric | Target |
|--------|--------|
| Admin login response | <500ms p95 |
| Admin dashboard load | <1 second |
| Route protection check | <50ms |

---

## Task Breakdown for AI Agents

### Phase 1: Database & Backend Setup
- [ ] Create database migration to add `role` and `username` columns to users table
- [ ] Update User model with role and username fields
- [ ] Update seed script to create admin account
- [ ] Update authService to support username-based login
- [ ] Update JWT token generation to include role
- [ ] Create admin middleware for route protection
- [ ] Create admin routes (GET /api/v1/admin)

### Phase 2: Frontend Implementation
- [ ] Update AuthContext and User type to include role
- [ ] Update LoginPage to support username input
- [ ] Create AdminDashboard page (empty placeholder with branding)
- [ ] Create AdminRouteGuard component
- [ ] Update App.tsx routing to include admin routes
- [ ] Update login redirect logic (admin → /admin, user → /game/lineup)

### Phase 3: Testing
- [ ] Unit tests for admin middleware
- [ ] Integration tests for admin login flow
- [ ] Integration tests for route protection
- [ ] Frontend tests for AdminRouteGuard
- [ ] E2E test for admin login and access

### Phase 4: Documentation & Verification
- [ ] Update AUTHENTICATION.md with admin account details
- [ ] Verify branding compliance on admin dashboard
- [ ] Verify accessibility compliance
- [ ] Manual testing of complete admin flow

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (administrator), goal (admin account and dashboard access), benefit (manage admin configurations)
- ✅ **Acceptance Criteria:** 10 testable, specific ACs covering account creation, authentication, dashboard access, and route protection
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md patterns (TypeScript, React, JWT, PostgreSQL)
- ✅ **Dependencies Identified:** US-045 (Authentication System) - completed
- ✅ **Story Points Estimated:** 5 points (moderate - extends existing auth, adds new routes and middleware)
- ✅ **Priority Assigned:** SHOULD (important for admin management but not blocking core game features)
- ✅ **Non-Functional Requirements:** Security, performance, accessibility defined
- ✅ **Branding Compliance:** Admin dashboard follows BRANDING_GUIDELINE.md
- ✅ **Accessibility:** WCAG 2.1 AA requirements specified
- ✅ **AI Agent Context:** Comprehensive technical notes, code examples, migration scripts provided

**Story Points:** 5  
**Priority:** SHOULD  
**Risk Level:** Low - Extends existing authentication system with well-defined patterns. Admin credentials are pre-defined. Uses established security practices (bcrypt, JWT).

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements the admin account and dashboard infrastructure (US-051), providing a dedicated admin user with secure access to admin-only areas of the application.
> 
> **Key Deliverables:**
> - Admin account creation with username `supersaiyan` via database seed
> - Extended login to support username-based authentication
> - Admin dashboard page at `/admin` (empty placeholder)
> - Backend middleware for admin route protection
> - Frontend route guard for admin-only routes
> - Database migration adding `role` and `username` columns
> 
> **Testing:** All 10 acceptance criteria verified with 6 test scenarios
> **DoR Compliance:** ✅ All requirements met
> **Security:** Bcrypt password hashing, JWT role claims, backend role verification

---

## Open Questions & Clarifications

### Resolved Assumptions:

**Q1: Should admin use email or username for login?**  
**A1 (Resolved):** Username (`supersaiyan`) for admin. The login form accepts either email or username in the email field.

**Q2: Where does the admin password get configured?**  
**A2 (Resolved):** Set in database seed script, not via environment variable. This ensures consistent deployment.

**Q3: What happens if someone tries to register with admin credentials?**  
**A3 (Resolved):** Registration is rejected. Reserved usernames are blocked.

**Q4: Is there a separate admin login page?**  
**A4 (Resolved):** No. Per requirements, the existing login page is used with a different post-login redirect.

### Outstanding Questions:

_No outstanding questions at this time. All requirements are well-defined based on the issue specification._

---

**End of User Story US-051**
