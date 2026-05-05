import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: jwt } = res.data;
    setToken(jwt);
    api.setAuthToken(jwt);
    return jwt;
  };

  const logout = () => {
    setToken(null);
    api.setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
