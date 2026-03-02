/**
 * 增强的用户服务
 * 提供完整的用户管理功能
 */

import { authApi } from '../api/auth';
import type { UserResponse, UpdateProfileRequest, ChangePasswordRequest } from '../api/auth';

// 扩展的用户类型
export interface UserProfile extends UserResponse {
  posts_count?: number;
  projects_count?: number;
  total_views?: number;
  followers_count?: number;
  following_count?: number;
}

export interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  thisMonthPosts: number;
  thisMonthViews: number;
  topPosts: Array<{
    id: number;
    title: string;
    views: number;
  }>;
}

export interface UserNotificationSettings {
  email_notifications: boolean;
  comment_notifications: boolean;
  weekly_digest: boolean;
  new_follower: boolean;
  mention_notifications: boolean;
}

class UserService {
  private readonly USER_CACHE_KEY = 'cyberpress_user_cache';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  /**
   * 获取当前用户完整信息
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const user = await authApi.getCurrentUser();
      this.cacheUserProfile(user);
      return user;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await fetch('/api/v1/users/me/stats', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // 返回默认统计信息
      return {
        totalPosts: 0,
        totalComments: 0,
        totalViews: 0,
        thisMonthPosts: 0,
        thisMonthViews: 0,
        topPosts: [],
      };
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const updatedUser = await authApi.updateProfile(data);
      this.cacheUserProfile(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await authApi.changePassword(data);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/v1/users/me/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      return data.avatar_url;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }

  /**
   * 获取通知设置
   */
  async getNotificationSettings(): Promise<UserNotificationSettings> {
    try {
      const response = await fetch('/api/v1/users/me/notifications/settings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      // 返回默认设置
      return {
        email_notifications: true,
        comment_notifications: true,
        weekly_digest: true,
        new_follower: true,
        mention_notifications: true,
      };
    }
  }

  /**
   * 更新通知设置
   */
  async updateNotificationSettings(
    settings: Partial<UserNotificationSettings>
  ): Promise<UserNotificationSettings> {
    try {
      const response = await fetch('/api/v1/users/me/notifications/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * 删除账户
   */
  async deleteAccount(password: string): Promise<void> {
    try {
      const response = await fetch('/api/v1/users/me/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  }

  /**
   * 导出用户数据
   */
  async exportUserData(): Promise<Blob> {
    try {
      const response = await fetch('/api/v1/users/me/export', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export user data');
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * 从缓存获取用户信息
   */
  getCachedUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.USER_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // 检查缓存是否过期
      if (now - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.USER_CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * 清除用户缓存
   */
  clearUserCache(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_CACHE_KEY);
    }
  }

  /**
   * 私有方法：缓存用户信息
   */
  private cacheUserProfile(user: UserProfile): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheData = {
        data: user,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.USER_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache user profile:', error);
    }
  }

  /**
   * 私有方法：获取认证令牌
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cyberpress_access_token');
  }

  /**
   * 格式化用户信息显示
   */
  formatUserDisplayName(user: UserProfile): string {
    if (user.full_name) {
      return user.full_name;
    }
    return user.username;
  }

  /**
   * 获取用户头像URL
   */
  getUserAvatarUrl(user: UserProfile, defaultAvatar?: string): string {
    if (user.avatar_url) {
      return user.avatar_url;
    }
    return defaultAvatar || '/images/default-avatar.png';
  }

  /**
   * 检查用户是否为管理员
   */
  isAdmin(user: UserProfile | null): boolean {
    // 这里需要根据实际的用户角色字段进行调整
    return user?.is_active && (user as any).is_superuser === true;
  }

  /**
   * 检查用户是否已验证
   */
  isVerified(user: UserProfile | null): boolean {
    return user?.is_verified || false;
  }
}

// 导出单例
export const userService = new UserService();

// 导出 React Hook
export function useUser() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [stats, setStats] = React.useState<UserStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cachedUser = userService.getCachedUserProfile();
        if (cachedUser) {
          setUser(cachedUser);
        }

        const userProfile = await userService.getCurrentUserProfile();
        setUser(userProfile);

        const userStats = await userService.getUserStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = React.useCallback(async (data: UpdateProfileRequest) => {
    const updatedUser = await userService.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const changePassword = React.useCallback(async (data: ChangePasswordRequest) => {
    await userService.changePassword(data);
  }, []);

  const uploadAvatar = React.useCallback(async (file: File) => {
    const avatarUrl = await userService.uploadAvatar(file);
    if (user) {
      setUser({ ...user, avatar_url: avatarUrl });
    }
    return avatarUrl;
  }, [user]);

  return {
    user,
    stats,
    loading,
    updateProfile,
    changePassword,
    uploadAvatar,
    formatDisplayName: () => userService.formatUserDisplayName(user || {}),
    getAvatarUrl: (defaultAvatar?: string) => userService.getUserAvatarUrl(user || {}, defaultAvatar),
    isAdmin: () => userService.isAdmin(user),
    isVerified: () => userService.isVerified(user),
  };
}

// 导入 React（仅在需要时）
import React from 'react';
