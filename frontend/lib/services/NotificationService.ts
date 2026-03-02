/**
 * Notification Service
 * 通知服务 - 管理浏览器通知和应用内通知
 * 支持 Web Push API 和应用内通知系统
 */

// ============================================
// 类型定义
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  priority: NotificationPriority;
  duration?: number;
  actions?: NotificationAction[];
  data?: Record<string, any>;
  createdAt: Date;
  read: boolean;
}

export interface NotificationAction {
  id: string;
  title: string;
  icon?: string;
  action: () => void;
}

export interface PushSubscriptionOptions {
  vapidPublicKey: string;
  swPath?: string;
}

export interface BrowserNotificationOptions extends NotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

// ============================================
// Notification Service Class
// ============================================

class NotificationService {
  private appNotifications: AppNotification[] = [];
  private listeners: Set<(notifications: AppNotification[]) => void> = new Set();
  private permission: NotificationPermission = 'default';
  private pushSubscription: PushSubscription | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.permission = Notification.permission;
    }
  }

  // ============================================
  // 通知权限管理
  // ============================================

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('[Notification] Notifications not supported');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return this.permission;
    }

    this.permission = await Notification.requestPermission();
    return this.permission;
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // ============================================
  // 浏览器通知
  // ============================================

  async showBrowserNotification(
    title: string,
    options: BrowserNotificationOptions = {}
  ): Promise<Notification | null> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    if (this.permission !== 'granted') {
      const result = await this.requestPermission();
      if (result !== 'granted') {
        return null;
      }
    }

    const notificationOptions: NotificationOptions = {
      icon: options.icon || '/icons/icon-192x192.png',
      badge: options.badge || '/icons/badge-72x72.png',
      image: options.image,
      body: options.body,
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
    };

    const notification = new Notification(title, notificationOptions);

    // Add action handlers
    if (options.actions && notification.actions) {
      notification.addEventListener('click', (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
      });
    }

    return notification;
  }

  // ============================================
  // 应用内通知
  // ============================================

  addAppNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): string {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false,
    };

    this.appNotifications.unshift(newNotification);

    // 如果不是低优先级，也显示浏览器通知
    if (notification.priority !== 'low') {
      this.showBrowserNotification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        image: notification.image,
        data: notification.data,
      });
    }

    this.notifyListeners();

    // 自动移除（如果设置了 duration）
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeAppNotification(newNotification.id);
      }, notification.duration);
    }

    return newNotification.id;
  }

  removeAppNotification(id: string): void {
    this.appNotifications = this.appNotifications.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  markAsRead(id: string): void {
    const notification = this.appNotifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    this.appNotifications.forEach((n) => (n.read = true));
    this.notifyListeners();
  }

  clearAll(): void {
    this.appNotifications = [];
    this.notifyListeners();
  }

  getNotifications(): AppNotification[] {
    return [...this.appNotifications];
  }

  getUnreadCount(): number {
    return this.appNotifications.filter((n) => !n.read).length;
  }

  // ============================================
  // 订阅/取消订阅
  // ============================================

  subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.add(listener);
    // 立即发送当前状态
    listener(this.getNotifications());

    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.getNotifications());
    });
  }

  // ============================================
  // Push Notifications
  // ============================================

  async subscribeToPush(options: PushSubscriptionOptions): Promise<PushSubscription | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('[Notification] Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        options.swPath || '/sw.js'
      );

      // Convert VAPID key
      const convertedVapidKey = this.urlBase64ToUint8Array(options.vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      this.pushSubscription = subscription;
      return subscription;
    } catch (error) {
      console.error('[Notification] Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.pushSubscription) {
      return false;
    }

    try {
      await this.pushSubscription.unsubscribe();
      this.pushSubscription = null;
      return true;
    } catch (error) {
      console.error('[Notification] Push unsubscribe failed:', error);
      return false;
    }
  }

  getPushSubscription(): PushSubscription | null {
    return this.pushSubscription;
  }

  // ============================================
  // 便捷方法
  // ============================================

  success(title: string, message: string, options?: Partial<AppNotification>): string {
    return this.addAppNotification({
      type: 'success',
      title,
      message,
      priority: 'normal',
      ...options,
    });
  }

  error(title: string, message: string, options?: Partial<AppNotification>): string {
    return this.addAppNotification({
      type: 'error',
      title,
      message,
      priority: 'high',
      ...options,
    });
  }

  warning(title: string, message: string, options?: Partial<AppNotification>): string {
    return this.addAppNotification({
      type: 'warning',
      title,
      message,
      priority: 'normal',
      ...options,
    });
  }

  info(title: string, message: string, options?: Partial<AppNotification>): string {
    return this.addAppNotification({
      type: 'info',
      title,
      message,
      priority: 'low',
      ...options,
    });
  }

  // ============================================
  // 辅助方法
  // ============================================

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// ============================================
// 单例实例
// ============================================

let notificationInstance: NotificationService | null = null;

export const getNotificationService = (): NotificationService => {
  if (!notificationInstance) {
    notificationInstance = new NotificationService();
  }
  return notificationInstance;
};

// ============================================
// 导出
// ============================================

export default NotificationService;
