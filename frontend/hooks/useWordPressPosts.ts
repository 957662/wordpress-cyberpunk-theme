/**
 * useWordPressPosts Hook
 * 用于获取 WordPress 文章数据的自定义 Hook
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  getPosts,
  getPostBySlug,
  getRelatedPosts,
  getLatestPosts,
  searchPosts,
  type Post,
  type PostDetail,
} from '@/lib/api/posts';

/**
 * 获取文章列表
 */
export function usePosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number;
  tags?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts({ ...params, _embed: true }),
    staleTime: 5 * 60 * 1000, // 5 分钟
    gcTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取单篇文章（按 slug）
 */
export function usePost(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug, true),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

/**
 * 获取相关文章
 */
export function useRelatedPosts(postId: number, categories?: number[]) {
  return useQuery({
    queryKey: ['related-posts', postId, categories],
    queryFn: () => getRelatedPosts(postId, categories),
    enabled: !!postId && !!categories && categories.length > 0,
    staleTime: 15 * 60 * 1000, // 15 分钟
  });
}

/**
 * 获取最新文章
 */
export function useLatestPosts(limit: number = 5) {
  return useQuery({
    queryKey: ['latest-posts', limit],
    queryFn: () => getLatestPosts(limit),
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}

/**
 * 搜索文章（无限滚动）
 */
export function useSearchPosts(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['search-posts', query],
    queryFn: ({ pageParam = 1 }) =>
      searchPosts(query, pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts.length < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 分钟
  });
}

/**
 * 获取分类文章
 */
export function useCategoryPosts(categoryId: number, page: number = 1) {
  return useQuery({
    queryKey: ['category-posts', categoryId, page],
    queryFn: () =>
      getPosts({
        categories: categoryId,
        page,
        per_page: 12,
        _embed: true,
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取标签文章
 */
export function useTagPosts(tagId: number, page: number = 1) {
  return useQuery({
    queryKey: ['tag-posts', tagId, page],
    queryFn: () =>
      getPosts({
        tags: tagId,
        page,
        per_page: 12,
        _embed: true,
      }),
    enabled: !!tagId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取作者文章
 */
export function useAuthorPosts(authorId: number, page: number = 1) {
  return useQuery({
    queryKey: ['author-posts', authorId, page],
    queryFn: () =>
      getPosts({
        author: authorId,
        page,
        per_page: 12,
        _embed: true,
      }),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
  });
}
