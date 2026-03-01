/**
 * 认证相关的自定义 Hooks
 */

import { useEffect, useCallback, useState } from 'react';
import { useAuthStore, useUser, useIsAuthenticated, useAuthActions } from '@/store/authStore';
import { authService, LoginCredentials, RegisterData } from '@/lib/services/auth';

/**
 * 认证 Hook
 * 提供完整的认证功能
 */
export function useAuth() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { login, logout, updateUser } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 登录函数
  const loginUser = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      login(response.user, response.token);
      return { success: true, user: response.user };
    } catch (err: any) {
      const errorMessage = err.message || '登录失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // 注册函数
  const registerUser = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      login(response.user, response.token);
      return { success: true, user: response.user };
    } catch (err: any) {
      const errorMessage = err.message || '注册失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // 登出函数
  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      logout();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || '登出失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // 更新用户资料
  const updateProfile = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(data);
      updateUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err: any) {
      const errorMessage = err.message || '更新失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  // 修改密码
  const changePassword = useCallback(async (data: { oldPassword: string; newPassword: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.changePassword(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || '密码修改失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 重置密码
  const resetPassword = useCallback(async (data: { token: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || '密码重置失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 请求重置密码
  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || '请求失败';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // 状态
    user,
    isAuthenticated,
    isLoading,
    error,

    // 操作
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateProfile,
    changePassword,
    resetPassword,
    requestPasswordReset,

    // 工具方法
    clearError: () => setError(null),
    hasRole: (role: string) => user?.roles?.includes(role) || false,
    hasCapability: (capability: string) => user?.capabilities?.[capability] || false,
    isAdmin: () => user?.roles?.includes('administrator') || user?.roles?.includes('admin') || false,
  };
}

/**
 * 认证检查 Hook
 * 在组件挂载时检查用户认证状态
 */
export function useAuthCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查本地存储的用户信息和令牌
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('cyberpress_auth_token');
          const userStr = localStorage.getItem('cyberpress_user');

          if (token && userStr) {
            const user = JSON.parse(userStr);
            setToken(token);
            setUser(user);

            // 验证令牌是否有效
            const isValid = await authService.verifyToken();
            if (!isValid) {
              // 令牌无效，清除状态
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [setUser, setToken]);

  return { isChecking };
}

/**
 * 受保护路由 Hook
 * 检查用户是否有权限访问某个路由
 */
export function useProtectedRoute(requiredRole?: string) {
  const { isAuthenticated } = useAuthStore();
  const user = useUser();

  const hasAccess = useCallback(() => {
    if (!isAuthenticated) {
      return { hasAccess: false, reason: 'not_authenticated' };
    }

    if (requiredRole && !user?.roles?.includes(requiredRole)) {
      return { hasAccess: false, reason: 'insufficient_permissions' };
    }

    return { hasAccess: true, reason: null };
  }, [isAuthenticated, user, requiredRole]);

  return {
    isAuthenticated,
    hasAccess: hasAccess(),
    user,
  };
}

/**
 * 令牌刷新 Hook
 * 自动在令牌即将过期时刷新
 */
export function useTokenRefresh() {
  const { logout, setToken } = useAuthActions();

  useEffect(() => {
    // 每5分钟检查一次令牌是否需要刷新
    const interval = setInterval(async () => {
      if (authService.isTokenExpiringSoon(300000)) { // 5分钟
        try {
          const newToken = await authService.refreshAccessToken();
          setToken(newToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval);
  }, [logout, setToken]);
}

/**
 * 用户权限 Hook
 * 检查用户是否有特定权限
 */
export function usePermissions() {
  const user = useUser();

  return {
    canEdit: () => user?.capabilities?.edit_posts || false,
    canPublish: () => user?.capabilities?.publish_posts || false,
    canDelete: () => user?.capabilities?.delete_posts || false,
    canModerate: () => user?.capabilities?.moderate_comments || false,
    canUpload: () => user?.capabilities?.upload_files || false,
    hasRole: (role: string) => user?.roles?.includes(role) || false,
    hasCapability: (capability: string) => user?.capabilities?.[capability] || false,
    roles: user?.roles || [],
    capabilities: user?.capabilities || {},
  };
}
