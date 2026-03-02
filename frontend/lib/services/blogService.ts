/**
 * 博客服务 API
 *
 * 处理所有与博客相关的 API 调用
 */

import { API_BASE_URL } from '@/lib/config';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: number;
  status: 'draft' | 'published' | 'scheduled';
  featured?: boolean;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PostFilters {
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  status?: string;
  featured?: boolean;
  sortBy?: 'date' | 'views' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 获取文章列表
 */
export async function getPosts(
  page = 1,
  pageSize = 10,
  filters: PostFilters = {}
): Promise<PostListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters.category) params.append('category', filters.category);
  if (filters.tag) params.append('tag', filters.tag);
  if (filters.search) params.append('search', filters.search);
  if (filters.author) params.append('author', filters.author);
  if (filters.status) params.append('status', filters.status);
  if (filters.featured) params.append('featured', 'true');
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const response = await fetch(`${API_BASE_URL}/posts?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

/**
 * 根据 slug 获取文章
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/slug/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

/**
 * 获取文章详情
 */
export async function getPost(id: string): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(
  postId: string,
  limit = 4
): Promise<Post[]> {
  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/related?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch related posts');
  }

  const data = await response.json();
  return data.posts;
}

/**
 * 获取热门文章
 */
export async function getTrendingPosts(
  days = 7,
  limit = 10
): Promise<Post[]> {
  const response = await fetch(
    `${API_BASE_URL}/posts/trending?days=${days}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch trending posts');
  }

  const data = await response.json();
  return data.posts;
}

/**
 * 搜索文章
 */
export async function searchPosts(
  query: string,
  filters: Omit<PostFilters, 'search'> = {},
  page = 1,
  pageSize = 10
): Promise<PostListResponse> {
  return getPosts(page, pageSize, { ...filters, search: query });
}

/**
 * 创建文章（需要认证）
 */
export async function createPost(
  post: Partial<Post>
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, post: data };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 更新文章（需要认证）
 */
export async function updatePost(
  id: string,
  post: Partial<Post>
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, post: data };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 删除文章（需要认证）
 */
export async function deletePost(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 点赞文章
 */
export async function likePost(
  postId: string
): Promise<{ success: boolean; likes?: number; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, likes: data.likes };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 记录文章浏览
 */
export async function recordView(postId: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/posts/${postId}/view`, {
      method: 'POST',
    });
  } catch (error) {
    // 静默失败
    console.error('Failed to record view:', error);
  }
}

/**
 * 获取文章统计
 */
export async function getPostStats(postId: string): Promise<{
  views: number;
  likes: number;
  comments: number;
  shares: number;
}> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch post stats');
  }

  return response.json();
}
