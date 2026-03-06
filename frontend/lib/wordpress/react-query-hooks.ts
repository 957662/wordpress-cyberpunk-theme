/**
 * WordPress React Query Hooks
 * 用于与 WordPress REST API 集成的 React Query hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { wpClient, type WordPressPost, type WordPressCategory, type WordPressTag } from './client';

// ==================== Types ====================

export interface PostQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'title' | 'relevance' | 'slug';
  order?: 'asc' | 'desc';
  slug?: string[];
  _embed?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  headers: {
    'x-wp-total': number;
    'x-wp-totalpages': number;
  };
  total: number;
  totalPages: number;
}

// ==================== Posts ====================

/**
 * 获取文章列表
 */
export function usePosts(params: PostQueryParams = {}, options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>) {
  const queryParams = {
    _embed: true,
    ...params,
  };

  return useQuery({
    queryKey: ['posts', queryParams],
    queryFn: () => wpClient.getPosts(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * 获取单篇文章
 */
export function usePost(slug: string, options?: Omit<UseQueryOptions<WordPressPost>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => wpClient.getPost(slug, { _embed: true }),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * 获取文章总数
 */
export function usePostsCount(options?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['posts-count'],
    queryFn: () => wpClient.getPostsCount(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

// ==================== Categories ====================

/**
 * 获取分类列表
 */
export function useCategories(options?: Omit<UseQueryOptions<WordPressCategory[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wpClient.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

/**
 * 获取单个分类
 */
export function useCategory(
  slug: string,
  options?: Omit<UseQueryOptions<WordPressCategory>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => wpClient.getCategory(slug),
    enabled: !!slug,
    ...options,
  });
}

// ==================== Tags ====================

/**
 * 获取标签列表
 */
export function useTags(options?: Omit<UseQueryOptions<WordPressTag[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => wpClient.getTags(),
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

/**
 * 获取单个标签
 */
export function useTag(slug: string, options?: Omit<UseQueryOptions<WordPressTag>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['tag', slug],
    queryFn: () => wpClient.getTag(slug),
    enabled: !!slug,
    ...options,
  });
}

// ==================== Search ====================

/**
 * 搜索文章
 */
export function useSearchPosts(
  searchQuery: string,
  params: Omit<PostQueryParams, 'search'> = {},
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['search', 'posts', searchQuery, params],
    queryFn: () => wpClient.searchPosts(searchQuery, { ...params, _embed: true }),
    enabled: searchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

// ==================== Media ====================

/**
 * 获取媒体文件详情
 */
export function useMedia(
  id: number,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: () => wpClient.getMedia(id),
    enabled: !!id,
    ...options,
  });
}

// ==================== Mutations ====================

/**
 * 提交评论（示例）
 */
export function useSubmitComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      postId: number;
      content: string;
      authorName: string;
      authorEmail: string;
    }) => {
      // 实现评论提交逻辑
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: commentData.postId,
          content: commentData.content,
          author_name: commentData.authorName,
          author_email: commentData.authorEmail,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// ==================== Prefetch ====================

/**
 * 预取文章数据
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['post', slug],
      queryFn: () => wpClient.getPost(slug, { _embed: true }),
      staleTime: 10 * 60 * 1000,
    });
  };
}

// ==================== Infinite Scroll ====================

/**
 * 无限滚动文章列表
 */
export function useInfinitePosts(
  params: Omit<PostQueryParams, 'page'> = {},
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['posts-infinite', params],
    queryFn: () => wpClient.getPosts({ ...params, _embed: true }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * 分页文章列表（带总数）
 */
export function usePaginatedPosts(
  params: PostQueryParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<WordPressPost>>, 'queryKey' | 'queryFn'>
) {
  const queryParams = {
    _embed: true,
    ...params,
  };

  return useQuery({
    queryKey: ['posts-paginated', queryParams],
    queryFn: async () => {
      const response = await wpClient.getRawResponse<WordPressPost[]>('/posts', queryParams);
      const total = parseInt(response.headers.get('x-wp-total') || '0', 10);
      const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '0', 10);

      return {
        data: response.data,
        headers: {
          'x-wp-total': total,
          'x-wp-totalpages': totalPages,
        },
        total,
        totalPages,
      };
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ==================== Related Posts ====================

/**
 * 获取相关文章（基于分类或标签）
 */
export function useRelatedPosts(
  postId: number,
  categoryIds?: number[],
  tagIds?: number[],
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['related-posts', postId, categoryIds, tagIds],
    queryFn: () => {
      const params: PostQueryParams = {
        _embed: true,
        per_page: 4,
        exclude: [postId],
      };

      if (categoryIds && categoryIds.length > 0) {
        params.categories = categoryIds;
      } else if (tagIds && tagIds.length > 0) {
        params.tags = tagIds;
      }

      return wpClient.getPosts(params);
    },
    enabled: !!(categoryIds || tagIds),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

// ==================== Trending Posts ====================

/**
 * 获取热门文章（基于浏览量或评论数）
 */
export function useTrendingPosts(
  perPage: number = 5,
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['trending-posts', perPage],
    queryFn: () =>
      wpClient.getPosts({
        _embed: true,
        per_page: perPage,
        orderby: 'comment_count', // 需要插件支持
      }),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

// ==================== Recent Posts ====================

/**
 * 获取最新文章
 */
export function useRecentPosts(
  perPage: number = 5,
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['recent-posts', perPage],
    queryFn: () =>
      wpClient.getPosts({
        _embed: true,
        per_page: perPage,
        orderby: 'date',
        order: 'desc',
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ==================== Featured Posts ====================

/**
 * 获取特色文章（带有特定标签或分类的文章）
 */
export function useFeaturedPosts(
  tagSlug: string = 'featured',
  perPage: number = 3,
  options?: Omit<UseQueryOptions<WordPressPost[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['featured-posts', tagSlug, perPage],
    queryFn: async () => {
      // 首先获取特色标签
      const tags = await wpClient.getTags({ slug: tagSlug });
      if (tags.length === 0) return [];

      // 然后获取带有该标签的文章
      return wpClient.getPosts({
        _embed: true,
        per_page: perPage,
        tags: [tags[0].id],
      });
    },
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

// ==================== Export Helper ====================

/**
 * WordPress API hooks 导出对象
 */
export const wpHooks = {
  // Posts
  usePosts,
  usePost,
  usePostsCount,
  useRelatedPosts,
  useTrendingPosts,
  useRecentPosts,
  useFeaturedPosts,
  useSearchPosts,
  usePaginatedPosts,

  // Categories
  useCategories,
  useCategory,

  // Tags
  useTags,
  useTag,

  // Media
  useMedia,

  // Mutations
  useSubmitComment,

  // Utilities
  usePrefetchPost,
};

export default wpHooks;
