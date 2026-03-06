/**
 * API 数据获取 Hooks
 * 使用 TanStack Query (React Query)
 */
'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiClient, ApiResponse } from '@/lib/api-client';
import { useCallback } from 'react';

// ==================== 类型定义 ====================

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  created_at: string;
  updated_at: string;
  views: number;
  likes_count: number;
  comments_count: number;
  featured_image?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user: User;
  content: string;
  parent_id?: string;
  created_at: string;
  likes_count: number;
}

// ==================== Blog Hooks ====================

/**
 * 获取文章列表
 */
export function usePosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const response = await apiClient.get<Post[]>('/posts', params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取单篇文章
 */
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await apiClient.get<Post>(`/posts/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * 获取文章推荐列表
 */
export function useRelatedPosts(postId: string, limit = 4) {
  return useQuery({
    queryKey: ['related-posts', postId, limit],
    queryFn: async () => {
      const response = await apiClient.get<Post[]>(`/posts/${postId}/related`, { limit });
      return response.data;
    },
    enabled: !!postId,
  });
}

// ==================== User Hooks ====================

/**
 * 获取当前用户信息
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取用户资料
 */
export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/users/${username}`);
      return response.data;
    },
    enabled: !!username,
  });
}

// ==================== Category & Tag Hooks ====================

/**
 * 获取所有分类
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

/**
 * 获取所有标签
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await apiClient.get('/tags');
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

// ==================== Comment Hooks ====================

/**
 * 获取文章评论
 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    },
    enabled: !!postId,
  });
}

/**
 * 添加评论
 */
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content, parentId }: {
      postId: string;
      content: string;
      parentId?: string;
    }) => {
      const response = await apiClient.post<Comment>('/comments', {
        post_id: postId,
        content,
        parent_id: parentId,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 刷新评论列表
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

// ==================== Like & Bookmark Hooks ====================

/**
 * 检查文章是否已点赞
 */
export function useIsPostLiked(postId: string) {
  return useQuery({
    queryKey: ['post-like', postId],
    queryFn: async () => {
      const response = await apiClient.get(`/posts/${postId}/like`);
      return response.data;
    },
    enabled: !!postId,
  });
}

/**
 * 切换点赞状态
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['post-like', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

/**
 * 检查文章是否已收藏
 */
export function useIsPostBookmarked(postId: string) {
  return useQuery({
    queryKey: ['post-bookmark', postId],
    queryFn: async () => {
      const response = await apiClient.get(`/posts/${postId}/bookmark`);
      return response.data;
    },
    enabled: !!postId,
  });
}

/**
 * 切换收藏状态
 */
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.post(`/posts/${postId}/bookmark`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['post-bookmark', postId] });
    },
  });
}

// ==================== Follow Hooks ====================

/**
 * 检查是否已关注用户
 */
export function useIsFollowing(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${userId}/follow`);
      return response.data;
    },
    enabled: !!userId,
  });
}

/**
 * 切换关注状态
 */
export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(`/users/${userId}/follow`);
      return response.data;
    },
    onSuccess: (data, userId) => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
    },
  });
}

// ==================== Search Hooks ====================

/**
 * 全局搜索
 */
export function useSearch(query: string, type = 'all') {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const response = await apiClient.get('/search', { q: query, type });
      return response.data;
    },
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

// ==================== Statistics Hooks ====================

/**
 * 获取网站统计信息
 */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await apiClient.get('/stats');
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1小时
  });
}

// ==================== Newsletter Hooks ====================

/**
 * 订阅新闻邮件
 */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/newsletter/subscribe', { email });
      return response.data;
    },
  });
}
