/**
 * CyberPress 社交功能 API 服务
 * 提供关注、点赞、书签、通知等社交功能的 API 调用
 */

import { SocialApiResponse, ApiError } from '@/types/social';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * API 请求配置
 */
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * 通用 API 请求函数
 */
async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
  } = config;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 添加认证 token（如果存在）
  const token = localStorage.getItem('auth_token');
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || '请求失败',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : '网络错误',
      0,
      {}
    );
  }
}

// ==================== 关注功能 ====================

/**
 * 关注用户
 */
export async function followUser(userId: string | number): Promise<SocialApiResponse> {
  return apiRequest<SocialApiResponse>(`/api/social/follow/${userId}`, {
    method: 'POST',
  });
}

/**
 * 取消关注用户
 */
export async function unfollowUser(userId: string | number): Promise<SocialApiResponse> {
  return apiRequest<SocialApiResponse>(`/api/social/follow/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取用户关注统计
 */
export async function getFollowStats(userId: string | number) {
  return apiRequest(`/api/social/follow/${userId}/stats`);
}

/**
 * 获取粉丝列表
 */
export async function getFollowers(
  userId: string | number,
  page: number = 1,
  limit: number = 20
) {
  return apiRequest(
    `/api/social/users/${userId}/followers?page=${page}&limit=${limit}`
  );
}

/**
 * 获取关注列表
 */
export async function getFollowing(
  userId: string | number,
  page: number = 1,
  limit: number = 20
) {
  return apiRequest(
    `/api/social/users/${userId}/following?page=${page}&limit=${limit}`
  );
}

// ==================== 点赞功能 ====================

/**
 * 点赞/取消点赞
 */
export async function toggleLike(targetType: 'post' | 'comment', targetId: string | number) {
  return apiRequest('/api/social/like', {
    method: 'POST',
    body: { target_type: targetType, target_id: targetId },
  });
}

/**
 * 获取点赞统计
 */
export async function getLikeStats(targetType: 'post' | 'comment', targetId: string | number) {
  return apiRequest(`/api/social/likes/${targetType}/${targetId}/stats`);
}

/**
 * 获取点赞用户列表
 */
export async function getLikers(
  targetType: 'post' | 'comment',
  targetId: string | number,
  page: number = 1,
  limit: number = 20
) {
  return apiRequest(
    `/api/social/likes/${targetType}/${targetId}/users?page=${page}&limit=${limit}`
  );
}

// ==================== 书签功能 ====================

/**
 * 创建书签文件夹
 */
export async function createBookmarkFolder(data: {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}) {
  return apiRequest('/api/social/bookmarks/folders', {
    method: 'POST',
    body: data,
  });
}

/**
 * 更新书签文件夹
 */
export async function updateBookmarkFolder(folderId: string | number, data: {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}) {
  return apiRequest(`/api/social/bookmarks/folders/${folderId}`, {
    method: 'PATCH',
    body: data,
  });
}

/**
 * 删除书签文件夹
 */
export async function deleteBookmarkFolder(folderId: string | number) {
  return apiRequest(`/api/social/bookmarks/folders/${folderId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取书签文件夹列表
 */
export async function getBookmarkFolders() {
  return apiRequest('/api/social/bookmarks/folders');
}

/**
 * 添加书签
 */
export async function addBookmark(data: {
  postId: string | number;
  folderId?: string | number;
  notes?: string;
}) {
  return apiRequest('/api/social/bookmarks', {
    method: 'POST',
    body: data,
  });
}

/**
 * 移除书签
 */
export async function removeBookmark(bookmarkId: string | number) {
  return apiRequest(`/api/social/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
  });
}

/**
 * 更新书签
 */
export async function updateBookmark(bookmarkId: string | number, data: {
  folderId?: string | number;
  notes?: string;
}) {
  return apiRequest(`/api/social/bookmarks/${bookmarkId}`, {
    method: 'PATCH',
    body: data,
  });
}

/**
 * 获取书签列表
 */
export async function getBookmarks(params?: {
  folderId?: string | number;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at';
}) {
  const queryParams = new URLSearchParams();
  if (params?.folderId) queryParams.append('folder_id', String(params.folderId));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.sortBy) queryParams.append('sort_by', params.sortBy);

  const queryString = queryParams.toString();
  return apiRequest(`/api/social/bookmarks${queryString ? `?${queryString}` : ''}`);
}

// ==================== 通知功能 ====================

/**
 * 获取通知列表
 */
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  type?: string;
  isRead?: boolean;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.type) queryParams.append('type', params.type);
  if (params?.isRead !== undefined) queryParams.append('is_read', String(params.isRead));

  const queryString = queryParams.toString();
  return apiRequest(`/api/social/notifications${queryString ? `?${queryString}` : ''}`);
}

/**
 * 获取通知统计
 */
export async function getNotificationStats() {
  return apiRequest('/api/social/notifications/stats');
}

/**
 * 标记通知为已读
 */
export async function markNotificationRead(notificationId: string | number) {
  return apiRequest(`/api/social/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsRead() {
  return apiRequest('/api/social/notifications/mark-all-read', {
    method: 'POST',
  });
}

/**
 * 删除通知
 */
export async function deleteNotification(notificationId: string | number) {
  return apiRequest(`/api/social/notifications/${notificationId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取通知偏好设置
 */
export async function getNotificationPreferences() {
  return apiRequest('/api/social/notifications/preferences');
}

/**
 * 更新通知偏好设置
 */
export async function updateNotificationPreferences(preferences: {
  email_notifications?: boolean;
  push_notifications?: boolean;
  notification_types?: {
    follow?: boolean;
    like?: boolean;
    comment?: boolean;
    mention?: boolean;
    system?: boolean;
  };
}) {
  return apiRequest('/api/social/notifications/preferences', {
    method: 'PATCH',
    body: preferences,
  });
}

// ==================== 活动流 ====================

/**
 * 获取活动流
 */
export async function getActivityFeed(params?: {
  userId?: string | number;
  page?: number;
  limit?: number;
  type?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.userId) queryParams.append('user_id', String(params.userId));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.type) queryParams.append('type', params.type);

  const queryString = queryParams.toString();
  return apiRequest(`/api/social/activity${queryString ? `?${queryString}` : ''}`);
}

// ==================== 导出 ====================

export default {
  // 关注
  followUser,
  unfollowUser,
  getFollowStats,
  getFollowers,
  getFollowing,

  // 点赞
  toggleLike,
  getLikeStats,
  getLikers,

  // 书签
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
  getBookmarkFolders,
  addBookmark,
  removeBookmark,
  updateBookmark,
  getBookmarks,

  // 通知
  getNotifications,
  getNotificationStats,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,

  // 活动流
  getActivityFeed,
};
