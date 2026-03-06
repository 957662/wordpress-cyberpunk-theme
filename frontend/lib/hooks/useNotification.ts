/**
 * Notification Hooks
 * 通知相关的自定义Hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationApi, type Notification, type NotificationStats } from '@/lib/api/notification';
import { useAuth } from './useAuth';

/**
 * 使用通知列表
 */
export function useNotifications(onlyUnread: boolean = false) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useAuth();

  const fetchNotifications = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await notificationApi.getNotifications(token, 1, 20, onlyUnread);
      setNotifications(data.data);
      setStats({
        total: data.meta.total,
        unread: data.meta.unread,
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [getToken, onlyUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * 标记为已读
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    const token = getToken();

    if (!token) return;

    try {
      await notificationApi.markAsRead(token, notificationId);

      // 更新本地状态
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [getToken]);

  /**
   * 全部标记为已读
   */
  const markAllAsRead = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    try {
      await notificationApi.markAllAsRead(token);

      // 更新本地状态
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );

      setStats(prev => ({
        ...prev,
        unread: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [getToken]);

  /**
   * 删除通知
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    const token = getToken();

    if (!token) return;

    try {
      await notificationApi.deleteNotification(token, notificationId);

      // 更新本地状态
      setNotifications(prev => {
        const notif = prev.find(n => n.id === notificationId);
        return prev.filter(n => n.id !== notificationId);
      });

      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        unread: Math.max(0, prev.unread - (notifications.find(n => n.id === notificationId)?.isRead ? 0 : 1)),
      }));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [getToken, notifications]);

  /**
   * 清空所有通知
   */
  const clearAll = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    try {
      await notificationApi.clearAll(token);

      // 清空本地状态
      setNotifications([]);
      setStats({ total: 0, unread: 0 });
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
    }
  }, [getToken]);

  return {
    notifications,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  };
}

/**
 * 使用未读通知计数
 */
export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const { getToken, isAuthenticated } = useAuth();

  const fetchCount = useCallback(async () => {
    const token = getToken();

    if (!token || !isAuthenticated) {
      setCount(0);
      return;
    }

    try {
      const stats = await notificationApi.getNotificationStats(token);
      setCount(stats.unread);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      setCount(0);
    }
  }, [getToken, isAuthenticated]);

  useEffect(() => {
    fetchCount();

    // 每30秒刷新一次
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [fetchCount]);

  return {
    count,
    refetch: fetchCount,
  };
}

/**
 * 使用实时通知（WebSocket）
 */
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = getToken();
    if (!token) return;

    // TODO: 实现WebSocket连接
    // 这里需要根据你的WebSocket实现来调整

    return () => {
      // 清理连接
    };
  }, [getToken, isAuthenticated]);

  return {
    notifications,
    connected,
  };
}
