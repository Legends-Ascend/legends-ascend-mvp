# Frontend Authentication & User Session Management

**ID:** US-045  
**Story Points:** 8  
**Priority:** MUST  
**Epic/Feature:** Authentication  
**Dependencies:** Backend user endpoints (users table exists), US-044 (Backend Player Data Model & API)

---

## User Story

As a **football manager**,  
I want **to securely log in to my account and have my session maintained across page interactions**,  
So that **I can access my personalised squad, player roster, and game features without repeatedly authenticating**.

---

## Context

### Summary
This story implements the foundational frontend authentication system for Legends Ascend, including login/registration pages with validation, session state management, protected routes, and logout functionality. This is a P0 critical story that must be completed before any user-facing features can be used, as it establishes user identity and data isolation necessary for all personalised game features.

### Scope

**In Scope:**
- Login page with email/password form validation
- Registration page with email/password form validation and confirmation
- Session state management using React Context API
- Protected route implementation that enforces authentication requirements
- Logout functionality with session cleanup
- User context available throughout the application via React Context
- Environment-variable-based landing page routing protection (respecting `VITE_LANDING_PAGE_ENABLED`)
- Client-side form validation (email format, password strength, required fields)
- Error message display for authentication failures
- Loading states during authentication operations
- Persistent session support (localStorage for auth token)
- Integration with existing backend user endpoints
- WCAG 2.1 AA compliant authentication forms
- Brand-compliant UI using approved colours and typography

**Out of Scope:**
- Backend authentication endpoints (assumed to exist or be simple stubs)
- OAuth/social login providers (Google, Facebook, etc.)
- Two-factor authentication (2FA)
- Password reset/forgot password functionality (separate story)
- Email verification workflow (separate story)
- Session timeout/refresh token logic (separate story)
- User profile management (separate story)
- Account deletion functionality (separate story)
- Multi-device session management (separate story)
- JWT token refresh mechanism (basic implementation only)

### Assumptions
- Backend has a `users` table with `id`, `email`, `password_hash`, `created_at`, `updated_at` fields
- Backend provides `/api/v1/auth/login` and `/api/v1/auth/register` endpoints (or stubs)
- Backend returns a JWT token or session identifier upon successful authentication
- User passwords are hashed on the backend (bcrypt or similar)
- Authentication tokens are stored in localStorage (not sessionStorage or cookies initially)
- The `VITE_LANDING_PAGE_ENABLED` environment variable controls landing page enforcement
- Users without authentication cannot access protected routes when landing page is enabled
- The existing `RouteGuard` component is leveraged for route protection
- UK English terminology used throughout (e.g., "Authorisation" not "Authorization" in UI copy where appropriate)
- All API calls use the `VITE_API_URL` environment variable for base URL
- Frontend runs on Vite with React 18+ and TypeScript strict mode

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md - All DoR requirements satisfied
- ✅ TECHNICAL_ARCHITECTURE.md - React 18+, TypeScript strict mode, pnpm, REST API patterns
- ✅ BRANDING_GUIDELINE.md - UI uses approved brand colours, typography, and logo guidelines
- ✅ ACCESSIBILITY_REQUIREMENTS.md - WCAG 2.1 AA compliance for forms, keyboard navigation, screen readers
- ✅ AI_PROMPT_ENGINEERING.md - Sufficient context for AI agents to implement autonomously

---

## Functional Requirements

- **[FR-1]** **Login Page:**
  - Display a login form with email and password input fields
  - Include a "Login" submit button and a "Don't have an account? Register" link
  - Client-side validation: email format (RFC 5322), password minimum length (8 characters)
  - On submission, call backend `/api/v1/auth/login` with credentials
  - On success: store auth token in localStorage, update auth context, redirect to `/game` (or dashboard)
  - On failure: display error message without exposing sensitive details (e.g., "Invalid credentials")
  - Show loading state during authentication request (disabled form, spinner/indicator)

