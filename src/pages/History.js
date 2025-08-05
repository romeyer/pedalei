import React from 'react';
import styled from 'styled-components';
import { FiMapPin, FiClock, FiTrendingUp, FiCalendar, FiAward } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatIcon = styled.div`
  background: ${props => props.color || '#3498db'};
  color: white;
  padding: 1rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const RoutesList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const RoutesHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ecf0f1;
`;

const RoutesTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const RouteItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const RouteInfo = styled.div`
  flex: 1;
`;

const RouteName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const RouteDetails = styled.div`
  display: flex;
  gap: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const RouteDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RouteDate = styled.div`
  color: #95a5a6;
  font-size: 0.9rem;
`;

const History = () => {
  // Mock data - replace with actual data from your backend
  const mockRoutes = [
    {
      id: '1',
      name: 'Morning Commute',
      distance: 8.5,
      duration: 32,
      date: '2024-01-15',
      co2Saved: 1.79
    },
    {
      id: '2',
      name: 'Weekend Adventure',
      distance: 25.3,
      duration: 95,
      date: '2024-01-13',
      co2Saved: 5.31
    }
  ];

  const totalRoutes = mockRoutes.length;
  const totalDistance = mockRoutes.reduce((sum, route) => sum + route.distance, 0);
  const totalTime = mockRoutes.reduce((sum, route) => sum + route.duration, 0);
  const totalCo2Saved = mockRoutes.reduce((sum, route) => sum + route.co2Saved, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <Title>Ride History</Title>

      <StatsOverview>
        <StatCard>
          <StatIcon color="#3498db">
            <FiMapPin />
          </StatIcon>
          <StatValue>{totalDistance.toFixed(1)} km</StatValue>
          <StatLabel>Total Distance</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#e74c3c">
            <FiClock />
          </StatIcon>
          <StatValue>{totalRoutes}</StatValue>
          <StatLabel>Total Routes</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <FiTrendingUp />
          </StatIcon>
          <StatValue>{Math.round(totalTime / 60)}h {totalTime % 60}m</StatValue>
          <StatLabel>Time Cycling</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#27ae60">
            <FiAward />
          </StatIcon>
          <StatValue>{totalCo2Saved.toFixed(1)} kg</StatValue>
          <StatLabel>CO₂ Saved</StatLabel>
        </StatCard>
      </StatsOverview>

      <RoutesList>
        <RoutesHeader>
          <RoutesTitle>Your Routes</RoutesTitle>
        </RoutesHeader>

        {mockRoutes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚴‍♂️</EmptyIcon>
            <EmptyText>No routes completed yet</EmptyText>
            <EmptySubtext>Start your first cycling adventure to see your history here!</EmptySubtext>
          </EmptyState>
        ) : (
          mockRoutes.map((route) => (
            <RouteItem key={route.id}>
              <RouteInfo>
                <RouteName>{route.name}</RouteName>
                <RouteDetails>
                  <RouteDetail>
                    <FiMapPin />
                    {route.distance.toFixed(1)} km
                  </RouteDetail>
                  <RouteDetail>
                    <FiClock />
                    {route.duration} min
                  </RouteDetail>
                  <RouteDetail>
                    <FiTrendingUp />
                    {route.co2Saved.toFixed(2)} kg CO₂ saved
                  </RouteDetail>
                </RouteDetails>
              </RouteInfo>
              <RouteDate>
                <FiCalendar style={{ marginRight: '0.25rem' }} />
                {formatDate(route.date)}
              </RouteDate>
            </RouteItem>
          ))
        )}
      </RoutesList>
    </Container>
  );
};

export default History;