import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';

interface LoginFormProps {
  onLogin: (user: any) => void;
  onSwitchToRegister: () => void;
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

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.login(formData);

      // Store token and user data
      apiService.setToken(result.token);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));

      setSuccess('Login successful! Redirecting...');
      
      // Delay redirect to show success message
      setTimeout(() => {
        onLogin(result.user);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer theme={theme}>
      <FormTitle theme={theme}>Login to Osmeña Colleges</FormTitle>
      
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
            placeholder="Enter your username"
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
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </FormGroup>
        
        <Button theme={theme} type="submit" disabled={loading}>
          {loading && <LoadingSpinner />}
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <SwitchText theme={theme}>
        Don't have an account?{' '}
        <SwitchLink theme={theme} onClick={onSwitchToRegister}>
          Register here
        </SwitchLink>
      </SwitchText>
    </FormContainer>
  );
};

export default LoginForm;
