/**
 * 评论服务 API
 *
 * 处理所有与评论相关的 API 调用
 */

import { API_BASE_URL } from '@/lib/config';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 获取文章评论列表
 */
export async function getComments(
  postId: string,
  page = 1,
  pageSize = 20,
  sortBy: 'date' | 'likes' = 'date'
): Promise<CommentListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
  });

  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/comments?${params}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

/**
 * 获取评论详情
 */
export async function getComment(commentId: string): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch comment');
  }

  return response.json();
}

/**
 * 获取评论回复
 */
export async function getCommentReplies(
  commentId: string,
  page = 1,
  pageSize = 10
): Promise<CommentListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/comments/${commentId}/replies?${params}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch comment replies');
  }

  return response.json();
}

/**
 * 创建评论（需要认证）
 */
export async function createComment(
  postId: string,
  data: {
    content: string;
    parentId?: string;
    authorName?: string;
    authorEmail?: string;
    authorUrl?: string;
  }
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create comment' };
    }

    const result = await response.json();
    return { success: true, comment: result };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 更新评论（需要认证）
 */
export async function updateComment(
  commentId: string,
  data: { content: string }
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const result = await response.json();
    return { success: true, comment: result };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 删除评论（需要认证）
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
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
 * 点赞评论
 */
export async function likeComment(
  commentId: string
): Promise<{ success: boolean; likes?: number; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
 * 点踩评论
 */
export async function dislikeComment(
  commentId: string
): Promise<{ success: boolean; dislikes?: number; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/dislike`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, dislikes: data.dislikes };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 举报评论
 */
export async function reportComment(
  commentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
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
 * 获取用户评论（需要认证）
 */
export async function getUserComments(
  page = 1,
  pageSize = 20
): Promise<CommentListResponse> {
  const token = localStorage.getItem('auth_token');
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/user/comments?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user comments');
  }

  return response.json();
}
