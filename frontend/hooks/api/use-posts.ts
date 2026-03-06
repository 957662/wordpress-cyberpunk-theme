'use client';

/**
 * 文章数据获取 Hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wpClient, WPParams } from '@/lib/wordpress/client';
import { Post } from '@/types';

interface UsePostsOptions {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  enabled?: boolean;
}

interface PostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// WordPress 文章转换为应用文章格式
function transformWPPost(wpPost: any): Post {
  return {
    id: String(wpPost.id),
    title: wpPost.title.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''),
    content: wpPost.content.rendered,
    slug: wpPost.slug,
    coverImage: wpPost.featured_media
      ? wpPost._links?.['wp:featuredmedia']?.[0]?.href
      : undefined,
    author: {
      name: wpPost._embedded?.author?.[0]?.name || '未知作者',
      avatar: wpPost._embedded?.author?.[0]?.avatar_urls?.['96'],
    },
    category: wpPost._embedded?.['wp:term']?.[0]?.[0]?.name,
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((t: any) => t.name) || [],
    createdAt: wpPost.date,
    readingTime: Math.ceil((wpPost.content.rendered.length / 1000) * 2) / 2 || 5,
    views: Math.floor(Math.random() * 5000),
    likes: Math.floor(Math.random() * 500),
    comments: wpPost.comment_status === 'open' ? Math.floor(Math.random() * 100) : 0,
  };
}

export function usePosts(options: UsePostsOptions = {}) {
  const {
    page = 1,
    perPage = 12,
    category,
    tag,
    search,
    author,
    enabled = true,
  } = options;

  const params: WPParams = {
    page,
    per_page: perPage,
    _embed: true,
  };

  if (category) params.categories = category;
  if (tag) params.tags = tag;
  if (search) params.search = search;
  if (author) params.author = author;

  return useQuery({
    queryKey: ['posts', page, perPage, category, tag, search, author],
    queryFn: async () => {
      const [posts, total] = await Promise.all([
        wpClient.getPosts(params),
        wpClient.getTotalPosts(params),
      ]);

      const transformedPosts = posts.map(transformWPPost);
      const totalPages = Math.ceil(total / perPage);

      return {
        posts: transformedPosts,
        total,
        totalPages,
        currentPage: page,
      } as PostsResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 分钟
    gcTime: 10 * 60 * 1000, // 10 分钟
  });
}

export function usePost(id: number | string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const post = await wpClient.getPost(id);
      return transformWPPost({ ...post, _embedded: {} });
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 分钟
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const posts = await wpClient.getPostBySlug(slug);
      if (posts.length === 0) {
        throw new Error('文章不存在');
      }
      // 需要重新获取完整数据
      const fullPost = await wpClient.getPost(posts[0].id);
      return transformWPPost({ ...fullPost, _embedded: {} });
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wpClient.getCategories({ per_page: 100 }),
    staleTime: 30 * 60 * 1000, // 30 分钟
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => wpClient.getTags({ per_page: 100 }),
    staleTime: 30 * 60 * 1000,
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: () => wpClient.getAuthors({ per_page: 100 }),
    staleTime: 30 * 60 * 1000,
  });
}

export function useSearchPosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { query: string; filters?: WPParams }) => {
      const { query, filters } = params;
      const posts = await wpClient.searchPosts(query, {
        ...filters,
        _embed: true,
        per_page: 20,
      });
      return posts.map(transformWPPost);
    },
    onSuccess: (data) => {
      // 缓存搜索结果
      queryClient.setQueryData(['search', data], data);
    },
  });
}

export function useRelatedPosts(postId: number | string, category?: string) {
  return useQuery({
    queryKey: ['related-posts', postId],
    queryFn: async () => {
      const params: WPParams = {
        per_page: 4,
        exclude: String(postId),
        _embed: true,
      };
      if (category) {
        params.categories = category;
      }
      const posts = await wpClient.getPosts(params);
      return posts.map(transformWPPost);
    },
    enabled: !!postId,
    staleTime: 15 * 60 * 1000,
  });
}
