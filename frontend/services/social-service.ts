/**
 * Social Service
 * 社交功能服务层 - 处理所有社交相关的 API 调用
 */

import { api } from '@/lib/api-client';
import type {
  FollowUser,
  FollowResponse,
  LikeResponse,
  BookmarkResponse,
  BookmarkItem,
  BookmarkFolder,
  Notification,
  NotificationStats,
  NotificationPreferences,
  UserSocialProfile,
  RelationshipStats,
  ActivityFeed,
  FeedResponse,
  SocialApiResponse,
} from '@/types/social.types';

const API_BASE = '/api/social';

// ============================================================================
// Follow Service - 关注功能
// ============================================================================

/**
 * 关注用户
 */
export async function followUser(userId: string): Promise<FollowResponse> {
  const response = await api.post<FollowResponse>(
    `${API_BASE}/follow`,
    { userId }
  );
  return response.data;
}

/**
 * 取消关注用户
 */
export async function unfollowUser(userId: string): Promise<FollowResponse> {
  const response = await api.post<FollowResponse>(
    `${API_BASE}/unfollow`,
    { userId }
  );
  return response.data;
}

/**
 * 批量关注用户
 */
export async function followMultipleUsers(userIds: string[]): Promise<FollowResponse[]> {
  const requests = userIds.map(userId =>
    () => api.post<FollowResponse>(`${API_BASE}/follow`, { userId })
  );
  return api.batch(requests);
}

/**
 * 获取用户的关注列表
 */
