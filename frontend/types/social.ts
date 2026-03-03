/**
 * 社交功能类型定义
 */

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowStats {
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
}

export interface FollowListResponse {
  items: FollowWithUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FollowWithUser extends Follow {
  follower: UserBasic;
  following: UserBasic;
}

export interface UserBasic {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
}

export interface Like {
  id: string;
  userId: string;
  targetType: 'post' | 'comment' | 'portfolio';
  targetId: string;
  createdAt: Date;
}

export interface LikeStats {
  likeCount: number;
  isLiked: boolean;
}
