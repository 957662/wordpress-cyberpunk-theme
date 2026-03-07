/**
 * User Service
 * 用户相关 API 服务
 */

import { apiClient } from './api-client';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  joinedAt: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: File;
}

export interface UserActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow';
  content: string;
  createdAt: string;
  relatedPost?: {
    id: string;
    title: string;
    slug: string;
  };
}

// ============================================================================
// User Service
// ============================================================================

class UserService {
  private readonly basePath = '/users';

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ data: User }>(`${this.basePath}/me`);
    return response.data;
  }

  /**
   * 根据 ID 获取用户信息
   */
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<{ data: User }>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * 根据 username 获取用户信息
   */
  async getUserByUsername(username: string): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      `${this.basePath}/username/${username}`
    );
    return response.data;
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.patch<{ data: User }>(
      `${this.basePath}/profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ data: { url: string } }>(
      `${this.basePath}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * 获取用户动态
   */
  async getUserActivity(userId?: number, page = 1, limit = 20): Promise<UserActivity[]> {
    const endpoint = userId ? `${this.basePath}/${userId}/activity` : `${this.basePath}/me/activity`;
    const response = await apiClient.get<{ data: UserActivity[] }>(endpoint, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * 关注用户
   */
  async followUser(userId: number): Promise<void> {
    await apiClient.post(`${this.basePath}/${userId}/follow`);
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${userId}/follow`);
  }

  /**
   * 获取关注列表
   */
  async getFollowing(userId?: number, page = 1, limit = 20): Promise<User[]> {
    const endpoint = userId ? `${this.basePath}/${userId}/following` : `${this.basePath}/me/following`;
    const response = await apiClient.get<{ data: User[] }>(endpoint, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * 获取粉丝列表
   */
  async getFollowers(userId?: number, page = 1, limit = 20): Promise<User[]> {
    const endpoint = userId ? `${this.basePath}/${userId}/followers` : `${this.basePath}/me/followers`;
    const response = await apiClient.get<{ data: User[] }>(endpoint, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * 检查是否关注了某个用户
   */
  async isFollowing(userId: number): Promise<boolean> {
    try {
      await apiClient.get(`${this.basePath}/${userId}/follow`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 删除账户
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.basePath}/me`);
  }
}

// 导出单例
export const userService = new UserService();
