/**
 * Blog Data Hooks
 * 博客数据相关的 React Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { BlogPost, BlogQuery, BlogListResponse } from '@/types/models/blog';

/**
 * 获取博客文章列表的 Hook
 */
export function useBlogPosts(params?: BlogQuery, options?: Omit<UseQueryOptions<BlogListResponse>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: async () => {
      // 使用 WordPress API
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.pageSize) queryParams.append('per_page', String(params.pageSize));
      if (params?.search) queryParams.append('search', params.search);
      if (params?.categories?.length) {
        queryParams.append('categories', params.categories.join(','));
      }
      if (params?.tags?.length) {
        queryParams.append('tags', params.tags.join(','));
      }

      // 排序
      if (params?.field) {
        const orderByMap: Record<string, string> = {
          date: 'date',
          title: 'title',
          views: 'modified',
          likes: 'modified',
          comments: 'comment_count',
        };
        queryParams.append('orderby', orderByMap[params.field] || 'date');
        queryParams.append('order', params.order || 'desc');
      }

      // 嵌入数据
      queryParams.append('_embed', '1');

      const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL || '/wp-json/wp/v2';
      const response = await fetch(`${wpApiUrl}/posts?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const posts: any[] = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

      return {
        posts: posts.map((post) => ({
          id: String(post.id),
          title: post.title.rendered,
          slug: post.slug,
          content: post.content.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
          author: {
            id: String(post._embedded?.author?.[0]?.id || '1'),
            name: post._embedded?.author?.[0]?.name || 'Admin',
            slug: post._embedded?.author?.[0]?.slug || 'admin',
            avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '',
            bio: '',
          },
          category: (post._embedded?.['wp:term']?.[0] || [])
            .filter((t: any) => t.taxonomy === 'category')
            .map((cat: any) => ({
              id: String(cat.id),
              name: cat.name,
              slug: cat.slug,
              description: cat.description || '',
              postCount: cat.count || 0,
            })),
          tags: (post._embedded?.['wp:term']?.[1] || [])
            .filter((t: any) => t.taxonomy === 'post_tag')
            .map((tag: any) => ({
              id: String(tag.id),
              name: tag.name,
              slug: tag.slug,
              description: tag.description || '',
              postCount: tag.count || 0,
            })),
          coverImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          publishedAt: post.date,
          createdAt: post.date,
          updatedAt: post.modified,
          status: 'published',
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          featured: post.sticky || false,
          seoTitle: post.title.rendered,
          seoDescription: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
          readingTime: Math.ceil(post.content.rendered.split(/\s+/).length / 200),
        })) as BlogPost[],
        total,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalPages,
      };
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    ...options,
  });
}

/**
 * 获取单篇博客文章的 Hook
 */
export function useBlogPost(slug: string, options?: Omit<UseQueryOptions<BlogPost>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL || '/wp-json/wp/v2';
      const response = await fetch(`${wpApiUrl}/posts?slug=${slug}&_embed=1`);

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      const posts: any[] = await response.json();

      if (posts.length === 0) {
        throw new Error('Post not found');
      }

      const post = posts[0];

      return {
        id: String(post.id),
        title: post.title.rendered,
        slug: post.slug,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
        author: {
          id: String(post._embedded?.author?.[0]?.id || '1'),
          name: post._embedded?.author?.[0]?.name || 'Admin',
          slug: post._embedded?.author?.[0]?.slug || 'admin',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '',
          bio: '',
        },
        category: (post._embedded?.['wp:term']?.[0] || [])
          .filter((t: any) => t.taxonomy === 'category')
          .map((cat: any) => ({
            id: String(cat.id),
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            postCount: cat.count || 0,
          })),
        tags: (post._embedded?.['wp:term']?.[1] || [])
          .filter((t: any) => t.taxonomy === 'post_tag')
          .map((tag: any) => ({
            id: String(tag.id),
            name: tag.name,
            slug: tag.slug,
            description: tag.description || '',
            postCount: tag.count || 0,
          })),
        coverImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        publishedAt: post.date,
        createdAt: post.date,
        updatedAt: post.modified,
        status: 'published',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        featured: post.sticky || false,
        seoTitle: post.title.rendered,
        seoDescription: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
        readingTime: Math.ceil(post.content.rendered.split(/\s+/).length / 200),
      } as BlogPost;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10分钟
    ...options,
  });
}

/**
 * 搜索文章的 Hook
 */
export function useSearchPosts(query: string, limit: number = 10, options?: Omit<UseQueryOptions<BlogPost[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['search-posts', query, limit],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL || '/wp-json/wp/v2';
      const response = await fetch(`${wpApiUrl}/posts?search=${encodeURIComponent(query)}&per_page=${limit}&_embed=1`);

      if (!response.ok) {
        throw new Error(`Failed to search posts: ${response.statusText}`);
      }

      const posts: any[] = await response.json();

      return posts.map((post) => ({
        id: String(post.id),
        title: post.title.rendered,
        slug: post.slug,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
        author: {
          id: String(post._embedded?.author?.[0]?.id || '1'),
          name: post._embedded?.author?.[0]?.name || 'Admin',
          slug: post._embedded?.author?.[0]?.slug || 'admin',
          avatar: '',
          bio: '',
        },
        category: [],
        tags: [],
        coverImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        publishedAt: post.date,
        createdAt: post.date,
        updatedAt: post.modified,
        status: 'published',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        featured: false,
        seoTitle: post.title.rendered,
        seoDescription: '',
        readingTime: 0,
      })) as BlogPost[];
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2分钟
    ...options,
  });
}

/**
 * 点赞文章的 Hook
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      return response.json();
    },
    onSuccess: (data, postId) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}

/**
 * 添加书签的 Hook
 */
export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to bookmark post');
      }
      return response.json();
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', postId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

/**
 * 获取博客统计的 Hook
 */
export function useBlogStats(options?: Omit<UseQueryOptions<{
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
}>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL || '/wp-json/wp/v2';

      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch(`${wpApiUrl}/posts?per_page=1`),
        fetch(`${wpApiUrl}/categories?per_page=1`),
        fetch(`${wpApiUrl}/tags?per_page=1`),
      ]);

      const totalPosts = parseInt(postsRes.headers.get('X-WP-Total') || '0', 10);
      const totalCategories = parseInt(categoriesRes.headers.get('X-WP-Total') || '0', 10);
      const totalTags = parseInt(tagsRes.headers.get('X-WP-Total') || '0', 10);

      return {
        totalPosts,
        totalViews: 0, // WordPress 不直接提供
        totalCategories,
        totalTags,
      };
    },
    staleTime: 15 * 60 * 1000, // 15分钟
    ...options,
  });
}
