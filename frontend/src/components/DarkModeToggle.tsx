import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  margin-right: 1rem;
`;

const ToggleLabel = styled.span<{ isDarkMode: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.isDarkMode ? '#e0e0e0' : '#ffffff'};
  font-weight: 500;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ToggleSwitch = styled.div<{ isDarkMode: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.isDarkMode ? '#4a4a4a' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isDarkMode ? '#666' : 'rgba(255, 255, 255, 0.5)'};

  &:hover {
    background: ${props => props.isDarkMode ? '#555' : 'rgba(255, 255, 255, 0.4)'};
  }
`;

const ToggleSlider = styled.div<{ isDarkMode: boolean }>`
  position: absolute;
  top: 2px;
  left: ${props => props.isDarkMode ? '26px' : '2px'};
  width: 16px;
  height: 16px;
  background: ${props => props.isDarkMode ? '#ffd700' : '#fff'};
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  
  &::before {
    content: '${props => props.isDarkMode ? '🌙' : '☀️'}';
    font-size: 10px;
  }
`;

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <ToggleContainer isDarkMode={isDarkMode}>
      <ToggleLabel isDarkMode={isDarkMode}>
        {isDarkMode ? 'Dark' : 'Light'}
      </ToggleLabel>
      <ToggleSwitch isDarkMode={isDarkMode} onClick={toggleDarkMode}>
        <ToggleSlider isDarkMode={isDarkMode} />
      </ToggleSwitch>
    </ToggleContainer>
  );
};

export default DarkModeToggle;
