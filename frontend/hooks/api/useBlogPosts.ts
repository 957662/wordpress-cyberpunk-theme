/**
 * useBlogPosts Hook
 * 优化的博客文章数据管理 Hook
 */

'use client';

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/api/blog.service';
import type { BlogPost } from '@/lib/adapters/blog-adapter';

/**
 * 获取文章列表（带分页）
 */
export function useBlogPosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'modified' | 'relevance';
  order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: () => blogService.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟垃圾回收
  });
}

/**
 * 获取文章无限滚动列表
 */
export function useInfiniteBlogPosts(params?: {
  per_page?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
}) {
  return useInfiniteQuery({
    queryKey: ['blog-posts-infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      blogService.getPosts({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = lastPage.totalPages;
      const nextPage = allPages.length + 1;
      return nextPage <= maxPages ? nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 根据 slug 获取文章
 */
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

/**
 * 根据 ID 获取文章
 */
export function useBlogPostById(id: number) {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => blogService.getPostById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * 获取精选文章
 */
export function useFeaturedPosts(limit: number = 5) {
  return useQuery({
    queryKey: ['featured-posts', limit],
    queryFn: () => blogService.getFeaturedPosts(limit),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 获取最新文章
 */
export function useRecentPosts(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: () => blogService.getRecentPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(
  postId: number,
  categoryIds: number[],
  limit: number = 4
) {
  return useQuery({
    queryKey: ['related-posts', postId, categoryIds, limit],
    queryFn: () => blogService.getRelatedPosts(postId, categoryIds, limit),
    enabled: !!postId && categoryIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * 搜索文章
 */
export function useSearchBlogPosts(
  query: string,
  params?: {
    page?: number;
    per_page?: number;
  }
) {
  return useQuery({
    queryKey: ['search-blog-posts', query, params],
    queryFn: () => blogService.searchPosts(query, params),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 获取分类列表
 */
export function useCategories(params?: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => blogService.getCategories(params),
    staleTime: 30 * 60 * 1000, // 30分钟
  });
}

/**
 * 根据 slug 获取分类
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => blogService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 获取标签列表
 */
export function useTags(params?: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
}) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => blogService.getTags(params),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 根据 slug 获取标签
 */
export function useTag(slug: string) {
  return useQuery({
    queryKey: ['tag', slug],
    queryFn: () => blogService.getTagBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * 获取作者列表
 */
export function useAuthors(params?: {
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => blogService.getAuthors(params),
    staleTime: 60 * 60 * 1000, // 1小时
  });
}

/**
 * 根据 slug 获取作者
 */
export function useAuthor(slug: string) {
  return useQuery({
    queryKey: ['author', slug],
    queryFn: () => blogService.getAuthorBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * 获取作者的文章
 */
export function useAuthorPosts(authorId: number, params?: {
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ['author-posts', authorId, params],
    queryFn: () => blogService.getPostsByAuthor(authorId, params),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取分类的文章
 */
export function useCategoryPosts(categoryId: number, params?: {
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ['category-posts', categoryId, params],
    queryFn: () => blogService.getPostsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取标签的文章
 */
export function useTagPosts(tagId: number, params?: {
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: ['tag-posts', tagId, params],
    queryFn: () => blogService.getPostsByTag(tagId, params),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 预取文章数据
 */
export function usePrefetchBlogPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['blog-post', slug],
      queryFn: () => blogService.getPostBySlug(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * 刷新文章列表
 */
export function useRefreshBlogPosts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
  };
}
