/**
 * CyberPress Platform - 认证服务
 * ============================================================================
 * 功能: JWT 令牌管理、用户认证、权限控制
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { ls } from './storage-service';

// ============================================================================
// 类型定义
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  status: 'active' | 'inactive' | 'suspended';
  bio?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ============================================================================
// 常量定义
// ============================================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
  REFRESH_EXPIRY: 'auth_refresh_expiry',
} as const;

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分钟（毫秒）
const REFRESH_ATTEMPT_LIMIT = 3;
const REFRESH_ATTEMPT_KEY = 'auth_refresh_attempts';

// ============================================================================
// Token 工具函数
// ============================================================================

/**
 * 解析 JWT Token
 */
export function parseJwt<T = any>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

/**
 * 检查 Token 是否过期
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt<{ exp: number }>(token);
  if (!payload || !payload.exp) return true;

  const expirationTime = payload.exp * 1000; // 转换为毫秒
  return Date.now() >= expirationTime;
}

/**
 * 检查 Token 是否即将过期（在阈值时间内）
 */
export function isTokenExpiringSoon(token: string, threshold: number = TOKEN_REFRESH_THRESHOLD): boolean {
  const payload = parseJwt<{ exp: number }>(token);
  if (!payload || !payload.exp) return true;

  const expirationTime = payload.exp * 1000;
  const timeUntilExpiry = expirationTime - Date.now();

  return timeUntilExpiry <= threshold;
}

/**
 * 获取 Token 的剩余时间（毫秒）
 */
export function getTokenTimeRemaining(token: string): number {
  const payload = parseJwt<{ exp: number }>(token);
  if (!payload || !payload.exp) return 0;

  const expirationTime = payload.exp * 1000;
  return Math.max(0, expirationTime - Date.now());
}

// ============================================================================
// 认证服务类
// ============================================================================

class AuthService {
  private refreshPromise: Promise<AuthTokens | null> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  /**
   * 初始化认证服务
   */
  initialize() {
    // 检查并清理过期的刷新尝试计数
    const attempts = ls.get<number>(REFRESH_ATTEMPT_KEY);
    if (attempts && attempts > 0) {
      ls.remove(REFRESH_ATTEMPT_KEY);
    }

    // 设置自动刷新定时器
    this.setupAutoRefresh();

    // 页面可见性变化时检查 Token
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * 清理认证服务
   */
  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * 设置自动刷新定时器
   */
  private setupAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // 每分钟检查一次是否需要刷新 Token
    this.refreshTimer = setInterval(() => {
      const accessToken = this.getAccessToken();
      if (accessToken && isTokenExpiringSoon(accessToken)) {
        this.refreshAccessToken();
      }
    }, 60 * 1000);
  }

  /**
   * 处理页面可见性变化
   */
  private handleVisibilityChange = () => {
    if (!document.hidden) {
      // 页面变为可见时，检查并刷新 Token
      const accessToken = this.getAccessToken();
      if (accessToken && isTokenExpiringSoon(accessToken, TOKEN_REFRESH_THRESHOLD / 2)) {
        this.refreshAccessToken();
      }
    }
  };

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      const data: AuthResponse = await response.json();

      // 存储令牌和用户数据
      this.setAuthData(data, credentials.rememberMe);

