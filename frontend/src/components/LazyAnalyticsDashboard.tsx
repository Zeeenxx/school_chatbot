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
  height: 300px;
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  margin: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

// Lazy load the AnalyticsDashboard component
const LazyAnalyticsDashboard = loadable(() => import('./AnalyticsDashboard'), {
  fallback: (
    <LoadingContainer theme={{}}>
      <LoadingSpinner theme={{}} />
      <LoadingText theme={{}}>Loading analytics...</LoadingText>
    </LoadingContainer>
  )
});

// Wrapper component with theme context
const LazyAnalyticsDashboardWrapper: React.FC = () => {
  return (
    <Suspense fallback={
      <LoadingContainer theme={{}}>
        <LoadingSpinner theme={{}} />
        <LoadingText theme={{}}>Initializing analytics...</LoadingText>
      </LoadingContainer>
    }>
      <LazyAnalyticsDashboard />
    </Suspense>
  );
};

export default LazyAnalyticsDashboardWrapper;


