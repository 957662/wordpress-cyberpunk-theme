/**
 * usePost Hook
 * 获取单篇文章的 Hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/services/post-service';
import type { Post } from '@/types/wordpress';

// 获取文章
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// 获取文章列表
export function usePosts(params?: {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.getPosts(params),
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

// 获取精选文章
export function useFeaturedPosts() {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postService.getFeaturedPosts(),
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

// 获取相关文章
export function useRelatedPosts(postId: number, categoryId?: number) {
  return useQuery({
    queryKey: ['posts', 'related', postId, categoryId],
    queryFn: () => postService.getRelatedPosts(postId, categoryId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}

// 增加浏览量
export function useIncrementViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.incrementViews(postId),
    onSuccess: (data, postId) => {
      // 更新缓存
      queryClient.setQueryData(['post', data.slug], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            view_count: (oldData.view_count || 0) + 1,
          };
        }
        return oldData;
      });
    },
  });
}

// 搜索文章
export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: () => postService.searchPosts(query),
    enabled: query.length > 2,
    staleTime: 1 * 60 * 1000, // 1分钟
  });
}

// 获取文章归档
export function usePostArchives() {
  return useQuery({
    queryKey: ['posts', 'archives'],
    queryFn: () => postService.getPostArchives(),
    staleTime: 60 * 60 * 1000, // 1小时
  });
}

// 获取热门文章
export function usePopularPosts(limit = 5) {
  return useQuery({
    queryKey: ['posts', 'popular', limit],
    queryFn: () => postService.getPopularPosts(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

// 获取最新文章
export function useLatestPosts(limit = 5) {
  return useQuery({
    queryKey: ['posts', 'latest', limit],
    queryFn: () => postService.getLatestPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

// 分页 Hook
export function usePostPagination(totalPosts: number, perPage: number = 10) {
  const totalPages = Math.ceil(totalPosts / perPage);

  return {
    totalPages,
    hasNextPage: (currentPage: number) => currentPage < totalPages,
    hasPrevPage: (currentPage: number) => currentPage > 1,
    getPageRange: (currentPage: number, range: number = 2) => {
      const start = Math.max(1, currentPage - range);
      const end = Math.min(totalPages, currentPage + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  };
}
