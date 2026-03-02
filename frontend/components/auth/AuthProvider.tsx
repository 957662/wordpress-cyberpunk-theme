/**
 * 认证提供者组件
 * 管理用户登录状态和认证信息
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCurrentUser } from '@/lib/wordpress/hooks';

interface User {
  id: number;
  name: string;
  email: string;
  url?: string;
  description?: string;
  avatar_urls?: { [key: string]: string };
  roles?: string[];
  capabilities?: { [key: string]: boolean };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasCapability: (capability: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 模拟从 localStorage 加载用户信息
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('cyberpress_user');
        const token = localStorage.getItem('cyberpress_token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 这里应该调用实际的登录 API
      // 目前使用模拟实现
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }

      // 保存用户信息和 token
      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        url: data.user.url,
        description: data.user.description,
        avatar_urls: data.user.avatar_urls,
        roles: data.user.roles,
        capabilities: data.user.capabilities,
      };

      setUser(userData);
      localStorage.setItem('cyberpress_user', JSON.stringify(userData));
      localStorage.setItem('cyberpress_token', data.token);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cyberpress_user');
    localStorage.removeItem('cyberpress_token');
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('cyberpress_user');
    const token = localStorage.getItem('cyberpress_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const hasCapability = useCallback((capability: string): boolean => {
    return user?.capabilities?.[capability] || false;
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refresh,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('administrator') || false,
    hasCapability,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
