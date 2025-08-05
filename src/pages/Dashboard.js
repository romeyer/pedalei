import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiTrendingUp, FiAward, FiWind, FiMapPin, FiClock } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  background: ${props => props.color || '#3498db'};
  color: white;
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ActionsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #27ae60;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background: #229954;
  }
`;

const RecentRoutes = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
`;

const Dashboard = () => {
  const { user } = useAuth();

  const getNextLevelKm = (level) => {
    return level * 100;
  };

  const getProgressToNextLevel = () => {
    const nextLevelKm = getNextLevelKm(user.level);
    return Math.min((user.totalKm / nextLevelKm) * 100, 100);
  };

  return (
    <Container>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user.name}! 🚴‍♂️</WelcomeTitle>
        <WelcomeSubtitle>
          Ready for your next cycling adventure?
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#3498db">
            <FiMapPin />
          </StatIcon>
          <StatContent>
            <StatValue>{user.totalKm.toFixed(1)} km</StatValue>
            <StatLabel>Total Distance</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <FiAward />
          </StatIcon>
          <StatContent>
            <StatValue>Level {user.level}</StatValue>
            <StatLabel>{getProgressToNextLevel().toFixed(0)}% to next level</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <FiWind />
          </StatIcon>
          <StatContent>
            <StatValue>{user.co2Saved.toFixed(1)} kg</StatValue>
            <StatLabel>CO₂ Saved</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#e74c3c">
            <FiClock />
          </StatIcon>
          <StatContent>
            <StatValue>0</StatValue>
            <StatLabel>Routes Completed</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionButton to="/new-route">
          <FiPlus /> Plan New Route
        </ActionButton>
      </ActionsSection>

      <RecentRoutes>
        <SectionTitle>Recent Routes</SectionTitle>
        <EmptyState>
          <p>No routes yet. <Link to="/new-route">Create your first route</Link> to get started!</p>
        </EmptyState>
      </RecentRoutes>
    </Container>
  );
};

export default Dashboard;