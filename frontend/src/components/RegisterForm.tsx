import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';

interface RegisterFormProps {
  onRegister: (user: any) => void;
  onSwitchToLogin: () => void;
}

const FormContainer = styled.div<{ theme: any }>`
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.border};
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const FormTitle = styled.h2<{ theme: any }>`
  color: ${props => props.theme.text};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label<{ theme: any }>`
  display: block;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input<{ theme: any }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Button = styled.button<{ theme: any }>`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: ${props => props.theme.primaryHover || '#8b3a42'};
  }
  
  &:disabled {
    background: ${props => props.theme.textSecondary};
    cursor: not-allowed;
  }
`;

const SwitchText = styled.p<{ theme: any }>`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const SwitchLink = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  
  &:hover {
    color: ${props => props.theme.primaryHover || '#8b3a42'};
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fcc;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #363;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #cfc;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PasswordRequirements = styled.div<{ theme: any }>`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const RequirementItem = styled.div<{ isValid: boolean }>`
  color: ${props => props.isValid ? '#22c55e' : '#ef4444'};
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const { isDarkMode } = useTheme();

  const theme = {
    cardBackground: isDarkMode ? '#2d3748' : 'white',
    background: isDarkMode ? '#1a202c' : '#f7fafc',
    border: isDarkMode ? '#4a5568' : '#e2e8f0',
    text: isDarkMode ? '#f7fafc' : '#2d3748',
    textSecondary: isDarkMode ? '#a0aec0' : '#718096',
    primary: '#722f37',
    primaryHover: '#8b3a42'
  };

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate password in real-time
    if (name === 'password') {
      validatePassword(value);
    }
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = formData.username && formData.email && formData.password && 
                     formData.password === formData.confirmPassword && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccess('Registration successful!');
      
      // Call the onRegister callback
      onRegister(result.user);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer theme={theme}>
      <FormTitle theme={theme}>Register for Osmeña Colleges</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label theme={theme}>Username</Label>
          <Input
            theme={theme}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Choose a username"
            required
            disabled={loading}
          />
        </FormGroup>
        
        <FormGroup>
          <Label theme={theme}>Email</Label>
          <Input
            theme={theme}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </FormGroup>
        
        <FormGroup>
          <Label theme={theme}>Password</Label>
          <Input
            theme={theme}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a strong password"
            required
            disabled={loading}
          />
          {formData.password && (
            <PasswordRequirements theme={theme}>
              <RequirementItem isValid={passwordValidation.length}>
                • At least 8 characters
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.uppercase}>
                • One uppercase letter
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.lowercase}>
                • One lowercase letter
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.number}>
                • One number
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.special}>
                • One special character
              </RequirementItem>
            </PasswordRequirements>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label theme={theme}>Confirm Password</Label>
          <Input
            theme={theme}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <ErrorMessage>Passwords do not match</ErrorMessage>
          )}
        </FormGroup>
        
        <Button theme={theme} type="submit" disabled={loading || !isFormValid}>
          {loading && <LoadingSpinner />}
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </form>
      
      <SwitchText theme={theme}>
        Already have an account?{' '}
        <SwitchLink theme={theme} onClick={onSwitchToLogin}>
          Login here
        </SwitchLink>
      </SwitchText>
    </FormContainer>
  );
};

export default RegisterForm;
