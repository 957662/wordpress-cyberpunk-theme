/**
 * User API Service
 * 用户相关 API 服务
 */

import { apiClient } from './api-client';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const userApi = {
  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/user/me');
    return response.data;
  },

  /**
   * 获取用户详情
   */
  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/user/${userId}`);
    return response.data;
  },

  /**
   * 更新用户资料
   */
  updateProfile: async (data: UpdateUserProfileDto): Promise<User> => {
    const response = await apiClient.patch<User>('/api/user/profile', data);
    return response.data;
  },

  /**
   * 修改密码
   */
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await apiClient.post('/api/user/change-password', data);
  },

  /**
   * 上传头像
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ url: string }>('/api/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * 删除账户
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/api/user/account');
  },
};

export default userApi;
