/**
 * Notification API Client
 * 通知相关的 API 客户端
 */

import { apiClient } from './client';

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'reply'
  | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  avatar_url?: string | null;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
  total: number;
  page: number;
  page_size: number;
}

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  in_app: boolean;
}

export interface NotificationSettings {
  follow: NotificationPreference;
  like: NotificationPreference;
  comment: NotificationPreference;
  mention: NotificationPreference;
  system: NotificationPreference;
}

/**
 * 通知 API 客户端
 */
export const notificationApi = {
  /**
   * 获取通知列表
   */
  async getNotifications(
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationListResponse> {
    return await apiClient.get<NotificationListResponse>('/notifications', {
      params: {
        page,
        page_size: pageSize,
        unread_only: unreadOnly,
      },
    });
  },

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return await apiClient.get<{ count: number }>('/notifications/unread-count');
  },

  /**
   * 标记通知为已读
   */
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.post(`/notifications/${notificationId}/read`);
  },

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * 清空所有通知
   */
  async clearAll(): Promise<void> {
    await apiClient.delete('/notifications/clear-all');
  },

  /**
   * 获取通知设置
   */
  async getSettings(): Promise<NotificationSettings> {
    return await apiClient.get<NotificationSettings>('/notifications/settings');
  },

  /**
   * 更新通知设置
   */
  async updateSettings(settings: NotificationSettings): Promise<void> {
    await apiClient.post('/notifications/settings', settings);
  },
};
