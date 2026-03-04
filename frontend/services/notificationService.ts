/**
 * Notification Service
 * Handles all notification-related operations
 */

import { Notification, NotificationPreferences, NotificationStats } from '@/types/notification.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class NotificationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/notifications`;
  }

  /**
   * Get all notifications for the current user
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: Notification['type'];
    unreadOnly?: boolean;
  }): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.unreadOnly) queryParams.append('unread', 'true');

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return {
        notifications: data.notifications || [],
        total: data.total || 0,
        unreadCount: data.unreadCount || 0,
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notification:', error);
      return null;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/read-all`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear notifications');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch notification stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`);

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Create a new notification (admin only)
   */
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time notifications (WebSocket)
   */
  subscribeToNotifications(
    callback: (notification: Notification) => void
  ): () => void {
    // WebSocket implementation would go here
    // For now, return a no-op function
    return () => {};
  }

  /**
   * Mock notification for development
   */
  static mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'comment',
      title: 'New Comment',
      message: 'John Doe commented on your post',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      actionUrl: '/blog/post-1',
    },
    {
      id: '2',
      type: 'like',
      title: 'New Like',
      message: 'Jane liked your comment',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: '3',
      type: 'follow',
      title: 'New Follower',
      message: 'Bob started following you',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      actionUrl: '/users/bob',
    },
  ];
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export class for testing
export default NotificationService;
