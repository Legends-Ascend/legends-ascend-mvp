/**
 * Authentication type definitions
 * Following TECHNICAL_ARCHITECTURE.md - TypeScript strict mode
 */

export interface User {
  id: string;          // UUID
  email: string;       // RFC 5322 email
  created_at: string;  // ISO 8601 timestamp
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, newsletterOptIn?: boolean) => Promise<void>;
  logout: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  newsletterOptIn?: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
