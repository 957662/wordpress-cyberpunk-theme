/**
 * Notification API Service
 * Handles all notification-related API calls
 */

import { axiosInstance } from '@/lib/api/client';

export type NotificationType =
  | 'comment'
  | 'like'
  | 'follow'
  | 'mention'
  | 'reply'
  | 'system'
  | 'post';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: number;
    username: string;
    display_name?: string;
    avatar?: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
}

class NotificationApiService {
  private readonly basePath = '/notifications';

  /**
   * Get all notifications
   */
  async getNotifications(options: {
    page?: number;
    perPage?: number;
    unreadOnly?: boolean;
    type?: NotificationType;
  } = {}): Promise<{
    data: Notification[];
    total: number;
    unread: number;
    page: number;
    per_page: number;
  }> {
    const { page = 1, perPage = 20, unreadOnly = false, type } = options;

    const response = await axiosInstance.get(this.basePath, {
      params: {
        page,
        per_page: perPage,
        unread_only: unreadOnly,
        type,
      },
    });

    return response.data;
  }

  /**
   * Get notification by ID
   */
  async getNotification(notificationId: number): Promise<Notification> {
    const response = await axiosInstance.get(`${this.basePath}/${notificationId}`);
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    await axiosInstance.patch(`${this.basePath}/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await axiosInstance.post(`${this.basePath}/read-all`);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${notificationId}`);
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    await axiosInstance.delete(this.basePath);
  }

  /**
   * Delete all read notifications
   */
  async deleteReadNotifications(): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/read`);
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await axiosInstance.get(`${this.basePath}/stats`);
    return response.data;
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await axiosInstance.get(`${this.basePath}/unread-count`);
    return response.data.count;
  }

  /**
   * Mark notifications as read by type
   */
  async markTypeAsRead(type: NotificationType): Promise<void> {
    await axiosInstance.post(`${this.basePath}/read-type`, { type });
  }
}

export const notificationApi = new NotificationApiService();
