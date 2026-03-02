/**
 * 评论相关类型定义
 */

import { User } from './api.types';

/**
 * 评论状态
 */
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'trash';

/**
 * 评论数据结构
 */
export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: CommentAuthor;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
  replyCount?: number;
}

/**
 * 评论作者信息
 */
export interface CommentAuthor {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  url?: string;
  isRegistered?: boolean;
}

/**
 * 创建评论请求
 */
export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
}

/**
 * 更新评论请求
 */
export interface UpdateCommentRequest {
  content: string;
}

/**
 * 评论列表响应
 */
export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 评论查询参数
 */
export interface CommentQueryParams {
  postId?: string;
  parentId?: string;
  status?: CommentStatus;
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'likes' | 'replies';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 评论回复表单数据
 */
export interface CommentReplyForm {
  content: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
}

/**
 * 评论统计数据
 */
export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  spam: number;
  byPost: Record<string, number>;
}

/**
 * 评论通知设置
 */
export interface CommentNotificationSettings {
  emailOnReply: boolean;
  emailOnModerate: boolean;
  browserNotification: boolean;
}

/**
 * 评论审核操作
 */
export type CommentModerationAction = 'approve' | 'spam' | 'trash' | 'restore';

/**
 * 批量操作评论请求
 */
export interface BulkCommentActionRequest {
  commentIds: string[];
  action: CommentModerationAction;
}

/**
 * 评论搜索过滤器
 */
export interface CommentFilter {
  search?: string;
  status?: CommentStatus;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  post?: string;
  hasReplies?: boolean;
}

/**
 * 评论导出数据
 */
export interface CommentExportData {
  id: string;
  post: string;
  author: string;
  email: string;
  content: string;
  status: string;
  createdAt: string;
  likes: number;
  repliesCount: number;
}

/**
 * 评论活动日志
 */
export interface CommentActivity {
  id: string;
  commentId: string;
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'spam' | 'restored';
  userId?: string;
  userIp?: string;
  userAgent?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}
