/**
 * 通知类型定义
 */

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
  actor?: NotificationActor;
  targetType?: string;
  targetId?: string;
  targetUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationActor {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
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
  // 邮件通知
  emailFollow: boolean;
  emailLike: boolean;
  emailComment: boolean;
  emailMention: boolean;
  emailSystem: boolean;

  // 推送通知
  pushFollow: boolean;
  pushLike: boolean;
  pushComment: boolean;
  pushMention: boolean;
  pushSystem: boolean;
}

export interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
}
