/**
 * 通知系统的自定义 Hook
 * 封装通知相关的逻辑和状态管理
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { notificationService, Notification, NotificationStats } from '@/services/notificationService';

export interface UseNotificationsOptions {
  autoLoad?: boolean;
  pollInterval?: number; // 轮询间隔（毫秒）
}

export function useNotifications({
  autoLoad = true,
  pollInterval = 30000, // 默认30秒轮询一次
}: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 加载通知列表
  const loadNotifications = useCallback(async (options?: { unreadOnly?: boolean }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(options);
      setNotifications(data.items);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 加载通知统计
  const loadStats = useCallback(async () => {
    try {
      const data = await notificationService.getNotificationStats();
      setStats(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, []);

  // 标记为已读
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setStats((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, []);

  // 标记所有为已读
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setStats((prev) => ({ ...prev, unread: 0 }));
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, []);

  // 删除通知
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        return prev.filter((n) => n.id !== notificationId);
      });
      setStats((prev) => ({
        total: prev.total - 1,
        unread: prev.unread,
      }));
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, []);

  // 清空所有通知
  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setStats({ total: 0, unread: 0 });
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  }, []);

  // 自动加载
  useEffect(() => {
    if (autoLoad) {
      loadNotifications();
      loadStats();
    }
  }, [autoLoad, loadNotifications, loadStats]);

  // 轮询更新
  useEffect(() => {
    if (!autoLoad || !pollInterval) return;

    const interval = setInterval(() => {
      loadStats();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [autoLoad, pollInterval, loadStats]);

  return {
    notifications,
    stats,
    isLoading,
    error,
    loadNotifications,
    loadStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
