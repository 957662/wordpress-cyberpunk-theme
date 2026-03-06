/**
 * Blog API Functions
 * 博客相关的 API 请求函数
 */

import { API_BASE_URL } from '@/config/api';

// Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
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
  status: 'draft' | 'published';
  featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending';
  featured?: boolean;
  status?: 'draft' | 'published';
}

export interface BlogResponse {
  data: BlogPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * 获取博客文章列表
 */
export async function getBlogPosts(params: BlogParams = {}): Promise<BlogResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params.category) queryParams.append('category', params.category);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/blog/posts?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  return response.json();
}

/**
 * 获取单篇博客文章
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }

  return response.json();
}

/**
 * 获取精选文章
 */
export async function getFeaturedPosts(limit = 5): Promise<BlogPost[]> {
  const response = await fetch(
    `${API_BASE_URL}/blog/posts?featured=true&per_page=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch featured posts');
  }

  const data: BlogResponse = await response.json();
  return data.data;
}

/**
 * 获取热门文章
 */
export async function getTrendingPosts(limit = 10): Promise<BlogPost[]> {
  const response = await fetch(
    `${API_BASE_URL}/blog/posts?sort=trending&per_page=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch trending posts');
  }

  const data: BlogResponse = await response.json();
  return data.data;
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(postId: string, limit = 4): Promise<BlogPost[]> {
  const response = await fetch(
    `${API_BASE_URL}/blog/posts/${postId}/related?limit=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch related posts');
  }

  return response.json();
}

/**
 * 搜索文章
 */
export async function searchPosts(
  query: string,
  params: Omit<BlogParams, 'search'> = {}
): Promise<BlogResponse> {
  return getBlogPosts({ ...params, search: query });
}

/**
 * 点赞文章
 */
export async function likePost(postId: string): Promise<{ liked: boolean; count: number }> {
  const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to like post');
  }

  return response.json();
}

/**
 * 收藏文章
 */
export async function bookmarkPost(
  postId: string
): Promise<{ bookmarked: boolean; count: number }> {
  const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to bookmark post');
  }

  return response.json();
}

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<
  Array<{ id: string; name: string; slug: string; count: number }>
> {
  const response = await fetch(`${API_BASE_URL}/blog/categories`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

/**
 * 获取标签列表
 */
export async function getTags(): Promise<
  Array<{ id: string; name: string; slug: string; count: number }>
> {
  const response = await fetch(`${API_BASE_URL}/blog/tags`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  return response.json();
}

/**
 * 获取博客统计数据
 */
export async function getBlogStats(): Promise<{
  total_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}> {
  const response = await fetch(`${API_BASE_URL}/blog/stats`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog stats');
  }

  return response.json();
}
