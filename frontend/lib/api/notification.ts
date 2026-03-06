/**
 * Notification API Service
 * 处理通知相关的API请求
 */

import { API_BASE_URL } from '@/lib/config';

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  content: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    unread: number;
    page: number;
    pageSize: number;
  };
}

class NotificationApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/notifications`;
  }

  /**
   * 获取通知列表
   */
  async getNotifications(
    token: string,
    page: number = 1,
    pageSize: number = 20,
    onlyUnread: boolean = false
  ): Promise<NotificationListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (onlyUnread) params.append('unread', 'true');

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }

  /**
   * 获取通知统计
   */
  async getNotificationStats(token: string): Promise<NotificationStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification stats');
    }

    return response.json();
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(token: string, notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * 批量标记通知为已读
   */
  async markAllAsRead(token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-all`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * 删除通知
   */
  async deleteNotification(token: string, notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${notificationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * 清空所有通知
   */
  async clearAll(token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/clear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear all notifications');
    }
  }

  /**
   * 设置通知偏好
   */
  async setPreferences(
    token: string,
    preferences: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      commentNotifications?: boolean;
      likeNotifications?: boolean;
      followNotifications?: boolean;
    }
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to set notification preferences');
    }
  }
}

// 导出单例实例
export const notificationApi = new NotificationApiService();

// 导出类型
export type {
  Notification,
  NotificationStats,
  NotificationListResponse,
};
