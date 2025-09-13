import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeProvider, useTheme, themes } from './context/ThemeContext';
import DarkModeToggle from './components/DarkModeToggle';
import LazyChatBot from './components/LazyChatBot';
import LazyAnalyticsDashboard from './components/LazyAnalyticsDashboard';
import AccessibilitySettings from './components/AccessibilitySettings';
import PerformanceMonitor from './components/PerformanceMonitor';
import PWAInstaller from './components/PWAInstaller';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/AdminDashboard';
import CampusMap from './components/CampusMap';
import AnnouncementToast from './components/AnnouncementToast';
import { io } from 'socket.io-client';
import './App.css';
import './accessibility.css';

interface Announcement {
  title: string;
  content: string;
  created_at: string;
}

// Cover photo component that tries to load your school's cover image
const CoverPhoto: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const coverImages = [
    '/assets/osmena-colleges-cover.png',
    '/assets/osmena-colleges-cover.jpg',
    '/assets/school-cover.jpg', 
    '/assets/cover.jpg'
  ];

  const logoImages = [
    '/assets/osmena-colleges-logo.png',
    '/assets/school-logo.png',
    '/assets/logo.png'
  ];

  return (
    <CoverSection>
      <CoverImageContainer>
        {!imageError ? (
          <CoverImage
            src={coverImages[0]}
            alt="Osmeña Colleges Campus"
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultCoverBg />
        )}
        <CoverOverlay />
      </CoverImageContainer>
      
      <CoverContent>
        <LogoSection>
          {!logoError ? (
            <CoverLogo
              src={logoImages[0]}
              alt="Osmeña Colleges Logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <DefaultLogo>
              <svg width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#ffffff", stopOpacity:0.95}} />
                    <stop offset="100%" style={{stopColor:"#f8f9fa", stopOpacity:0.9}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#coverGrad)" stroke="#722f37" strokeWidth="8"/>
                <text x="100" y="85" textAnchor="middle" fill="#722f37" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">OC</text>
                <text x="100" y="125" textAnchor="middle" fill="#722f37" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="normal">COLLEGES</text>
              </svg>
            </DefaultLogo>
          )}
        </LogoSection>
        
        <TitleSection>
          <MainTitle>Osmeña Colleges</MainTitle>
          <CoverSubtitle>Excellence in Education Since 1948</CoverSubtitle>
          <Description>Your AI-powered assistant for courses, facilities, campus information and many more.</Description>
        </TitleSection>
      </CoverContent>
    </CoverSection>
  );
};

