/**
 * Auth API
 * 认证相关 API 接口
 */

import { apiClient } from './client';
import { ApiResponse } from './client';

// 认证相关类型定义
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>(
    '/v1/auth/login',
    credentials
  );
  return response.data;
}

/**
 * 用户注册
 */
export async function register(userData: RegisterRequest): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>(
    '/v1/auth/register',
    userData
  );
  return response.data;
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/v1/auth/me');
  return response.data;
}

/**
 * 刷新访问令牌
 */
export async function refreshToken(): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/v1/auth/refresh');
  return response.data;
}

/**
 * 用户登出
 */
export async function logout(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/v1/auth/logout');
  return response.data;
}

/**
 * 请求重置密码
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    '/v1/auth/reset-password',
    null,
    {
      params: { email }
    }
  );
  return response.data;
}

/**
 * 确认重置密码
 */
export async function confirmPasswordReset(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    '/v1/auth/confirm-reset-password',
    { token, new_password: newPassword }
  );
  return response.data;
}

/**
 * 更新用户资料
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>(
    '/v1/auth/profile',
    data
  );
  return response.data;
}

/**
 * 修改密码
 */
export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    '/v1/auth/change-password',
    data
  );
  return response.data;
}

// 导出所有认证相关的 API
export const authApi = {
  login,
  register,
  getCurrentUser,
  refreshToken,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  updateProfile,
  changePassword,
};

export default authApi;
