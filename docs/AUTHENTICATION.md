# Authentication Implementation

This document describes the authentication system implementation for Legends Ascend MVP.

## Overview

The authentication system provides user registration, login, and session management using JWT tokens and bcrypt password hashing.

## Endpoints

### POST /api/v1/auth/register
Register a new user account.

**Rate Limit:** 3 requests per IP per hour

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Validation:**
- Email: Must be valid email format (RFC 5322)
- Password: Minimum 8 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation error (invalid email or password format)
- 409: Email already in use
- 429: Rate limit exceeded
- 500: Internal server error

### POST /api/v1/auth/login
Login with email and password.

**Rate Limit:** 5 requests per IP per 15 minutes (only failed attempts count)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials
- 429: Rate limit exceeded (too many failed login attempts)
- 500: Internal server error

### GET /api/v1/auth/me
Get current user information from JWT token.

**Rate Limit:** 100 requests per IP per 15 minutes

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 401: Missing, invalid, or expired token
- 429: Rate limit exceeded
- 500: Internal server error

## Security Features

### Password Hashing
- Uses bcrypt with 10 salt rounds
- Passwords are never stored in plain text
- One-way hashing prevents password recovery

### JWT Tokens
- 7-day expiration time
- Includes user ID and email in payload
- Signed with HS256 algorithm
- Secret key must be set via JWT_SECRET environment variable

### Rate Limiting
Protection against brute force attacks:
- Registration: 3 attempts per IP per hour
- Login: 5 failed attempts per IP per 15 minutes
- Token verification: 100 requests per IP per 15 minutes

### Environment Variables

**Required:**
- `JWT_SECRET` - Secret key for signing JWT tokens
  - Must be set for the application to start
  - Generate with: `openssl rand -base64 32`
  - Keep secret and rotate regularly

**Optional:**
- `NODE_ENV` - Set to 'production' in production, 'test' for tests

## Database Schema

The users table includes:
- `id` (UUID, primary key)
- `email` (VARCHAR(255), unique, not null)
- `password_hash` (VARCHAR(255), not null)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Frontend Integration

The frontend should:

1. **Store the token** in localStorage after successful login/registration:
```typescript
localStorage.setItem('authToken', response.data.token);
```

2. **Include the token** in requests to protected endpoints:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

3. **Handle token expiration** by catching 401 errors and redirecting to login

4. **Clear the token** on logout:
```typescript
localStorage.removeItem('authToken');
```

## Testing

The auth system includes comprehensive tests covering:
- Successful registration and login flows
- Input validation
- Error handling
- Rate limiting
- CORS support
- Token verification

Run tests with:
```bash
cd backend
pnpm run test -- authRoutes.test.ts
```

## Deployment

### Vercel Environment Variables

Set in Vercel Project Settings > Environment Variables:
- `JWT_SECRET` - Generate a secure random string (required)
- `LA_POSTGRES_URL` - PostgreSQL connection string (required)

### Local Development

1. Copy `.env.example` to `.env`
2. Set `JWT_SECRET` to any value for local testing
3. Configure database connection string

## Future Enhancements

Potential improvements (out of scope for this PR):
- Password reset flow
- Email verification
- OAuth/social login
- Two-factor authentication
- Refresh token mechanism
- Session timeout warnings
- Account deletion
- Password strength requirements
