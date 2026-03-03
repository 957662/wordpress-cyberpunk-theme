/**
 * 通知系统相关 Hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notification/notification-service';
import {
  Notification,
  NotificationsResponse,
  NotificationsQuery,
  NotificationSettings,
  NotificationStats,
  BulkNotificationAction,
} from '../../types/notification.types';

/**
 * 通知列表 Hook
 */
export function useNotifications(query?: NotificationsQuery) {
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', query],
    queryFn: () => notificationService.getNotifications(query),
    staleTime: 1 * 60 * 1000, // 1分钟缓存
  });

  return {
    notifications: notificationsData?.notifications ?? [],
    total: notificationsData?.total ?? 0,
    unreadCount: notificationsData?.unreadCount ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 未读通知数量 Hook
 */
export function useUnreadCount() {
  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30 * 1000, // 30秒缓存
    refetchInterval: 60 * 1000, // 每分钟自动刷新
  });

  return {
    unreadCount: count ?? 0,
    isLoading,
    error,
  };
}

/**
 * 通知统计 Hook
 */
export function useNotificationStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: () => notificationService.getNotificationStats(),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  return {
    stats,
    isLoading,
    error,
  };
}

/**
 * 最新通知 Hook
 */
export function useLatestNotifications(limit: number = 5) {
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['latest-notifications', limit],
    queryFn: () => notificationService.getLatestNotifications(limit),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 60 * 1000, // 每分钟自动刷新
  });

  return {
    notifications: notifications ?? [],
    isLoading,
    error,
  };
}

/**
 * 通知操作 Hook
 */
export function useNotificationActions() {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsUnread(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.archiveNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: (action: BulkNotificationAction) =>
      notificationService.bulkAction(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAsUnread: markAsUnreadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    archive: archiveMutation.mutate,
    delete: deleteMutation.mutate,
    bulkAction: bulkActionMutation.mutate,
    isPending:
      markAsReadMutation.isPending ||
      markAllAsReadMutation.isPending ||
      archiveMutation.isPending ||
      deleteMutation.isPending ||
      bulkActionMutation.isPending,
  };
}

/**
 * 通知设置 Hook
 */
export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => notificationService.getNotificationSettings(),
    staleTime: 10 * 60 * 1000, // 10分钟缓存
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<NotificationSettings>) =>
      notificationService.updateNotificationSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}

/**
 * 实时通知 Hook
 */
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 这里可以集成 WebSocket 连接
    // 暂时使用轮询作为示例
    const interval = setInterval(async () => {
      try {
        const latest = await notificationService.getLatestNotifications(3);
        setNotifications(latest);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch real-time notifications:', error);
        setIsConnected(false);
      }
    }, 30000); // 30秒轮询一次

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    isConnected,
  };
}
