'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

const DEFAULT_ADMIN_EMAIL = 'admin@phoneverse.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin#PhoneVerse2026';
const MASTER_RECOVERY_KEY = 'PHONEVERSE-PAKISTAN-2026';

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: UserRole) => void;
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  changeAdminPassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  resetAdminPassword: (recoveryKey: string, newPassword: string) => { success: boolean; message: string };
  customerLogin: (email: string, password: string) => { success: boolean; message: string };
  customerRegister: (fullName: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentAdminEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>(DEFAULT_ADMIN_PASSWORD);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('phoneverse_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedPwd = localStorage.getItem('phoneverse_admin_pwd');
      if (savedPwd) {
        setAdminPassword(savedPwd);
      } else {
        localStorage.setItem('phoneverse_admin_pwd', DEFAULT_ADMIN_PASSWORD);
      }
    } catch (e) {
      console.warn('Error reading storage in AuthContext', e);
    }
  }, []);

  const login = (email: string, role: UserRole = 'customer') => {
    const isSpecialAdmin = email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() || role === 'admin';
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: isSpecialAdmin ? 'System Administrator' : 'Pakistani Customer',
      role: isSpecialAdmin ? 'admin' : 'customer',
      is_active: true
    };
    setUser(newUser);
    try {
      localStorage.setItem('phoneverse_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const adminLogin = (email: string, password: string): { success: boolean; message: string } => {
    const currentStoredPwd = localStorage.getItem('phoneverse_admin_pwd') || adminPassword || DEFAULT_ADMIN_PASSWORD;

    if (email.trim().toLowerCase() !== DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'Invalid Admin Email. Access restricted to authorized personnel.' };
    }

    if (password !== currentStoredPwd) {
      return { success: false, message: 'Incorrect Admin Password. Please verify and try again.' };
    }

    const adminUser: User = {
      id: 'admin_root_1',
      email: DEFAULT_ADMIN_EMAIL,
      full_name: 'System Administrator (Pakistan)',
      role: 'admin',
      is_active: true
    };

    setUser(adminUser);
    try {
      localStorage.setItem('phoneverse_user', JSON.stringify(adminUser));
    } catch (e) {
      console.error(e);
    }

    return { success: true, message: 'Admin authentication successful. Welcome to Control Center.' };
  };

  const changeAdminPassword = (oldPassword: string, newPassword: string): { success: boolean; message: string } => {
    const currentStoredPwd = localStorage.getItem('phoneverse_admin_pwd') || adminPassword || DEFAULT_ADMIN_PASSWORD;

    if (oldPassword !== currentStoredPwd) {
      return { success: false, message: 'Current password does not match.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    setAdminPassword(newPassword);
    try {
      localStorage.setItem('phoneverse_admin_pwd', newPassword);
    } catch (e) {
      console.error(e);
    }

    return { success: true, message: 'Admin password changed successfully!' };
  };

  const resetAdminPassword = (recoveryKey: string, newPassword: string): { success: boolean; message: string } => {
    if (recoveryKey.trim() !== MASTER_RECOVERY_KEY) {
      return { success: false, message: 'Invalid Master Recovery Key. Contact Chief Systems Officer.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    setAdminPassword(newPassword);
    try {
      localStorage.setItem('phoneverse_admin_pwd', newPassword);
    } catch (e) {
      console.error(e);
    }

    return { success: true, message: 'Admin password has been reset successfully! You can now log in.' };
  };

  const customerLogin = (email: string, password: string): { success: boolean; message: string } => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      role: 'customer',
      is_active: true
    };
    setUser(newUser);
    try {
      localStorage.setItem('phoneverse_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    return { success: true, message: 'Logged in successfully.' };
  };

  const customerRegister = (fullName: string, email: string, password: string): { success: boolean; message: string } => {
    if (!fullName || !email || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: fullName,
      role: 'customer',
      is_active: true
    };
    setUser(newUser);
    try {
      localStorage.setItem('phoneverse_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    return { success: true, message: 'Account registered successfully.' };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('phoneverse_user');
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        adminLogin,
        changeAdminPassword,
        resetAdminPassword,
        customerLogin,
        customerRegister,
        logout,
        isAuthenticated,
        isAdmin,
        currentAdminEmail: DEFAULT_ADMIN_EMAIL
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
