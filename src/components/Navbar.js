import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiPlus, FiClock, FiLogOut, FiUser } from 'react-icons/fi';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
  color: #3498db;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #2980b9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover, &.active {
    background-color: #34495e;
    color: #3498db;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ecf0f1;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #34495e;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <NavContainer>
      <Logo to="/dashboard">
        🚴‍♂️ Pedalei
      </Logo>
      
      <NavLinks>
        <NavLink 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          <FiHome /> Dashboard
        </NavLink>
        <NavLink 
          to="/new-route" 
          className={location.pathname === '/new-route' ? 'active' : ''}
        >
          <FiPlus /> New Route
        </NavLink>
        <NavLink 
          to="/history" 
          className={location.pathname === '/history' ? 'active' : ''}
        >
          <FiClock /> History
        </NavLink>
      </NavLinks>

      <UserSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiUser />
          <span>{user.name}</span>
          <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Lv.{user.level}</span>
        </div>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut /> Logout
        </LogoutButton>
      </UserSection>
    </NavContainer>
  );
};

export default Navbar;