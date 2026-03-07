/**
 * Blog Data Hooks
 * 统一的博客数据获取 Hooks
 * 使用 WordPress Data Service 和 Cache
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wordpressDataService } from '@/services/blog/wordpress-data-service';
import { blogCache } from '@/services/blog/blog-data-cache';
import type { BlogPost, Category, Tag } from '@/types/models';

// Query keys
export const blogQueryKeys = {
  all: ['blog'] as const,
  posts: () => [...blogQueryKeys.all, 'posts'] as const,
  post: (id: string | number) => [...blogQueryKeys.all, 'post', id] as const,
  postBySlug: (slug: string) => [...blogQueryKeys.all, 'post', 'slug', slug] as const,
  categories: () => [...blogQueryKeys.all, 'categories'] as const,
  category: (id: string | number) => [...blogQueryKeys.all, 'category', id] as const,
  tags: () => [...blogQueryKeys.all, 'tags'] as const,
  tag: (id: string | number) => [...blogQueryKeys.all, 'tag', id] as const,
  search: (query: string) => [...blogQueryKeys.all, 'search', query] as const,
};

/**
 * 获取文章列表
 */
export function usePosts(params: {
  page?: number;
  per_page?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
  order?: 'asc' | 'desc';
  orderby?: string;
  sticky?: boolean;
  enabled?: boolean;
}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [
      ...blogQueryKeys.posts(),
      queryParams,
    ],
    queryFn: async () => {
      // 先检查缓存
      const cached = blogCache.get('posts', queryParams);
      if (cached) {
        return cached;
      }

      // 获取数据
      const data = await wordpressDataService.getPosts(queryParams);
      blogCache.set('posts', queryParams, data);
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * 获取单篇文章
 */
export function usePost(id: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: blogQueryKeys.post(id),
    queryFn: async () => {
      const cached = blogCache.get('post', { id });
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getPost(id);
      if (data) {
        blogCache.set('post', { id }, data);
      }
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * 通过 slug 获取文章
 */
export function usePostBySlug(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: blogQueryKeys.postBySlug(slug),
    queryFn: async () => {
      const cached = blogCache.get('post', { slug });
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getPostBySlug(slug);
      if (data) {
        blogCache.set('post', { slug }, data);
      }
      return data;
    },
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * 获取分类列表
 */
export function useCategories(params: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [
      ...blogQueryKeys.categories(),
      queryParams,
    ],
    queryFn: async () => {
      const cached = blogCache.get('categories', queryParams);
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getCategories(queryParams);
      blogCache.set('categories', queryParams, data);
      return data;
    },
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

/**
 * 获取单个分类
 */
export function useCategory(id: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: blogQueryKeys.category(id),
    queryFn: async () => {
      const cached = blogCache.get('category', { id });
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getCategory(id);
      if (data) {
        blogCache.set('category', { id }, data);
      }
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 获取标签列表
 */
export function useTags(params: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [
      ...blogQueryKeys.tags(),
      queryParams,
    ],
    queryFn: async () => {
      const cached = blogCache.get('tags', queryParams);
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getTags(queryParams);
      blogCache.set('tags', queryParams, data);
      return data;
    },
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 获取单个标签
 */
export function useTag(id: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: blogQueryKeys.tag(id),
    queryFn: async () => {
      const cached = blogCache.get('tag', { id });
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.getTag(id);
      if (data) {
        blogCache.set('tag', { id }, data);
      }
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * 搜索文章
 */
export function useSearchPosts(query: string, params: {
  page?: number;
  per_page?: number;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [
      ...blogQueryKeys.search(query),
      queryParams,
    ],
    queryFn: async () => {
      const searchParams = { ...queryParams, search: query };
      const cached = blogCache.get('posts', searchParams);
      if (cached) {
        return cached;
      }

      const data = await wordpressDataService.searchPosts(query, queryParams);
      blogCache.set('posts', searchParams, data);
      return data;
    },
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - search results change more frequently
  });
}

/**
 * 预加载数据的 Hook
 */
export function usePrefetchBlog() {
  const queryClient = useQueryClient();

  const prefetchPosts = async (params: any = {}) => {
    queryClient.prefetchQuery({
      queryKey: [...blogQueryKeys.posts(), params],
      queryFn: () => wordpressDataService.getPosts(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchCategories = async (params: any = {}) => {
    queryClient.prefetchQuery({
      queryKey: [...blogQueryKeys.categories(), params],
      queryFn: () => wordpressDataService.getCategories(params),
      staleTime: 30 * 60 * 1000,
    });
  };

  const prefetchTags = async (params: any = {}) => {
    queryClient.prefetchQuery({
      queryKey: [...blogQueryKeys.tags(), params],
      queryFn: () => wordpressDataService.getTags(params),
      staleTime: 30 * 60 * 1000,
    });
  };

  return {
    prefetchPosts,
    prefetchCategories,
    prefetchTags,
  };
}

/**
 * 清除博客缓存的 Hook
 */
export function useInvalidateBlog() {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
  };

  const invalidatePost = (id: string | number) => {
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.post(id) });
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() });
  };

  const invalidateTags = () => {
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.tags() });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
  };

  return {
    invalidatePosts,
    invalidatePost,
    invalidateCategories,
    invalidateTags,
    invalidateAll,
  };
}
