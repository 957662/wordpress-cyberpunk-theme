/**
 * 认证上下文
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/lib/hooks';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<UserProfile | null>('cyberpress-user', null);
  const [token, setToken] = useLocalStorage<string | null>('cyberpress-token', null);
  const [isLoading, setIsLoading] = useLocalStorage<boolean>('cyberpress-auth-loading', false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: 实现实际的 API 调用
      const mockUser: UserProfile = {
        id: 1,
        name: 'Cyber User',
        email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber',
      };
      const mockToken = 'mock-jwt-token';

      setUser(mockUser);
      setToken(mockToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
