/**
 * 评论 API 服务
 */

export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  parentId?: number;
  status: 'approved' | 'pending' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface CreateCommentData {
  postId: number;
  content: string;
  parentId?: number;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

class CommentApiService {
  private baseUrl: string;
  private tokenKey: string = 'auth_token';

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * 获取 token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * 获取请求头
   */
  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * 获取文章评论列表
   */
  async getComments(
    postId: number,
    params?: { page?: number; per_page?: number; parent?: 0 | number }
  ): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams({
        post_id: String(postId),
        page: String(params?.page || 1),
        per_page: String(params?.per_page || 20),
        ...(params?.parent !== undefined && { parent: String(params.parent) }),
      });

      const response = await fetch(`${this.baseUrl}/comments?${queryParams}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('获取评论失败');
      }

      const data = await response.json();
      return {
        comments: data.comments || [],
        total: data.total || 0,
        page: data.page || 1,
        perPage: data.per_page || 20,
        totalPages: data.total_pages || 0,
      };
    } catch (error) {
      console.error('获取评论列表失败:', error);
      return {
        comments: [],
        total: 0,
        page: 1,
        perPage: 20,
        totalPages: 0,
      };
    }
  }

  /**
   * 获取单个评论
   */
  async getComment(commentId: number): Promise<Comment | null> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const comment: Comment = await response.json();
      return comment;
    } catch (error) {
      console.error('获取评论失败:', error);
      return null;
    }
  }

  /**
   * 创建评论
   */
  async createComment(data: CreateCommentData): Promise<{ success: boolean; comment?: Comment; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/comments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || '评论失败' };
      }

      const comment: Comment = await response.json();
      return { success: true, comment };
    } catch (error) {
      console.error('创建评论失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 更新评论
   */
  async updateComment(
    commentId: number,
    content: string
  ): Promise<{ success: boolean; comment?: Comment; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        return { success: false, message: '更新失败' };
      }

      const comment: Comment = await response.json();
      return { success: true, comment };
    } catch (error) {
      console.error('更新评论失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return { success: false, message: '删除失败' };
      }

      return { success: true, message: '删除成功' };
    } catch (error) {
      console.error('删除评论失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: number): Promise<{ success: boolean; liked: boolean; likeCount: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}/like`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return { success: false, liked: false, likeCount: 0 };
      }

      const data = await response.json();
      return {
        success: true,
        liked: data.liked,
        likeCount: data.like_count,
      };
    } catch (error) {
      console.error('点赞评论失败:', error);
      return { success: false, liked: false, likeCount: 0 };
    }
  }

  /**
   * 获取评论的回复列表
   */
  async getReplies(commentId: number, params?: { page?: number; per_page?: number }): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: String(params?.page || 1),
        per_page: String(params?.per_page || 20),
      });

      const response = await fetch(`${this.baseUrl}/comments/${commentId}/replies?${queryParams}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('获取回复失败');
      }

      const data = await response.json();
      return {
        comments: data.comments || [],
        total: data.total || 0,
        page: data.page || 1,
        perPage: data.per_page || 20,
        totalPages: data.total_pages || 0,
      };
    } catch (error) {
      console.error('获取回复列表失败:', error);
      return {
        comments: [],
        total: 0,
        page: 1,
        perPage: 20,
        totalPages: 0,
      };
    }
  }

  /**
   * 举报评论
   */
  async reportComment(commentId: number, reason: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}/report`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        return { success: false, message: '举报失败' };
      }

      return { success: true, message: '举报成功' };
    } catch (error) {
      console.error('举报评论失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 获取用户的评论列表
   */
  async getUserComments(params?: { page?: number; per_page?: number }): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: String(params?.page || 1),
        per_page: String(params?.per_page || 20),
      });

      const response = await fetch(`${this.baseUrl}/user/comments?${queryParams}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('获取评论失败');
      }

      const data = await response.json();
      return {
        comments: data.comments || [],
        total: data.total || 0,
        page: data.page || 1,
        perPage: data.per_page || 20,
        totalPages: data.total_pages || 0,
      };
    } catch (error) {
      console.error('获取用户评论列表失败:', error);
      return {
        comments: [],
        total: 0,
        page: 1,
        perPage: 20,
        totalPages: 0,
      };
    }
  }

  /**
   * 获取最新评论
   */
  async getLatestComments(limit: number = 10): Promise<Comment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/latest?limit=${limit}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return [];
      }

      const comments: Comment[] = await response.json();
      return comments;
    } catch (error) {
      console.error('获取最新评论失败:', error);
      return [];
    }
  }
}

// 导出单例
export const commentApiService = new CommentApiService();

// 导出便捷函数
export const getComments = (postId: number, params?: { page?: number; per_page?: number; parent?: 0 | number }) =>
  commentApiService.getComments(postId, params);
export const getComment = (commentId: number) => commentApiService.getComment(commentId);
export const createComment = (data: CreateCommentData) => commentApiService.createComment(data);
export const updateComment = (commentId: number, content: string) =>
  commentApiService.updateComment(commentId, content);
export const deleteComment = (commentId: number) => commentApiService.deleteComment(commentId);
export const likeComment = (commentId: number) => commentApiService.likeComment(commentId);
export const getReplies = (commentId: number, params?: { page?: number; per_page?: number }) =>
  commentApiService.getReplies(commentId, params);
export const reportComment = (commentId: number, reason: string) =>
  commentApiService.reportComment(commentId, reason);
export const getUserComments = (params?: { page?: number; per_page?: number }) =>
  commentApiService.getUserComments(params);
export const getLatestComments = (limit?: number) => commentApiService.getLatestComments(limit);

export default commentApiService;