- **[FR-2]** **Registration Page:**
  - Display a registration form with email, password, and password confirmation fields
  - Include "Register" submit button and "Already have an account? Login" link
  - Client-side validation:
    - Email format (RFC 5322)
    - Password minimum 8 characters, must include at least one uppercase letter, one lowercase letter, one number
    - Password and confirmation fields must match
  - On submission, call backend `/api/v1/auth/register` with user details
  - On success: store auth token in localStorage, update auth context, redirect to `/game` (or dashboard)
  - On failure: display specific error message (e.g., "Email already in use", "Invalid email format")
  - Show loading state during registration request

- **[FR-3]** **Session State Management:**
  - Implement `AuthContext` using React Context API
  - Context provides: `user` (user object with id, email), `isAuthenticated` (boolean), `login()`, `register()`, `logout()`, `loading` (boolean)
  - On app initialisation, check localStorage for existing auth token
  - If token exists, validate with backend (optional: call `/api/v1/auth/me` to fetch user data)
  - If token is invalid/expired, clear localStorage and set `isAuthenticated` to false
  - Persist `isAuthenticated` state across page refreshes via localStorage

- **[FR-4]** **Protected Routes:**
  - Leverage existing `RouteGuard` component to enforce authentication
  - When `VITE_LANDING_PAGE_ENABLED` is `true`:
    - Unauthenticated users accessing protected routes (e.g., `/game`, `/players`, `/lineup`) are redirected to landing page
    - Authenticated users can access all routes
  - When `VITE_LANDING_PAGE_ENABLED` is `false`:
    - All routes accessible without enforcement (dev/testing mode)
  - Protected routes include: `/game`, `/players`, `/lineup`, `/simulator`, `/leaderboard`
  - Exempt routes (always accessible): `/`, `/privacy-policy`, `/login`, `/register`

- **[FR-5]** **Logout Functionality:**
  - Provide a "Logout" button in the application header/navigation
  - On logout:
    - Clear auth token from localStorage
    - Clear user data from AuthContext
    - Set `isAuthenticated` to false
    - Redirect user to landing page or login page
  - Optional: Call backend `/api/v1/auth/logout` to invalidate session server-side

- **[FR-6]** **User Context Availability:**
  - `AuthContext` is available throughout the component tree via `useAuth()` custom hook
  - Components can access `user`, `isAuthenticated`, `login()`, `register()`, `logout()`, `loading` states
  - User data includes at minimum: `id` (UUID), `email` (string), `created_at` (timestamp)

- **[FR-7]** **Error Handling:**
  - Network errors: Display user-friendly message ("Unable to connect. Please check your internet connection.")
  - 401 Unauthorized: Display "Invalid credentials" for login, "Authentication required" for protected routes
  - 409 Conflict: Display "Email already in use" for registration
  - 500 Server Error: Display "Something went wrong. Please try again later."
  - Validation errors: Display field-specific error messages below input fields

- **[FR-8]** **Form Validation:**
  - Email validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (basic RFC 5322)
  - Password strength:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
  - Display validation errors inline below input fields with red text and error icon
  - Disable submit button until all fields are valid
  - Validation occurs on blur and on submit

---

## Non-Functional Requirements

### Performance
- Login/registration API calls: <500ms p95 (backend responsibility, but frontend should handle gracefully)
- Form validation: <50ms (synchronous, no network calls)
- AuthContext provider render overhead: negligible (use React.memo and useMemo where appropriate)
- Page load with auth check: <1s p95 (includes token validation if backend call required)
- localStorage read/write operations: <10ms

### Security
- **Authentication:** 
  - Store JWT tokens in localStorage (XSS risk acknowledged; consider httpOnly cookies in future iteration)
  - Never log or expose auth tokens in console or error messages
  - Clear tokens on logout and when invalid
- **Authorization:**
  - All protected API calls include `Authorization: Bearer <token>` header
  - Backend validates token on every request
- **Input Validation:**
  - Client-side validation for UX only; backend must re-validate all inputs
  - Sanitise user inputs to prevent XSS (React handles this by default for text content)
  - Use controlled components to prevent unexpected input mutations
- **Error Messages:**
  - Do not expose sensitive information in error messages (e.g., "User exists" vs "Invalid credentials")
  - Log detailed errors to console for debugging (dev mode only)

