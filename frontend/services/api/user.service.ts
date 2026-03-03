/**
 * User Service
 * 用户服务 - 处理用户相关操作
 */

interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  interests?: string[];
}

interface UserStats {
  posts: number;
  comments: number;
  followers: number;
  following: number;
  likesReceived: number;
}

interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  interests?: string[];
}

class UserService {
  private baseUrl: string;
  private endpoints = {
    users: '/api/users',
    profile: '/api/users/profile',
    stats: '/api/users/stats',
    follow: '/api/users/follow',
    search: '/api/users/search',
    settings: '/api/users/settings',
  };

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.users}/me`);

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  }

  /**
   * 获取用户信息
   */
  async getUser(userId: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.users}/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  /**
   * 获取用户资料
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.profile}/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.profile}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  /**
   * 获取用户统计
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.stats}/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return response.json();
  }

  /**
   * 关注用户
   */
  async followUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.follow}/${userId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to follow user');
    }
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.follow}/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to unfollow user');
    }
  }

  /**
   * 搜索用户
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.search}?q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to search users');
    }

    return response.json();
  }

  /**
   * 获取用户关注列表
   */
  async getFollowing(userId: string, page: number = 1): Promise<{ users: User[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.users}/${userId}/following?page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch following list');
    }

    return response.json();
  }

  /**
   * 获取用户粉丝列表
   */
  async getFollowers(userId: string, page: number = 1): Promise<{ users: User[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.users}/${userId}/followers?page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch followers list');
    }

    return response.json();
  }

  /**
   * 更新用户设置
   */
  async updateSettings(settings: Record<string, any>): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.settings}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}${this.endpoints.profile}/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json();
  }

  /**
   * 删除账号
   */
  async deleteAccount(): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.users}/me`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  }
}

// 导出单例实例
export const userService = new UserService();
export default userService;
