import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/apiServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    const validateSession = async () => {
      if (!token) {
        clearAuthState();
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getMyInfo();
        setUser(currentUser || JSON.parse(storedUser || null));
      } catch (error) {
        clearAuthState();
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    validateSession();
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearAuthState();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = (loginResponse) => {
    // loginResponse kiểu LoginResponse { token, user }
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
    setUser(loginResponse.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      clearAuthState();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isReader = user?.role === 'READER';
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAdmin, isReader, loading }}>
      {children}
    </AuthContext.Provider>
  );
};