### Accessibility
- **WCAG 2.1 AA Compliance:**
  - All form inputs have associated `<label>` elements with `htmlFor` attribute
  - Error messages announced to screen readers via `aria-live="polite"` regions
  - Focus indicators visible on all interactive elements (2px solid outline, 2px offset)
  - Keyboard navigation: Tab order follows visual layout, Enter submits forms
  - Form validation errors associated with inputs via `aria-describedby`
- **Keyboard Navigation:**
  - Tab: Navigate between fields
  - Enter: Submit form
  - Escape: Clear error messages (optional enhancement)
- **Screen Reader Compatibility:**
  - Login/Registration pages use semantic HTML (`<form>`, `<input>`, `<button>`)
  - ARIA labels for loading states: `aria-busy="true"` during API calls
  - ARIA role="alert" for error messages
- **Color Contrast:**
  - Error text: Minimum 4.5:1 contrast ratio against background
  - Input borders: Minimum 3:1 contrast ratio
  - Focus indicators: Minimum 3:1 contrast ratio against adjacent colours

### Branding
- **UI Components:**
  - Use Primary Blue (`#1E3A8A`) for login/register buttons
  - Use Error Red (`#EF4444`) for validation error messages
  - Use Medium Gray (`#64748B`) for secondary text (e.g., "Don't have an account?")
  - Typography: Inter or Poppins (Semi-Bold 600 for headings, Regular 400 for body)
- **Logo:**
  - Display Legends Ascend logo at top of login/registration pages
  - Use full-colour logo on light background
  - Maintain 20px clear space around logo
- **Form Design:**
  - Input fields: 16px body text, 1.5 line height, rounded corners (6px)
  - Buttons: 16px Semi-Bold text, 10px 20px padding, 6px border radius
  - Spacing: 20px between form fields, 10px between label and input

### Internationalization
- **UK English:**
  - Use "Email" not "E-mail"
  - Use "Password" (consistent capitalisation)
  - Use "Log in" (two words as verb), "Login" (one word as noun/adjective)
  - Use "Register" not "Sign up" (consistency with terminology)
- **Date/Time:**
  - Display user `created_at` timestamps in DD/MM/YYYY format if shown in UI
- **Externalisation:**
  - All UI strings should be defined in a constants file for future i18n support

### Observability
- **Logging:**
  - Log authentication events: login success, login failure, registration success, logout
  - Log API errors with request ID, status code, error message
  - Use structured logging format: `{ timestamp, level, event, user_id, message, metadata }`
  - Console logs in development mode; integration with logging service in production (future)
- **Metrics:**
  - Track login success/failure rates (future: integrate with analytics)
  - Track registration conversion rates
  - Track page load time for login/registration pages
- **Error Tracking:**
  - Catch and log unhandled promise rejections in auth flows
  - Display user-friendly error messages while logging detailed errors to console

---

## Acceptance Criteria

### AC-1: User Can Successfully Log In
**Given** a user with a registered account (email: `manager@legends.com`, password: `SecurePass123`)  
**When** the user navigates to `/login`, enters valid credentials, and clicks "Login"  
**Then** 
- The user is redirected to `/game` or dashboard
- The user's email is displayed in the application header
- The auth token is stored in localStorage
- The `AuthContext` reflects `isAuthenticated: true` and `user: { id, email }`

### AC-2: Login Form Validates User Input
**Given** a user on the `/login` page  
**When** the user enters an invalid email format (e.g., `notanemail`) and clicks "Login"  
**Then** 
- An error message "Please enter a valid email address" is displayed below the email field
- The form is not submitted
- The submit button remains enabled (or disabled until valid)

**When** the user enters a valid email but incorrect password  
**Then**
- The backend returns 401 Unauthorized
- An error message "Invalid credentials" is displayed
- The password field is cleared
- The user remains on the login page

### AC-3: User Can Successfully Register
**Given** a new user on the `/register` page  
**When** the user enters valid details (email: `newmanager@legends.com`, password: `NewPass123`, confirm password: `NewPass123`) and clicks "Register"  
**Then**
- The backend creates a new user account
- The user is logged in automatically
- The auth token is stored in localStorage
- The user is redirected to `/game` or onboarding flow
- The `AuthContext` reflects `isAuthenticated: true`

### AC-4: Registration Form Validates Password Strength
**Given** a user on the `/register` page  
**When** the user enters a weak password (e.g., `pass`) and clicks "Register"  
**Then**
- An error message "Password must be at least 8 characters and include uppercase, lowercase, and number" is displayed
- The form is not submitted

