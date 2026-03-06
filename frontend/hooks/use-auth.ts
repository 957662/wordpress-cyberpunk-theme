/**
 * useAuth Hook
 * 认证 Hook
 *
 * 提供用户认证相关的状态和操作
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { authStoreEnhanced } from '@/store/auth-store';
import type { User } from '@/types';

// ==================== 类型定义 ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==================== useAuth Hook ====================

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: authStoreEnhanced.getState().user,
    isAuthenticated: authStoreEnhanced.getState().isAuthenticated,
    isLoading: false,
    error: null,
  });

  // 订阅认证状态变化
  useEffect(() => {
    const unsubscribe = authStoreEnhanced.subscribe((newState) => {
      setState({
        user: newState.user,
        isAuthenticated: newState.isAuthenticated,
        isLoading: newState.isLoading,
        error: null,
      });
    });

    return unsubscribe;
  }, []);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authStoreEnhanced.login(email, password);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '登录失败'
      }));
      throw error;
    }
  }, []);

  // 注册
  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authStoreEnhanced.register(data);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '注册失败'
      }));
      throw error;
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authStoreEnhanced.logout();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '登出失败'
      }));
      throw error;
    }
  }, []);

  // 更新资料
  const updateProfile = useCallback(async (data: {
    full_name?: string;
    bio?: string;
    website_url?: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authStoreEnhanced.updateProfile(data);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '更新资料失败'
      }));
      throw error;
    }
  }, []);

  // 上传头像
  const uploadAvatar = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authStoreEnhanced.uploadAvatar(file);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '上传头像失败'
      }));
      throw error;
    }
  }, []);

  // 刷新令牌
  const refreshTokens = useCallback(async () => {
    try {
      await authStoreEnhanced.refreshTokens();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || '刷新令牌失败'
      }));
      throw error;
    }
  }, []);

  // 权限检查
  const hasPermission = useCallback((permission: string): boolean => {
    return authStoreEnhanced.hasPermission(permission);
  }, []);

  const isAuthor = useCallback((): boolean => {
    return authStoreEnhanced.isAuthor();
  }, []);

  const isAdmin = useCallback((): boolean => {
    return authStoreEnhanced.isAdmin();
  }, []);

  const isVerified = useCallback((): boolean => {
    return authStoreEnhanced.isVerified();
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    refreshTokens,
    hasPermission,
    isAuthor,
    isAdmin,
    isVerified,
  };
}

// ==================== 辅助 Hooks ====================

/**
 * 检查是否已登录
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 重定向到登录页面
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}

/**
 * 检查是否是作者
 */
export function useRequireAuthor() {
  const { isAuthor, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAuthor()) {
      // 重定向到首页或显示错误
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }, [isAuthenticated, isLoading, isAuthor]);

  return { isAuthor: isAuthor(), isAuthenticated, isLoading };
}

/**
 * 检查是否是管理员
 */
export function useRequireAdmin() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin()) {
      // 重定向到首页或显示错误
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }, [isAuthenticated, isLoading, isAdmin]);

  return { isAdmin: isAdmin(), isAuthenticated, isLoading };
}

// ==================== 客户端工具函数 ====================

/**
 * 获取存储的令牌
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * 获取存储的刷新令牌
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * 清除认证信息
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('cyberpress_auth');
}

/**
 * 检查令牌是否即将过期
 */
export function isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    return (exp - now) < thresholdMinutes * 60 * 1000;
  } catch {
    return true;
  }
}

/**
 * 获取令牌剩余时间（秒）
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((exp - now) / 1000));
  } catch {
    return 0;
  }
}
