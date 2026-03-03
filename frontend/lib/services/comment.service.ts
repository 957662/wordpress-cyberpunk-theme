/**
 * Comment Service
 * 评论服务 - 处理评论相关的业务逻辑
 */

import { wpApi } from '../api/wordpress-api';
import type { Comment } from '@/types';

export interface CreateCommentData {
  postId: number;
  parentId?: number;
  author: string;
  authorEmail: string;
  content: string;
}

export interface CommentQueryParams {
  post?: number;
  page?: number;
  per_page?: number;
  orderby?: 'date' | 'date_gmt' | 'id' | 'post' | 'parent';
  order?: 'asc' | 'desc';
  status?: 'approve' | 'hold' | 'spam' | 'trash';
}

export interface PaginatedCommentsResponse {
  comments: Comment[];
  total: number;
  totalPages: number;
}

class CommentService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  /**
   * 获取评论列表（带分页）
   */
  async getComments(
    params: CommentQueryParams = {}
  ): Promise<PaginatedCommentsResponse> {
    try {
      const queryParams = {
        page: params.page || 1,
        per_page: params.per_page || 10,
        post: params.post,
        orderby: params.orderby || 'date',
        order: params.order || 'desc',
        status: params.status || 'approve',
      };

      const cacheKey = `comments-${JSON.stringify(queryParams)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/comments', { params: queryParams });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

      const result = {
        comments: response.data,
        total,
        totalPages,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * 获取文章的所有评论
   */
  async getCommentsByPost(
    postId: number,
    params: Omit<CommentQueryParams, 'post'> = {}
  ): Promise<PaginatedCommentsResponse> {
    return this.getComments({ ...params, post: postId });
  }

  /**
   * 根据 ID 获取单条评论
   */
  async getCommentById(id: number): Promise<Comment> {
    try {
      const response = await wpApi.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw new Error('Failed to fetch comment');
    }
  }

  /**
   * 创建新评论
   */
  async createComment(data: CreateCommentData): Promise<Comment> {
    try {
      const response = await wpApi.post('/comments', {
        post: data.postId,
        parent: data.parentId || 0,
        author_name: data.author,
        author_email: data.authorEmail,
        content: data.content,
      });

      // 清除相关缓存
      this.clearCacheByPost(data.postId);

      return response.data;
    } catch (error: any) {
      console.error('Error creating comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  }

  /**
   * 更新评论（需要认证）
   */
  async updateComment(
    id: number,
    data: Partial<CreateCommentData>
  ): Promise<Comment> {
    try {
      const response = await wpApi.post(`/comments/${id}`, {
        content: data.content,
      });

      // 清除相关缓存
      if (data.postId) {
        this.clearCacheByPost(data.postId);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error updating comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update comment');
    }
  }

  /**
   * 删除评论（需要认证）
   */
  async deleteComment(id: number, postId?: number): Promise<void> {
    try {
      await wpApi.delete(`/comments/${id}`, {
        params: { force: true },
      });

      // 清除相关缓存
      if (postId) {
        this.clearCacheByPost(postId);
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }

  /**
   * 获取评论的子评论
   */
  async getReplies(commentId: number): Promise<Comment[]> {
    try {
      const response = await wpApi.get('/comments', {
        params: { parent: commentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  }

  /**
   * 评论计数
   */
  async getCommentCount(postId: number): Promise<number> {
    try {
      const cacheKey = `comment-count-${postId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached !== null) return cached;

      const response = await wpApi.get('/comments', {
        params: { post: postId, per_page: 1 },
      });

      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      this.setCache(cacheKey, total);
      return total;
    } catch (error) {
      console.error('Error fetching comment count:', error);
      return 0;
    }
  }

  /**
   * 构建评论树
   */
  buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // 创建映射
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 构建树结构
    comments.forEach(comment => {
      const currentComment = commentMap.get(comment.id);
      if (!currentComment) return;

      if (comment.parent === 0) {
        rootComments.push(currentComment);
      } else {
        const parent = commentMap.get(comment.parent);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(currentComment);
        }
      }
    });

    return rootComments;
  }

  /**
   * 缓存管理
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCacheByPost(postId: number): void {
    // 清除与该文章相关的所有缓存
    Array.from(this.cache.keys()).forEach(key => {
      if (key.includes(`post-${postId}`) || key.includes(`comments-{"post":${postId}`)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// 导出单例
export const commentService = new CommentService();
export default commentService;