**When** the user enters mismatched passwords (password: `SecurePass123`, confirm: `SecurePass124`)  
**Then**
- An error message "Passwords do not match" is displayed below the confirm password field
- The form is not submitted

### AC-5: Protected Routes Redirect Unauthenticated Users (Landing Page Enabled)
**Given** `VITE_LANDING_PAGE_ENABLED` is set to `true` and the user is not authenticated  
**When** the user attempts to navigate to `/game` or any protected route  
**Then**
- The user is redirected to the landing page (`/`)
- A message "Please log in to access this feature" is displayed (optional)
- The requested route is not rendered

**Given** the user is authenticated  
**When** the user navigates to `/game` or any protected route  
**Then**
- The route is rendered successfully
- The user remains on the requested page

### AC-6: Protected Routes Are Accessible (Landing Page Disabled)
**Given** `VITE_LANDING_PAGE_ENABLED` is set to `false`  
**When** the user (authenticated or not) navigates to `/game` or any protected route  
**Then**
- The route is rendered successfully
- No redirect occurs

### AC-7: User Can Log Out Successfully
**Given** an authenticated user on any page  
**When** the user clicks the "Logout" button  
**Then**
- The auth token is removed from localStorage
- The `AuthContext` reflects `isAuthenticated: false` and `user: null`
- The user is redirected to the landing page or login page
- Attempting to access protected routes now redirects to landing page (if enabled)

### AC-8: Session Persists Across Page Refreshes
**Given** a user is logged in and the auth token is stored in localStorage  
**When** the user refreshes the page (F5 or Ctrl+R)  
**Then**
- The user remains authenticated
- The `AuthContext` is re-initialised with user data from localStorage or backend validation
- The user does not need to log in again

### AC-9: Accessibility - Keyboard Navigation Works
**Given** a user on the `/login` page  
**When** the user navigates using only the keyboard (Tab, Enter)  
**Then**
- The user can tab through email input, password input, and submit button in logical order
- Pressing Enter in any field submits the form
- Focus indicators are visible on all interactive elements
- Screen readers announce form labels, error messages, and loading states

### AC-10: Branding Compliance
**Given** the login and registration pages are rendered  
**When** a user views the pages  
**Then**
- The Legends Ascend logo is displayed at the top with proper spacing
- Button colours match Primary Blue (`#1E3A8A`)
- Error messages use Error Red (`#EF4444`)
- Typography uses Inter or Poppins font family
- All colour contrast ratios meet WCAG 2.1 AA standards (4.5:1 for text, 3:1 for UI components)

---

## Test Scenarios

### TS-1: [Maps to AC-1] - Happy Path Login
**Steps:**
1. Navigate to `/login`
2. Enter email: `manager@legends.com`
3. Enter password: `SecurePass123`
4. Click "Login" button
5. Wait for API response

**Expected Result:** 
- User is redirected to `/game`
- User email is displayed in header
- localStorage contains auth token
- `AuthContext.isAuthenticated` is `true`

**Code Example (Jest + React Testing Library):**
```typescript
test('user can log in successfully', async () => {
  render(<App />);
  
  // Navigate to login
  const loginLink = screen.getByText(/log in/i);
  fireEvent.click(loginLink);
  
  // Enter credentials
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(emailInput, { target: { value: 'manager@legends.com' } });
  fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
  
  // Submit form
  const submitButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(submitButton);
  
  // Wait for redirect
  await waitFor(() => {
    expect(window.location.pathname).toBe('/game');
  });
  
  // Verify user is authenticated
  expect(localStorage.getItem('authToken')).toBeTruthy();
  expect(screen.getByText(/manager@legends.com/i)).toBeInTheDocument();
});
```

### TS-2: [Maps to AC-2] - Email Validation Error
**Steps:**
1. Navigate to `/login`
2. Enter email: `notanemail`
3. Enter password: `SecurePass123`
4. Click "Login" button

**Expected Result:**
- Error message "Please enter a valid email address" appears below email field
- Form is not submitted (no API call)
- User remains on login page

