/**
 * 点赞系统类型定义
 */

import { User } from './common.type';

/**
 * 点赞目标类型
 */
export enum LikeTargetType {
  POST = 'post',           // 文章
  COMMENT = 'comment',     // 评论
  REPLY = 'reply',         // 回复
  USER_STATUS = 'user_status', // 用户状态
}

/**
 * 点赞实体
 */
export interface Like {
  id: string;
  userId: string;
  user?: User;
  targetType: LikeTargetType;
  targetId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 点赞统计
 */
export interface LikeStats {
  count: number;
  isLiked: boolean;
  recentUsers?: User[];
}

/**
 * 点赞请求
 */
export interface LikeRequest {
  targetType: LikeTargetType;
  targetId: string;
}

/**
 * 取消点赞请求
 */
export interface UnlikeRequest {
  targetType: LikeTargetType;
  targetId: string;
}

/**
 * 点赞用户列表响应
 */
export interface LikeUsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 批量点赞状态
 */
export interface BatchLikeStatus {
  [targetId: string]: boolean;
}
