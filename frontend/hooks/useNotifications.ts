/**
 * useNotifications Hook
 * 通知管理的 React Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { notificationService } from '@/services/notification-service';
import type { Notification, NotificationPreferences, NotificationStats } from '@/types/social.types';

export interface UseNotificationsOptions {
  enabled?: boolean;
  type?: string;
  unreadOnly?: boolean;
  pollInterval?: number; // 轮询间隔（毫秒）
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  stats: NotificationStats;
  preferences: NotificationPreferences;
  isLoading: boolean;
  isError: boolean;
  unreadCount: number;
  refetch: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearRead: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  toggleNotificationType: (
    type: string,
    enabled: boolean,
    channel: 'email' | 'push' | 'inApp'
  ) => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    enabled = true,
    type,
    unreadOnly = false,
    pollInterval = 30000, // 默认 30 秒轮询一次
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0, read: 0 });
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailFollows: true,
    emailLikes: true,
    emailComments: true,
    emailMentions: true,
    emailReplies: true,
    emailBookmarks: true,
    emailSystem: true,
    pushFollows: true,
    pushLikes: true,
    pushComments: true,
    pushMentions: true,
    pushReplies: true,
    pushBookmarks: true,
    pushSystem: true,
    inAppFollows: true,
    inAppLikes: true,
    inAppComments: true,
    inAppMentions: true,
    inAppReplies: true,
    inAppBookmarks: true,
    inAppSystem: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 加载通知列表
  const loadNotifications = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setIsError(false);

      const data = await notificationService.getNotifications({
        type,
        unreadOnly,
      });

      setNotifications(data.items);
      setStats({
        total: data.total,
        unread: data.unread,
        read: data.total - data.unread,
      });
      setUnreadCount(data.unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, type, unreadOnly]);

  // 加载通知偏好设置
  const loadPreferences = useCallback(async () => {
    if (!enabled) return;

    try {
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, [enabled]);

  // 初始加载
  useEffect(() => {
    if (enabled) {
      loadNotifications();
      loadPreferences();
    }
  }, [enabled, loadNotifications, loadPreferences]);

  // 轮询新通知
  useEffect(() => {
    if (!enabled || !pollInterval) return;

    const intervalId = setInterval(() => {
      // 只获取未读数量，不影响当前列表
      notificationService.getUnreadCount()
        .then(setUnreadCount)
        .catch(console.error);
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [enabled, pollInterval]);

  // 标记为已读
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      // 乐观更新
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
      setStats((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        read: prev.read + 1,
      }));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('操作失败');
    }
  }, []);

  // 标记为未读
  const markAsUnread = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsUnread(notificationId);

      // 乐观更新
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: false } : n
        )
      );

      setUnreadCount((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        unread: prev.unread + 1,
        read: Math.max(0, prev.read - 1),
      }));
    } catch (error) {
      console.error('Error marking as unread:', error);
      toast.error('操作失败');
    }
  }, []);

  // 全部标记为已读
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      // 乐观更新
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );

      setUnreadCount(0);
      setStats((prev) => ({
        ...prev,
        unread: 0,
        read: prev.total,
      }));

      toast.success('已全部标记为已读');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('操作失败');
    }
  }, []);

  // 删除通知
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);

      // 乐观更新
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        const newUnreadCount = notification && !notification.read ? unreadCount - 1 : unreadCount;

        setUnreadCount(Math.max(0, newUnreadCount));

        return prev.filter((n) => n.id !== notificationId);
      });

      setStats((prev) => ({
        total: Math.max(0, prev.total - 1),
        unread: Math.max(0, prev.unread - 1),
        read: prev.read,
      }));

      toast.success('通知已删除');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('删除失败');
    }
  }, [unreadCount]);

  // 清除已读通知
  const clearRead = useCallback(async () => {
    try {
      await notificationService.clearRead();

      // 乐观更新
      setNotifications((prev) => prev.filter((n) => !n.read));
      setStats((prev) => ({
        ...prev,
        total: prev.unread,
        read: 0,
      }));

      toast.success('已清除已读通知');
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      toast.error('操作失败');
    }
  }, []);

  // 更新偏好设置
  const updatePreferences = useCallback(async (
    newPreferences: Partial<NotificationPreferences>
  ) => {
    try {
      const updated = await notificationService.updatePreferences(newPreferences);
      setPreferences(updated);
      toast.success('设置已更新');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('更新设置失败');
    }
  }, []);

  // 切换通知类型
  const toggleNotificationType = useCallback(async (
    type: string,
    enabled: boolean,
    channel: 'email' | 'push' | 'inApp'
  ) => {
    try {
      const updated = await notificationService.toggleNotificationType(type, enabled, channel);
      setPreferences(updated);
    } catch (error) {
      console.error('Error toggling notification type:', error);
      toast.error('操作失败');
    }
  }, []);

  return {
    notifications,
    stats,
    preferences,
    isLoading,
    isError,
    unreadCount,
    refetch: loadNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearRead,
    updatePreferences,
    toggleNotificationType,
  };
}
