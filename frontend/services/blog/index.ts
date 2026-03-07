// ================================================================
// Blog Service - 博客服务
// ================================================================

import {
  Post,
  Category,
  Tag,
  Comment,
  PostQueryParams,
  PostListResponse,
  CategoryListResponse,
  TagListResponse,
  CommentListResponse,
  PostStats,
  SearchResult,
  LikeResponse,
  CommentSubmitResponse,
  PostArchive,
} from './types';

// API 基础 URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// ================================================================
// 工具函数
// ================================================================

/**
 * 构建 URL 查询参数
 */
function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * 通用请求函数
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: '请求失败',
      }));
      throw new Error(error.error || error.message || '请求失败');
    }

    return response.json();
  } catch (error) {
    console.error('API 请求错误:', error);
    throw error;
  }
}

// ================================================================
// 文章服务
// ================================================================

export const postService = {
  /**
   * 获取文章列表
   */
  async getList(params: PostQueryParams = {}): Promise<PostListResponse> {
    const query = buildQueryParams(params);
    return fetchAPI<PostListResponse>(`/blog/posts${query}`);
  },

  /**
   * 根据 slug 获取文章
   */
  async getBySlug(slug: string): Promise<Post> {
    return fetchAPI<Post>(`/blog/posts/${slug}`);
  },

  /**
   * 根据 ID 获取文章
   */
  async getById(id: string): Promise<Post> {
    return fetchAPI<Post>(`/blog/posts/id/${id}`);
  },

  /**
   * 获取热门文章
   */
  async getPopular(limit: number = 10): Promise<Post[]> {
    return fetchAPI<Post[]>(`/blog/posts/popular?limit=${limit}`);
  },

  /**
   * 获取精选文章
   */
  async getFeatured(limit: number = 5): Promise<Post[]> {
    return fetchAPI<Post[]>(`/blog/posts/featured?limit=${limit}`);
  },

  /**
   * 获取置顶文章
   */
  async getSticky(): Promise<Post[]> {
    return fetchAPI<Post[]>('/blog/posts/sticky');
  },

  /**
   * 获取相关文章
   */
  async getRelated(postId: string): Promise<Post[]> {
    return fetchAPI<Post[]>(`/blog/posts/${postId}/related`);
  },

  /**
   * 搜索文章
   */
  async search(query: string, params?: PostQueryParams): Promise<SearchResult> {
    const queryParams = buildQueryParams({ ...params, search: query });
    return fetchAPI<SearchResult>(`/blog/search${queryParams}`);
  },

  /**
   * 获取文章归档
   */
  async getArchive(year?: number): Promise<PostArchive[]> {
    const url = year ? `/blog/archive?year=${year}` : '/blog/archive';
    return fetchAPI<PostArchive[]>(url);
  },

  /**
   * 增加浏览量
   */
  async incrementViews(postId: string): Promise<void> {
    await fetchAPI(`/blog/posts/${postId}/views`, {
      method: 'POST',
    });
  },

  /**
   * 点赞文章
   */
  async like(postId: string): Promise<LikeResponse> {
    return fetchAPI<LikeResponse>(`/blog/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  /**
   * 取消点赞
   */
  async unlike(postId: string): Promise<LikeResponse> {
    return fetchAPI<LikeResponse>(`/blog/posts/${postId}/like`, {
      method: 'DELETE',
    });
  },
};

// ================================================================
// 分类服务
// ================================================================

export const categoryService = {
  /**
   * 获取分类列表
   */
  async getList(params?: {
    page?: number;
    pageSize?: number;
    parentId?: string;
  }): Promise<CategoryListResponse> {
    const query = buildQueryParams(params || {});
    return fetchAPI<CategoryListResponse>(`/blog/categories${query}`);
  },

  /**
   * 根据 slug 获取分类
   */
  async getBySlug(slug: string): Promise<Category> {
    return fetchAPI<Category>(`/blog/categories/${slug}`);
  },

  /**
   * 根据 ID 获取分类
   */
  async getById(id: string): Promise<Category> {
    return fetchAPI<Category>(`/blog/categories/id/${id}`);
  },

  /**
   * 获取热门分类
   */
  async getPopular(limit: number = 10): Promise<Category[]> {
    return fetchAPI<Category[]>(`/blog/categories/popular?limit=${limit}`);
  },

  /**
   * 获取分类树
   */
  async getTree(): Promise<Category[]> {
    return fetchAPI<Category[]>('/blog/categories/tree');
  },
};

// ================================================================
// 标签服务
// ================================================================

export const tagService = {
  /**
   * 获取标签列表
   */
  async getList(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<TagListResponse> {
    const query = buildQueryParams(params || {});
    return fetchAPI<TagListResponse>(`/blog/tags${query}`);
  },

  /**
   * 根据 slug 获取标签
   */
  async getBySlug(slug: string): Promise<Tag> {
    return fetchAPI<Tag>(`/blog/tags/${slug}`);
  },

  /**
   * 根据 ID 获取标签
   */
  async getById(id: string): Promise<Tag> {
    return fetchAPI<Tag>(`/blog/tags/id/${id}`);
  },

  /**
   * 获取热门标签
   */
  async getPopular(limit: number = 20): Promise<Tag[]> {
    return fetchAPI<Tag[]>(`/blog/tags/popular?limit=${limit}`);
  },

  /**
   * 搜索标签
   */
  async search(query: string): Promise<Tag[]> {
    return fetchAPI<Tag[]>(`/blog/tags/search?q=${encodeURIComponent(query)}`);
  },
};

// ================================================================
// 评论服务
// ================================================================

export const commentService = {
  /**
   * 获取文章的评论列表
   */
  async getList(
    postId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: Comment['status'];
    }
  ): Promise<CommentListResponse> {
    const query = buildQueryParams(params || {});
    return fetchAPI<CommentListResponse>(
      `/blog/posts/${postId}/comments${query}`
    );
  },

  /**
   * 提交评论
   */
  async submit(
    postId: string,
    data: {
      content: string;
      parent_id?: string;
      author_name?: string;
      author_email?: string;
      author_url?: string;
    }
  ): Promise<CommentSubmitResponse> {
    return fetchAPI<CommentSubmitResponse>(
      `/blog/posts/${postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * 点赞评论
   */
  async like(commentId: string): Promise<{ success: boolean; karma: number }> {
    return fetchAPI(`/blog/comments/${commentId}/like`, {
      method: 'POST',
    });
  },
};

// ================================================================
// 统计服务
// ================================================================

export const statsService = {
  /**
   * 获取博客统计数据
   */
  async getStats(): Promise<PostStats> {
    return fetchAPI<PostStats>('/blog/stats');
  },
};

// ================================================================
// 导出服务
// ================================================================

export default {
  post: postService,
  category: categoryService,
  tag: tagService,
  comment: commentService,
  stats: statsService,
};
