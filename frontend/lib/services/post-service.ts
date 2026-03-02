/**
 * Post Service
 * Business logic layer for post operations
 */

import { WordPressClient } from '@/lib/wordpress/api-client';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

// Types
export interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'pending';
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_image?: string[];
    author?: string;
    schema?: any;
  };
  acf?: {
    [key: string]: any;
  };
}

export interface PostListItem {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage?: string;
  categories?: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  author?: { id: number; name: string; avatar?: string };
}

export interface PostFilters {
  category?: string;
  tag?: string;
  search?: string;
  status?: 'publish' | 'draft' | 'pending';
  author?: number;
  per_page?: number;
  page?: number;
  orderby?: 'date' | 'title' | 'modified' | 'relevance';
  order?: 'asc' | 'desc';
}

export interface PostMutationInput {
  title: string;
  content: string;
  excerpt?: string;
  status?: 'publish' | 'draft' | 'pending';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  acf?: { [key: string]: any };
}

// Validation Schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  status: z.enum(['publish', 'draft', 'pending']).optional(),
  categories: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  featured_media: z.number().optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.number(),
});

// API Functions
const wpClient = new WordPressClient();

export async function getPosts(filters: PostFilters = {}): Promise<PostListItem[]> {
  try {
    const response = await wpClient.fetch<any[]>(`/posts`, {
      params: {
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        category: filters.category,
        tags: filters.tag,
        search: filters.search,
        status: filters.status || 'publish',
        author: filters.author,
        orderby: filters.orderby || 'date',
        order: filters.order || 'desc',
        _embed: true,
      },
    });

    return response.map((post) => transformPostToListItem(post));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPost(id: number): Promise<Post> {
  try {
    const response = await wpClient.fetch<Post>(`/posts/${id}`, {
      params: { _embed: true },
    });
    return response;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await wpClient.fetch<Post[]>(`/posts`, {
      params: { slug, _embed: true },
    });

    if (!response || response.length === 0) {
      return null;
    }

    return response[0];
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function createPost(input: PostMutationInput): Promise<Post> {
  try {
    const response = await wpClient.fetch<Post>('/posts', {
      method: 'POST',
      data: input,
    });
    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id: number, input: Partial<PostMutationInput>): Promise<Post> {
  try {
    const response = await wpClient.fetch<Post>(`/posts/${id}`, {
      method: 'PUT',
      data: input,
    });
    return response;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    await wpClient.fetch(`/posts/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function getRelatedPosts(
  postId: number,
  limit: number = 4
): Promise<PostListItem[]> {
  try {
    const post = await getPost(postId);
    const categories = post.categories.join(',');

    const response = await wpClient.fetch<any[]>(`/posts`, {
      params: {
        categories,
        exclude: postId,
        per_page: limit,
        orderby: 'rand',
        _embed: true,
      },
    });

    return response.map((p) => transformPostToListItem(p));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function searchPosts(query: string, limit: number = 10): Promise<PostListItem[]> {
  try {
    const response = await wpClient.fetch<any[]>(`/posts`, {
      params: {
        search: query,
        per_page: limit,
        _embed: true,
      },
    });

    return response.map((post) => transformPostToListItem(post));
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// Helper Functions
function transformPostToListItem(post: any): PostListItem {
  const featuredImage =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.yoast_head_json?.og_image?.[0];

  return {
    id: post.id,
    title: post.title.rendered,
    excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
    slug: post.slug,
    date: post.date,
    featuredImage,
    categories: post._embedded?.['wp:term']?.[0] || [],
    tags: post._embedded?.['wp:term']?.[1] || [],
    author: post._embedded?.author?.[0]
      ? {
          id: post._embedded.author[0].id,
          name: post._embedded.author[0].name,
          avatar: post._embedded.author[0].avatar_urls?.['96'],
        }
      : undefined,
  };
}

// React Query Hooks
export function usePosts(filters: PostFilters = {}, options?: UseQueryOptions<PostListItem[]>) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function usePost(id: number, options?: UseQueryOptions<Post>) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function usePostBySlug(slug: string, options?: UseQueryOptions<Post | null>) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useRelatedPosts(postId: number, limit: number = 4) {
  return useQuery({
    queryKey: ['related-posts', postId, limit],
    queryFn: () => getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function usePostSearch(query: string, limit: number = 10) {
  return useQuery({
    queryKey: ['post-search', query, limit],
    queryFn: () => searchPosts(query, limit),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PostMutationInput) => createPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<PostMutationInput> }) =>
      updatePost(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
