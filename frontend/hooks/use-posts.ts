/**
 * usePosts Hook
 * 文章数据获取 Hook
 *
 * 提供文章列表、详情等数据的获取和管理
 */

'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/services/api-client';
import type { Post, PostCreate, PostUpdate, PaginatedResponse } from '@/types';

// ==================== 查询 Keys ====================

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: any) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  slug: (slug: string) => [...postKeys.details(), slug] as const,
  related: (id: number) => [...postKeys.all, 'related', id] as const,
};

// ==================== 文章列表 ====================

/**
 * 获取文章列表
 */
export function usePosts(params?: {
  page?: number;
  limit?: number;
  category_id?: number;
  tag_id?: number;
  author_id?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useQuery({
    queryKey: postKeys.list(params || {}),
    queryFn: () => apiClient.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 获取文章无限列表
 */
export function useInfinitePosts(params?: {
  limit?: number;
  category_id?: number;
  tag_id?: number;
  author_id?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useInfiniteQuery({
    queryKey: [...postKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getPosts({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== 文章详情 ====================

/**
 * 通过 ID 获取文章详情
 */
export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => apiClient.getPostById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 通过 slug 获取文章详情
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.slug(slug),
    queryFn: () => apiClient.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

// ==================== 相关文章 ====================

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: number, limit: number = 5) {
  return useQuery({
    queryKey: postKeys.related(postId),
    queryFn: () => apiClient.getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}

// ==================== 文章操作 ====================

/**
 * 创建文章
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreate) => apiClient.createPost(data),
    onSuccess: () => {
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: PostUpdate }) =>
      apiClient.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // 刷新文章详情
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => apiClient.deletePost(postId),
    onSuccess: (_, postId) => {
      // 移除文章详情缓存
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * 发布文章
 */
export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => apiClient.publishPost(postId),
    onSuccess: (_, postId) => {
      // 刷新文章详情
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * 取消发布文章
 */
export function useUnpublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => apiClient.unpublishPost(postId),
    onSuccess: (_, postId) => {
      // 刷新文章详情
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ==================== 预获取 ====================

/**
 * 预获取文章详情
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: postKeys.detail(postId),
      queryFn: () => apiClient.getPostById(postId),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * 预获取相关文章
 */
export function usePrefetchRelatedPosts() {
  const queryClient = useQueryClient();

  return (postId: number, limit: number = 5) => {
    queryClient.prefetchQuery({
      queryKey: postKeys.related(postId),
      queryFn: () => apiClient.getRelatedPosts(postId, limit),
      staleTime: 15 * 60 * 1000,
    });
  };
}

// ==================== 热门和最新文章 ====================

/**
 * 获取热门文章
 */
export function usePopularPosts(limit: number = 10) {
  return useQuery({
    queryKey: [...postKeys.all, 'popular', limit],
    queryFn: async () => {
      const response = await apiClient.getPosts({
        sort_by: 'view_count',
        sort_order: 'desc',
        limit,
      });
      return response.items;
    },
    staleTime: 30 * 60 * 1000, // 30 分钟
  });
}

/**
 * 获取最新文章
 */
export function useRecentPosts(limit: number = 10) {
  return useQuery({
    queryKey: [...postKeys.all, 'recent', limit],
    queryFn: async () => {
      const response = await apiClient.getPosts({
        sort_by: 'created_at',
        sort_order: 'desc',
        limit,
      });
      return response.items;
    },
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}
