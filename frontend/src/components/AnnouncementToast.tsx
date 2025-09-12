import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const ToastWrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.cardBackground} 80%, ${theme.primary} 150%)`};
  color: ${({ theme }) => theme.text};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border-left: 5px solid ${({ theme }) => theme.primary};
  z-index: 9999;
  max-width: 380px;
  width: calc(100% - 40px);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: ${({ isVisible }) =>
    isVisible
      ? css`${slideIn} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`
      : css`${slideOut} 0.5s ease-out both`};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: ${({ theme }) => theme.primary};
    animation: ${progress} 10s linear forwards;
  }
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
`;

const ToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ToastTitle = styled.h4`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 1rem;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const ToastContent = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

interface AnnouncementToastProps {
  title: string;
  content: string;
  onClose: () => void;
}

const AnnouncementToast: React.FC<AnnouncementToastProps> = ({ title, content, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Wait for fade-out animation to finish
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, 10000); // Auto-dismiss after 10 seconds
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <ToastWrapper isVisible={isVisible}>
      <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </IconWrapper>
      <ContentWrapper>
        <ToastHeader>
          <ToastTitle>{title}</ToastTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ToastHeader>
        <ToastContent>{content}</ToastContent>
      </ContentWrapper>
    </ToastWrapper>
  );
};

export default AnnouncementToast;
