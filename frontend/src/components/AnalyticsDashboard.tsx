import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';

interface AnalyticsData {
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  totals: {
    totalSessions: number;
    totalMessages: number;
    uniqueUsers: number;
  };
  dailyData: Array<{
    date: string;
    total_sessions: number;
    total_messages: number;
    unique_users: number;
  }>;
  popularQueries: Array<{
    content: string;
    count: number;
  }>;
  feedback: {
    total_feedback: number;
    avg_rating: number;
    positive_feedback: number;
  };
}

const DashboardContainer = styled.div<{ theme: any }>`
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DashboardTitle = styled.h2<{ theme: any }>`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.8rem;
`;

const PeriodSelector = styled.select<{ theme: any }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ theme: any }>`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div<{ theme: any }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div<{ theme: any }>`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3<{ theme: any }>`
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const PopularQueriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QueryItem = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
`;

const QueryText = styled.span<{ theme: any }>`
  color: ${props => props.theme.text};
  flex: 1;
  margin-right: 1rem;
`;

const QueryCount = styled.span<{ theme: any }>`
  background: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const LoadingSpinner = styled.div<{ theme: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div<{ theme: any }>`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fcc;
  margin-bottom: 1rem;
`;

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');
  const { isDarkMode } = useTheme();

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getAnalytics(selectedPeriod);
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  if (loading) {
    return (
      <DashboardContainer theme={isDarkMode ? { cardBackground: '#2d3748', border: '#4a5568' } : { cardBackground: 'white', border: '#e2e8f0' }}>
        <LoadingSpinner theme={isDarkMode ? { textSecondary: '#a0aec0' } : { textSecondary: '#718096' }}>
          Loading analytics...
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer theme={isDarkMode ? { cardBackground: '#2d3748', border: '#4a5568' } : { cardBackground: 'white', border: '#e2e8f0' }}>
        <ErrorMessage theme={{}}>
          Error: {error}
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardContainer theme={isDarkMode ? { cardBackground: '#2d3748', border: '#4a5568' } : { cardBackground: 'white', border: '#e2e8f0' }}>
        <div>No analytics data available</div>
      </DashboardContainer>
    );
  }

  const theme = {
    cardBackground: isDarkMode ? '#2d3748' : 'white',
    background: isDarkMode ? '#1a202c' : '#f7fafc',
    border: isDarkMode ? '#4a5568' : '#e2e8f0',
    text: isDarkMode ? '#f7fafc' : '#2d3748',
    textSecondary: isDarkMode ? '#a0aec0' : '#718096',
    primary: '#722f37'
  };

  return (
    <DashboardContainer theme={theme}>
      <DashboardHeader>
        <DashboardTitle theme={theme}>Analytics Dashboard</DashboardTitle>
        <PeriodSelector 
          theme={theme}
          value={period} 
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </PeriodSelector>
      </DashboardHeader>

      <StatsGrid>
        <StatCard theme={theme}>
          <StatValue theme={theme}>{analyticsData.totals.totalSessions}</StatValue>
          <StatLabel theme={theme}>Total Sessions</StatLabel>
        </StatCard>
        <StatCard theme={theme}>
          <StatValue theme={theme}>{analyticsData.totals.totalMessages}</StatValue>
          <StatLabel theme={theme}>Total Messages</StatLabel>
        </StatCard>
        <StatCard theme={theme}>
          <StatValue theme={theme}>{analyticsData.totals.uniqueUsers}</StatValue>
          <StatLabel theme={theme}>Unique Users</StatLabel>
        </StatCard>
        <StatCard theme={theme}>
          <StatValue theme={theme}>
            {analyticsData.feedback.avg_rating ? analyticsData.feedback.avg_rating.toFixed(1) : 'N/A'}
          </StatValue>
          <StatLabel theme={theme}>Avg Rating</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle theme={theme}>Popular Queries</SectionTitle>
        <PopularQueriesList>
          {analyticsData.popularQueries.slice(0, 10).map((query, index) => (
            <QueryItem key={index} theme={theme}>
              <QueryText theme={theme}>{query.content}</QueryText>
              <QueryCount theme={theme}>{query.count}</QueryCount>
            </QueryItem>
          ))}
        </PopularQueriesList>
      </Section>

      <Section>
        <SectionTitle theme={theme}>Feedback Summary</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <StatCard theme={theme}>
            <StatValue theme={theme}>{analyticsData.feedback.total_feedback}</StatValue>
            <StatLabel theme={theme}>Total Feedback</StatLabel>
          </StatCard>
          <StatCard theme={theme}>
            <StatValue theme={theme}>{analyticsData.feedback.positive_feedback}</StatValue>
            <StatLabel theme={theme}>Positive (4+ stars)</StatLabel>
          </StatCard>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;