export async function getFollowing(
  userId: string,
  page = 1,
  perPage = 20
): Promise<{ users: FollowUser[]; total: number }> {
  const response = await api.get<{
    users: FollowUser[];
    total: number;
  }>(`${API_BASE}/following/${userId}`, {
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * 获取用户的粉丝列表
 */
export async function getFollowers(
  userId: string,
  page = 1,
  perPage = 20
): Promise<{ users: FollowUser[]; total: number }> {
  const response = await api.get<{
    users: FollowUser[];
    total: number;
  }>(`${API_BASE}/followers/${userId}`, {
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * 获取推荐关注的用户
 */
export async function getRecommendedUsers(limit = 10): Promise<FollowUser[]> {
  const response = await api.get<FollowUser[]>(
    `${API_BASE}/recommendations`,
    { params: { limit } }
  );
  return response.data;
}

// ============================================================================
// Like Service - 点赞功能
// ============================================================================

/**
 * 点赞文章或评论
 */
export async function likeContent(
  targetId: string,
  targetType: 'post' | 'comment'
): Promise<LikeResponse> {
  const response = await api.post<LikeResponse>(
    `${API_BASE}/like`,
    { targetId, targetType }
  );
  return response.data;
}

/**
 * 取消点赞
 */
export async function unlikeContent(
  targetId: string,
  targetType: 'post' | 'comment'
): Promise<LikeResponse> {
  const response = await api.post<LikeResponse>(
    `${API_BASE}/unlike`,
    { targetId, targetType }
  );
  return response.data;
}

/**
 * 检查是否已点赞
 */
export async function checkLikeStatus(
  targetId: string,
  targetType: 'post' | 'comment'
): Promise<{ isLiked: boolean }> {
  const response = await api.get<{ isLiked: boolean }>(
    `${API_BASE}/like/status`,
    { params: { targetId, targetType } }
  );
  return response.data;
}

/**
 * 获取点赞列表
 */
export async function getLikes(
  targetId: string,
  targetType: 'post' | 'comment',
  page = 1,
  perPage = 20
): Promise<{ users: Array<{ id: string; username: string; displayName: string; avatar?: string }>; total: number }> {
  const response = await api.get<{
    users: Array<{ id: string; username: string; displayName: string; avatar?: string }>;
    total: number;
  }>(`${API_BASE}/likes/${targetType}/${targetId}`, {
    params: { page, per_page: perPage },
  });
  return response.data;
}

// ============================================================================
// Bookmark Service - 书签功能
// ============================================================================

/**
 * 添加书签
 */
export async function addBookmark(
  targetId: string,
  targetType: 'post' | 'comment',
  folderId?: string
): Promise<BookmarkResponse> {
  const response = await api.post<BookmarkResponse>(
    `${API_BASE}/bookmark`,
    { targetId, targetType, folderId }
  );
  return response.data;
}

/**
 * 移除书签
 */
export async function removeBookmark(
  bookmarkId: string
): Promise<BookmarkResponse> {
  const response = await api.delete<BookmarkResponse>(
    `${API_BASE}/bookmark/${bookmarkId}`
  );
  return response.data;
}

/**
 * 获取书签列表
 */
export async function getBookmarks(
  page = 1,
  perPage = 20,
  folderId?: string
): Promise<{ bookmarks: BookmarkItem[]; total: number }> {
  const response = await api.get<{
    bookmarks: BookmarkItem[];
    total: number;
  }>(`${API_BASE}/bookmarks`, {
    params: { page, per_page: perPage, folderId },
  });
  return response.data;
}

/**
 * 创建书签文件夹
 */
export async function createBookmarkFolder(
  name: string,
  icon?: string,
  color?: string
): Promise<BookmarkFolder> {
  const response = await api.post<BookmarkFolder>(
    `${API_BASE}/bookmark/folder`,
    { name, icon, color }
  );
  return response.data;
}

/**
 * 更新书签文件夹
 */
export async function updateBookmarkFolder(
  folderId: string,
  updates: Partial<Pick<BookmarkFolder, 'name' | 'icon' | 'color'>>
): Promise<BookmarkFolder> {
  const response = await api.put<BookmarkFolder>(
    `${API_BASE}/bookmark/folder/${folderId}`,
    updates
  );
  return response.data;
}

/**
 * 删除书签文件夹
 */
export async function deleteBookmarkFolder(folderId: string): Promise<void> {
  await api.delete(`${API_BASE}/bookmark/folder/${folderId}`);
}

/**
 * 获取书签文件夹列表
 */
export async function getBookmarkFolders(): Promise<BookmarkFolder[]> {
  const response = await api.get<BookmarkFolder[]>(
    `${API_BASE}/bookmark/folders`
  );
  return response.data;
}

// ============================================================================
// Notification Service - 通知功能
// ============================================================================

/**
 * 获取通知列表
 */
export async function getNotifications(
  page = 1,
  perPage = 20,
  unreadOnly = false
): Promise<{ notifications: Notification[]; total: number }> {
  const response = await api.get<{
    notifications: Notification[];
    total: number;
  }>(`${API_BASE}/notifications`, {
    params: { page, per_page: perPage, unreadOnly },
  });
  return response.data;
}

/**
 * 获取通知统计
 */
export async function getNotificationStats(): Promise<NotificationStats> {
  const response = await api.get<NotificationStats>(
    `${API_BASE}/notifications/stats`
  );
  return response.data;
}

/**
 * 标记通知为已读
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await api.put(`${API_BASE}/notifications/${notificationId}/read`);
}

/**
 * 批量标记通知为已读
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.put(`${API_BASE}/notifications/read-all`);
}

/**
 * 删除通知
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  await api.delete(`${API_BASE}/notifications/${notificationId}`);
}

/**
 * 获取通知偏好设置
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await api.get<NotificationPreferences>(
    `${API_BASE}/notifications/preferences`
  );
  return response.data;
}

/**
 * 更新通知偏好设置
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const response = await api.put<NotificationPreferences>(
    `${API_BASE}/notifications/preferences`,
    preferences
  );
  return response.data;
}

// ============================================================================
// User Profile Service - 用户资料
// ============================================================================

/**
 * 获取用户社交资料
 */
export async function getUserSocialProfile(
  userId: string
): Promise<UserSocialProfile> {
  const response = await api.get<UserSocialProfile>(
    `${API_BASE}/profile/${userId}`
  );
  return response.data;
}

/**
 * 获取用户关系统计
 */
export async function getUserRelationshipStats(
  userId: string
): Promise<RelationshipStats> {
  const response = await api.get<RelationshipStats>(
    `${API_BASE}/profile/${userId}/stats`
  );
  return response.data;
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  updates: Partial<Pick<UserSocialProfile, 'bio' | 'location' | 'website' | 'displayName'>>
): Promise<UserSocialProfile> {
  const response = await api.put<UserSocialProfile>(
    `${API_BASE}/profile`,
    updates
  );
  return response.data;
}

/**
 * 上传头像
 */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const response = await api.upload<{ avatarUrl: string }>(
    `${API_BASE}/profile/avatar`,
    file
  );
  return response.data;
}

// ============================================================================
// Activity & Feed Service - 动态和 Feed
// ============================================================================

/**
 * 获取用户动态
 */
export async function getUserActivity(
  userId?: string,
  page = 1,
  perPage = 20
): Promise<ActivityFeed> {
  const response = await api.get<ActivityFeed>(
    `${API_BASE}/activity`,
    { params: { userId, page, per_page: perPage } }
  );
  return response.data;
}

/**
 * 获取 Feed
 */
export async function getFeed(
  type: 'global' | 'following' | 'personal' = 'following',
  page = 1,
  perPage = 20
): Promise<FeedResponse> {
  const response = await api.get<FeedResponse>(
    `${API_BASE}/feed/${type}`,
    { params: { page, per_page: perPage } }
  );
  return response.data;
}

// ============================================================================
// Blocking & Muting - 屏蔽和静音
// ============================================================================

/**
 * 屏蔽用户
 */
export async function blockUser(userId: string): Promise<void> {
  await api.post(`${API_BASE}/block`, { userId });
}

/**
 * 取消屏蔽用户
 */
export async function unblockUser(userId: string): Promise<void> {
  await api.post(`${API_BASE}/unblock`, { userId });
}

/**
 * 静音用户
 */
export async function muteUser(userId: string): Promise<void> {
  await api.post(`${API_BASE}/mute`, { userId });
}

/**
 * 取消静音用户
 */
export async function unmuteUser(userId: string): Promise<void> {
  await api.post(`${API_BASE}/unmute`, { userId });
}

/**
 * 获取已屏蔽用户列表
 */
export async function getBlockedUsers(page = 1, perPage = 20): Promise<{
  users: UserSocialProfile[];
  total: number;
}> {
  const response = await api.get<{
    users: UserSocialProfile[];
    total: number;
  }>(`${API_BASE}/blocked`, {
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * 获取已静音用户列表
 */
export async function getMutedUsers(page = 1, perPage = 20): Promise<{
  users: UserSocialProfile[];
  total: number;
}> {
  const response = await api.get<{
    users: UserSocialProfile[];
    total: number;
  }>(`${API_BASE}/muted`, {
    params: { page, per_page: perPage },
  });
  return response.data;
}
