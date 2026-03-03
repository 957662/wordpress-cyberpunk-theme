/**
 * 通知服务
 * 处理通知的获取、标记已读、删除等操作
 */

import { apiClient } from '@/lib/api-client';

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'reply'
  | 'system'
  | 'newsletter';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  userId: string;
  actorId?: string;
  actor?: {
    id: string;
    username: string;
    avatar?: string;
    displayName?: string;
  };
  targetType?: string;
  targetId?: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread: number;
  page: number;
  pageSize: number;
}

export interface NotificationSettings {
  emailFollow: boolean;
  emailLike: boolean;
  emailComment: boolean;
  emailMention: boolean;
  emailSystem: boolean;
  pushFollow: boolean;
  pushLike: boolean;
  pushComment: boolean;
  pushMention: boolean;
  pushSystem: boolean;
}

class NotificationService {
  private baseUrl = '/api/notifications';

  /**
   * 获取通知列表
   */
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    type?: NotificationType;
    unreadOnly?: boolean;
  }): Promise<NotificationListResponse> {
    const response = await apiClient.get<NotificationListResponse>(
      this.baseUrl,
      { params }
    );
    return response.data;
  }

  /**
   * 获取通知统计
   */
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await apiClient.get<NotificationStats>(
      `${this.baseUrl}/stats`
    );
    return response.data;
  }

  /**
   * 标记通知为已读
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${notificationId}/read`);
  }

  /**
   * 批量标记通知为已读
   */
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    await apiClient.put(`${this.baseUrl}/batch/read`, { notificationIds });
  }

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put(`${this.baseUrl}/read-all`);
  }

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  /**
   * 批量删除通知
   */
  async deleteMultipleNotifications(notificationIds: string[]): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/batch`, {
      data: { notificationIds },
    });
  }

  /**
   * 清空所有通知
   */
  async clearAll(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/all`);
  }

  /**
   * 获取通知设置
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>(
      `${this.baseUrl}/settings`
    );
    return response.data;
  }

  /**
   * 更新通知设置
   */
  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>(
      `${this.baseUrl}/settings`,
      settings
    );
    return response.data;
  }
}

export const notificationService = new NotificationService();
