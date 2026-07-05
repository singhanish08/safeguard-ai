import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, logoutUser, getMe } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();
  const isInitialMount = useRef(true);
  const isAuthenticated = !!user && !!token;
  const isEmployee = user?.role === 'employee';
  const isManager = user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getMe();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadUser();
    }
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    const { user: userData, token: newToken } = data.data;
    queryClient.clear();
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (credentials) => {
    const { data } = await registerUser(credentials);
    const { user: userData, token: newToken } = data.data;
    queryClient.clear();
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    queryClient.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isEmployee,
        isManager,
        isAdmin,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
