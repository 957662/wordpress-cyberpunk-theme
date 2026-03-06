/**
 * 收藏系统类型定义
 * 与后端API完全对应
 */

import { User } from './common';

/**
 * 收藏目标类型
 */
export enum BookmarkTargetType {
  POST = 'post',           // 文章
  PROJECT = 'project',     // 项目
  CATEGORY = 'category',   // 分类
}

/**
 * 收藏实体
 */
export interface Bookmark {
  id: string;
  userId: string;
  targetType: BookmarkTargetType;
  targetId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建收藏请求
 */
export interface CreateBookmarkRequest {
  target_type: BookmarkTargetType;
  target_id: string | number;
  notes?: string;
}

/**
 * 更新收藏请求
 */
export interface UpdateBookmarkRequest {
  notes?: string;
}

/**
 * 收藏响应
 */
export interface BookmarkResponse {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 收藏状态响应
 */
export interface BookmarkStatusResponse {
  is_bookmarked: boolean;
  bookmark_id?: string;
}

/**
 * 收藏列表响应
 */
export interface BookmarkListResponse {
  items: BookmarkResponse[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

/**
 * 搜索收藏请求
 */
export interface SearchBookmarksRequest {
  query?: string;
  target_type?: BookmarkTargetType;
  page?: number;
  per_page?: number;
}

/**
 * 收藏统计
 */
export interface BookmarkStats {
  total: number;
  by_type: {
    post: number;
    project: number;
    category: number;
  };
}