**Code Example:**
```typescript
test('displays error for invalid email format', async () => {
  render(<LoginPage />);
  
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /login/i });
  
  fireEvent.change(emailInput, { target: { value: 'notanemail' } });
  fireEvent.click(submitButton);
  
  const errorMessage = await screen.findByText(/please enter a valid email address/i);
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveAttribute('role', 'alert');
});
```

### TS-3: [Maps to AC-3] - Successful Registration
**Steps:**
1. Navigate to `/register`
2. Enter email: `newmanager@legends.com`
3. Enter password: `NewPass123`
4. Enter confirm password: `NewPass123`
5. Click "Register" button

**Expected Result:**
- Backend creates user account
- User is logged in automatically
- User is redirected to `/game`
- localStorage contains auth token

### TS-4: [Maps to AC-4] - Password Strength Validation
**Steps:**
1. Navigate to `/register`
2. Enter email: `newmanager@legends.com`
3. Enter password: `weak`
4. Enter confirm password: `weak`
5. Click "Register" button

**Expected Result:**
- Error message "Password must be at least 8 characters and include uppercase, lowercase, and number" appears
- Form is not submitted

### TS-5: [Maps to AC-5] - Protected Route Redirect (Landing Page Enabled)
**Steps:**
1. Set `VITE_LANDING_PAGE_ENABLED=true` in `.env`
2. Clear localStorage (log out)
3. Navigate directly to `/game`

**Expected Result:**
- User is redirected to `/` (landing page)
- `/game` content is not rendered

**Code Example:**
```typescript
test('redirects unauthenticated user from protected route', () => {
  // Mock environment variable
  process.env.VITE_LANDING_PAGE_ENABLED = 'true';
  
  // Clear auth
  localStorage.clear();
  
  render(<App />);
  
  // Try to navigate to protected route
  window.history.pushState({}, '', '/game');
  
  // Should redirect to landing
  expect(window.location.pathname).toBe('/');
});
```

### TS-6: [Maps to AC-7] - Logout Flow
**Steps:**
1. Log in as authenticated user
2. Verify user is on `/game` page
3. Click "Logout" button in header

**Expected Result:**
- localStorage auth token is removed
- User is redirected to `/` or `/login`
- Attempting to access `/game` now redirects to landing page

### TS-7: [Maps to AC-8] - Session Persistence
**Steps:**
1. Log in successfully
2. Verify user is on `/game`
3. Refresh the page (F5)

**Expected Result:**
- User remains authenticated
- User stays on `/game` page
- User data is still available in `AuthContext`

### TS-8: [Maps to AC-9] - Keyboard Navigation
**Manual Test:**
1. Navigate to `/login`
2. Press Tab to move focus to email field
3. Enter email, press Tab to move to password field
4. Enter password, press Tab to move to submit button
5. Press Enter to submit form

**Expected Result:**
- Focus moves in logical order: email → password → submit button
- Focus indicators are visible on each element
- Form submits when Enter is pressed in any field or on submit button

### TS-9: [Maps to AC-10] - Branding Compliance Audit
**Manual Test:**
1. Render login and registration pages
2. Inspect UI elements with browser DevTools

**Expected Result:**
- Logo displayed with 20px clear space
- Button background: `#1E3A8A`
- Error text: `#EF4444`
- Typography: Inter or Poppins
- Color contrast ratios: ≥4.5:1 for text, ≥3:1 for UI components

---

## Technical Notes

### API Design

**Base URL:** `${VITE_API_URL}` (e.g., `http://localhost:3000/api`)

#### POST /api/v1/auth/login
**Description:** Authenticates a user and returns an auth token.

