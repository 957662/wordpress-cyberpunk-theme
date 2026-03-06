/**
 * WordPress React Hooks
 * 用于在 React 组件中获取 WordPress 数据
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wpClient, WPArticle, WPCategory, WPTag } from './client';

/**
 * 获取文章列表
 */
export function usePosts(options: {
  page?: number;
  per_page?: number;
  category?: number;
  tag?: number;
  search?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: () => wpClient.getPosts(options),
    enabled: options.enabled ?? true,
  });
}

/**
 * 获取单篇文章
 */
export function usePost(id: number, enabled = true) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => wpClient.getPost(id),
    enabled: enabled && !!id,
  });
}

/**
 * 根据 slug 获取文章
 */
export function usePostBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => wpClient.getPostBySlug(slug),
    enabled: enabled && !!slug,
  });
}

/**
 * 获取分类列表
 */
export function useCategories(options: {
  page?: number;
  per_page?: number;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: ['categories', options],
    queryFn: () => wpClient.getCategories(options),
    enabled: options.enabled ?? true,
  });
}

/**
 * 获取标签列表
 */
export function useTags(options: {
  page?: number;
  per_page?: number;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: ['tags', options],
    queryFn: () => wpClient.getTags(options),
    enabled: options.enabled ?? true,
  });
}

/**
 * 搜索文章
 */
export function useSearch(query: string, options: {
  page?: number;
  per_page?: number;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => wpClient.search(query, options),
    enabled: (options.enabled ?? true) && query.length > 0,
  });
}

/**
 * 预取文章数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['post', id],
      queryFn: () => wpClient.getPost(id),
    });
  };
}

/**
 * 使文章缓存失效
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };
}
