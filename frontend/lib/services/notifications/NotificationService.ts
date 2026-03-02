/**
 * 通知服务 - 管理应用通知
 */

'use client';

import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  persistent?: boolean;
  timestamp: number;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  actions?: NotificationAction[];
  persistent?: boolean;
}

/**
 * 通知状态管理
 */
interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, options?: NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

/**
 * 通知服务
 */
class NotificationService {
  private static instance: NotificationService;
  private store: any;

  private constructor() {
    this.initializeStore();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 初始化状态存储
   */
  private initializeStore() {
    this.store = create<NotificationState>((set, get) => ({
      notifications: [],

      addNotification: (message: string, options: NotificationOptions = {}) => {
        const id = this.generateId();
        const notification: Notification = {
          id,
          type: options.type || 'info',
          title: options.title,
          message,
          duration: options.duration ?? this.getDefaultDuration(options.type || 'info'),
          actions: options.actions,
          persistent: options.persistent || false,
          timestamp: Date.now(),
        };

        set(state => ({
          notifications: [...state.notifications, notification],
        }));

        // 自动移除（如果不是持久化的）
        if (!notification.persistent && notification.duration && notification.duration > 0) {
          setTimeout(() => {
            this.remove(id);
          }, notification.duration);
        }

        return id;
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      updateNotification: (id: string, updates: Partial<Notification>) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }));
      },
    }));
  }

  /**
   * 显示成功通知
   */
  success(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'success' });
  }

  /**
   * 显示错误通知
   */
  error(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'error' });
  }

  /**
   * 显示警告通知
   */
  warning(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'warning' });
  }

  /**
   * 显示信息通知
   */
  info(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'info' });
  }

  /**
   * 显示通知
   */
  show(message: string, options?: NotificationOptions): string {
    return this.store.getState().addNotification(message, options);
  }

  /**
   * 移除通知
   */
  remove(id: string): void {
    this.store.getState().removeNotification(id);
  }

  /**
   * 清除所有通知
   */
  clear(): void {
    this.store.getState().clearAll();
  }

  /**
   * 更新通知
   */
  update(id: string, updates: Partial<Notification>): void {
    this.store.getState().updateNotification(id, updates);
  }

  /**
   * 获取所有通知
   */
  getAll(): Notification[] {
    return this.store.getState().notifications;
  }

  /**
   * 获取状态存储
   */
  getStore() {
    return this.store;
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * 获取默认持续时间
   */
  private getDefaultDuration(type: NotificationType): number {
    const durations = {
      success: 4000,
      error: 6000,
      warning: 5000,
      info: 3000,
    };
    return durations[type];
  }

  /**
   * 显示确认对话框
   */
  confirm(message: string, options?: {
    title?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }): string {
    const id = this.show(message, {
      type: 'warning',
      title: options?.title,
      persistent: true,
      actions: [
        {
          label: options?.cancelLabel || '取消',
          onClick: () => {
            this.remove(id);
            options?.onCancel?.();
          },
        },
        {
          label: options?.confirmLabel || '确认',
          primary: true,
          onClick: () => {
            this.remove(id);
            options?.onConfirm?.();
          },
        },
      ],
    });

    return id;
  }

  /**
   * 显示加载通知
   */
  loading(message: string = '加载中...'): string {
    return this.show(message, {
      type: 'info',
      persistent: true,
    });
  }

  /**
   * 更新为成功状态
   */
  resolveLoading(id: string, message: string): void {
    this.update(id, {
      type: 'success',
      message,
      persistent: false,
      duration: 3000,
    });
  }

  /**
   * 更新为错误状态
   */
  rejectLoading(id: string, message: string): void {
    this.update(id, {
      type: 'error',
      message,
      persistent: false,
      duration: 5000,
    });
  }
}

// 导出单例实例
export const notification = NotificationService.getInstance();

// 导出便捷Hook
export function useNotification() {
  const store = notification.getStore();

  return {
    notifications: store(state => state.notifications),
    success: notification.success.bind(notification),
    error: notification.error.bind(notification),
    warning: notification.warning.bind(notification),
    info: notification.info.bind(notification),
    show: notification.show.bind(notification),
    remove: notification.remove.bind(notification),
    clear: notification.clear.bind(notification),
    confirm: notification.confirm.bind(notification),
    loading: notification.loading.bind(notification),
    resolveLoading: notification.resolveLoading.bind(notification),
    rejectLoading: notification.rejectLoading.bind(notification),
  };
}

// 通知预设
export const NotificationPresets = {
  // 保存成功
  SAVED: (item: string) => ({
    message: `${item}已保存`,
    type: 'success' as const,
  }),

  // 删除成功
  DELETED: (item: string) => ({
    message: `${item}已删除`,
    type: 'success' as const,
  }),

  // 更新成功
  UPDATED: (item: string) => ({
    message: `${item}已更新`,
    type: 'success' as const,
  }),

  // 网络错误
  NETWORK_ERROR: {
    message: '网络连接失败，请检查您的网络设置',
    type: 'error' as const,
  },

  // 保存失败
  SAVE_ERROR: {
    message: '保存失败，请稍后重试',
    type: 'error' as const,
  },

  // 加载失败
  LOAD_ERROR: {
    message: '加载失败，请刷新页面重试',
    type: 'error' as const,
  },

  // 未授权
  UNAUTHORIZED: {
    message: '您没有权限执行此操作',
    type: 'warning' as const,
  },

  // 未登录
  NOT_LOGGED_IN: {
    message: '请先登录',
    type: 'warning' as const,
  },
};
