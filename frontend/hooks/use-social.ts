/**
 * useSocial Hook
 * 社交功能 Hook
 *
 * 提供关注、点赞、收藏等社交功能
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// ==================== 类型定义 ====================

export interface FollowStats {
  followers_count: number;
  following_count: number;
  is_following: boolean;
}

export interface SocialStats {
  likes_count: number;
  comments_count: number;
  shares_count: number;
  bookmarks_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

export interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  website_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following?: boolean;
  is_verified?: boolean;
}

// ==================== API 客户端 ====================

const socialApiClient = {
  // 关注
  followUser: async (userId: number) => {
    const response = await fetch(`/api/social/follow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('关注失败');
    return response.json();
  },

  unfollowUser: async (userId: number) => {
    const response = await fetch(`/api/social/follow/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('取消关注失败');
    return response.json();
  },

  // 获取关注状态
  getFollowStatus: async (userId: number): Promise<FollowStats> => {
    const response = await fetch(`/api/social/follow/${userId}/status`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) throw new Error('获取关注状态失败');
    return response.json();
  },

  // 获取用户资料
  getUserProfile: async (username: string): Promise<UserProfile> => {
    const response = await fetch(`/api/social/users/${username}`);
    if (!response.ok) throw new Error('获取用户资料失败');
    return response.json();
  },

  // 获取关注列表
  getFollowing: async (userId: number, page: number = 1) => {
    const response = await fetch(`/api/social/users/${userId}/following?page=${page}`);
    if (!response.ok) throw new Error('获取关注列表失败');
    return response.json();
  },

  // 获取粉丝列表
  getFollowers: async (userId: number, page: number = 1) => {
    const response = await fetch(`/api/social/users/${userId}/followers?page=${page}`);
    if (!response.ok) throw new Error('获取粉丝列表失败');
    return response.json();
  },
};

// ==================== 查询 Keys ====================

export const socialKeys = {
  all: ['social'] as const,
  followStatus: (userId: number) => [...socialKeys.all, 'follow', userId] as const,
  userProfile: (username: string) => [...socialKeys.all, 'profile', username] as const,
  following: (userId: number) => [...socialKeys.all, 'following', userId] as const,
  followers: (userId: number) => [...socialKeys.all, 'followers', userId] as const,
};

// ==================== 关注功能 ====================

/**
 * 获取关注状态
 */
export function useFollowStatus(userId: number) {
  return useQuery({
    queryKey: socialKeys.followStatus(userId),
    queryFn: () => socialApiClient.getFollowStatus(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 分钟
  });
}

/**
 * 关注/取消关注
 */
export function useFollowUser(userId: number) {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: followStatus } = useFollowStatus(userId);

  // 初始化关注状态
  useState(() => {
    if (followStatus?.is_following !== undefined) {
      setIsFollowing(followStatus.is_following);
    }
  });

  const followMutation = useMutation({
    mutationFn: () => socialApiClient.followUser(userId),
    onSuccess: (data) => {
      setIsFollowing(true);
      queryClient.invalidateQueries({
        queryKey: socialKeys.followStatus(userId)
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => socialApiClient.unfollowUser(userId),
    onSuccess: (data) => {
      setIsFollowing(false);
      queryClient.invalidateQueries({
        queryKey: socialKeys.followStatus(userId)
      });
    },
  });

  const toggleFollow = useCallback(() => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  }, [isFollowing, followMutation, unfollowMutation]);

  return {
    isFollowing,
    toggleFollow,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}

// ==================== 用户资料 ====================

/**
 * 获取用户资料
 */
export function useUserProfile(username: string) {
  return useQuery({
    queryKey: socialKeys.userProfile(username),
    queryFn: () => socialApiClient.getUserProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 获取关注列表
 */
export function useFollowing(userId: number, page: number = 1) {
  return useQuery({
    queryKey: [...socialKeys.following(userId), page],
    queryFn: () => socialApiClient.getFollowing(userId, page),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 分钟
  });
}

/**
 * 获取粉丝列表
 */
export function useFollowers(userId: number, page: number = 1) {
  return useQuery({
    queryKey: [...socialKeys.followers(userId), page],
    queryFn: () => socialApiClient.getFollowers(userId, page),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 分钟
  });
}

// ==================== 点赞功能 ====================

/**
 * 点赞 Hook
 */
export function useLike(postId: number) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blog/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) throw new Error('点赞失败');
      return response.json();
    },
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setLikeCount(data.count);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blog/posts/${postId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) throw new Error('取消点赞失败');
      return response.json();
    },
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setLikeCount(data.count);
    },
  });

  const toggleLike = useCallback(() => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  }, [isLiked, likeMutation, unlikeMutation]);

  return {
    isLiked,
    likeCount,
    toggleLike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
  };
}

// ==================== 收藏功能 ====================

/**
 * 收藏 Hook
 */
export function useBookmark(postId: number) {
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blog/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) throw new Error('收藏失败');
      return response.json();
    },
    onSuccess: (data) => {
      setIsBookmarked(data.bookmarked);
    },
  });

  const unbookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/blog/posts/${postId}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) throw new Error('取消收藏失败');
      return response.json();
    },
    onSuccess: (data) => {
      setIsBookmarked(data.bookmarked);
    },
  });

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      unbookmarkMutation.mutate();
    } else {
      bookmarkMutation.mutate();
    }
  }, [isBookmarked, bookmarkMutation, unbookmarkMutation]);

  return {
    isBookmarked,
    toggleBookmark,
    isLoading: bookmarkMutation.isPending || unbookmarkMutation.isPending,
  };
}

// ==================== 分享功能 ====================

/**
 * 分享 Hook
 */
export function useShare(postId: number) {
  const [shareCount, setShareCount] = useState(0);

  const shareMutation = useMutation({
    mutationFn: async (platform: string) => {
      // 记录分享统计
      await fetch(`/api/blog/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ platform }),
      });
    },
  });

  const shareToSocialMedia = useCallback((platform: 'twitter' | 'facebook' | 'linkedin' | 'wechat', url: string, title: string) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      wechat: '', // 微信分享需要特殊处理
    };

    if (platform === 'wechat') {
      // 微信分享：显示二维码或其他方式
      console.log('分享到微信:', url);
      return;
    }

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      shareMutation.mutate(platform);
    }
  }, [shareMutation]);

  const copyLink = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      shareMutation.mutate('copy');
      return true;
    } catch (error) {
      console.error('复制链接失败:', error);
      return false;
    }
  }, [shareMutation]);

  return {
    shareCount,
    shareToSocialMedia,
    copyLink,
  };
}

// ==================== 辅助函数 ====================

/**
 * 格式化关注数量
 */
export function formatFollowCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