      // 重置刷新尝试计数
      ls.remove(REFRESH_ATTEMPT_KEY);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '注册失败');
      }

      const data: AuthResponse = await response.json();

      // 存储令牌和用户数据
      this.setAuthData(data, true);

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();

      if (refreshToken) {
        // 调用后端登出接口
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        }).catch(() => {
          // 忽略登出 API 错误，继续清理本地数据
        });
      }

      // 清理本地数据
      this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也要清理本地数据
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken(): Promise<AuthTokens | null> {
    // 防止并发刷新
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 检查刷新尝试次数
    const attempts = ls.get<number>(REFRESH_ATTEMPT_KEY) || 0;
    if (attempts >= REFRESH_ATTEMPT_LIMIT) {
      console.error('Token refresh attempt limit reached');
      this.clearAuthData();
      return null;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      if (result) {
        // 重置尝试计数
        ls.remove(REFRESH_ATTEMPT_KEY);
      }
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * 执行令牌刷新
   */
  private async performTokenRefresh(): Promise<AuthTokens | null> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: RefreshTokenResponse = await response.json();

      // 更新访问令牌
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: refreshToken,
        expiresIn: data.expiresIn,
        tokenType: 'Bearer',
      };

      this.setAccessToken(tokens.accessToken);

      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error);

      // 增加刷新尝试计数
      const attempts = (ls.get<number>(REFRESH_ATTEMPT_KEY) || 0) + 1;
      ls.set(REFRESH_ATTEMPT_KEY, attempts, { ttl: 10 * 60 * 1000 }); // 10分钟过期

      // 刷新失败，清理认证数据
      if (attempts >= REFRESH_ATTEMPT_LIMIT) {
        this.clearAuthData();
      }

      return null;
    }
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): User | null {
    return ls.get<User>(STORAGE_KEYS.USER_DATA);
  }

  /**
   * 更新当前用户信息
   */
  updateCurrentUser(updates: Partial<User>): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    ls.set(STORAGE_KEYS.USER_DATA, updatedUser);

    return updatedUser;
  }

  /**
   * 检查用户是否已认证
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return false;

    // 检查访问令牌是否过期
    if (isTokenExpired(accessToken)) {
      // 尝试刷新令牌
      return false;
    }

    return true;
  }

  /**
   * 检查用户是否有指定角色
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * 检查用户是否有任一指定角色
   */
  hasAnyRole(roles: User['role'][]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * 检查用户是否有指定权限
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // 简单的权限检查逻辑（可以根据需要扩展）
    const rolePermissions: Record<User['role'], string[]> = {
      admin: ['*'], // 管理员拥有所有权限
      editor: ['create', 'edit', 'publish', 'delete'],
      author: ['create', 'edit'],
      subscriber: ['read'],
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return ls.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    return ls.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * 设置认证数据
   */
  private setAuthData(data: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? ls : localStorage;

    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.tokens.accessToken);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.tokens.refreshToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));

    // 设置刷新令牌过期时间
    const refreshExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30天
    storage.setItem(STORAGE_KEYS.REFRESH_EXPIRY, refreshExpiry.toString());
  }

  /**
   * 设置访问令牌
   */
  private setAccessToken(token: string): void {
    ls.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * 清理认证数据
   */
  private clearAuthData(): void {
    ls.remove(STORAGE_KEYS.ACCESS_TOKEN);
    ls.remove(STORAGE_KEYS.REFRESH_TOKEN);
    ls.remove(STORAGE_KEYS.USER_DATA);
    ls.remove(STORAGE_KEYS.REFRESH_EXPIRY);
    ls.remove(REFRESH_ATTEMPT_KEY);

    // 清理所有存储（包括 localStorage）
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_EXPIRY);
  }

  /**
   * 获取认证头
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * 修改密码
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '密码修改失败');
    }
  }

  /**
   * 请求密码重置
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '请求失败');
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '密码重置失败');
    }
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '邮箱验证失败');
    }
  }
}

// ============================================================================
// 导出单例
// ============================================================================

export const authService = new AuthService();

// 自动初始化（仅在浏览器环境）
if (typeof window !== 'undefined') {
  authService.initialize();
}

// ============================================================================
// React Hook
// ============================================================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 初始化时获取用户信息
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(authService.isAuthenticated());
    setIsLoading(false);

    // 监听存储变化（多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('auth_')) {
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
        setIsAuthenticated(authService.isAuthenticated());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(authService.isAuthenticated());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole: authService.hasRole.bind(authService),
    hasAnyRole: authService.hasAnyRole.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
  };
}

// ============================================================================
// 高阶组件
// ============================================================================

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: User['role'][];
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, roles, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to access this page.</div>;
  }

  if (roles && !hasAnyRole(roles)) {
    return fallback || <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
}

// ============================================================================
// 导出
// ============================================================================

export default authService;
