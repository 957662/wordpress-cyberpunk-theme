/**
 * Blog Service
 * 博客相关API服务
 */

import { apiClient } from './api-client'

export interface Post {
  id: string | number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  category?: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  author?: {
    id: number
    username: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  views?: number
  likes?: number
  readTime?: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  postCount?: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  postCount?: number
}

export interface Comment {
  id: string | number
  postId: string | number
  author: {
    id: number
    username: string
    avatar?: string
  }
  content: string
  createdAt: string
  updatedAt: string
  parentId?: string | number
  replies?: Comment[]
}

export interface PostsResponse {
  data: Post[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ListPostsParams {
  page?: number
  perPage?: number
  category?: string
  tag?: string
  search?: string
  sort?: 'latest' | 'popular' | 'trending'
}

/**
 * Blog API Service
 */
export const blogService = {
  /**
   * 获取文章列表
   */
  async listPosts(params?: ListPostsParams): Promise<PostsResponse> {
    const response = await apiClient.get('/posts', { params })
    return response.data
  },

  /**
   * 获取单篇文章
   */
  async getPost(slug: string): Promise<Post> {
    const response = await apiClient.get(`/posts/${slug}`)
    return response.data
  },

  /**
   * 获取文章通过ID
   */
  async getPostById(id: string | number): Promise<Post> {
    const response = await apiClient.get(`/posts/by-id/${id}`)
    return response.data
  },

  /**
   * 创建文章
   */
  async createPost(data: Partial<Post>): Promise<Post> {
    const response = await apiClient.post('/posts', data)
    return response.data
  },

  /**
   * 更新文章
   */
  async updatePost(id: string | number, data: Partial<Post>): Promise<Post> {
    const response = await apiClient.put(`/posts/${id}`, data)
    return response.data
  },

  /**
   * 删除文章
   */
  async deletePost(id: string | number): Promise<void> {
    await apiClient.delete(`/posts/${id}`)
  },

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: Omit<ListPostsParams, 'search'>): Promise<PostsResponse> {
    return this.listPosts({ ...params, search: query })
  },

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string | number, limit = 4): Promise<Post[]> {
    const response = await apiClient.get(`/posts/${postId}/related`, {
      params: { limit },
    })
    return response.data
  },

  /**
   * 获取热门文章
   */
  async getPopularPosts(limit = 10): Promise<Post[]> {
    const response = await apiClient.get('/posts/popular', {
      params: { limit },
    })
    return response.data
  },

  /**
   * 获取趋势文章
   */
  async getTrendingPosts(limit = 10): Promise<Post[]> {
    const response = await apiClient.get('/posts/trending', {
      params: { limit },
    })
    return response.data
  },

  /**
   * 文章点赞
   */
  async likePost(postId: string | number): Promise<void> {
    await apiClient.post(`/posts/${postId}/like`)
  },

  /**
   * 取消文章点赞
   */
  async unlikePost(postId: string | number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/like`)
  },

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: string | number): Promise<void> {
    await apiClient.post(`/posts/${postId}/bookmark`)
  },

  /**
   * 取消收藏文章
   */
  async unbookmarkPost(postId: string | number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/bookmark`)
  },

  /**
   * 增加文章浏览量
   */
  async incrementViews(postId: string | number): Promise<void> {
    await apiClient.post(`/posts/${postId}/views`)
  },
}

/**
 * Category API Service
 */
export const categoryService = {
  /**
   * 获取分类列表
   */
  async listCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories')
    return response.data
  },

  /**
   * 获取单个分类
   */
  async getCategory(slug: string): Promise<Category> {
    const response = await apiClient.get(`/categories/${slug}`)
    return response.data
  },

  /**
   * 获取分类下的文章
   */
  async getCategoryPosts(
    slug: string,
    params?: Pick<ListPostsParams, 'page' | 'perPage'>
  ): Promise<PostsResponse> {
    const response = await apiClient.get(`/categories/${slug}/posts`, { params })
    return response.data
  },
}

/**
 * Tag API Service
 */
export const tagService = {
  /**
   * 获取标签列表
   */
  async listTags(): Promise<Tag[]> {
    const response = await apiClient.get('/tags')
    return response.data
  },

  /**
   * 获取热门标签
   */
  async getPopularTags(limit = 20): Promise<Tag[]> {
    const response = await apiClient.get('/tags/popular', {
      params: { limit },
    })
    return response.data
  },

  /**
   * 获取单个标签
   */
  async getTag(slug: string): Promise<Tag> {
    const response = await apiClient.get(`/tags/${slug}`)
    return response.data
  },

  /**
   * 获取标签下的文章
   */
  async getTagPosts(
    slug: string,
    params?: Pick<ListPostsParams, 'page' | 'perPage'>
  ): Promise<PostsResponse> {
    const response = await apiClient.get(`/tags/${slug}/posts`, { params })
    return response.data
  },
}

/**
 * Comment API Service
 */
export const commentService = {
  /**
   * 获取文章评论
   */
  async getComments(postId: string | number): Promise<Comment[]> {
    const response = await apiClient.get(`/posts/${postId}/comments`)
    return response.data
  },

  /**
   * 创建评论
   */
  async createComment(
    postId: string | number,
    data: { content: string; parentId?: string | number }
  ): Promise<Comment> {
    const response = await apiClient.post(`/posts/${postId}/comments`, data)
    return response.data
  },

  /**
   * 更新评论
   */
  async updateComment(commentId: string | number, data: { content: string }): Promise<Comment> {
    const response = await apiClient.put(`/comments/${commentId}`, data)
    return response.data
  },

  /**
   * 删除评论
   */
  async deleteComment(commentId: string | number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`)
  },

  /**
   * 评论点赞
   */
  async likeComment(commentId: string | number): Promise<void> {
    await apiClient.post(`/comments/${commentId}/like`)
  },

  /**
   * 取消评论点赞
   */
  async unlikeComment(commentId: string | number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}/like`)
  },
}

export default {
  blog: blogService,
  category: categoryService,
  tag: tagService,
  comment: commentService,
}
