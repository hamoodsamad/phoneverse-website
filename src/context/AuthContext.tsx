'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phoneverse_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn('Error reading user storage', e);
    }
  }, []);

  const login = (email: string, role: UserRole = 'customer') => {
    const isSpecialAdmin = email.includes('admin');
    const assignedRole: UserRole = isSpecialAdmin ? 'admin' : role;
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: isSpecialAdmin ? 'System Admin' : 'Pakistani Customer',
      role: assignedRole,
      is_active: true
    };
    setUser(newUser);
    localStorage.setItem('phoneverse_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('phoneverse_user');
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
