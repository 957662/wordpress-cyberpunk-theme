/**
 * useAuth - 认证相关的 Hook
 * 处理用户登录、注册、登出等
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 初始化时检查用户登录状态
  useEffect(() => {
    checkAuth();
  }, []);

  // 检查认证状态
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Token 无效，清除它
        localStorage.removeItem('auth_token');
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 登录
  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      const { user, token } = await response.json();

      // 保存 token
      localStorage.setItem('auth_token', token);

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('登录成功！');

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || '登录失败，请稍后重试';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // 注册
  const register = async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '注册失败');
      }

      const { user, token } = await response.json();

      // 保存 token
      localStorage.setItem('auth_token', token);

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('注册成功！');

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || '注册失败，请稍后重试';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    toast.success('已退出登录');
    router.push('/');
  }, [router]);

  // 更新用户信息
  const updateProfile = async (data: Partial<User>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '更新失败');
      }

      const updatedUser = await response.json();

      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

      toast.success('个人信息已更新！');

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || '更新失败，请稍后重试';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };
}
