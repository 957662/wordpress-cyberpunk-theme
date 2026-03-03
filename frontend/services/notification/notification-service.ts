/**
 * 通知服务
 * 处理通知的获取、标记、删除等操作
 */

import { apiClient } from '../api-client';
import {
  Notification,
  NotificationsResponse,
  NotificationsQuery,
  NotificationSettings,
  NotificationStats,
  BulkNotificationAction,
  BulkNotificationResponse,
} from '../../types/notification.types';

class NotificationService {
  private readonly baseUrl = '/api/notifications';

  /**
   * 获取通知列表
   */
  async getNotifications(query?: NotificationsQuery): Promise<NotificationsResponse> {
    try {
      const response = await apiClient.get<NotificationsResponse>(
        this.baseUrl,
        { params: query }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  /**
   * 获取未读通知数量
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        `${this.baseUrl}/unread-count`
      );
      return response.data.count;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  }

  /**
   * 获取通知统计
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get<NotificationStats>(
        `${this.baseUrl}/stats`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      throw error;
    }
  }

  /**
   * 标记单个通知为已读
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.patch<{ success: boolean }>(
        `${this.baseUrl}/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * 标记单个通知为未读
   */
  async markAsUnread(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.patch<{ success: boolean }>(
        `${this.baseUrl}/${notificationId}/unread`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      throw error;
    }
  }

  /**
   * 标记所有通知为已读
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.patch<{ success: boolean; count: number }>(
        `${this.baseUrl}/read-all`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  }

  /**
   * 归档通知
   */
  async archiveNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.patch<{ success: boolean }>(
        `${this.baseUrl}/${notificationId}/archive`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to archive notification:', error);
      throw error;
    }
  }

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete<{ success: boolean }>(
        `${this.baseUrl}/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * 批量操作通知
   */
  async bulkAction(
    action: BulkNotificationAction
  ): Promise<BulkNotificationResponse> {
    try {
      const response = await apiClient.post<BulkNotificationResponse>(
        `${this.baseUrl}/bulk`,
        action
      );
      return response.data;
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      throw error;
    }
  }

  /**
   * 获取通知设置
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiClient.get<NotificationSettings>(
        `${this.baseUrl}/settings`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      throw error;
    }
  }

  /**
   * 更新通知设置
   */
  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
      const response = await apiClient.patch<NotificationSettings>(
        `${this.baseUrl}/settings`,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * 发送测试通知
   */
  async sendTestNotification(type: string): Promise<Notification> {
    try {
      const response = await apiClient.post<Notification>(
        `${this.baseUrl}/test`,
        { type }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }

  /**
   * 清空所有通知
   */
  async clearAllNotifications(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.delete<{ success: boolean; count: number }>(
        `${this.baseUrl}/all`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      throw error;
    }
  }

  /**
   * 获取最新通知
   */
  async getLatestNotifications(limit: number = 5): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>(
        `${this.baseUrl}/latest`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get latest notifications:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const notificationService = new NotificationService();
