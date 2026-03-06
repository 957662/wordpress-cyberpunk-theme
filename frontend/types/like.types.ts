/**
 * 点赞系统类型定义
 * 与后端API完全对应
 */

import { User } from './common.type';

/**
 * 点赞目标类型
 */
export enum LikeTargetType {
  POST = 'post',           // 文章
  COMMENT = 'comment',     // 评论
  PROJECT = 'project',     // 项目
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
}

/**
 * 创建点赞请求
 */
export interface CreateLikeRequest {
  target_type: LikeTargetType;
  target_id: string | number;
}

/**
 * 点赞响应
 */
export interface LikeResponse {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  created_at: string;
}

/**
 * 点赞状态响应
 */
export interface LikeStatusResponse {
  is_liked: boolean;
  like_count: number;
  like_id?: string;
}

/**
 * 点赞统计响应
 */
export interface LikeStatsResponse {
  total_likes: number;
  recent_likes?: LikeResponse[];
}

/**
 * 点赞列表响应
 */
export interface LikeListResponse {
  items: LikeResponse[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
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
