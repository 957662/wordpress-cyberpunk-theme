/**
 * useBlogTags Hook
 * 获取博客标签列表的 Hook
 */

import { useQuery } from '@tanstack/react-query';
import type { BlogTag } from '@/types/blog';

/**
 * 获取所有标签
 */
export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async (): Promise<BlogTag[]> => {
      const response = await fetch('/api/blog/tags');

      if (!response.ok) {
        throw new Error('Failed to fetch blog tags');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}

/**
 * 获取热门标签
 */
export function usePopularTags(limit: number = 20) {
  return useQuery({
    queryKey: ['blog-tags', 'popular', limit],
    queryFn: async (): Promise<BlogTag[]> => {
      const response = await fetch(`/api/blog/tags?popular=true&limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch popular tags');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 分钟
  });
}

/**
 * 根据 slug 获取单个标签
 */
export function useBlogTag(slug: string) {
  return useQuery({
    queryKey: ['blog-tag', slug],
    queryFn: async (): Promise<BlogTag> => {
      const response = await fetch(`/api/blog/tags/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog tag');
      }

      const data = await response.json();
      return data;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}