// App Content component that uses the theme
const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? themes.dark : themes.light;
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [currentView, setCurrentView] = useState<'home' | 'analytics' | 'accessibility' | 'login' | 'register' | 'admin' | 'map'>('home');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check for stored user session on initial load and handle view
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      // On initial load, if the user is an admin, default to the admin view
      if (userData.role === 'admin') {
        setCurrentView('admin');
      }
    } else {
      // If no user is stored, default to the login view
      setCurrentView('login');
    }
  }, []);

  // Listen for real-time announcements
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    socket.on('new_announcement', (newAnnouncement: Announcement) => {
      setAnnouncement(newAnnouncement);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleChat = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleLogin = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    // Navigate to the correct view based on user role
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  return (
    <AppContainer theme={currentTheme} isAdminView={currentView === 'admin'}>
    <SocialMediaWrapper>
        <SocialMediaLink 
          href="https://www.facebook.com/osmena.colleges" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Visit Osmeña Colleges Facebook Page"
          bgColor="#1877f2"
        >
          <SocialIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </SocialIcon>
        </SocialMediaLink>
        
        <SocialMediaLink 
          href="https://www.instagram.com/explore/locations/1528623860731422/osmena-colleges-osmena-st-masbate-city/" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Follow Osmeña Colleges on Instagram"
          bgColor="#E4405F"
        >
          <SocialIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </SocialIcon>
        </SocialMediaLink>
        
        <SocialMediaLink 
          href="https://www.tiktok.com/discover/osme%C3%B1a-college" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Follow Osmeña Colleges on TikTok"
          bgColor="#000000"
        >
          <SocialIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </SocialIcon>
        </SocialMediaLink>
      </SocialMediaWrapper>
      
      {/* Navigation Menu */}
      <NavigationMenu theme={currentTheme}>
        <NavButton 
          theme={currentTheme}
          active={currentView === 'home'}
          onClick={() => setCurrentView('home')}
        >
          Home
        </NavButton>
        <NavButton 
          theme={currentTheme}
          active={currentView === 'map'}
          onClick={() => setCurrentView('map')}
        >
          Map
        </NavButton>
        {!isAuthenticated ? (
          <>
            <NavButton 
              theme={currentTheme}
              active={currentView === 'login'}
              onClick={() => setCurrentView('login')}
            >
              Login
            </NavButton>
            <NavButton 
              theme={currentTheme}
              active={currentView === 'register'}
              onClick={() => setCurrentView('register')}
            >
              Register
            </NavButton>
          </>
        ) : (
          <>
            {['admin', 'staff'].includes(user?.role) && (
              <NavButton 
                theme={currentTheme}
                active={currentView === 'analytics'}
                onClick={() => setCurrentView('analytics')}
              >
                Analytics
              </NavButton>
            )}
            {user?.role === 'admin' && (
              <NavButton 
                theme={currentTheme}
                active={currentView === 'admin'}
                onClick={() => setCurrentView('admin')}
              >
                Admin
              </NavButton>
            )}
            <NavButton 
              theme={currentTheme}
              onClick={handleLogout}
            >
              Logout
            </NavButton>
          </>
        )}
        <NavButton 
          theme={currentTheme}
          active={currentView === 'accessibility'}
          onClick={() => setCurrentView('accessibility')}
        >
          Accessibility
        </NavButton>
        <DarkModeToggle />
      </NavigationMenu>
      
      {/* Conditional rendering for centered views */}
      {['login', 'register', 'accessibility'].includes(currentView) ? (
        <CenteredContainer>
          {currentView === 'login' && (
            <LoginForm 
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          )}
          
          {currentView === 'register' && (
            <RegisterForm 
              onRegister={handleLogin}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}
          
          {currentView === 'accessibility' && (
            <AccessibilitySettings />
          )}
        </CenteredContainer>
      ) : (
        <>
          {/* Render different views based on currentView */}
          {currentView === 'home' && <CoverPhoto />}
          
          {currentView === 'analytics' && isAuthenticated && (
            <LazyAnalyticsDashboard />
          )}
          
          {currentView === 'admin' && isAuthenticated && user?.role === 'admin' && (
            <AdminDashboard />
          )}
          
          {currentView === 'map' && (
            <CampusMap />
          )}
        </>
      )}
      
      {announcement && (
        <AnnouncementToast
          title={announcement.title}
          content={announcement.content}
          onClose={() => setAnnouncement(null)}
        />
      )}
      
      {isChatOpen && (
        <ChatOverlay onClick={toggleChat}>
          <ChatModalContainer onClick={(e) => e.stopPropagation()} theme={currentTheme}>
            <ChatModalHeader theme={currentTheme}>
              <DarkModeToggle />
              <ChatCloseButton onClick={toggleChat} theme={currentTheme}>
                ×
              </ChatCloseButton>
            </ChatModalHeader>
            <ChatBotWrapper>
              <LazyChatBot />
            </ChatBotWrapper>
          </ChatModalContainer>
        </ChatOverlay>
      )}
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* PWA Installer */}
      <PWAInstaller />

      {showLoginPrompt && (
        <PromptOverlay onClick={() => setShowLoginPrompt(false)}>
          <PromptModal theme={currentTheme} onClick={(e) => e.stopPropagation()}>
            <PromptMessage theme={currentTheme}>
              You need to be logged in to chat with our AI assistant.
            </PromptMessage>
            <PromptButtonContainer>
              <PromptButton 
                theme={currentTheme} 
                onClick={() => {
                  setCurrentView('login');
                  setShowLoginPrompt(false);
                }}
              >
                Login
              </PromptButton>
              <PromptButton 
                theme={currentTheme} 
                className="cancel"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </PromptButton>
            </PromptButtonContainer>
          </PromptModal>
        </PromptOverlay>
      )}

      {!isChatOpen && (
        <ChatIconWrapper onClick={toggleChat} theme={currentTheme}>
          <ChatIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
              <circle cx="7" cy="9" r="1" fill="white"/>
              <circle cx="12" cy="9" r="1" fill="white"/>
              <circle cx="17" cy="9" r="1" fill="white"/>
            </svg>
          </ChatIcon>
          <ChatTooltip theme={currentTheme}>
            {isChatOpen ? 'Close Chat' : 'Open Chat'}
          </ChatTooltip>
        </ChatIconWrapper>
      )}
    </AppContainer>
  );
};

const CenteredContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1; /* This makes it take up the available vertical space */
  padding: 2rem;
  width: 100%;
  box-sizing: border-box; /* Ensures padding is included in the width */
`;

const AppContainer = styled.div<{ theme: any; isAdminView?: boolean }>`
  min-height: 100vh;
  background: ${props => 
    props.isAdminView 
      ? props.theme.dashboardBackground 
      : (props.theme.backgroundGradient || props.theme.background)
  };
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow-x: hidden;
  scroll-behavior: smooth;
  transition: background 0.3s ease;
  position: relative;
`;

const ChatTooltip = styled.div<{ theme: any }>`
  position: absolute;
  bottom: 70px;
  right: 0;
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 20px;
    border: 6px solid transparent;
    border-top-color: ${props => props.theme.cardBackground};
  }
  
  @media (max-width: 768px) {
    bottom: 65px;
    font-size: 13px;
    padding: 6px 10px;
  }
  
  @media (max-width: 480px) {
    bottom: 60px;
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const ChatIconWrapper = styled.div<{ theme: any }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:hover ${ChatTooltip} {
    opacity: 1;
    visibility: visible;
  }
  
  @media (max-width: 768px) {
    bottom: 25px;
    right: 25px;
  }
  
  @media (max-width: 480px) {
    bottom: 20px;
    right: 20px;
  }
`;

const ChatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #722f37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(114, 47, 55, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    background: #8b3a42;
    box-shadow: 0 6px 25px rgba(114, 47, 55, 0.6);
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    
    svg {
      width: 25px;
      height: 25px;
    }
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const ChatOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const ChatModalContainer = styled.div<{ theme: any }>`
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 85vh;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ChatModalHeader = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${props => props.theme.headerBackground || '#722f37'};
  border-bottom: 1px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 15px;
  }
