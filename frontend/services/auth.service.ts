/**
 * 认证服务
 * 处理用户认证、授权、会话管理
 */

import { http } from '@/services/api/base.service';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * 从 localStorage 加载认证信息
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch {
          this.user = null;
        }
      }
    }
  }

  /**
   * 保存认证信息到 localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      if (this.token) {
        localStorage.setItem('auth_token', this.token);
      } else {
        localStorage.removeItem('auth_token');
      }
      if (this.refreshToken) {
        localStorage.setItem('refresh_token', this.refreshToken);
      } else {
        localStorage.removeItem('refresh_token');
      }
      if (this.user) {
        localStorage.setItem('auth_user', JSON.stringify(this.user));
      } else {
        localStorage.removeItem('auth_user');
      }
    }
  }

  /**
   * 清除认证信息
   */
  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>('/auth/login', credentials);
      
      this.token = response.token;
      this.refreshToken = response.refreshToken;
      this.user = response.user;
      this.saveToStorage();

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>('/auth/register', data);
      
      this.token = response.token;
      this.refreshToken = response.refreshToken;
      this.user = response.user;
      this.saveToStorage();

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      await http.post('/auth/logout');
    } catch {
      // 忽略错误，继续清除本地状态
    } finally {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      this.clearStorage();
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
      const response = await http.post<{ token: string }>('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      this.token = response.token;
      this.saveToStorage();

      return response.token;
    } catch (error) {
      // 刷新失败，清除认证信息
      this.logout();
      throw error;
    }
  }

  /**
   * 请求密码重置
   */
  async requestPasswordReset(email: string): Promise<void> {
    await http.post('/auth/password-reset/request', { email });
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await http.post('/auth/password-reset/confirm', data);
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await http.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await http.put<User>('/auth/profile', data);
    this.user = response;
    this.saveToStorage();
    return response;
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return this.token;
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  /**
   * 检查用户角色
   */
  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  /**
   * 检查是否有任一角色
   */
  hasAnyRole(roles: string[]): boolean {
    if (!this.user) return false;
    return roles.includes(this.user.role);
  }
}

// 导出单例
export const authService = AuthService.getInstance();
