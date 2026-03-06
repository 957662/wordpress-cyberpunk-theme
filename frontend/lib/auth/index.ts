/**
 * 认证系统核心库
 * @description 完整的认证、授权、会话管理系统
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';

// =====================================================
// 类型定义
// =====================================================

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  display_name?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

// =====================================================
// 认证服务类
// =====================================================

class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'auth_tokens';
  private readonly USER_KEY = 'auth_user';
  private readonly REFRESH_THRESHOLD = 300; // 5 minutes in seconds

  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.initTokenRefresh();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // =====================================================
  // 存储管理
  // =====================================================

  private setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    const expiresAt = Date.now() + (tokens.expires_in * 1000);
    const tokenData = {
      ...tokens,
      expires_at: expiresAt,
    };

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));

    // 设置自动刷新
    this.scheduleTokenRefresh(tokens.expires_in);
  }

  private getStoredTokens(): AuthTokens & { expires_at: number } | null {
    if (typeof window === 'undefined') return null;

    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) return null;

    try {
      return JSON.parse(tokenData);
    } catch {
      return null;
    }
  }

  private setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  private clearAuthData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // =====================================================
  // Token 刷新
  // =====================================================

  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    const refreshTime = (expiresIn - this.REFRESH_THRESHOLD) * 1000;

    this.tokenRefreshTimer = setTimeout(() => {
      this.refreshAccessToken();
    }, refreshTime);
  }

  private async refreshAccessToken(): Promise<void> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refresh_token) {
      this.clearAuthData();
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: tokens.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: AuthTokens = await response.json();
      this.setTokens(data);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      window.location.href = '/login';
    }
  }

  private initTokenRefresh(): void {
    if (typeof window === 'undefined') return;

    const tokens = this.getStoredTokens();
    if (tokens && tokens.expires_at) {
      const timeUntilExpiry = tokens.expires_at - Date.now();
      const timeUntilRefresh = Math.max(0, timeUntilExpiry - (this.REFRESH_THRESHOLD * 1000));

      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshAccessToken();
      }, timeUntilRefresh);
    }
  }

  // =====================================================
  // 认证方法
  // =====================================================

  /**
   * 登录
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const { user, tokens } = data;

    this.setTokens(tokens);
    this.setUser(user);

    return user;
  }

  /**
   * 注册
   */
  async register(userData: RegisterData): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    const { user, tokens } = data;

    this.setTokens(tokens);
    this.setUser(user);

    return user;
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
      window.location.href = '/';
    }
  }

  /**
   * 忘记密码
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Forgot password request failed');
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset password failed');
    }
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerificationEmail(): Promise<void> {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Resend verification failed');
    }
  }

  // =====================================================
  // 工具方法
  // =====================================================

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.access_token || null;
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.refresh_token || null;
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.getStoredUser();
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    const user = this.getStoredUser();

    if (!tokens || !user) return false;

    // 检查 token 是否过期
    if (tokens.expires_at && Date.now() > tokens.expires_at) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  /**
   * 获取认证头
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * 检查用户权限
   */
  hasPermission(requiredRole: User['role']): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy: Record<User['role'], number> = {
      admin: 4,
      editor: 3,
      author: 2,
      subscriber: 1,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * 更新用户信息
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    const updatedUser: User = await response.json();
    this.setUser(updatedUser);

    return updatedUser;
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }
  }

  /**
   * 删除账户
   */
  async deleteAccount(password: string): Promise<void> {
    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Account deletion failed');
    }

    this.clearAuthData();
    window.location.href = '/';
  }
}

// =====================================================
// 导出单例
// =====================================================

export const authService = AuthService.getInstance();

// =====================================================
// React Hooks
// =====================================================

/**
 * useAuth Hook - 认证状态管理
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    tokens: authService.getStoredTokens(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.login(credentials);
      setState({
        user,
        tokens: authService.getStoredTokens(),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.register(userData);
      setState({
        user,
        tokens: authService.getStoredTokens(),
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authService.logout();
  }, []);

  const refreshUser = useCallback(() => {
    setState({
      user: authService.getCurrentUser(),
      tokens: authService.getStoredTokens(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    authService,
  };
}

/**
 * useUser Hook - 当前用户信息
 */
export function useUser() {
  const { user, isAuthenticated } = useAuth();
  return user;
}

/**
 * usePermissions Hook - 权限检查
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = useCallback((requiredRole: User['role']) => {
    return authService.hasPermission(requiredRole);
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  const isEditor = useCallback(() => {
    return hasRole('editor');
  }, [hasRole]);

  const canEdit = useCallback((resourceUserId?: string) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'editor' || user.id === resourceUserId;
  }, [user]);

  return {
    hasRole,
    isAdmin,
    isEditor,
    canEdit,
  };
}

// =====================================================
// 高阶组件
// =====================================================

/**
 * withAuth HOC - 需要认证才能访问
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * withRole HOC - 需要特定角色才能访问
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: User['role']
): React.ComponentType<P> {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const { hasRole } = usePermissions();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated || !hasRole(requiredRole)) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// =====================================================
// 默认导出
// =====================================================

export default authService;
