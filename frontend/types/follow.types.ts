/**
 * 关注系统类型定义
 */

import { User } from './common.types';

/**
 * 关注关系类型
 */
export interface Follow {
  id: string;
  followerId: string;  // 关注者ID
  followingId: string; // 被关注者ID
  createdAt: string;
  updatedAt: string;

  // 关联数据
  follower?: User;
  following?: User;
}

/**
 * 关注状态
 */
export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean; // 对方是否也关注了我
  followerCount: number;
  followingCount: number;
}

/**
 * 关注请求参数
 */
export interface FollowRequest {
  followingId: string;
}

/**
 * 取消关注请求参数
 */
export interface UnfollowRequest {
  followingId: string;
}

/**
 * 粉丝列表响应
 */
export interface FollowersResponse {
  followers: User[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 关注列表响应
 */
export interface FollowingResponse {
  following: User[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 关注操作结果
 */
export interface FollowActionResult {
  success: boolean;
  isFollowing: boolean;
  message?: string;
}
