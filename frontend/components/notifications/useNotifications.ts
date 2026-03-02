'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationType } from './NotificationToast';

export interface UseNotificationsOptions {
  defaultDuration?: number;
  maxNotifications?: number;
  storageKey?: string;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    defaultDuration = 5000,
    maxNotifications = 5,
    storageKey = 'cyberpress-notifications',
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationId, setNotificationId] = useState(0);

  // Load notifications from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [storageKey]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications, storageKey]);

  const show = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
    ) => {
      const id = `notification-${notificationId}`;
      const notification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: new Date(),
        duration: defaultDuration,
        read: false,
        ...options,
      };

      setNotificationId((prev) => prev + 1);
      setNotifications((prev) => {
        const next = [...prev, notification];
        // Keep only the last maxNotifications
        return next.slice(-maxNotifications);
      });

      return id;
    },
    [notificationId, defaultDuration, maxNotifications]
  );

  const close = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('success', title, message, options);
    },
    [show]
  );

  const error = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('error', title, message, options);
    },
    [show]
  );

  const warning = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('warning', title, message, options);
    },
    [show]
  );

  const info = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('info', title, message, options);
    },
    [show]
  );

  const comment = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('comment', title, message, options);
    },
    [show]
  );

  const like = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('like', title, message, options);
    },
    [show]
  );

  const follow = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('follow', title, message, options);
    },
    [show]
  );

  const mention = useCallback(
    (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
      return show('mention', title, message, options);
    },
    [show]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    show,
    close,
    markRead,
    markAllRead,
    clearAll,
    success,
    error,
    warning,
    info,
    comment,
    like,
    follow,
    mention,
    unreadCount,
  };
}
