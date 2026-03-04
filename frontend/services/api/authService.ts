/**
 * 认证服务
 * 处理用户认证相关的 API 请求
 */

import { httpClient } from './httpClient';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await httpClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // 存储 token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    return response;
  },

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    // 存储 token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    return response;
  },

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      // 清除本地存储的 token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>('/auth/me');
  },

  /**
   * 刷新 token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    // 更新 token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    return response;
  },

  /**
   * 请求密码重置
   */
  async requestPasswordReset(email: string): Promise<void> {
    await httpClient.post('/auth/password-reset/request', { email });
  },

  /**
   * 确认密码重置
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await httpClient.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  },

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await httpClient.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};
