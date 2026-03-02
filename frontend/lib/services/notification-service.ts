/**
 * 通知服务
 * 管理应用通知和提醒
 */

import { toast } from 'react-hot-toast';

export interface NotificationOptions {
  duration?: number;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

/**
 * 通知服务类
 */
class NotificationService {
  private notifications: NotificationItem[] = [];
  private listeners: Set<(notifications: NotificationItem[]) => void> = new Set();

  /**
   * 显示成功通知
   */
  success(message: string, options?: NotificationOptions): void {
    toast.success(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || '✓',
    });

    this.addNotification({
      type: 'success',
      title: '成功',
      message,
    });
  }

  /**
   * 显示错误通知
   */
  error(message: string, options?: NotificationOptions): void {
    toast.error(message, {
      duration: options?.duration || 4000,
      icon: options?.icon || '✕',
    });

    this.addNotification({
      type: 'error',
      title: '错误',
      message,
    });
  }

  /**
   * 显示信息通知
   */
  info(message: string, options?: NotificationOptions): void {
    toast(message, {
      duration: options?.duration || 3000,
      icon: options?.icon || 'ℹ',
    });

    this.addNotification({
      type: 'info',
      title: '信息',
      message,
    });
  }

  /**
   * 显示警告通知
   */
  warning(message: string, options?: NotificationOptions): void {
    toast(message, {
      duration: options?.duration || 3500,
      icon: options?.icon || '⚠',
      style: {
        background: '#f0ff00',
        color: '#0a0a0f',
      },
    });

    this.addNotification({
      type: 'warning',
      title: '警告',
      message,
    });
  }

  /**
   * 显示加载通知
   */
  loading(message: string = '加载中...'): string {
    return toast.loading(message);
  }

  /**
   * 更新加载通知
   */
  updateLoading(
    toastId: string,
    message: string,
    type: 'success' | 'error' = 'success'
  ): void {
    if (type === 'success') {
      toast.success(message, { id: toastId });
    } else {
      toast.error(message, { id: toastId });
    }
  }

  /**
   * 显示 Promise 通知
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> {
    return toast.promise(promise, messages);
  }

  /**
   * 获取所有通知
   */
  getAll(): NotificationItem[] {
    return [...this.notifications];
  }

  /**
   * 获取未读通知
   */
  getUnread(): NotificationItem[] {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * 标记为已读
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * 标记所有为已读
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  /**
   * 删除通知
   */
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  /**
   * 清空所有通知
   */
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * 订阅通知变化
   */
  subscribe(listener: (notifications: NotificationItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 获取未读数量
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // 私有方法

  private addNotification(data: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const notification: NotificationItem = {
      ...data,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    this.notifications.unshift(notification);

    // 限制通知数量
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

// 导出单例
export const notificationService = new NotificationService();

// 导出便捷方法
export const notify = {
  success: (message: string, options?: NotificationOptions) =>
    notificationService.success(message, options),
  error: (message: string, options?: NotificationOptions) =>
    notificationService.error(message, options),
  info: (message: string, options?: NotificationOptions) =>
    notificationService.info(message, options),
  warning: (message: string, options?: NotificationOptions) =>
    notificationService.warning(message, options),
  loading: (message?: string) => notificationService.loading(message),
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => notificationService.promise(promise, messages),
};

export type { NotificationItem, NotificationOptions };
