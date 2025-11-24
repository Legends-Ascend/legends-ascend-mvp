/**
 * Register Page Component
 * Following BRANDING_GUIDELINE.md and ACCESSIBILITY_REQUIREMENTS.md
 * Implements US-045 FR-2
 */

import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validation';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.8));
  z-index: 1;
`;

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
`;

const LogoImage = styled.img`
  height: 120px;
  width: auto;
  margin: 0 auto 30px;
  display: block;
  object-fit: contain;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  border: 2px solid #64748B;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: #1E3A8A;

  &:focus {
    outline: 2px solid #1E3A8A;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CheckboxLabel = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #0F172A;
  cursor: pointer;
  line-height: 1.5;

  a {
    color: #1E3A8A;
    text-decoration: underline;
    
    &:hover {
      color: #1e40af;
    }

    &:focus {
      outline: 2px solid #1E3A8A;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`;

export function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const result = registerSchema.safeParse({ email, password, confirmPassword, newsletterOptIn });
    if (!result.success) {
      const fieldErrors: { 
        email?: string; 
        password?: string; 
        confirmPassword?: string;
      } = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as 'email' | 'password' | 'confirmPassword';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, newsletterOptIn);
      // Redirect to dashboard after successful registration
      window.location.href = '/game/lineup';
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <BackgroundImage 
        src="/assets/backgrounds/stadium.jpg" 
        alt=""
        aria-hidden="true"
      />
      <BackgroundOverlay aria-hidden="true" />
      <Card>
        <LogoImage 
          src="/assets/branding/legends-ascend-logo-transparent.png" 
          alt="Legends Ascend logo"
        />
        <Title>Register</Title>
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

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage id="confirmPassword-error" role="alert">
                {errors.confirmPassword}
              </ErrorMessage>
            )}
          </FormGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="newsletterOptIn"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
              disabled={isSubmitting}
            />
            <CheckboxLabel htmlFor="newsletterOptIn">
              Sign me up for news and updates about Legends Ascend.{' '}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more about how we handle your data
              </a>
            </CheckboxLabel>
          </CheckboxGroup>

          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting && <LoadingSpinner />}
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </Form>

        <LinkText>
          Already have an account?{' '}
          <a href="/login" onClick={(e) => {
            e.preventDefault();
            window.location.href = '/login';
          }}>
            Log In
          </a>
        </LinkText>
      </Card>
    </Container>
  );
}
