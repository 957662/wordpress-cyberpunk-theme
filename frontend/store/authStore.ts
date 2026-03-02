/**
 * CyberPress Platform - Authentication Store
 * 用户认证状态管理 (使用 Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  bio?: string;
  website?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // 设置用户
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      // 设置令牌
      setToken: (token) => {
        set({ token });
        // 同时更新默认 axios header
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('auth_token', token);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      },

      // 设置加载状态
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // 登录
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        // 持久化 token
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
      },

      // 登出
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // 清除 token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      },

      // 更新用户信息
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      // 检查认证状态
      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          // TODO: 实际项目中应该调用 API 验证 token
          // const response = await fetch('/api/auth/me', {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // });
          // const user = await response.json();

          // 模拟验证成功
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
        }
      },
    }),
    {
      name: 'cyberpress-auth-storage',
      // 只持久化特定字段
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 选择器 hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
    checkAuth: state.checkAuth,
  }));

// 工具函数
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const canEdit = (user: User | null): boolean => {
  return hasRole(user, ['admin', 'editor', 'author']);
};

export const canDelete = (user: User | null): boolean => {
  return hasRole(user, ['admin', 'editor']);
};
