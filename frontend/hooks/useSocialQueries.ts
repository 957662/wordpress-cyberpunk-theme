/**
 * 社交功能 React Query Hooks
 * 使用 React Query 管理社交功能的数据获取和状态
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { socialQueryKeys } from '@/types/social.types';
import socialApi from '@/services/socialApi';

// ============================================================================
// 关注 Hooks
// ============================================================================

/**
 * 获取用户关注统计
 */
export function useFollowStats(userId: string) {
  return useQuery({
    queryKey: socialQueryKeys.followStats(userId),
    queryFn: () => socialApi.getFollowStats(userId),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取粉丝列表
 */
export function useFollowers(userId: string, page: number = 1) {
  return useQuery({
    queryKey: socialQueryKeys.followers(userId, page),
    queryFn: () => socialApi.getFollowers(userId, page, 20),
    enabled: !!userId,
  });
}

/**
 * 获取关注列表
 */
export function useFollowing(userId: string, page: number = 1) {
  return useQuery({
    queryKey: socialQueryKeys.following(userId, page),
    queryFn: () => socialApi.getFollowing(userId, page, 20),
    enabled: !!userId,
  });
}

/**
 * 关注用户 Mutation
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => socialApi.followUser(userId),
    onSuccess: (data, userId) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['social', 'follow'] });
      
      // 可选：显示成功提示
      if (data.success) {
        console.log('关注成功');
      }
    },
  });
}

/**
 * 取消关注 Mutation
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => socialApi.unfollowUser(userId),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['social', 'follow'] });
      
      console.log('取消关注成功');
    },
  });
}

// ============================================================================
// 点赞 Hooks
// ============================================================================

/**
 * 获取点赞统计
 */
export function useLikeStats(targetType: 'post' | 'comment', targetId: string) {
  return useQuery({
    queryKey: socialQueryKeys.likeStats(targetType, targetId),
    queryFn: () => socialApi.getLikeStats(targetType, targetId),
    enabled: !!targetId,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 获取点赞用户列表
 */
export function useLikers(targetType: 'post' | 'comment', targetId: string, page: number = 1) {
  return useQuery({
    queryKey: socialQueryKeys.likers(targetType, targetId, page),
    queryFn: () => socialApi.getLikers(targetType, targetId, page, 20),
    enabled: !!targetId,
  });
}

/**
 * 切换点赞 Mutation
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: 'post' | 'comment'; targetId: string }) =>
      socialApi.toggleLike(targetType, targetId),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['social', 'likes'] });
    },
  });
}

// ============================================================================
// 书签 Hooks
// ============================================================================

/**
 * 获取书签文件夹列表
 */
export function useBookmarkFolders() {
  return useQuery({
    queryKey: socialQueryKeys.bookmarkFolders,
    queryFn: () => socialApi.getBookmarkFolders(),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取书签列表
 */
export function useBookmarks(params?: { folderId?: number; page?: number }) {
  return useQuery({
    queryKey: socialQueryKeys.bookmarks(params),
    queryFn: () => socialApi.getBookmarks(params),
  });
}

/**
 * 创建书签文件夹 Mutation
 */
export function useCreateBookmarkFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; icon?: string; color?: string }) =>
      socialApi.createBookmarkFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialQueryKeys.bookmarkFolders });
    },
  });
}

/**
 * 添加书签 Mutation
 */
export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: number; folderId?: number; notes?: string }) =>
      socialApi.addBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'bookmarks'] });
    },
  });
}

/**
 * 删除书签 Mutation
 */
export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: number) => socialApi.removeBookmark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'bookmarks'] });
    },
  });
}

// ============================================================================
// 通知 Hooks
// ============================================================================

/**
 * 获取通知列表
 */
export function useNotifications(params?: { page?: number; type?: string }) {
  return useQuery({
    queryKey: socialQueryKeys.notifications(params),
    queryFn: () => socialApi.getNotifications(params),
    refetchInterval: 30 * 1000, // 每30秒自动刷新
  });
}

/**
 * 获取通知统计
 */
export function useNotificationStats() {
  return useQuery({
    queryKey: socialQueryKeys.notificationStats,
    queryFn: () => socialApi.getNotificationStats(),
    refetchInterval: 30 * 1000, // 每30秒自动刷新
  });
}

/**
 * 获取通知偏好设置
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: socialQueryKeys.notificationPreferences,
    queryFn: () => socialApi.getNotificationPreferences(),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 标记通知为已读 Mutation
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => socialApi.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] });
    },
  });
}

/**
 * 标记所有通知为已读 Mutation
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] });
    },
  });
}

/**
 * 删除通知 Mutation
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => socialApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] });
    },
  });
}

/**
 * 更新通知偏好设置 Mutation
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: {
      email_notifications?: boolean;
      push_notifications?: boolean;
      notification_types?: {
        follow?: boolean;
        like?: boolean;
        comment?: boolean;
        mention?: boolean;
        system?: boolean;
      };
    }) => socialApi.updateNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialQueryKeys.notificationPreferences });
    },
  });
}

// ============================================================================
// 活动流 Hooks
// ============================================================================

/**
 * 获取活动流
 */
export function useActivityFeed(params?: { userId?: number; page?: number }) {
  return useQuery({
    queryKey: socialQueryKeys.activityFeed(params),
    queryFn: () => socialApi.getActivityFeed(params),
    refetchInterval: 60 * 1000, // 每分钟自动刷新
  });
}
