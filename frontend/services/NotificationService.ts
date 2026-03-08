/**
 * CyberPress Notification Service
 * 通知服务
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
  isRead?: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface NotificationOptions {
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private defaultDuration: number = 5000; // 5秒

  /**
   * 订阅通知变化
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    // 立即调用一次，传入当前通知列表
    listener(this.getAllNotifications());

    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 通知所有监听器
   */
  private notify(): void {
    const notifications = this.getAllNotifications();
    this.listeners.forEach((listener) => {
      try {
        listener(notifications);
      } catch (error) {
        console.error('[NotificationService] Listener error:', error);
      }
    });
  }

  /**
   * 生成通知 ID
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * 添加通知
   */
  add(
    type: NotificationType,
    title: string,
    message: string,
    options: NotificationOptions = {}
  ): Notification {
    const id = this.generateId();

    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options.duration ?? this.defaultDuration,
      timestamp: Date.now(),
      isRead: false,
      actions: options.actions,
      metadata: options.metadata,
    };

    this.notifications.set(id, notification);
    this.notify();

    // 自动移除（如果不是持久通知）
    if (!options.persistent && notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }

    // 浏览器通知
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      this.showBrowserNotification(title, message, type);
    }

    console.log('[NotificationService] Added:', notification);
    return notification;
  }

  /**
   * 显示成功通知
   */
  success(title: string, message: string, options?: NotificationOptions): Notification {
    return this.add('success', title, message, options);
  }

  /**
   * 显示错误通知
   */
  error(title: string, message: string, options?: NotificationOptions): Notification {
    return this.add('error', title, message, { ...options, duration: options?.duration ?? 10000 }); // 错误通知默认显示10秒
  }

  /**
   * 显示警告通知
   */
  warning(title: string, message: string, options?: NotificationOptions): Notification {
    return this.add('warning', title, message, options);
  }

  /**
   * 显示信息通知
   */
  info(title: string, message: string, options?: NotificationOptions): Notification {
    return this.add('info', title, message, options);
  }

  /**
   * 显示确认对话框
   */
  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const notification = this.add('warning', title, message, {
        persistent: true,
        duration: 0,
        actions: [
          {
            label: '取消',
            onClick: () => {
              this.remove(notification.id);
              resolve(false);
            },
          },
          {
            label: '确认',
            primary: true,
            onClick: () => {
              this.remove(notification.id);
              resolve(true);
            },
          },
        ],
      });
    });
  }

  /**
   * 移除通知
   */
  remove(id: string): boolean {
    const removed = this.notifications.delete(id);
    if (removed) {
      this.notify();
      console.log('[NotificationService] Removed:', id);
    }
    return removed;
  }

  /**
   * 清空所有通知
   */
  clear(): void {
    this.notifications.clear();
    this.notify();
    console.log('[NotificationService] Cleared all notifications');
  }

  /**
   * 标记为已读
   */
  markAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * 标记所有为已读
   */
  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.isRead = true;
    });
    this.notify();
  }

  /**
   * 获取所有通知
   */
  getAllNotifications(): Notification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }

  /**
   * 获取未读通知
   */
  getUnreadNotifications(): Notification[] {
    return this.getAllNotifications().filter((n) => !n.isRead);
  }

  /**
   * 获取未读通知数量
   */
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  /**
   * 显示浏览器通知
   */
  private showBrowserNotification(title: string, message: string, type: NotificationType): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const icons: Record<NotificationType, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    const notification = new Notification(`${icons[type]} ${title}`, {
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'cyberpress-notification',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  /**
   * 请求浏览器通知权限
   */
  async requestBrowserPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

// 创建单例实例
const notificationService = new NotificationService();

// 请求浏览器通知权限
if (typeof window !== 'undefined') {
  notificationService.requestBrowserPermission();
}

export default notificationService;

/**
 * React Hook: useNotifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount: notificationService.getUnreadCount(),
    add: (type: NotificationType, title: string, message: string, options?: NotificationOptions) =>
      notificationService.add(type, title, message, options),
    success: (title: string, message: string, options?: NotificationOptions) =>
      notificationService.success(title, message, options),
    error: (title: string, message: string, options?: NotificationOptions) =>
      notificationService.error(title, message, options),
    warning: (title: string, message: string, options?: NotificationOptions) =>
      notificationService.warning(title, message, options),
    info: (title: string, message: string, options?: NotificationOptions) =>
      notificationService.info(title, message, options),
    confirm: (title: string, message: string) => notificationService.confirm(title, message),
    remove: (id: string) => notificationService.remove(id),
    clear: () => notificationService.clear(),
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
  };
}

/**
 * React Hook: useNotification
 * 简化的通知 Hook
 */
export function useNotification() {
  return {
    showSuccess: (title: string, message: string) => notificationService.success(title, message),
    showError: (title: string, message: string) => notificationService.error(title, message),
    showWarning: (title: string, message: string) => notificationService.warning(title, message),
    showInfo: (title: string, message: string) => notificationService.info(title, message),
    showConfirm: (title: string, message: string) => notificationService.confirm(title, message),
  };
}

/**
 * 高阶组件：withNotification
 */
export function withNotification<P extends object>(
  WrappedComponent: React.ComponentType<P & { notification: ReturnType<typeof useNotification> }>
) {
  return (props: P) => {
    const notification = useNotification();
    return <WrappedComponent {...props} notification={notification} />;
  };
}

/**
 * 上下文 Provider
 */
export const NotificationContext = React.createContext(notificationService);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return (
    <NotificationContext.Provider value={notificationService as any}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * 工具函数：创建 Promise 包装器
 */
export function withNotification<T>(
  promise: Promise<T>,
  options: {
    success?: string;
    error?: string;
    loading?: string;
  }
): Promise<T> {
  if (options.loading) {
    notificationService.info('处理中', options.loading, { duration: 0 });
  }

  return promise
    .then((result) => {
      if (options.success) {
        notificationService.success('成功', options.success);
      }
      return result;
    })
    .catch((error) => {
      const errorMessage = options.error || error.message || '操作失败';
      notificationService.error('错误', errorMessage);
      throw error;
    });
}
