/**
 * useBlogPosts Hook
 * 获取博客文章列表的 Hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BlogPost, BlogSearchParams } from '@/types/blog';

interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface UseBlogPostsOptions {
  params?: BlogSearchParams;
  enabled?: boolean;
}

/**
 * 获取博客文章列表
 */
export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const { params = {}, enabled = true } = options;

  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: async (): Promise<BlogPostsResponse> => {
      const searchParams = new URLSearchParams();

      if (params.q) searchParams.append('search', params.q);
      if (params.category) searchParams.append('category', params.category);
      if (params.tag) searchParams.append('tag', params.tag);
      if (params.author) searchParams.append('author', params.author);
      if (params.sortBy) searchParams.append('orderby', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      if (params.page) searchParams.append('page', String(params.page));
      if (params.perPage) searchParams.append('per_page', String(params.perPage));

      const response = await fetch(
        `/api/blog/posts?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 刷新博客文章列表
 */
export function useRefreshBlogPosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
  };
}
