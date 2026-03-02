/**
 * 通知 Store
 * 用于管理应用通知
 */

import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  addNotification: notification =>
    set(state => {
      const newNotification: Notification = {
        ...notification,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // 自动移除通知
      if (notification.duration !== 0) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== newNotification.id),
          }));
        }, duration);
      }

      return {
        notifications: [...state.notifications, newNotification],
      };
    }),
  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// 辅助函数
export const notify = {
  success: (title: string, message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  },
  error: (title: string, message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  },
  warning: (title: string, message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  },
  info: (title: string, message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  },
};
