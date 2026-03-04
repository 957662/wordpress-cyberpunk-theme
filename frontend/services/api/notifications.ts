/**
 * Notifications API Service
 * Handles all notification-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface CreateNotificationDto {
  type: Notification['type'];
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  comment: boolean;
  like: boolean;
  follow: boolean;
  mention: boolean;
  system: boolean;
}

class NotificationsService {
  private baseUrl = `${API_BASE_URL}/notifications`;

  /**
   * Get all notifications for current user
   */
  async getNotifications(params?: {
    skip?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<Notification[]> {
    try {
      const response = await axios.get<Notification[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get<{ count: number }>(`${this.baseUrl}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await axios.patch<Notification>(`${this.baseUrl}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await axios.get<NotificationPreferences>(`${this.baseUrl}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await axios.patch<NotificationPreferences>(`${this.baseUrl}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationsService = new NotificationsService();
