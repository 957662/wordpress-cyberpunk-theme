/**
 * 用户认证服务
 * 处理登录、注册、令牌管理
 */

import { axiosInstance } from '@/lib/wordpress/client';

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
  capabilities?: Record<string, boolean>;
}

// 认证响应
export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  expires_in?: number;
}

// 登录凭据
export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

// 注册数据
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// 令牌存储
const TOKEN_KEY = 'cyberpress_auth_token';
const REFRESH_TOKEN_KEY = 'cyberpress_refresh_token';
const USER_KEY = 'cyberpress_user';

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // 从存储中恢复会话
    this.loadSession();
  }

  /**
   * 加载已保存的会话
   */
  private loadSession() {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);

      if (token) {
        this.token = token;
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      if (refreshToken) {
        this.refreshToken = refreshToken;
      }

      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  /**
   * 保存会话
   */
  private saveSession(token: string, refreshToken: string | undefined, user: User) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    this.token = token;
    this.refreshToken = refreshToken || null;
    this.user = user;

    // 更新 axios 默认头
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 清除会话
   */
  private clearSession() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiry = null;

    delete axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post('/cyberpress/v1/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });

      const { token, refresh_token, user, expires_in } = response.data;

      this.saveSession(token, refresh_token, user);

      // 设置令牌过期时间
      if (expires_in) {
        this.tokenExpiry = Date.now() + expires_in * 1000;
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '登录失败，请检查您的凭据');
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post('/cyberpress/v1/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        name: data.name,
      });

      const { token, refresh_token, user, expires_in } = response.data;

      this.saveSession(token, refresh_token, user);

      // 设置令牌过期时间
      if (expires_in) {
        this.tokenExpiry = Date.now() + expires_in * 1000;
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '注册失败，请稍后再试');
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await axiosInstance.post('/cyberpress/v1/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * 刷新令牌
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axiosInstance.post('/cyberpress/v1/auth/refresh', {
        refresh_token: this.refreshToken,
      });

      const { token, refresh_token, expires_in } = response.data;

      // 更新令牌
      localStorage.setItem(TOKEN_KEY, token);
      if (refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        this.refreshToken = refresh_token;
      }

      this.token = token;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 更新过期时间
      if (expires_in) {
        this.tokenExpiry = Date.now() + expires_in * 1000;
      }

      return token;
    } catch (error: any) {
      this.clearSession();
      throw new Error(error.response?.data?.message || '令牌刷新失败，请重新登录');
    }
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  /**
   * 检查令牌是否即将过期
   */
  isTokenExpiringSoon(threshold: number = 300000): boolean {
    if (!this.tokenExpiry) return false;
    return Date.now() + threshold > this.tokenExpiry;
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return this.token;
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axiosInstance.put('/cyberpress/v1/auth/profile', data);

      const updatedUser = response.data;
      this.user = updatedUser;
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '更新资料失败');
    }
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      await axiosInstance.post('/cyberpress/v1/auth/change-password', {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '密码修改失败');
    }
  }

  /**
   * 请求重置密码
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await axiosInstance.post('/cyberpress/v1/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '请求失败');
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
  }): Promise<void> {
    try {
      await axiosInstance.post('/cyberpress/v1/auth/reset-password', {
        token: data.token,
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '密码重置失败');
    }
  }

  /**
   * 验证令牌
   */
  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await axiosInstance.get('/cyberpress/v1/auth/verify');
      return response.data.valid;
    } catch (error) {
      this.clearSession();
      return false;
    }
  }

  /**
   * 检查用户权限
   */
  hasCapability(capability: string): boolean {
    return this.user?.capabilities?.[capability] || false;
  }

  /**
   * 检查用户角色
   */
  hasRole(role: string): boolean {
    return this.user?.roles?.includes(role) || false;
  }

  /**
   * 是否为管理员
   */
  isAdmin(): boolean {
    return this.hasRole('administrator') || this.hasRole('admin');
  }
}

// 创建单例实例
export const authService = new AuthService();

// 导出类型
export type { User, LoginCredentials, RegisterData, AuthResponse };