`;

const ChatCloseButton = styled.button<{ theme: any }>`
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }
`;

const ChatBotWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

//Cover Photo Styled Components
const CoverSection = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  @media (max-width: 1440px) {
    height: 100vh;
  }
  
  @media (max-width: 1024px) {
    height: 90vh;
  }
  
  @media (max-width: 768px) {
    height: 85vh;
    min-height: 600px;
  }
  
  @media (max-width: 480px) {
    height: 80vh;
    min-height: 500px;
  }
  
  @media (max-width: 320px) {
    height: 75vh;
    min-height: 450px;
  }
`;

const CoverImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const DefaultCoverBg = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #722f37, #8b3a42, #722f37);
  background-size: 400% 400%;
  animation: gradientShift 8s ease-in-out infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 2;
`;

const CoverContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  max-width: 1200px;
  padding: 3rem;
  width: 100%;
  
  @media (max-width: 1440px) {
    max-width: 1000px;
    padding: 2.5rem;
  }
  
  @media (max-width: 1024px) {
    max-width: 800px;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 95%;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 90%;
  }
  
  @media (max-width: 320px) {
    padding: 0.8rem;
    max-width: 85%;
  }
`;

const LogoSection = styled.div`
  margin-bottom: 3rem;
  
  @media (max-width: 1440px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 1024px) {
    margin-bottom: 2rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const CoverLogo = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  object-fit: cover;
  background: white;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 1440px) {
    width: 140px;
    height: 140px;
  }
  
  @media (max-width: 1024px) {
    width: 130px;
    height: 130px;
    border-width: 4px;
  }
  
  @media (max-width: 768px) {
    width: 110px;
    height: 110px;
    border-width: 4px;
  }
  
  @media (max-width: 480px) {
    width: 90px;
    height: 90px;
    border-width: 3px;
  }
  
  @media (max-width: 320px) {
    width: 80px;
    height: 80px;
    border-width: 3px;
  }
`;

