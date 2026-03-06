'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationPreferences } from '@/types/notification.types';

interface UseNotificationsOptions {
  autoFetch?: boolean;
  pollInterval?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { autoFetch = true, pollInterval = 0 } = options;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would call your API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'comment',
          title: 'New Comment',
          message: 'John Doe commented on your post',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false,
          actionUrl: '/blog/post-1',
        },
        {
          id: '2',
          type: 'like',
          title: 'New Like',
          message: 'Jane liked your comment',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      // API call would go here
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      // API call would go here
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      // API call would go here
      setNotifications(prev => {
        const notification = prev.find(n => n.id === id);
        const newNotifications = prev.filter(n => n.id !== id);
        if (notification && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return newNotifications;
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  // Clear all
  const clearAll = useCallback(async () => {
    try {
      // API call would go here
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  // Poll for new notifications
  useEffect(() => {
    if (pollInterval > 0) {
      const interval = setInterval(fetchNotifications, pollInterval);
      return () => clearInterval(interval);
    }
  }, [pollInterval, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}

// Hook for notification preferences
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    comment: true,
    like: true,
    follow: true,
    mention: true,
    system: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = useCallback(async (newPrefs: Partial<NotificationPreferences>) => {
    setIsLoading(true);
    setError(null);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPreferences(prev => ({ ...prev, ...newPrefs }));
    } catch (err) {
      setError('Failed to update preferences');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    preferences,
    updatePreferences,
    isLoading,
    error,
  };
}

export default useNotifications;
