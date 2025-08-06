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
      // Basic validation
      if (!email || !password) {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }

      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('pedalei_users') || '[]');
      
      // Find user
      const existingUser = storedUsers.find(user => user.email === email);
      
      if (!existingUser) {
        return { success: false, error: 'Usuário não encontrado. Crie uma conta primeiro.' };
      }

      // Simple password check (in production, use proper hashing)
      if (existingUser.password !== password) {
        return { success: false, error: 'Senha incorreta' };
      }

      // Remove password from user object for security
      const userForSession = { ...existingUser };
      delete userForSession.password;
      
      setUser(userForSession);
      localStorage.setItem('pedalei_user', JSON.stringify(userForSession));
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
      // Basic validation
      if (!email || !password || !name) {
        return { success: false, error: 'Todos os campos são obrigatórios' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Email inválido' };
      }

      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('pedalei_users') || '[]');
      
      // Check if user already exists
      const existingUser = storedUsers.find(user => user.email === email);
      if (existingUser) {
        return { success: false, error: 'Usuário já existe. Faça login.' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        email,
        name,
        password, // In production, hash this
        level: 1,
        totalKm: 0,
        co2Saved: 0,
        createdAt: new Date().toISOString(),
        routes: []
      };

      // Save to users list
      storedUsers.push(newUser);
      localStorage.setItem('pedalei_users', JSON.stringify(storedUsers));

      // Remove password from user object for session
      const userForSession = { ...newUser };
      delete userForSession.password;
      
      setUser(userForSession);
      localStorage.setItem('pedalei_user', JSON.stringify(userForSession));
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