/**
 * Login Page Component
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-045 FR-1
 */

import { useState, useEffect, type FormEvent } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validation';

const REMEMBER_USERNAME_KEY = 'legends-ascend-remember-username';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1E3A8A 0%, #60A5FA 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1E3A8A;
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0F172A;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
`;

const Input = styled.input`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  padding: 12px 16px;
  border: 2px solid #E2E8F0;
  border-radius: 6px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #1E3A8A;
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
  }

  &:disabled {
    background-color: #F1F5F9;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 6px;
  role: alert;

  &::before {
    content: '⚠';
  }
`;

const Button = styled.button`
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 20px;
  background: #1E3A8A;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background: #1e40af;
  }

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border: 2px solid #E2E8F0;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #1E3A8A;

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }
`;

const CheckboxLabel = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #0F172A;
  cursor: pointer;
  user-select: none;
`;

const LinkText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #64748B;
  text-align: center;
  margin-top: 20px;

  a {
    color: #1E3A8A;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #1E3A8A;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #FFFFFF;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUsername, setRememberUsername] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load remembered username on component mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY);
    if (rememberedUsername) {
      setEmail(rememberedUsername);
      setRememberUsername(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as 'email' | 'password';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle remember username preference
      if (rememberUsername) {
        localStorage.setItem(REMEMBER_USERNAME_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_USERNAME_KEY);
      }

      await login(email, password);
      // Redirect to dashboard after successful login
      window.location.href = '/game/lineup';
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>⚽ Legends Ascend</Logo>
        <Title>Log In</Title>
        <Form onSubmit={handleSubmit}>
          {errors.form && (
            <ErrorMessage role="alert" aria-live="polite">
              {errors.form}
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <ErrorMessage id="email-error" role="alert">
                {errors.email}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <ErrorMessage id="password-error" role="alert">
                {errors.password}
              </ErrorMessage>
            )}
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="remember-username"
              checked={rememberUsername}
              onChange={(e) => setRememberUsername(e.target.checked)}
              disabled={isSubmitting}
            />
            <CheckboxLabel htmlFor="remember-username">
              Remember username
            </CheckboxLabel>
          </CheckboxContainer>

          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting && <LoadingSpinner />}
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </Form>

        <LinkText>
          Don't have an account?{' '}
          <a href="/register" onClick={(e) => {
            e.preventDefault();
            window.location.href = '/register';
          }}>
            Register
          </a>
        </LinkText>
      </Card>
    </Container>
  );
}
