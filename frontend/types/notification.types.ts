/**
 * Notification Type Definitions
 */

export type NotificationType = 'comment' | 'like' | 'follow' | 'mention' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  comment: boolean;
  like: boolean;
  follow: boolean;
  mention: boolean;
  system: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    comment: number;
    like: number;
    follow: number;
    mention: number;
    system: number;
  };
}

export interface NotificationCreateInput {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationUpdateInput {
  read?: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  unreadOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
}
