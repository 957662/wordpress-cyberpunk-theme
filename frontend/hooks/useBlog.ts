/**
 * useBlog Hook - 博客数据获取
 *
 * @description 使用 React Query 获取博客数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBlogPosts,
  getBlogPost,
  getFeaturedPosts,
  getTrendingPosts,
  getRelatedPosts,
  searchPosts,
  likePost,
  bookmarkPost,
  getCategories,
  getTags,
  getBlogStats,
  type BlogParams,
  type BlogPost,
} from '@/lib/api/blog';

/**
 * 获取博客文章列表
 */
export function useBlogPosts(params: BlogParams = {}) {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: () => getBlogPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * 获取单篇博客文章
 */
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPost(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * 获取精选文章
 */
export function useFeaturedPosts(limit = 5) {
  return useQuery({
    queryKey: ['featured-posts', limit],
    queryFn: () => getFeaturedPosts(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * 获取热门文章
 */
export function useTrendingPosts(limit = 10) {
  return useQuery({
    queryKey: ['trending-posts', limit],
    queryFn: () => getTrendingPosts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: string, limit = 4) {
  return useQuery({
    queryKey: ['related-posts', postId, limit],
    queryFn: () => getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * 搜索文章
 */
export function useSearchPosts(query: string, params: Omit<BlogParams, 'search'> = {}) {
  return useQuery({
    queryKey: ['search-posts', query, params],
    queryFn: () => searchPosts(query, params),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * 点赞文章
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: (data, postId) => {
      // 更新文章列表中的点赞数
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
    },
  });
}

/**
 * 收藏文章
 */
export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => bookmarkPost(postId),
    onSuccess: (data, postId) => {
      // 更新文章列表中的收藏数
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
    },
  });
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 获取博客统计数据
 */
export function useBlogStats() {
  return useQuery({
    queryKey: ['blog-stats'],
    queryFn: getBlogStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto refetch every 5 minutes
  });
}

/**
 * 预取文章数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['blog-post', slug],
      queryFn: () => getBlogPost(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
}
