/**
 * useSearch Hook
 * 搜索功能Hook
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

/**
 * 搜索内容
 */
export function useSearch(query: string, subtype: 'post' | 'page' | 'any' = 'any', enabled = true) {
  return useQuery({
    queryKey: ['search', query, subtype],
    queryFn: () => api.search.search(query, subtype),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

/**
 * 搜索文章
 */
export function useSearchPosts(query: string, enabled = true) {
  return useSearch(query, 'post', enabled);
}

/**
 * 搜索页面
 */
export function useSearchPages(query: string, enabled = true) {
  return useSearch(query, 'page', enabled);
}

/**
 * 搜索所有内容
 */
export function useSearchAll(query: string, enabled = true) {
  return useSearch(query, 'any', enabled);
}
