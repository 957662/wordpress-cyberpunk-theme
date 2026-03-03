/**
 * 通知系统类型定义
 */

import { User } from './common.types';

/**
 * 通知类型枚举
 */
export enum NotificationType {
  COMMENT = 'comment',           // 评论通知
  REPLY = 'reply',               // 回复通知
  LIKE = 'like',                 // 点赞通知
  FOLLOW = 'follow',             // 关注通知
  MENTION = 'mention',           // 提及通知
  SYSTEM = 'system',             // 系统通知
  POST = 'post',                 // 文章发布通知
  BOOKMARK = 'bookmark',         // 收藏通知
  ACHIEVEMENT = 'achievement',   // 成就通知
}

/**
 * 通知状态枚举
 */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

/**
 * 通知优先级
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * 通知实体
 */
export interface Notification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;

  // 内容
  title: string;
  content: string;
  excerpt?: string;

  // 发送者和接收者
  senderId?: string;
  sender?: User;
  recipientId: string;
  recipient?: User;

  // 关联数据
  postId?: string;
  postTitle?: string;
  commentId?: string;
  replyId?: string;

  // 时间戳
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  archivedAt?: string;

  // 元数据
  metadata?: Record<string, any>;
  actionUrl?: string;
}

/**
 * 通知列表响应
 */
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}

/**
 * 通知列表查询参数
 */
export interface NotificationsQuery {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  startDate?: string;
  endDate?: string;
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  // 邮件通知设置
  emailComment: boolean;
  emailReply: boolean;
  emailLike: boolean;
  emailFollow: boolean;
  emailMention: boolean;
  emailSystem: boolean;

  // 站内通知设置
  siteComment: boolean;
  siteReply: boolean;
  siteLike: boolean;
  siteFollow: boolean;
  siteMention: boolean;
  siteSystem: boolean;
  sitePost: boolean;

  // 推送通知设置
  pushEnabled: boolean;
  pushComment: boolean;
  pushReply: boolean;
  pushLike: boolean;
  pushFollow: boolean;
  pushMention: boolean;

  // 每日摘要
  dailyDigest: boolean;
  weeklyDigest: boolean;
}

/**
 * 通知统计
 */
export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<NotificationType, number>;
}

/**
 * 批量操作请求
 */
export interface BulkNotificationAction {
  notificationIds: string[];
  action: 'mark_read' | 'mark_unread' | 'archive' | 'delete';
}

/**
 * 批量操作响应
 */
export interface BulkNotificationResponse {
  success: boolean;
  affected: number;
  failed: string[];
}