**Request:**
```json
{
  "email": "manager@legends.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "manager@legends.com",
      "created_at": "2025-11-15T10:30:00Z"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

#### POST /api/v1/auth/register
**Description:** Registers a new user and returns an auth token.

**Request:**
```json
{
  "email": "newmanager@legends.com",
  "password": "NewPass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "newmanager@legends.com",
      "created_at": "2025-11-18T13:24:00Z"
    }
  }
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_IN_USE",
    "message": "Email already registered"
  }
}
```

#### GET /api/v1/auth/me (Optional)
**Description:** Returns the current authenticated user's details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "manager@legends.com",
      "created_at": "2025-11-15T10:30:00Z"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Data Model

**Frontend Auth State (AuthContext):**
```typescript
interface User {
  id: string;          // UUID
  email: string;       // RFC 5322 email
  created_at: string;  // ISO 8601 timestamp
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**localStorage Schema:**
```typescript
// Key: 'authToken'
// Value: JWT token string
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Key: 'user' (optional, for faster initialisation)
// Value: JSON stringified user object
localStorage.setItem('user', JSON.stringify({
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  email: 'manager@legends.com',
  created_at: '2025-11-15T10:30:00Z'
}));
```

### Validation Schemas

**Zod Schemas (for form validation):**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### Migrations
- **Required:** No database migrations needed (assumes `users` table exists from US-044 or earlier)
- **Type:** N/A
- **Rollback Plan:** N/A

### Integration Points

**Existing Components:**
- **RouteGuard:** Leverage existing `RouteGuard.tsx` component for protected route enforcement
  - Update to use `AuthContext` instead of hardcoded `isAuthenticated={false}`
  - Ensure `VITE_LANDING_PAGE_ENABLED` env variable is respected

**Backend Integration:**
- **User Table:** Integrate with existing `users` table in PostgreSQL
- **Auth Middleware:** Backend `authenticate.ts` middleware validates tokens on protected endpoints
- **API Base URL:** Use `VITE_API_URL` environment variable for all API calls

**State Management:**
- **AuthContext Provider:** Wrap entire `<App />` component tree in `<AuthProvider>`
- **useAuth Hook:** Export custom hook for consuming auth context in components

### Failure Modes & Resilience

**Network Errors:**
- **Scenario:** API request fails due to network timeout or server unavailable
- **Handling:** Display user-friendly error message ("Unable to connect. Please try again.")
- **Retry:** User can retry by resubmitting form; no automatic retries

**Invalid Token:**
- **Scenario:** Stored token is expired or invalid when app initialises
- **Handling:** Clear localStorage, set `isAuthenticated: false`, redirect to landing page
- **Fallback:** User must log in again

**API 500 Errors:**
- **Scenario:** Backend returns 500 Internal Server Error
- **Handling:** Display generic error message ("Something went wrong. Please try again later.")
- **Logging:** Log full error details to console (dev mode only)

**Validation Errors:**
- **Scenario:** User submits form with invalid data
- **Handling:** Display field-specific error messages inline
- **Prevention:** Client-side validation prevents most invalid submissions

### Performance Targets
- Form validation: <50ms (synchronous)
- API request (login/register): <500ms p95 (network + backend)
- AuthContext initialisation: <100ms
- localStorage operations: <10ms
- Page load with auth check: <1s p95

### Component Structure

```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── LogoutButton.tsx
│   │   └── __tests__/
│   │       ├── LoginPage.test.tsx
│   │       ├── RegisterPage.test.tsx
│   │       └── LogoutButton.test.tsx
│   ├── RouteGuard.tsx (existing, update to use AuthContext)
│   └── ...
├── context/
│   ├── AuthContext.tsx
│   └── __tests__/
│       └── AuthContext.test.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   ├── authService.ts
│   └── __tests__/
│       └── authService.test.ts
├── types/
│   └── auth.ts
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts
└── App.tsx (wrap with AuthProvider)
```

### Key Files to Create/Update

**New Files:**
- `frontend/src/components/auth/LoginPage.tsx`
- `frontend/src/components/auth/RegisterPage.tsx`
- `frontend/src/components/auth/LogoutButton.tsx`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/services/authService.ts`
- `frontend/src/types/auth.ts`
- `frontend/src/utils/validation.ts`
- `frontend/src/components/auth/__tests__/LoginPage.test.tsx`
- `frontend/src/components/auth/__tests__/RegisterPage.test.tsx`
- `frontend/src/context/__tests__/AuthContext.test.tsx`
- `frontend/src/services/__tests__/authService.test.ts`
- `frontend/src/utils/__tests__/validation.test.ts`

**Update Files:**
- `frontend/src/App.tsx` (wrap with `<AuthProvider>`, update `RouteGuard` to use `AuthContext`)
- `frontend/src/components/RouteGuard.tsx` (integrate with `AuthContext`)
- `frontend/.env.example` (add `VITE_LANDING_PAGE_ENABLED` if not present)

---

## Task Breakdown for AI Agents

### Phase 1: Design & Setup
- [ ] Review all foundation documents (DEFINITION_OF_READY.md, TECHNICAL_ARCHITECTURE.md, BRANDING_GUIDELINE.md, ACCESSIBILITY_REQUIREMENTS.md)
- [ ] Create folder structure: `components/auth/`, `context/`, `hooks/`, `services/`, `types/`
- [ ] Define TypeScript interfaces for User, AuthContextValue, API responses
- [ ] Create Zod validation schemas for login and registration forms
- [ ] Update `.env.example` with `VITE_LANDING_PAGE_ENABLED` (if not present)

### Phase 2: Implementation (Coding Agent)
- [ ] **AuthContext & Hook:**
  - [ ] Implement `AuthContext.tsx` with Provider component
  - [ ] Create `useAuth.ts` custom hook
  - [ ] Add localStorage token management
  - [ ] Add initialisation logic to check for existing token on mount
- [ ] **Auth Service:**
  - [ ] Implement `authService.ts` with `login()`, `register()`, `getMe()` functions
  - [ ] Add error handling and response parsing
  - [ ] Include `Authorization: Bearer <token>` header for authenticated requests
- [ ] **Login Page:**
  - [ ] Create `LoginPage.tsx` with email/password form
  - [ ] Add form validation using Zod schema
  - [ ] Implement loading state and error handling
  - [ ] Add "Register" link for navigation
  - [ ] Ensure WCAG 2.1 AA compliance (labels, ARIA attributes, focus management)
- [ ] **Registration Page:**
  - [ ] Create `RegisterPage.tsx` with email/password/confirm password form
  - [ ] Add form validation using Zod schema
  - [ ] Implement loading state and error handling
  - [ ] Add "Login" link for navigation
  - [ ] Ensure WCAG 2.1 AA compliance
- [ ] **Logout Button:**
  - [ ] Create `LogoutButton.tsx` component
  - [ ] Integrate with AuthContext `logout()` function
  - [ ] Add to application header/navigation
- [ ] **RouteGuard Integration:**
  - [ ] Update `RouteGuard.tsx` to consume `AuthContext`
  - [ ] Replace hardcoded `isAuthenticated={false}` with context value
  - [ ] Verify `VITE_LANDING_PAGE_ENABLED` logic is respected
- [ ] **App Integration:**
  - [ ] Wrap `<App />` with `<AuthProvider>`
  - [ ] Add routes for `/login` and `/register`
  - [ ] Update navigation to include logout button for authenticated users
- [ ] **Styling:**
  - [ ] Apply brand colours (Primary Blue, Error Red, Medium Gray)
  - [ ] Use approved typography (Inter/Poppins)
  - [ ] Ensure responsive design (mobile-first)
  - [ ] Add focus indicators with 2px solid outline

### Phase 3: Testing (Testing Agent)
- [ ] **Unit Tests:**
  - [ ] `AuthContext.test.tsx`: Test login, register, logout, initialisation
  - [ ] `authService.test.ts`: Test API calls with mocked fetch responses
  - [ ] `validation.test.ts`: Test email and password validation logic
- [ ] **Integration Tests:**
  - [ ] `LoginPage.test.tsx`: Test form submission, validation, error handling
  - [ ] `RegisterPage.test.tsx`: Test form submission, password matching, error handling
  - [ ] `LogoutButton.test.tsx`: Test logout flow and context update
- [ ] **E2E Tests (Optional):**
  - [ ] Full login flow from landing page to `/game`
  - [ ] Full registration flow
  - [ ] Protected route redirect flow
- [ ] **Accessibility Tests:**
  - [ ] Run axe-core on login and registration pages
  - [ ] Test keyboard navigation manually
  - [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] **Branding Tests:**
  - [ ] Verify colour usage matches BRANDING_GUIDELINE.md
  - [ ] Verify typography matches guidelines
  - [ ] Check colour contrast ratios with WebAIM tool

### Phase 4: Documentation & Verification
- [ ] Update API documentation (if separate OpenAPI spec exists)
- [ ] Add inline JSDoc comments to AuthContext and service functions
- [ ] Create user-facing documentation for login/registration flow (if needed)
- [ ] Verify branding compliance with BRANDING_GUIDELINE.md
- [ ] Verify accessibility compliance with ACCESSIBILITY_REQUIREMENTS.md
- [ ] Update README.md with authentication setup instructions (if applicable)

### Phase 5: Deployment Readiness
- [ ] All tests passing (unit, integration, accessibility)
- [ ] Code review completed (automated + manual)
- [ ] Performance benchmarks met (<500ms login, <1s page load)
- [ ] Security review passed (token storage, error messages, input validation)
- [ ] Branding and accessibility audits completed
- [ ] Documentation updated

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (football manager), goal (secure login/session), benefit (personalised access)
- ✅ **Acceptance Criteria:** 10 testable ACs covering login, registration, validation, protected routes, logout, session persistence, keyboard navigation, branding
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md (React 18+, TypeScript strict mode, pnpm, Vite, REST API patterns)
- ✅ **Dependencies Identified:** Backend user endpoints, US-044 (users table exists)
- ✅ **Story Points Estimated:** 8 points (1-2 days, moderate complexity)
- ✅ **Priority Assigned:** MUST (P0 critical foundation)
- ✅ **Non-Functional Requirements:** Performance (<500ms API, <1s page load), Security (token storage, validation), Accessibility (WCAG 2.1 AA), Branding (colours, typography, logo)
- ✅ **Branding Compliance:** UI uses Primary Blue, Error Red, Inter/Poppins fonts, logo with clear space
- ✅ **Accessibility:** WCAG 2.1 AA (form labels, ARIA, keyboard navigation, focus indicators, screen reader support)
- ✅ **AI Agent Context:** Comprehensive technical details, API specs, validation schemas, component structure, test scenarios

**Story Points:** 8  
**Priority:** MUST  
**Risk Level:** Medium - Relies on backend auth endpoints (assumed to exist or be stubs); localStorage XSS risk acknowledged but acceptable for MVP; session refresh logic is basic (future enhancement needed)

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> This PR implements frontend authentication and user session management for Legends Ascend, including login/registration pages with form validation, session state management using React Context API, protected routes respecting the `VITE_LANDING_PAGE_ENABLED` environment variable, and logout functionality.
> 
> **Key Deliverables:**
> - Login and registration pages with client-side validation (email format, password strength)
> - AuthContext provider and useAuth hook for global authentication state
> - Protected route enforcement via updated RouteGuard component
> - Logout functionality with localStorage cleanup
> - WCAG 2.1 AA compliant forms (labels, ARIA, keyboard navigation, focus indicators)
> - Brand-compliant UI (Primary Blue buttons, Error Red validation messages, Inter/Poppins typography)
> 
> **Testing:** All 10 acceptance criteria verified with 9 test scenarios (unit, integration, accessibility)
> **DoR Compliance:** ✅ All requirements met per DEFINITION_OF_READY.md

---

## Open Questions & Clarifications

**Backend Endpoints:**
- [ ] Do `/api/v1/auth/login` and `/api/v1/auth/register` endpoints exist, or should stubs be created?
  - If stubs: Should they return mock data or integrate with the `users` table?
  - If integrated: Should passwords be hashed with bcrypt?

**Token Format:**
- [ ] Should the auth token be a JWT, or a simple session identifier?
  - If JWT: What claims should be included (user_id, email, exp)?
  - If session ID: Should backend maintain a sessions table?

**Password Reset:**
- [ ] Is password reset functionality in scope for this story, or a separate story?
  - Assumption: Separate story (out of scope for US-045)

**Email Verification:**
- [ ] Is email verification required upon registration?
  - Assumption: No (out of scope for US-045)

**Session Timeout:**
- [ ] Should sessions expire after a certain period of inactivity?
  - Assumption: Basic implementation only; advanced session timeout is a future enhancement

**Multi-Device Sessions:**
- [ ] Should users be allowed to log in from multiple devices simultaneously?
  - Assumption: Yes (no session management on backend initially)

---

**Note:** If any of the above questions are critical blockers, please clarify before implementation begins. Otherwise, the assumptions stated in the **Assumptions** section will be followed.
