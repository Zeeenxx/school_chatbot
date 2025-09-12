import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import accessibilityService from '../services/accessibilityService';

const SettingsContainer = styled.div<{ theme: any }>`
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
  max-width: 500px;
  margin: 0 auto;
`;

const SettingsTitle = styled.h2<{ theme: any }>`
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
`;

const SettingGroup = styled.div`
  margin-bottom: 2rem;
`;

const SettingLabel = styled.label<{ theme: any }>`
  display: block;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
`;

const SettingDescription = styled.p<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Slider = styled.input<{ theme: any }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.border};
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    border: none;
  }
`;

const SliderValue = styled.span<{ theme: any }>`
  color: ${props => props.theme.text};
  font-weight: 600;
  min-width: 40px;
  text-align: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Toggle = styled.input<{ theme: any }>`
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.theme.border};
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:checked {
    background: ${props => props.theme.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: transform 0.3s ease;
  }
  
  &:checked::before {
    transform: translateX(26px);
  }
`;

const Button = styled.button<{ theme: any }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 1rem;
  
  &:hover {
    background: ${props => props.theme.primaryHover || '#8b3a42'};
  }
  
  &:disabled {
    background: ${props => props.theme.textSecondary};
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div<{ theme: any, type: 'success' | 'info' }>`
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: ${props => props.type === 'success' ? '#efe' : '#eef'};
  color: ${props => props.type === 'success' ? '#363' : '#336'};
  border: 1px solid ${props => props.type === 'success' ? '#cfc' : '#ccf'};
`;

const AccessibilitySettings: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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

  useEffect(() => {
    // Load current settings
    const status = accessibilityService.getStatus();
    setFontSize(status.fontSize);
    setHighContrast(status.highContrast);
    setReducedMotion(status.reducedMotion);
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    accessibilityService.setFontSize(newSize);
    setStatusMessage(`Font size changed to ${newSize}px`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    accessibilityService.setHighContrast(enabled);
    setStatusMessage(enabled ? 'High contrast mode enabled' : 'High contrast mode disabled');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleReducedMotionToggle = (enabled: boolean) => {
    setReducedMotion(enabled);
    accessibilityService.setReducedMotion(enabled);
    setStatusMessage(enabled ? 'Reduced motion enabled' : 'Reduced motion disabled');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const resetToDefaults = () => {
    setFontSize(16);
    setHighContrast(false);
    setReducedMotion(false);
    accessibilityService.setFontSize(16);
    accessibilityService.setHighContrast(false);
    accessibilityService.setReducedMotion(false);
    setStatusMessage('Settings reset to defaults');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const announceSettings = () => {
    accessibilityService.announce('Accessibility settings updated');
  };

  return (
    <SettingsContainer theme={theme}>
      <SettingsTitle theme={theme}>Accessibility Settings</SettingsTitle>
      
      {statusMessage && (
        <StatusMessage theme={theme} type="success">
          {statusMessage}
        </StatusMessage>
      )}
      
      <SettingGroup>
        <SettingLabel theme={theme}>Font Size</SettingLabel>
        <SettingDescription theme={theme}>
          Adjust the text size to make it easier to read. This affects all text on the page.
        </SettingDescription>
        <SliderContainer>
          <Slider
            theme={theme}
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
            aria-label="Font size"
          />
          <SliderValue theme={theme}>{fontSize}px</SliderValue>
        </SliderContainer>
      </SettingGroup>
      
      <SettingGroup>
        <SettingLabel theme={theme}>High Contrast Mode</SettingLabel>
        <SettingDescription theme={theme}>
          Increase the contrast between text and background colors for better visibility.
        </SettingDescription>
        <ToggleContainer>
          <Toggle
            theme={theme}
            type="checkbox"
            checked={highContrast}
            onChange={(e) => handleHighContrastToggle(e.target.checked)}
            aria-label="High contrast mode"
          />
          <span style={{ color: theme.text }}>
            {highContrast ? 'Enabled' : 'Disabled'}
          </span>
        </ToggleContainer>
      </SettingGroup>
      
      <SettingGroup>
        <SettingLabel theme={theme}>Reduced Motion</SettingLabel>
        <SettingDescription theme={theme}>
          Reduce or eliminate animations and transitions for users who are sensitive to motion.
        </SettingDescription>
        <ToggleContainer>
          <Toggle
            theme={theme}
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => handleReducedMotionToggle(e.target.checked)}
            aria-label="Reduced motion"
          />
          <span style={{ color: theme.text }}>
            {reducedMotion ? 'Enabled' : 'Disabled'}
          </span>
        </ToggleContainer>
      </SettingGroup>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button theme={theme} onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button theme={theme} onClick={announceSettings}>
          Announce Settings
        </Button>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: theme.background, borderRadius: '8px' }}>
        <h3 style={{ color: theme.text, marginBottom: '1rem' }}>Keyboard Shortcuts</h3>
        <ul style={{ color: theme.textSecondary, fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li><strong>Tab:</strong> Navigate between interactive elements</li>
          <li><strong>Enter/Space:</strong> Activate buttons and links</li>
          <li><strong>Escape:</strong> Close modals and menus</li>
          <li><strong>Alt + A:</strong> Focus accessibility settings</li>
          <li><strong>Alt + C:</strong> Focus chat interface</li>
        </ul>
      </div>
    </SettingsContainer>
  );
};

export default AccessibilitySettings;


