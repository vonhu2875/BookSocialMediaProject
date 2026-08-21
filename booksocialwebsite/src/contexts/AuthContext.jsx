import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }
};

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};