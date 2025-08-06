import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StravaService from '../services/strava';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 400px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FC4C02;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #7f8c8d;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #2980b9;
  }
`;

const StravaCallback = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Conectando com Strava...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`Strava authorization error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received from Strava');
      }

      // Exchange code for token
      await StravaService.exchangeToken(code);
      
      setStatus('success');
      setMessage('Conexão com Strava realizada com sucesso!');

      // Close popup after a delay
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ type: 'STRAVA_SUCCESS' }, '*');
          window.close();
        } else {
          // If not in popup, redirect to dashboard
          window.location.href = '/dashboard';
        }
      }, 2000);

    } catch (error) {
      console.error('Strava callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Erro ao conectar com Strava');
    }
  };

  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <Container>
      <Card>
        {status === 'loading' && (
          <>
            <LoadingSpinner />
            <Title>Conectando...</Title>
            <Message>{message}</Message>
          </>
        )}
        
        {status === 'success' && (
          <>
            <Icon>✅</Icon>
            <Title>Sucesso!</Title>
            <Message>{message}</Message>
            <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
              Esta janela será fechada automaticamente...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <Icon>❌</Icon>
            <Title>Erro na Conexão</Title>
            <Message>{message}</Message>
            <Button onClick={handleClose}>
              Fechar
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default StravaCallback;