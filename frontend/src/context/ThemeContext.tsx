import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Get initial theme from localStorage or default to light mode
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme colors
export const themes = {
  light: {
    background: '#722f37',
    backgroundGradient: 'linear-gradient(135deg, #722f37 0%, #5d1a1d 100%)',
    chatBackground: 'rgba(255, 255, 255, 0.95)',
    headerBackground: '#722f37',
    messageUser: '#722f37',
    messageBot: '#f8f9fa',
    messageUserText: '#ffffff',
    messageBotText: '#333333',
    inputBackground: '#ffffff',
    inputBorder: '#ddd',
    inputText: '#333333',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    buttonBackground: '#722f37',
    buttonText: '#ffffff',
    buttonHover: '#8b3a42',
    // Additional theme properties for complete coverage
    cardBackground: '#ffffff',
    messagesBackground: '#f8f9fa',
    headerText: '#ffffff',
    userMessageBackground: '#722f37',
    botMessageBackground: '#f4e6e7',
    userMessageText: '#ffffff',
    botMessageText: '#333333',
    botMessageIcon: '#e6d2d5',
    inputFieldBackground: '#ffffff',
    placeholderText: '#999999',
    primary: '#722f37',
    primaryTransparent: 'rgba(114, 47, 55, 0.25)',
    buttonDisabled: '#cccccc',
    dashboardBackground: '#f4f7fc',
    titleColor: '#333333',
    borderColor: '#e0e0e0',
  },
  dark: {
    background: '#2a0000', // Dark maroon base
    backgroundGradient: 'linear-gradient(135deg, #2a0000 0%, #4d0000 100%)', // Maroon gradient
    chatBackground: 'rgba(20, 0, 0, 0.95)',
    headerBackground: '#722f37', // Keep primary maroon for headers
    messageUser: '#722f37',
    messageBot: '#3a0000',
    messageUserText: '#ffffff',
    messageBotText: '#f5e6e6',
    inputBackground: '#3a0000',
    inputBorder: '#5c1f1f',
    inputText: '#f5e6e6',
    text: '#f5e6e6', // Light text for readability on dark background
    textSecondary: '#e0c0c0',
    border: '#5c1f1f',
    shadow: 'rgba(0, 0, 0, 0.5)',
    buttonBackground: '#722f37',
    buttonText: '#ffffff',
    buttonHover: '#8b3a42',
    // Additional theme properties for complete coverage
    cardBackground: '#3a0000',
    messagesBackground: '#2a0000',
    headerText: '#ffffff',
    userMessageBackground: '#722f37',
    botMessageBackground: '#4a3335',
    userMessageText: '#ffffff',
    botMessageText: '#f5e6e6',
    botMessageIcon: '#5a4045',
    inputFieldBackground: '#3a0000',
    placeholderText: '#b08f8f',
    primary: '#722f37',
    primaryTransparent: 'rgba(114, 47, 55, 0.25)',
    buttonDisabled: '#666666',
    dashboardBackground: '#1e0000', // Even darker for the dashboard background
    titleColor: '#ffffff',
    borderColor: '#5c1f1f',
  },
};
