'use client';

/**
 * CyberPress Platform - WordPress API Hooks
 * React Query hooks for WordPress API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWordPress } from '../wordpress/api';
import type { Post, Page, Category, Tag, Author, BlogFilters } from '../wordpress/types';

// ============================================
// Query Keys
// ============================================

export const wpKeys = {
  posts: (filters?: BlogFilters) => ['posts', filters] as const,
  post: (id: number | string) => ['post', id] as const,
  postBySlug: (slug: string) => ['post', 'slug', slug] as const,
  pages: () => ['pages'] as const,
  page: (id: number | string) => ['page', id] as const,
  categories: () => ['categories'] as const,
  category: (id: number) => ['category', id] as const,
  tags: () => ['tags'] as const,
  tag: (id: number) => ['tag', id] as const,
  authors: () => ['authors'] as const,
  author: (id: number) => ['author', id] as const,
  search: (query: string) => ['search', query] as const,
};

// ============================================
// Posts Hooks
// ============================================

/**
 * 获取文章列表
 */
export function usePosts(filters?: BlogFilters) {
  return useQuery({
    queryKey: wpKeys.posts(filters),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getPosts({
        page: filters?.page,
        per_page: filters?.per_page || 10,
        categories: filters?.category ? [parseInt(filters.category)] : undefined,
        tags: filters?.tag ? [parseInt(filters.tag)] : undefined,
        search: filters?.search,
        orderby: filters?.orderby,
        order: filters?.order,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 获取单篇文章
 */
export function usePost(id: number | string) {
  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getPost(id);
    },
    enabled: !!id,
  });
}

/**
 * 通过 slug 获取文章
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: wpKeys.postBySlug(slug),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getPostBySlug(slug);
    },
    enabled: !!slug,
  });
}

// ============================================
// Pages Hooks
// ============================================

/**
 * 获取页面列表
 */
export function usePages() {
  return useQuery({
    queryKey: wpKeys.pages(),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getPages();
    },
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取单个页面
 */
export function usePage(id: number | string) {
  return useQuery({
    queryKey: wpKeys.page(id),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getPage(id);
    },
    enabled: !!id,
  });
}

// ============================================
// Categories & Tags Hooks
// ============================================

/**
 * 获取分类列表
 */
export function useCategories() {
  return useQuery({
    queryKey: wpKeys.categories(),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getCategories();
    },
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取单个分类
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: wpKeys.category(id),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getCategories();
    },
    enabled: !!id,
  });
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: wpKeys.tags(),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getTags();
    },
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取单个标签
 */
export function useTag(id: number) {
  return useQuery({
    queryKey: wpKeys.tag(id),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getTags();
    },
    enabled: !!id,
  });
}

// ============================================
// Authors Hooks
// ============================================

/**
 * 获取作者列表
 */
export function useAuthors() {
  return useQuery({
    queryKey: wpKeys.authors(),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getAuthors();
    },
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}

/**
 * 获取单个作者
 */
export function useAuthor(id: number) {
  return useQuery({
    queryKey: wpKeys.author(id),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.getAuthors();
    },
    enabled: !!id,
  });
}

// ============================================
// Search Hooks
// ============================================

/**
 * 搜索内容
 */
export function useSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: wpKeys.search(query),
    queryFn: async () => {
      const wp = getWordPress();
      return await wp.search({
        search: query,
        subtype: 'any',
        per_page: 20,
      });
    },
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 分钟
  });
}

// ============================================
// Mutations
// ============================================

/**
 * 创建文章
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Post>) => {
      const wp = getWordPress();
      return await wp.createPost(data);
    },
    onSuccess: () => {
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: wpKeys.posts() });
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      const wp = getWordPress();
      return await wp.updatePost(id, data);
    },
    onSuccess: (_, variables) => {
      // 刷新该文章
      queryClient.invalidateQueries({ queryKey: wpKeys.post(variables.id) });
      queryClient.invalidateQueries({ queryKey: wpKeys.posts() });
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const wp = getWordPress();
      await wp.deletePost(id);
    },
    onSuccess: () => {
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: wpKeys.posts() });
    },
  });
}
