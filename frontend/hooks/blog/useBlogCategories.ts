/**
 * useBlogCategories Hook
 * 获取博客分类列表的 Hook
 */

import { useQuery } from '@tanstack/react-query';
import type { BlogCategory } from '@/types/blog';

/**
 * 获取所有分类
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async (): Promise<BlogCategory[]> => {
      const response = await fetch('/api/blog/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch blog categories');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}

/**
 * 根据 slug 获取单个分类
 */
export function useBlogCategory(slug: string) {
  return useQuery({
    queryKey: ['blog-category', slug],
    queryFn: async (): Promise<BlogCategory> => {
      const response = await fetch(`/api/blog/categories/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog category');
      }

      const data = await response.json();
      return data;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}
