/**
 * 通知服务
 * 处理用户通知的获取、标记已读、设置偏好等功能
 */

import { apiClient } from '@/lib/api-client';
import type {
  Notification,
  NotificationPreferences,
  NotificationStats,
  SocialApiResponse,
} from '@/types/social.types';

export interface NotificationsListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  unreadOnly?: boolean;
}

export interface NotificationsListResponse {
  items: Notification[];
  total: number;
  unread: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class NotificationService {
  private baseUrl = '/api/notifications';

  /**
   * 获取通知列表
   */
  async getNotifications(params: NotificationsListParams = {}): Promise<NotificationsListResponse> {
    const {
      page = 1,
      pageSize = 20,
      type,
      unreadOnly = false,
    } = params;

    const response = await apiClient.get<NotificationsListResponse>(this.baseUrl, {
      params: {
        page,
        pageSize,
        type,
        unreadOnly,
      },
    });
    return response.data;
  }

  /**
   * 获取通知统计
   */
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await apiClient.get<NotificationStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`${this.baseUrl}/unread-count`);
    return response.data.count;
  }

  /**
   * 标记单个通知为已读
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  /**
   * 标记单个通知为未读
   */
  async markAsUnread(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/unread`);
  }

  /**
   * 批量标记为已读
   */
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    await apiClient.post(`${this.baseUrl}/mark-read`, { notificationIds });
  }

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/mark-all-read`);
  }

  /**
   * 删除单个通知
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  /**
   * 批量删除通知
   */
  async deleteMultiple(notificationIds: string[]): Promise<void> {
    await apiClient.post(`${this.baseUrl}/delete-multiple`, { notificationIds });
  }

  /**
   * 清空所有通知
   */
  async clearAll(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/clear-all`);
  }

  /**
   * 删除所有已读通知
   */
  async clearRead(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/clear-read`);
  }

  /**
   * 获取通知偏好设置
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>(`${this.baseUrl}/preferences`);
    return response.data;
  }

  /**
   * 更新通知偏好设置
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.patch<NotificationPreferences>(`${this.baseUrl}/preferences`, preferences);
    return response.data;
  }

  /**
   * 批量更新通知偏好
   */
  async batchUpdatePreferences(updates: {
    category: 'email' | 'push' | 'inApp';
    enabled: boolean;
    types: string[];
  }[]): Promise<NotificationPreferences> {
    const response = await apiClient.post<NotificationPreferences>(`${this.baseUrl}/preferences/batch`, { updates });
    return response.data;
  }

  /**
   * 启用/禁用某类通知
   */
  async toggleNotificationType(
    type: string,
    enabled: boolean,
    channel: 'email' | 'push' | 'inApp'
  ): Promise<NotificationPreferences> {
    const response = await apiClient.patch<NotificationPreferences>(
      `${this.baseUrl}/preferences/toggle`,
      { type, enabled, channel }
    );
    return response.data;
  }

  /**
   * 获取通知详情
   */
  async getNotificationDetail(notificationId: string): Promise<Notification> {
    const response = await apiClient.get<Notification>(`${this.baseUrl}/${notificationId}`);
    return response.data;
  }

  /**
   * 搜索通知
   */
  async searchNotifications(
    query: string,
    page = 1,
    pageSize = 20
  ): Promise<NotificationsListResponse> {
    const response = await apiClient.get<NotificationsListResponse>(`${this.baseUrl}/search`, {
      params: { query, page, pageSize },
    });
    return response.data;
  }

  /**
   * 获取最新通知（用于实时更新）
   */
  async getLatestNotifications(limit = 10): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(`${this.baseUrl}/latest`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 静音通知（不显示但保留）
   */
  async muteNotification(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/mute`);
  }

  /**
   * 取消静音
   */
  async unmuteNotification(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/unmute`);
  }

  /**
   * 测试通知（用于开发调试）
   */
  async testNotification(type: string): Promise<SocialApiResponse> {
    const response = await apiClient.post<SocialApiResponse>(`${this.baseUrl}/test`, { type });
    return response.data;
  }
}

export const notificationService = new NotificationService();
