/**
 * WordPress 数据获取 Hooks
 * 使用 React Query 管理数据状态
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wpClient, wpKeys } from '@/lib/wordpress';

/**
 * 获取文章列表
 */
export function usePosts(options?: {
  page?: number;
  perPage?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
  orderBy?: 'date' | 'title' | 'id';
  order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: wpKeys.posts(),
    queryFn: () => wpClient.getPosts(options),
    staleTime: 60 * 1000, // 1 分钟
  });
}

/**
 * 获取单篇文章
 */
export function usePost(id: number, enabled = true) {
  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: () => wpClient.getPost(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 根据 slug 获取文章
 */
export function usePostBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: wpKeys.postBySlug(slug),
    queryFn: () => wpClient.getPostBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useQuery({
    queryKey: wpKeys.categories(),
    queryFn: () => wpClient.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: wpKeys.tags(),
    queryFn: () => wpClient.getTags(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * 获取用户信息
 */
export function useUser(id: number, enabled = true) {
  return useQuery({
    queryKey: wpKeys.user(id),
    queryFn: () => wpClient.getUser(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 分钟
  });
}

/**
 * 搜索
 */
export function useSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => wpClient.search(query),
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 分钟
  });
}

/**
 * 预取相关数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: wpKeys.post(id),
      queryFn: () => wpClient.getPost(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * 无效化文章列表缓存
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: wpKeys.posts() });
  };
}
