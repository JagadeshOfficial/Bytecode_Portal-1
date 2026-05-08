'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Setup axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    Cookies.set('token', token, { expires: 30 }); // 30 days
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Redirect based on role
    const roleRoutes: { [key: string]: string } = {
      'CEO': '/ceo/dashboard',
      'MANAGER': '/manager/dashboard',
      'COUNSELLOR_LEAD': '/manager/dashboard',
      'COUNSELLOR': '/counsellor/leads',
      'MARKETING_LEAD': '/marketing/dashboard',
      'MARKETING_EMPLOYEE': '/marketing/dashboard',
      'SEO_TEAM': '/seo/dashboard',
      'PLACEMENT_OFFICER': '/placement/dashboard'
    };

    router.push(roleRoutes[userData.role] || '/ems/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/ems/login');
  };

  // Route protection logic
  useEffect(() => {
    if (!loading) {
      const isPublicPath = pathname === '/ems/login';
      const isEMSPath = pathname.startsWith('/ems') || pathname.startsWith('/ceo') || pathname.startsWith('/manager') || pathname.startsWith('/counsellor') || pathname.startsWith('/marketing') || pathname.startsWith('/seo') || pathname.startsWith('/placement');

      if (isEMSPath && !isPublicPath && !token) {
        router.push('/ems/login');
      }
    }
  }, [pathname, token, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
