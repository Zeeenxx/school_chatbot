import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import loadable from '@loadable/component';

// Loading animation
const loadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  margin: 1rem auto;
  max-width: 800px;
`;

const LoadingSpinner = styled.div<{ theme: any }>`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.border};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: ${loadingAnimation} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.div<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
  text-align: center;
`;

// Lazy load the ChatBot component
const LazyChatBot = loadable(() => import('./ChatBot'), {
  fallback: (
    <LoadingContainer theme={{}}>
      <LoadingSpinner theme={{}} />
      <LoadingText theme={{}}>Loading chatbot...</LoadingText>
    </LoadingContainer>
  )
});

// Wrapper component with theme context
const LazyChatBotWrapper: React.FC = () => {
  return (
    <Suspense fallback={
      <LoadingContainer theme={{}}>
        <LoadingSpinner theme={{}} />
        <LoadingText theme={{}}>Initializing chatbot...</LoadingText>
      </LoadingContainer>
    }>
      <LazyChatBot />
    </Suspense>
  );
};

export default LazyChatBotWrapper;


