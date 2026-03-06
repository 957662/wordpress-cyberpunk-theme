/**
 * useBlogPost Hook
 * 获取单个博客文章的 Hook
 */

import { useQuery } from '@tanstack/react-query';
import type { BlogPostFull } from '@/types/blog';

interface UseBlogPostOptions {
  enabled?: boolean;
}

/**
 * 根据 slug 获取博客文章
 */
export function useBlogPost(slug: string, options: UseBlogPostOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async (): Promise<BlogPostFull> => {
      const response = await fetch(`/api/blog/posts/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 根据 ID 获取博客文章
 */
export function useBlogPostById(id: string, options: UseBlogPostOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: async (): Promise<BlogPostFull> => {
      const response = await fetch(`/api/blog/posts/id/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}
