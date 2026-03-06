/**
 * useBlogSearch Hook
 * 博客搜索功能的 Hook
 */

import { useQuery } from '@tanstack/react-query';
import type { BlogSearchResult, BlogSearchParams } from '@/types/blog';

interface UseBlogSearchOptions {
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * 博客搜索 Hook
 */
export function useBlogSearch(
  params: BlogSearchParams,
  options: UseBlogSearchOptions = {}
) {
  const { enabled = true, debounceMs = 300 } = options;

  // 只有当有搜索关键词时才启用查询
  const isEnabled = enabled && !!params.q;

  return useQuery({
    queryKey: ['blog-search', params],
    queryFn: async (): Promise<BlogSearchResult> => {
      const searchParams = new URLSearchParams();

      if (params.q) searchParams.append('q', params.q);
      if (params.category) searchParams.append('category', params.category);
      if (params.tag) searchParams.append('tag', params.tag);
      if (params.author) searchParams.append('author', params.author);
      if (params.sortBy) searchParams.append('sort_by', params.sortBy);
      if (params.order) searchParams.append('order', params.order);
      if (params.page) searchParams.append('page', String(params.page));
      if (params.perPage) searchParams.append('per_page', String(params.perPage));

      const response = await fetch(
        `/api/blog/search?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to search blog posts');
      }

      const data = await response.json();
      return data;
    },
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000, // 2 分钟
    // 使用防抖（需要配合 useDebounce 使用）
    gcTime: debounceMs,
  });
}
