/**
 * Auth API Service
 * 认证相关 API 服务
 */

import { apiClient } from './api-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export const authApi = {
  /**
   * 用户登录
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  /**
   * 刷新令牌
   */
  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/refresh', data);
    return response.data;
  },

  /**
   * 发送密码重置邮件
   */
  sendPasswordResetEmail: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/password-reset/send', { email });
  },

  /**
   * 重置密码
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/api/auth/password-reset/confirm', {
      token,
      newPassword,
    });
  },

  /**
   * 发送验证邮件
   */
  sendVerificationEmail: async (): Promise<void> => {
    await apiClient.post('/api/auth/send-verification-email');
  },

  /**
   * 验证邮箱
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/api/auth/verify-email', { token });
  },
};

export default authApi;
