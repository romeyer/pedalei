import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pedalei_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        level: 1,
        totalKm: 0,
        co2Saved: 0
      };
      
      setUser(mockUser);
      localStorage.setItem('pedalei_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pedalei_user');
  };

  const register = async (email, password, name) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name,
        level: 1,
        totalKm: 0,
        co2Saved: 0
      };
      
      setUser(mockUser);
      localStorage.setItem('pedalei_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};