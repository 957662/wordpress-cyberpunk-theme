/**
 * User API Service
 * Handles all user-related API calls
 */

import { axiosInstance } from '@/lib/api/client';

export interface User {
  id: number;
  username: string;
  email: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface UserStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
  likes_count: number;
}

class UserApiService {
  private readonly basePath = '/users';

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get(`${this.basePath}/me`);
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User> {
    const response = await axiosInstance.get(`${this.basePath}/${userId}`);
    return response.data;
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User> {
    const response = await axiosInstance.get(`${this.basePath}/username/${username}`);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await axiosInstance.patch(`${this.basePath}/me`, data);
    return response.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.post(`${this.basePath}/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await axiosInstance.post(`${this.basePath}/me/change-password`, data);
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId?: number): Promise<UserStats> {
    const path = userId ? `${this.basePath}/${userId}/stats` : `${this.basePath}/me/stats`;
    const response = await axiosInstance.get(path);
    return response.data;
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/me`);
  }

  /**
   * Search users
   */
  async searchUsers(query: string, page = 1, perPage = 20): Promise<{
    data: User[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const response = await axiosInstance.get(`${this.basePath}/search`, {
      params: { q: query, page, per_page: perPage },
    });
    return response.data;
  }

  /**
   * Get user followers
   */
  async getFollowers(userId: number, page = 1, perPage = 20): Promise<{
    data: User[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const response = await axiosInstance.get(`${this.basePath}/${userId}/followers`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  }

  /**
   * Get user following
   */
  async getFollowing(userId: number, page = 1, perPage = 20): Promise<{
    data: User[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const response = await axiosInstance.get(`${this.basePath}/${userId}/following`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  }
}

export const userApi = new UserApiService();
