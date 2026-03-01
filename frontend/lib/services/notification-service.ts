/**
 * 通知服务
 * 提供统一的通知管理功能
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  /** 通知类型 */
  type?: NotificationType;
  /** 标题 */
  title?: string;
  /** 消息内容 */
  message: string;
  /** 显示时长（毫秒），0 表示不自动关闭 */
  duration?: number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: string;
  /** 自定义类名 */
  className?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 关闭回调 */
  onClose?: () => void;
}

export interface Notification extends Required<Omit<NotificationOptions, 'onClose'>> {
  id: string;
  createdAt: number;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private idCounter = 0;

  /**
   * 订阅通知变化
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 通知所有订阅者
   */
  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  /**
   * 添加通知
   */
  add(options: NotificationOptions): string {
    const id = `notification-${++this.idCounter}-${Date.now()}`;
    const notification: Notification = {
      type: options.type || 'info',
      title: options.title || '',
      message: options.message,
      duration: options.duration ?? 5000,
      closable: options.closable ?? true,
      icon: options.icon || this.getDefaultIcon(options.type || 'info'),
      className: options.className || '',
      onClick: options.onClick,
      id,
      createdAt: Date.now(),
    };

    this.notifications.push(notification);
    this.notify();

    // 自动关闭
    if (notification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }

    return id;
  }

  /**
   * 移除通知
   */
  remove(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      const notification = this.notifications[index];
      notification.onClose?.();
      this.notifications.splice(index, 1);
      this.notify();
    }
  }

  /**
   * 清空所有通知
   */
  clear(): void {
    this.notifications.forEach(n => n.onClose?.());
    this.notifications = [];
    this.notify();
  }

  /**
   * 获取默认图标
   */
  private getDefaultIcon(type: NotificationType): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  }

  /**
   * 成功通知
   */
  success(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.add({ ...options, message, type: 'success' });
  }

  /**
   * 错误通知
   */
  error(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.add({ ...options, message, type: 'error', duration: 0 });
  }

  /**
   * 警告通知
   */
  warning(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.add({ ...options, message, type: 'warning' });
  }

  /**
   * 信息通知
   */
  info(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): string {
    return this.add({ ...options, message, type: 'info' });
  }

  /**
   * 获取所有通知
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * 获取通知数量
   */
  count(): number {
    return this.notifications.length;
  }
}

// 创建单例
const notificationService = new NotificationService();

// 导出单例和类
export { NotificationService };
export default notificationService;
