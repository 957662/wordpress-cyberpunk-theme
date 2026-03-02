/**
 * CyberPress Platform - Notification Store
 * 通知状态管理 (使用 Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  addSuccess: (title: string, message: string) => void;
  addError: (title: string, message: string) => void;
  addWarning: (title: string, message: string) => void;
  addInfo: (title: string, message: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      // 添加通知
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification: Notification = {
          ...notification,
          id,
          createdAt: new Date(),
          duration: notification.duration || 5000,
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // 自动移除通知
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      // 移除通知
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      // 清除所有通知
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // 快捷方法 - 成功
      addSuccess: (title, message) => {
        get().addNotification({
          type: 'success',
          title,
          message,
        });
      },

      // 快捷方法 - 错误
      addError: (title, message) => {
        get().addNotification({
          type: 'error',
          title,
          message,
          duration: 7000, // 错误消息显示更长时间
        });
      },

      // 快捷方法 - 警告
      addWarning: (title, message) => {
        get().addNotification({
          type: 'warning',
          title,
          message,
        });
      },

      // 快捷方法 - 信息
      addInfo: (title, message) => {
        get().addNotification({
          type: 'info',
          title,
          message,
        });
      },
    }),
    {
      name: 'cyberpress-notifications',
      // 不持久化通知，每次会话重新开始
      partialize: () => ({}),
    }
  )
);

// 选择器 hooks
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);
export const useNotificationActions = () =>
  useNotificationStore((state) => ({
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    addSuccess: state.addSuccess,
    addError: state.addError,
    addWarning: state.addWarning,
    addInfo: state.addInfo,
  }));

// 工具函数
export const notify = {
  success: (title: string, message: string) =>
    useNotificationStore.getState().addSuccess(title, message),
  error: (title: string, message: string) =>
    useNotificationStore.getState().addError(title, message),
  warning: (title: string, message: string) =>
    useNotificationStore.getState().addWarning(title, message),
  info: (title: string, message: string) =>
    useNotificationStore.getState().addInfo(title, message),
};
