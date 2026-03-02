/**
 * Comments API
 * 评论相关 API 接口
 */

import { apiClient } from './client';
import type { Comment, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 获取评论列表
 */
export async function getComments(params?: {
  page?: number;
  per_page?: number;
  post?: number;
  parent?: number;
  status?: 'hold' | 'approve' | 'spam' | 'trash';
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'date' | 'post' | 'parent';
}): Promise<PaginatedResponse<Comment>> {
  const response = await apiClient.get<Comment[]>('/comments', {
    params: {
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      status: params?.status || 'approve',
      ...params,
    },
  });

  // 获取总数
  const total = parseInt(response.headers['x-wp-total'] || '0', 10);
  const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

  return {
    data: response.data,
    total,
    totalPages,
    currentPage: params?.page || 1,
    pageSize: params?.per_page || 10,
  };
}

/**
 * 根据 ID 获取单个评论
 */
export async function getCommentById(id: number): Promise<Comment> {
  const response = await apiClient.get<Comment>(`/comments/${id}`);
  return response.data;
}

/**
 * 获取文章的评论
 */
export async function getCommentsByPostId(
  postId: number,
  params?: {
    page?: number;
    per_page?: number;
    order?: 'asc' | 'desc';
    parent?: number;
  }
): Promise<PaginatedResponse<Comment>> {
  return getComments({
    post: postId,
    ...params,
  });
}

/**
 * 创建评论
 */
export async function createComment(data: {
  post: number;
  content: string;
  parent?: number;
  author?: string;
  author_email?: string;
  author_url?: string;
}): Promise<Comment> {
  const response = await apiClient.post<Comment>('/comments', {
    ...data,
    // 如果是已登录用户，使用用户信息
    author_name: data.author,
    author_email: data.author_email,
    author_url: data.author_url,
  });
  return response.data;
}

/**
 * 更新评论（需要认证）
 */
export async function updateComment(
  id: number,
  data: {
    content?: string;
    status?: 'hold' | 'approve' | 'spam' | 'trash';
  }
): Promise<Comment> {
  const response = await apiClient.put<Comment>(`/comments/${id}`, data);
  return response.data;
}

/**
 * 删除评论（需要认证）
 */
export async function deleteComment(id: number, force: boolean = false): Promise<void> {
  await apiClient.delete(`/comments/${id}`, {
    params: { force },
  });
}

/**
 * 批准评论（需要认证）
 */
export async function approveComment(id: number): Promise<Comment> {
  return updateComment(id, { status: 'approve' });
}

/**
 * 拒绝评论（需要认证）
 */
export async function unapproveComment(id: number): Promise<Comment> {
  return updateComment(id, { status: 'hold' });
}

/**
 * 标记为垃圾评论（需要认证）
 */
export async function spamComment(id: number): Promise<Comment> {
  return updateComment(id, { status: 'spam' });
}

/**
 * 获取评论的子评论（回复）
 */
export async function getCommentReplies(parentId: number): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>('/comments', {
    params: {
      parent: parentId,
      per_page: 100,
      order: 'asc',
    },
  });
  return response.data;
}

/**
 * 构建评论树结构
 */
export function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  // 创建映射
  comments.forEach(comment => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  // 构建树
  comments.forEach(comment => {
    const node = map.get(comment.id)!;
    if (comment.parent === 0) {
      roots.push(node);
    } else {
      const parent = map.get(comment.parent);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(node);
      }
    }
  });

  return roots;
}

/**
 * 获取评论统计
 */
export async function getCommentStats(postId?: number): Promise<{
  total: number;
  approved: number;
  pending: number;
  spam: number;
}> {
  try {
    // 获取所有评论
    const allComments = await getComments({ post: postId, per_page: 100 });
    const approved = await getComments({ post: postId, per_page: 1, status: 'approve' });
    const pending = await getComments({ post: postId, per_page: 1, status: 'hold' });
    const spam = await getComments({ post: postId, per_page: 1, status: 'spam' });

    return {
      total: allComments.total,
      approved: approved.total,
      pending: pending.total,
      spam: spam.total,
    };
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      spam: 0,
    };
  }
}
