import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('job_portal_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('job_portal_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Fetch current user from server on load if token exists
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('job_portal_token');
      if (!savedToken) return;
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          localStorage.setItem('job_portal_user', JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Backend reachability check warning:', err.message);
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('job_portal_token', data.token);
      localStorage.setItem('job_portal_user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('job_portal_token', data.token);
      localStorage.setItem('job_portal_user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoCandidate = () => {
    return login('alex.seeker@jobportal.com', 'password123');
  };

  const loginAsDemoEmployer = () => {
    return login('recruiter@techpulse.com', 'password123');
  };

  const logout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('job_portal_token');
    localStorage.removeItem('job_portal_user');
  };

  const updateUserProfile = async (updatedFields) => {
    const savedToken = localStorage.getItem('job_portal_token');
    if (savedToken) {
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`
          },
          body: JSON.stringify(updatedFields)
        });
        const data = await res.json();
        if (res.ok) {
          setCurrentUser(data.user);
          localStorage.setItem('job_portal_user', JSON.stringify(data.user));
          return;
        }
      } catch (err) {
        console.error('Profile update error:', err);
      }
    }

    setCurrentUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('job_portal_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        login,
        register,
        logout,
        loginAsDemoCandidate,
        loginAsDemoEmployer,
        updateUserProfile,
        isAuthenticated: !!currentUser,
        isCandidate: currentUser?.role === 'candidate',
        isEmployer: currentUser?.role === 'employer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
