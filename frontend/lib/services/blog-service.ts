/**
 * Blog Service
 *
 * Centralized service for blog-related API calls
 * Handles posts, categories, tags, and comments
 */

import { apiClient } from '../api-client';
import type {
  Post,
  Category,
  Tag,
  Comment,
  PaginatedResponse,
  PostFilters,
  PostSearchParams,
} from '../types/blog';

// =====================================================
// Posts API
// =====================================================

export interface GetPostsParams {
  page?: number;
  per_page?: number;
  status?: 'publish' | 'draft' | 'private';
  categories?: string;
  tags?: string;
  author?: number;
  search?: string;
  orderby?: 'date' | 'title' | 'modified' | 'comment_count' | 'views';
  order?: 'asc' | 'desc';
  slug?: string;
}

export interface GetPostResponse extends Post {
  author?: {
    id: number;
    name: string;
    slug?: string;
    avatar_url?: string;
  };
  categories?: Category[];
  tags?: Tag[];
}

/**
 * Get paginated posts with optional filters
 */
export async function getPosts(
  params: GetPostsParams = {},
): Promise<PaginatedResponse<GetPostResponse>> {
  try {
    const response = await apiClient.get('/posts', { params });
    return {
      data: response.data,
      meta: {
        total: parseInt(response.headers['x-wp-total'] || '0', 10),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

/**
 * Get a single post by slug or ID
 */
export async function getPost(
  slugOrId: string | number,
): Promise<GetPostResponse> {
  try {
    const response = await apiClient.get(`/posts/${slugOrId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${slugOrId}:`, error);
    throw error;
  }
}

/**
 * Search posts with full-text search
 */
export async function searchPosts(
  params: PostSearchParams,
): Promise<PaginatedResponse<GetPostResponse>> {
  try {
    return getPosts({
      search: params.query,
      page: params.page,
      per_page: params.per_page,
      categories: params.categories?.join(','),
      tags: params.tags?.join(','),
      orderby: 'date',
      order: 'desc',
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(
  limit: number = 5,
): Promise<GetPostResponse[]> {
  try {
    const response = await apiClient.get('/posts', {
      params: {
        per_page: limit,
        meta_key: 'featured',
        meta_value: '1',
        status: 'publish',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

/**
 * Get popular posts by view count
 */
export async function getPopularPosts(
  limit: number = 10,
): Promise<GetPostResponse[]> {
  try {
    const response = await apiClient.get('/posts/popular', {
      params: { per_page: limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

/**
 * Get related posts based on categories/tags
 */
export async function getRelatedPosts(
  postId: number,
  limit: number = 4,
): Promise<GetPostResponse[]> {
  try {
    const response = await apiClient.get(`/posts/${postId}/related`, {
      params: { per_page: limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Increment post view count
 */
export async function incrementPostViews(postId: number): Promise<void> {
  try {
    await apiClient.post(`/posts/${postId}/views`);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * Like/Unlike a post
 */
export async function togglePostLike(postId: number): Promise<{ liked: boolean; count: number }> {
  try {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// =====================================================
// Categories API
// =====================================================

/**
 * Get all categories
 */
export async function getCategories(
  params: { per_page?: number; include_empty?: boolean } = {},
): Promise<Category[]> {
  try {
    const response = await apiClient.get('/categories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get a single category by slug
 */
export async function getCategory(slug: string): Promise<Category> {
  try {
    const response = await apiClient.get(`/categories`, {
      params: { slug },
    });
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
}

// =====================================================
// Tags API
// =====================================================

/**
 * Get all tags
 */
export async function getTags(
  params: { per_page?: number; include_empty?: boolean } = {},
): Promise<Tag[]> {
  try {
    const response = await apiClient.get('/tags', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit: number = 20): Promise<Tag[]> {
  try {
    const response = await apiClient.get('/tags', {
      params: {
        per_page: limit,
        orderby: 'count',
        order: 'desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return [];
  }
}

// =====================================================
// Comments API
// =====================================================

export interface CreateCommentParams {
  post_id: number;
  author_name?: string;
  author_email?: string;
  content: string;
  parent_id?: number;
}

/**
 * Get comments for a post
 */
export async function getComments(
  postId: number,
  params: { per_page?: number; page?: number } = {},
): Promise<PaginatedResponse<Comment>> {
  try {
    const response = await apiClient.get('/comments', {
      params: {
        post: postId,
        ...params,
        status: 'approved',
        orderby: 'date',
        order: 'asc',
      },
    });
    return {
      data: response.data,
      meta: {
        total: parseInt(response.headers['x-wp-total'] || '0', 10),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
      },
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  data: CreateCommentParams,
): Promise<Comment> {
  try {
    const response = await apiClient.post('/comments', data);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

/**
 * Reply to a comment
 */
export async function replyToComment(
  parentCommentId: number,
  content: string,
  authorData?: { name?: string; email?: string },
): Promise<Comment> {
  try {
    // Get parent comment to find post ID
    const parentComment = await apiClient.get(`/comments/${parentCommentId}`);

    return createComment({
      post_id: parentComment.data.post,
      parent_id: parentCommentId,
      content,
      ...authorData,
    });
  } catch (error) {
    console.error('Error replying to comment:', error);
    throw error;
  }
}

// =====================================================
// Analytics API
// =====================================================

/**
 * Get post analytics
 */
export async function getPostAnalytics(
  postId: number,
  days: number = 30,
): Promise<{
  views: number;
  visitors: number;
  unique_visitors: number;
  history: Array<{ date: string; views: number; visitors: number }>;
}> {
  try {
    const response = await apiClient.get(`/posts/${postId}/analytics`, {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

// =====================================================
// Blog Service Object
// =====================================================

export const blogService = {
  // Posts
  getPosts,
  getPost,
  searchPosts,
  getFeaturedPosts,
  getPopularPosts,
  getRelatedPosts,
  incrementPostViews,
  togglePostLike,

  // Categories
  getCategories,
  getCategory,

  // Tags
  getTags,
  getPopularTags,

  // Comments
  getComments,
  createComment,
  replyToComment,

  // Analytics
  getPostAnalytics,
};

export default blogService;
