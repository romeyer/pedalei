import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiTrendingUp, FiAward, FiWind, FiMapPin, FiClock, FiActivity } from 'react-icons/fi';
import StravaConnection from '../components/StravaConnection';
import StravaService from '../services/strava';

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

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.source === 'strava' ? '#FC4C02' : '#3498db'};
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ActivityName = styled.h4`
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
`;

const ActivitySource = styled.span`
  background: ${props => props.source === 'strava' ? '#FC4C02' : '#3498db'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ActivityStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ActivityStat = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  
  strong {
    color: #2c3e50;
    font-weight: 600;
  }
`;

const LoadingActivities = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #fadbd8;
  color: #c0392b;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border: 1px solid #e74c3c;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stravaConnected, setStravaConnected] = useState(false);
  const [stravaActivities, setStravaActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);

  useEffect(() => {
    setStravaConnected(StravaService.isConnected());
  }, []);

  const handleStravaConnection = async (connected) => {
    setStravaConnected(connected);
    if (connected) {
      await loadStravaActivities();
    } else {
      setStravaActivities([]);
    }
  };

  const loadStravaActivities = async () => {
    setLoadingActivities(true);
    setActivitiesError(null);
    try {
      const activities = await StravaService.getActivities(10);
      setStravaActivities(activities);
    } catch (error) {
      console.error('Error loading Strava activities:', error);
      setActivitiesError('Erro ao carregar atividades do Strava');
    }
    setLoadingActivities(false);
  };

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

      <StravaConnection onConnectionChange={handleStravaConnection} />

      <ActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionButton to="/new-route">
          <FiPlus /> Plan New Route
        </ActionButton>
      </ActionsSection>

      <RecentRoutes>
        <SectionTitle>
          <FiActivity style={{ marginRight: '0.5rem' }} />
          Atividades Recentes
        </SectionTitle>
        
        {loadingActivities && (
          <LoadingActivities>
            Carregando atividades do Strava...
          </LoadingActivities>
        )}
        
        {activitiesError && (
          <ErrorMessage>
            {activitiesError}
          </ErrorMessage>
        )}
        
        {stravaActivities.length > 0 ? (
          <ActivitiesGrid>
            {stravaActivities.map((activity) => (
              <ActivityCard key={activity.id} source={activity.source}>
                <ActivityHeader>
                  <ActivityName>{activity.name}</ActivityName>
                  <ActivitySource source={activity.source}>
                    {activity.source}
                  </ActivitySource>
                </ActivityHeader>
                
                <ActivityStat>
                  <strong>{activity.date}</strong>
                </ActivityStat>
                
                <ActivityStats>
                  <ActivityStat>
                    Distância: <strong>{activity.distance} km</strong>
                  </ActivityStat>
                  <ActivityStat>
                    Tempo: <strong>{activity.duration} min</strong>
                  </ActivityStat>
                  <ActivityStat>
                    Vel. Média: <strong>{activity.averageSpeed} km/h</strong>
                  </ActivityStat>
                  <ActivityStat>
                    Elevação: <strong>{activity.elevationGain} m</strong>
                  </ActivityStat>
                  <ActivityStat>
                    Calorias: <strong>{activity.calories}</strong>
                  </ActivityStat>
                  <ActivityStat>
                    CO₂ Poupado: <strong>{activity.co2Saved} kg</strong>
                  </ActivityStat>
                </ActivityStats>
              </ActivityCard>
            ))}
          </ActivitiesGrid>
        ) : !loadingActivities && !stravaConnected ? (
          <EmptyState>
            <p>Conecte sua conta Strava para ver suas atividades de ciclismo aqui!</p>
          </EmptyState>
        ) : !loadingActivities && stravaConnected ? (
          <EmptyState>
            <p>Nenhuma atividade de ciclismo encontrada no Strava.</p>
          </EmptyState>
        ) : null}
      </RecentRoutes>
    </Container>
  );
};

export default Dashboard;