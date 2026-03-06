/**
 * 博客数据相关的 React Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, BlogSearchParams } from '@/services/api/blog-service';
import { Post, Category, Tag } from '@/types';

/**
 * 获取文章列表
 */
export function usePosts(params: BlogSearchParams = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => blogService.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取单篇文章
 */
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogService.getPost(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => blogService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => blogService.getTags(),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

/**
 * 搜索文章
 */
export function useSearchPosts(query: string, params?: Omit<BlogSearchParams, 'search'>) {
  return useQuery({
    queryKey: ['search', query, params],
    queryFn: () => blogService.searchPosts(query, params),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: string | number, limit: number = 4) {
  return useQuery({
    queryKey: ['related-posts', postId, limit],
    queryFn: () => blogService.getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 获取热门文章
 */
export function usePopularPosts(limit: number = 5) {
  return useQuery({
    queryKey: ['popular-posts', limit],
    queryFn: () => blogService.getPopularPosts(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 获取特色文章
 */
export function useFeaturedPosts(limit: number = 3) {
  return useQuery({
    queryKey: ['featured-posts', limit],
    queryFn: () => blogService.getFeaturedPosts(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 预取文章数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['post', slug],
      queryFn: () => blogService.getPost(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * 预取分类数据
 */
export function usePrefetchCategories() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => blogService.getCategories(),
      staleTime: 30 * 60 * 1000,
    });
  };
}

/**
 * 无效化文章列表缓存
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };
}

/**
 * 无效化单篇文章缓存
 */
export function useInvalidatePost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.invalidateQueries({ queryKey: ['post', slug] });
  };
}
