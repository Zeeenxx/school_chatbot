import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  bundleSize: number;
}

const MonitorContainer = styled.div<{ theme: any }>`
  position: fixed;
  top: 10px;
  right: 10px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  font-size: 0.8rem;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.span<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
`;

const MetricValue = styled.span<{ theme: any, status: 'good' | 'warning' | 'poor' }>`
  color: ${props => {
    switch (props.status) {
      case 'good': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return props.theme.text;
    }
  }};
  font-weight: 600;
`;

const ToggleButton = styled.button<{ theme: any }>`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.primary};
  color: white;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.primaryHover || '#8b3a42'};
  }
`;

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    bundleSize: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(process.env.NODE_ENV === 'development');
  const { isDarkMode } = useTheme();

  const theme = {
    cardBackground: isDarkMode ? '#2d3748' : 'white',
    border: isDarkMode ? '#4a5568' : '#e2e8f0',
    text: isDarkMode ? '#f7fafc' : '#2d3748',
    textSecondary: isDarkMode ? '#a0aec0' : '#718096',
    primary: '#722f37',
    primaryHover: '#8b3a42'
  };

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }): 'good' | 'warning' | 'poor' => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'poor';
  };

  const measurePerformance = useCallback(() => {
    if (!isEnabled) return;

    // Measure page load time
    const loadTime = performance.timing ? 
      performance.timing.loadEventEnd - performance.timing.navigationStart : 0;

    // Measure render time (simplified)
    const renderTime = performance.now();

    // Measure memory usage (if available)
    const memoryUsage = (performance as any).memory ? 
      Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;

    // Measure network latency (simplified)
    const networkLatency = performance.timing ? 
      performance.timing.responseEnd - performance.timing.requestStart : 0;

    // Estimate bundle size (simplified)
    const bundleSize = Math.round(document.documentElement.innerHTML.length / 1024);

    setMetrics({
      loadTime,
      renderTime,
      memoryUsage,
      networkLatency,
      bundleSize
    });
  }, [isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      // Initial measurement
      setTimeout(measurePerformance, 1000);

      // Periodic updates
      const interval = setInterval(measurePerformance, 5000);
      return () => clearInterval(interval);
    }
  }, [isEnabled, measurePerformance]);

  if (!isEnabled) {
    return (
      <ToggleButton 
        theme={theme}
        onClick={() => setIsEnabled(true)}
        title="Enable Performance Monitor"
      >
        P
      </ToggleButton>
    );
  }

  if (!isVisible) {
    return (
      <ToggleButton 
        theme={theme}
        onClick={() => setIsVisible(true)}
        title="Show Performance Monitor"
      >
        P
      </ToggleButton>
    );
  }

  return (
    <MonitorContainer theme={theme}>
      <ToggleButton 
        theme={theme}
        onClick={() => setIsVisible(false)}
        title="Hide Performance Monitor"
      >
        ×
      </ToggleButton>
      
      <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: theme.text }}>
        Performance Monitor
      </div>
      
      <MetricRow>
        <MetricLabel theme={theme}>Load Time:</MetricLabel>
        <MetricValue 
          theme={theme} 
          status={getPerformanceStatus(metrics.loadTime, { good: 1000, warning: 3000 })}
        >
          {metrics.loadTime}ms
        </MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel theme={theme}>Render Time:</MetricLabel>
        <MetricValue 
          theme={theme} 
          status={getPerformanceStatus(metrics.renderTime, { good: 100, warning: 500 })}
        >
          {metrics.renderTime.toFixed(0)}ms
        </MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel theme={theme}>Memory:</MetricLabel>
        <MetricValue 
          theme={theme} 
          status={getPerformanceStatus(metrics.memoryUsage, { good: 50, warning: 100 })}
        >
          {metrics.memoryUsage}MB
        </MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel theme={theme}>Network:</MetricLabel>
        <MetricValue 
          theme={theme} 
          status={getPerformanceStatus(metrics.networkLatency, { good: 200, warning: 1000 })}
        >
          {metrics.networkLatency}ms
        </MetricValue>
      </MetricRow>
      
      <MetricRow>
        <MetricLabel theme={theme}>Bundle Size:</MetricLabel>
        <MetricValue 
          theme={theme} 
          status={getPerformanceStatus(metrics.bundleSize, { good: 500, warning: 1000 })}
        >
          {metrics.bundleSize}KB
        </MetricValue>
      </MetricRow>
    </MonitorContainer>
  );
};

export default PerformanceMonitor;
