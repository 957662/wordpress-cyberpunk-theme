/**
 * 认证服务
 * 处理用户认证相关API调用
 */

import { httpClient } from '../http-client';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: User;
}

export class AuthService {
  private baseUrl = '/api/v1/auth';

  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await httpClient.post<TokenResponse>(
      `${this.baseUrl}/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // 保存令牌
    if (response.access_token) {
      this.setAccessToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
      
      if (response.user) {
        this.setCurrentUser(response.user);
      }
    }

    return response;
  }

  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await httpClient.post<User>(
      `${this.baseUrl}/register`,
      data
    );

    return response;
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await httpClient.post<TokenResponse>(
      `${this.baseUrl}/refresh`,
      { refresh_token: refreshToken }
    );

    // 更新令牌
    if (response.access_token) {
      this.setAccessToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
    }

    return response;
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>(`${this.baseUrl}/me`);
    this.setCurrentUser(response);
    return response;
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerification(email: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/resend-verification`, { email });
  }

  /**
   * 请求密码重置
   */
  async requestPasswordReset(email: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/reset-password-request`, { email });
  }

  /**
   * 确认密码重置
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/reset-password-confirm`, {
      token,
      new_password: newPassword,
    });
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
    this.clearAuth();
  }

  /**
   * 保存访问令牌
   */
  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * 保存刷新令牌
   */
  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  /**
   * 保存当前用户信息
   */
  private setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  /**
   * 清除认证信息
   */
  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('current_user');
    }
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// 导出单例
export const authService = new AuthService();
