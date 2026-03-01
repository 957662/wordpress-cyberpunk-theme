'use client';

import { useQuery } from '@tanstack/react-query';
import { wpClient, wpKeys } from '@/lib/wordpress/client';

/**
 * 获取文章列表的 Hook
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
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 获取单篇文章的 Hook
 */
export function usePost(id: number) {
  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: () => wpClient.getPost(id),
    enabled: !!id,
  });
}

/**
 * 通过 slug 获取文章的 Hook
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: wpKeys.postBySlug(slug),
    queryFn: () => wpClient.getPostBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * 获取分类列表的 Hook
 */
export function useCategories() {
  return useQuery({
    queryKey: wpKeys.categories(),
    queryFn: () => wpClient.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取标签列表的 Hook
 */
export function useTags() {
  return useQuery({
    queryKey: wpKeys.tags(),
    queryFn: () => wpClient.getTags(),
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取用户信息的 Hook
 */
export function useUser(id: number) {
  return useQuery({
    queryKey: wpKeys.user(id),
    queryFn: () => wpClient.getUser(id),
    enabled: !!id,
  });
}
