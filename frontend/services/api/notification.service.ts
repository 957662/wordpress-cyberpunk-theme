/**
 * Notification Service
 * 通知服务 - 处理用户通知相关操作
 */

interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'reply' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  comment: boolean;
  like: boolean;
  follow: boolean;
  mention: boolean;
  system: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

class NotificationService {
  private baseUrl: string;
  private endpoints = {
    notifications: '/api/notifications',
    preferences: '/api/notifications/preferences',
    stats: '/api/notifications/stats',
    markRead: '/api/notifications/mark-read',
    markAllRead: '/api/notifications/mark-all-read',
  };

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取通知列表
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
    unreadOnly?: boolean;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.unreadOnly) searchParams.set('unread_only', 'true');

    const response = await fetch(
      `${this.baseUrl}${this.endpoints.notifications}?${searchParams}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }

  /**
   * 获取通知统计
   */
  async getStats(): Promise<NotificationStats> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.stats}`);

    if (!response.ok) {
      throw new Error('Failed to fetch notification stats');
    }

    return response.json();
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.markRead}/${notificationId}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.markAllRead}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * 获取通知偏好设置
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`);

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
  }

  /**
   * 更新通知偏好设置
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await fetch(`${this.baseUrl}${this.endpoints.preferences}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }

    return response.json();
  }

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.notifications}/${notificationId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * 清除所有已读通知
   */
  async clearRead(): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${this.endpoints.notifications}/clear-read`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Failed to clear read notifications');
    }
  }
}

// 导出单例实例
export const notificationService = new NotificationService();
export default notificationService;
