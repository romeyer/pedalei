import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StravaService from '../services/strava';

const Container = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StravaButton = styled.button`
  background: #FC4C02;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #E04102;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const DisconnectButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
  
  &:hover {
    background: #c0392b;
  }
`;

const Status = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  
  &.connected {
    background: #d5ead3;
    border: 1px solid #27ae60;
    color: #1e8449;
  }
  
  &.error {
    background: #fadbd8;
    border: 1px solid #e74c3c;
    color: #c0392b;
  }
`;

const AthleteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const AthleteDetails = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StravaConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [athleteData, setAthleteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = StravaService.isConnected();
    setIsConnected(connected);
    
    if (connected) {
      try {
        const athlete = await StravaService.getAthlete();
        setAthleteData(athlete);
        onConnectionChange && onConnectionChange(true);
      } catch (error) {
        console.error('Error fetching athlete:', error);
        setIsConnected(false);
        onConnectionChange && onConnectionChange(false);
      }
    }
  };

  const handleConnect = () => {
    setLoading(true);
    setError(null);
    
    const authUrl = StravaService.getAuthorizationUrl();
    
    // Open popup window for Strava auth
    const popup = window.open(
      authUrl,
      'strava-auth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for popup completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setLoading(false);
        // Check if connection was successful
        setTimeout(() => {
          checkConnection();
        }, 1000);
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    StravaService.disconnect();
    setIsConnected(false);
    setAthleteData(null);
    setError(null);
    onConnectionChange && onConnectionChange(false);
  };

  return (
    <Container>
      <Title>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FC4C02">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7.008 13.828h4.172"/>
        </svg>
        Conexão com Strava
      </Title>
      
      {error && (
        <Status className="error">
          ❌ Erro: {error}
        </Status>
      )}
      
      {isConnected && athleteData ? (
        <>
          <Status className="connected">
            ✅ Conectado ao Strava
          </Status>
          
          <AthleteInfo>
            {athleteData.profile && (
              <Avatar src={athleteData.profile} alt={athleteData.firstname} />
            )}
            <AthleteDetails>
              <h4>{athleteData.firstname} {athleteData.lastname}</h4>
              <p>@{athleteData.username} • {athleteData.city}, {athleteData.country}</p>
              <p>Seguidores: {athleteData.follower_count} • Seguindo: {athleteData.friend_count}</p>
            </AthleteDetails>
            <DisconnectButton onClick={handleDisconnect}>
              Desconectar
            </DisconnectButton>
          </AthleteInfo>
          
          <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            💡 Agora você pode importar seu histórico de ciclismo do Strava para o dashboard
          </p>
        </>
      ) : (
        <>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            Conecte sua conta Strava para importar automaticamente seu histórico de ciclismo e sincronizar suas atividades.
          </p>
          
          <StravaButton onClick={handleConnect} disabled={loading}>
            {loading ? <LoadingSpinner /> : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7.008 13.828h4.172"/>
              </svg>
            )}
            {loading ? 'Conectando...' : 'Conectar com Strava'}
          </StravaButton>
          
          <p style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '1rem' }}>
            * Você será redirecionado para o Strava para autorizar a conexão
          </p>
        </>
      )}
    </Container>
  );
};

export default StravaConnection;