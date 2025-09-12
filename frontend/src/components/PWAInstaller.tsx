import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallBanner = styled.div<{ theme: any }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const InstallContent = styled.div`
  flex: 1;
`;

const InstallTitle = styled.h3<{ theme: any }>`
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const InstallDescription = styled.p<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const InstallButton = styled.button<{ theme: any }>`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.theme.primaryHover || '#8b3a42'};
  }
`;

const CloseButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const InstallIcon = styled.div<{ theme: any }>`
  width: 48px;
  height: 48px;
  background: ${props => props.theme.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { isDarkMode } = useTheme();

  const theme = {
    cardBackground: isDarkMode ? '#2d3748' : 'white',
    border: isDarkMode ? '#4a5568' : '#e2e8f0',
    text: isDarkMode ? '#f7fafc' : '#2d3748',
    textSecondary: isDarkMode ? '#a0aec0' : '#718096',
    primary: '#722f37',
    primaryHover: '#8b3a42'
  };

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleCloseBanner = () => {
    setShowInstallBanner(false);
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or if user recently dismissed
  if (isInstalled || !showInstallBanner || !deferredPrompt) {
    return null;
  }

  // Check if user recently dismissed (within 24 hours)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const timeSinceDismissal = Date.now() - parseInt(dismissedTime);
    if (timeSinceDismissal < 24 * 60 * 60 * 1000) { // 24 hours
      return null;
    }
  }

  return (
    <InstallBanner theme={theme}>
      <InstallIcon theme={theme}>📱</InstallIcon>
      <InstallContent>
        <InstallTitle theme={theme}>Install Osmeña Colleges Chatbot</InstallTitle>
        <InstallDescription theme={theme}>
          Install this app on your device for quick access and offline functionality.
        </InstallDescription>
      </InstallContent>
      <InstallButton theme={theme} onClick={handleInstallClick}>
        Install
      </InstallButton>
      <CloseButton theme={theme} onClick={handleCloseBanner} aria-label="Close">
        ×
      </CloseButton>
    </InstallBanner>
  );
};

export default PWAInstaller;


