/**
 * 用户服务
 * 处理用户管理、权限和角色
 */

import { apiClient } from '../api/client';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';
  capabilities: string[];
  registered: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  meta?: Record<string, any>;
}

export interface UserProfile extends User {
  posts: number;
  comments: number;
  views: number;
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
    timezone: string;
  };
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  role: User['role'];
  avatar?: File;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  newThisMonth: number;
  newThisWeek: number;
  online: number;
}

/**
 * 用户服务类
 */
export class UserService {
  private readonly baseURL = '/users';

  /**
   * 获取当前登录用户
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get(`${this.baseURL}/me`);
    return response.data;
  }

  /**
   * 更新当前用户资料
   */
  async updateCurrentUser(data: Partial<UserFormData>): Promise<UserProfile> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post(`${this.baseURL}/me`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * 更改当前用户密码
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(`${this.baseURL}/me/password`, data);
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post(`${this.baseURL}/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * 获取用户列表（管理后台）
   */
  async getUsers(params?: {
    role?: User['role'];
    status?: User['status'];
    search?: string;
    page?: number;
    perPage?: number;
    orderBy?: 'username' | 'email' | 'registered' | 'posts';
    order?: 'asc' | 'desc';
  }): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/admin`, { params });
    return response.data;
  }

  /**
   * 获取用户详情
   */
  async getUser(userId: string): Promise<UserProfile> {
    const response = await apiClient.get(`${this.baseURL}/${userId}`);
    return response.data;
  }

  /**
   * 创建用户（管理后台）
   */
  async createUser(data: UserFormData): Promise<User> {
    const response = await apiClient.post(`${this.baseURL}`, data);
    return response.data;
  }

  /**
   * 更新用户（管理后台）
   */
  async updateUser(userId: string, data: Partial<UserFormData>): Promise<User> {
    const response = await apiClient.put(`${this.baseURL}/${userId}`, data);
    return response.data;
  }

  /**
   * 删除用户
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${userId}`);
  }

  /**
   * 批量删除用户
   */
  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    await Promise.all(userIds.map(id => this.deleteUser(id)));
  }

  /**
   * 更改用户状态
   */
  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    await apiClient.put(`${this.baseURL}/${userId}/status`, { status });
  }

  /**
   * 批量更新用户状态
   */
  async bulkUpdateStatus(userIds: string[], status: User['status']): Promise<void> {
    await apiClient.put(`${this.baseURL}/bulk/status`, {
      ids: userIds,
      status,
    });
  }

  /**
   * 更改用户角色
   */
  async updateUserRole(userId: string, role: User['role']): Promise<void> {
    await apiClient.put(`${this.baseURL}/${userId}/role`, { role });
  }

  /**
   * 重置用户密码（管理后台）
   */
  async resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
    const response = await apiClient.post(`${this.baseURL}/${userId}/reset-password`);
    return response.data;
  }

  /**
   * 获取用户统计数据
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get(`${this.baseURL}/stats`);
    return response.data;
  }

  /**
   * 获取在线用户列表
   */
  async getOnlineUsers(): Promise<User[]> {
    const response = await apiClient.get(`${this.baseURL}/online`);
    return response.data;
  }

  /**
   * 搜索用户
   */
  async searchUsers(query: string, params?: {
    role?: User['role'];
    limit?: number;
  }): Promise<User[]> {
    const response = await apiClient.get(`${this.baseURL}/search`, {
      params: { q: query, ...params },
    });
    return response.data;
  }

  /**
   * 获取用户的文章
   */
  async getUserPosts(userId: string, params?: {
    page?: number;
    perPage?: number;
    status?: string;
  }): Promise<{
    data: any[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/posts`, { params });
    return response.data;
  }

  /**
   * 获取用户的评论
   */
  async getUserComments(userId: string, params?: {
    page?: number;
    perPage?: number;
  }): Promise<{
    data: any[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/comments`, { params });
    return response.data;
  }

  /**
   * 关注用户
   */
  async followUser(userId: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/${userId}/follow`);
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${userId}/follow`);
  }

  /**
   * 获取用户的关注者
   */
  async getUserFollowers(userId: string, params?: {
    page?: number;
    perPage?: number;
  }): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/followers`, { params });
    return response.data;
  }

  /**
   * 获取用户正在关注的人
   */
  async getUserFollowing(userId: string, params?: {
    page?: number;
    perPage?: number;
  }): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/following`, { params });
    return response.data;
  }

  /**
   * 验证用户名是否可用
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const response = await apiClient.get(`${this.baseURL}/check-username`, {
      params: { username },
    });
    return response.data;
  }

  /**
   * 验证邮箱是否可用
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await apiClient.get(`${this.baseURL}/check-email`, {
      params: { email },
    });
    return response.data;
  }

  /**
   * 获取用户权限列表
   */
  async getUserCapabilities(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseURL}/me/capabilities`);
    return response.data;
  }

  /**
   * 检查是否有特定权限
   */
  async hasCapability(capability: string): Promise<boolean> {
    const capabilities = await this.getUserCapabilities();
    return capabilities.includes(capability);
  }

  /**
   * 更新用户偏好设置
   */
  async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<void> {
    await apiClient.put(`${this.baseURL}/me/preferences`, { preferences });
  }

  /**
   * 删除用户账号
   */
  async deleteOwnAccount(password: string): Promise<void> {
    await apiClient.post(`${this.baseURL}/me/delete`, { password });
  }
}

// 导出单例
export const userService = new UserService();

/**
 * React Query hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, 'current'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

/**
 * 获取当前用户
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => userService.getCurrentUser(),
    retry: false,
  });
}

/**
 * 获取用户列表（管理后台）
 */
export function useUsers(params?: {
  role?: User['role'];
  status?: User['status'];
  search?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: userKeys.list({ admin: true, ...params }),
    queryFn: () => userService.getUsers(params),
  });
}

/**
 * 获取用户详情
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUser(userId),
    enabled: !!userId,
  });
}

/**
 * 获取用户统计
 */
export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    refetchInterval: 30000, // 每30秒刷新
  });
}

/**
 * 获取在线用户
 */
export function useOnlineUsers() {
  return useQuery({
    queryKey: [...userKeys.all, 'online'],
    queryFn: () => userService.getOnlineUsers(),
    refetchInterval: 60000, // 每分钟刷新
  });
}

/**
 * 创建用户
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser.bind(userService),
    onSuccess: () => {
      toast.success('用户创建成功');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '创建失败';
      toast.error(message);
    },
  });
}

/**
 * 更新用户
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserFormData> }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      toast.success('用户已更新');
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: () => {
      toast.error('更新失败');
    },
  });
}

/**
 * 更新当前用户
 */
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateCurrentUser.bind(userService),
    onSuccess: () => {
      toast.success('资料已更新');
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: () => {
      toast.error('更新失败');
    },
  });
}

/**
 * 删除用户
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser.bind(userService),
    onSuccess: () => {
      toast.success('用户已删除');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: () => {
      toast.error('删除失败');
    },
  });
}

/**
 * 批量更新用户状态
 */
export function useBulkUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, status }: { userIds: string[]; status: User['status'] }) =>
      userService.bulkUpdateStatus(userIds, status),
    onSuccess: () => {
      toast.success('状态已更新');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
}

/**
 * 关注用户
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.followUser.bind(userService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * 取消关注用户
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.unfollowUser.bind(userService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