const DefaultLogo = styled.div`
  display: inline-block;
  border-radius: 50%;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    width: 150px;
    height: 150px;
    
    @media (max-width: 1440px) {
      width: 140px;
      height: 140px;
    }
    
    @media (max-width: 1024px) {
      width: 130px;
      height: 130px;
    }
    
    @media (max-width: 768px) {
      width: 110px;
      height: 110px;
    }
    
    @media (max-width: 480px) {
      width: 90px;
      height: 90px;
    }
    
    @media (max-width: 320px) {
      width: 80px;
      height: 80px;
    }
  }
`;

const TitleSection = styled.div`
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  letter-spacing: 2px;
  
  @media (max-width: 1440px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 3rem;
    letter-spacing: 1.5px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 320px) {
    font-size: 1.7rem;
    letter-spacing: 0px;
  }
`;

const CoverSubtitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0 0 2rem 0;
  opacity: 0.95;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
  
  @media (max-width: 1440px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.5rem;
    letter-spacing: 0.8px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    letter-spacing: 0px;
  }
  
  @media (max-width: 320px) {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const Description = styled.p`
  font-size: 1.4rem;
  margin: 2rem 0 4rem 0;
  opacity: 0.9;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 1440px) {
    font-size: 1.3rem;
    max-width: 650px;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 1.8rem 0 3.5rem 0;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 1.5rem 0 3rem 0;
    max-width: 95%;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 1.5rem 0 2.5rem 0;
    max-width: 100%;
    line-height: 1.4;
  }
  
  @media (max-width: 320px) {
    font-size: 0.9rem;
    margin: 1rem 0 2rem 0;
    line-height: 1.3;
  }
`;

const SocialMediaWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 15px;
  
  @media (max-width: 768px) {
    bottom: 25px;
    left: 25px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    bottom: 20px;
    left: 20px;
    gap: 10px;
  }
`;

const SocialMediaLink = styled.a<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${props => props.bgColor};
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.bgColor}40;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${props => props.bgColor}60;
    filter: brightness(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 480px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const NavigationMenu = styled.nav<{ theme: any }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 25px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  gap: 4px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    top: 15px;
    padding: 6px;
    gap: 3px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    padding: 4px;
    gap: 2px;
  }
`;

const NavButton = styled.button<{ theme: any; active?: boolean }>`
  padding: 10px 16px;
  border: none;
  background: ${props => props.active ? props.theme.primary || '#722f37' : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary || '#722f37' : props.theme.hoverBackground || 'rgba(114, 47, 55, 0.1)'};
    color: ${props => props.active ? 'white' : props.theme.primary || '#722f37'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const PromptOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PromptModal = styled.div<{ theme: any }>`
  background: ${props => props.theme.cardBackground};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.theme.border};
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PromptMessage = styled.p<{ theme: any }>`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const PromptButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const PromptButton = styled.button<{ theme: any }>`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.primary};
  color: white;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  &.cancel {
    background-color: transparent;
    color: ${props => props.theme.textSecondary};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      background-color: ${props => props.theme.hoverBackground};
      color: ${props => props.theme.text};
    }
  }
`;

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
