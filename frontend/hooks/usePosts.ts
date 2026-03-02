/**
 * usePosts Hook
 * 文章数据管理Hook
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import type { Post } from '@/types';

/**
 * 获取文章列表
 */
export function usePosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => api.posts.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取文章详情
 */
export function usePost(id: number | string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => api.posts.getPost(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 通过slug获取文章
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.posts.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取精选文章
 */
export function useFeaturedPosts(limit: number = 5) {
  return useQuery({
    queryKey: ['featured-posts', limit],
    queryFn: () => api.posts.getFeaturedPosts(limit),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取最新文章
 */
export function useRecentPosts(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: () => api.posts.getRecentPosts(limit),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 创建文章
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Post>) => api.posts.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      api.posts.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.posts.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
