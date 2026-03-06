/**
 * User API Client
 * 提供用户相关的API调用
 */

import { ApiResponse } from './types';

/**
 * 用户类型定义
 */
export interface User {
  id: string | number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  status: 'active' | 'inactive' | 'banned';
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 用户注册表单
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

/**
 * 用户登录表单
 */
export interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 用户资料更新表单
 */
export interface ProfileFormData {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar?: string;
}

/**
 * 密码更改表单
 */
export interface PasswordChangeFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * 密码重置请求
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * 密码重置确认
 */
export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

/**
 * 用户统计信息
 */
export interface UserStats {
  posts_count: number;
  comments_count: number;
  likes_count: number;
  bookmarks_count: number;
  followers_count: number;
  following_count: number;
  views_count: number;
}

/**
 * 关注的用户信息
 */
export interface FollowerUser {
  id: string | number;
  username: string;
  name?: string;
  avatar?: string;
  bio?: string;
  followers_count: number;
  is_following?: boolean;
}

/**
 * User API 客户端类
 */
class UserAPI {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * 清除认证令牌
   */
  clearAuthToken() {
    const { Authorization, ...rest } = this.headers as any;
    this.headers = rest;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 用户登录
   */
  async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  /**
   * 获取当前用户信息
   */
  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  /**
   * 获取用户信息
   */
  async getUser(id: string | number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  /**
   * 获取用户信息（通过用户名）
   */
  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/username/${username}`);
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: ProfileFormData): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更改密码
   */
  async changePassword(
    data: PasswordChangeFormData
  ): Promise<ApiResponse<void>> {
    return this.request<void>('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * 请求密码重置
   */
  async requestPasswordReset(
    data: PasswordResetRequest
  ): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 确认密码重置
   */
  async confirmPasswordReset(
    data: PasswordResetConfirm
  ): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/password/reset/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${this.baseURL}/users/me/avatar`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 获取用户统计信息
   */
  async getStats(): Promise<ApiResponse<UserStats>> {
    return this.request<UserStats>('/users/me/stats');
  }

  /**
   * 获取用户的关注列表
   */
  async getFollowing(
    userId: string | number,
    page: number = 1
  ): Promise<ApiResponse<{ data: FollowerUser[]; total: number }>> {
    return this.request<{ data: FollowerUser[]; total: number }>(
      `/users/${userId}/following?page=${page}`
    );
  }

  /**
   * 获取用户的粉丝列表
   */
  async getFollowers(
    userId: string | number,
    page: number = 1
  ): Promise<ApiResponse<{ data: FollowerUser[]; total: number }>> {
    return this.request<{ data: FollowerUser[]; total: number }>(
      `/users/${userId}/followers?page=${page}`
    );
  }

  /**
   * 关注用户
   */
  async followUser(userId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/follow`, {
      method: 'DELETE',
    });
  }

  /**
   * 封禁用户（管理员）
   */
  async banUser(userId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/ban`, {
      method: 'POST',
    });
  }

  /**
   * 解封用户（管理员）
   */
  async unbanUser(userId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}/ban`, {
      method: 'DELETE',
    });
  }

  /**
   * 删除用户（管理员）
   */
  async deleteUser(userId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

/**
 * 导出单例实例
 */
export const userApi = new UserAPI();

/**
 * 导出类型
 */
export type {
  User,
  RegisterFormData,
  LoginFormData,
  ProfileFormData,
  PasswordChangeFormData,
  PasswordResetRequest,
  PasswordResetConfirm,
  AuthResponse,
  UserStats,
  FollowerUser,
};
