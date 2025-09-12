import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">
        {isDarkMode ? 'dark' : 'light'}
      </div>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  test('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  test('toggles between light and dark themes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const themeStatus = screen.getByTestId('theme-status');

    // Initially light
    expect(themeStatus).toHaveTextContent('light');

    // Toggle to dark
    fireEvent.click(toggleButton);
    expect(themeStatus).toHaveTextContent('dark');

    // Toggle back to light
    fireEvent.click(toggleButton);
    expect(themeStatus).toHaveTextContent('light');
  });

  test('persists theme preference in localStorage', () => {
    // Clear localStorage before test
    localStorage.clear();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');

    // Toggle to dark mode
    fireEvent.click(toggleButton);

    // Check if preference is stored
    expect(localStorage.getItem('isDarkMode')).toBe('true');

    // Toggle back to light mode
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('isDarkMode')).toBe('false');
  });

  test('loads theme preference from localStorage on mount', () => {
    // Set dark mode in localStorage
    localStorage.setItem('isDarkMode', 'true');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });
});

