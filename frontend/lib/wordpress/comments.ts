/**
 * WordPress Comments API
 * 评论系统的数据访问层
 */

import { wpClient } from './client';

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_email: string;
  author_url: string;
  author_avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
  author_ip: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: 'approved' | 'hold' | 'spam';
  type: string;
  karma: number;
  meta: [];
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    up: Array<{ embeddable: boolean; href: string }>;
  };
}

export interface CommentFormData {
  post: number;
  author_name: string;
  author_email: string;
  author_url?: string;
  content: string;
  parent?: number;
}

export interface CommentQueryOptions {
  post?: number;
  parent?: number;
  parent__in?: number[];
  parent__not_in?: number[];
  status?: string;
  type?: string;
  page?: number;
  per_page?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  search?: string;
}

export interface CommentTree extends WPComment {
  children?: CommentTree[];
}

/**
 * 获取评论列表
 */
export async function getComments(options: CommentQueryOptions = {}) {
  const params = new URLSearchParams();

  if (options.post) params.append('post', options.post.toString());
  if (options.parent) params.append('parent', options.parent.toString());
  if (options.parent__in) params.append('parent__in', options.parent__in.join(','));
  if (options.parent__not_in) params.append('parent__not_in', options.parent__not_in.join(','));
  if (options.status) params.append('status', options.status);
  if (options.type) params.append('type', options.type);
  if (options.page) params.append('page', options.page.toString());
  if (options.per_page) params.append('per_page', options.per_page.toString());
  if (options.order) params.append('order', options.order);
  if (options.orderby) params.append('orderby', options.orderby);
  if (options.search) params.append('search', options.search);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/comments?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  const data: WPComment[] = await response.json();

  return {
    data,
    total: parseInt(response.headers.get('X-WP-Total') || '0', 10),
    totalPages: parseInt(response.headers.get('X-WP-TotalPages') || '0', 10),
  };
}

/**
 * 获取单个评论
 */
export async function getComment(id: number): Promise<WPComment> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/comments/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch comment: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 创建评论
 */
export async function createComment(data: CommentFormData): Promise<WPComment> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        status: 'hold', // 默认需要审核
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create comment');
  }

  return response.json();
}

/**
 * 更新评论（需要认证）
 */
export async function updateComment(
  id: number,
  data: Partial<CommentFormData>,
  token?: string
): Promise<WPComment> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/comments/${id}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update comment: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 删除评论（需要认证）
 */
export async function deleteComment(
  id: number,
  token?: string,
  force = false
): Promise<WPComment> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/comments/${id}?force=${force}`,
    {
      method: 'DELETE',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete comment: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 将扁平化的评论列表转换为树形结构
 */
export function buildCommentTree(comments: WPComment[]): CommentTree[] {
  const map = new Map<number, CommentTree>();
  const roots: CommentTree[] = [];

  // 第一遍：创建所有节点的映射
  comments.forEach(comment => {
    map.set(comment.id, { ...comment, children: [] });
  });

  // 第二遍：构建父子关系
  comments.forEach(comment => {
    const node = map.get(comment.id)!;

    if (comment.parent === 0) {
      roots.push(node);
    } else {
      const parent = map.get(comment.parent);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        // 如果找不到父节点，将其作为根节点
        roots.push(node);
      }
    }
  });

  return roots;
}

/**
 * 获取文章的评论树
 */
export async function getPostComments(
  postId: number,
  status: 'approved' | 'hold' | 'all' = 'approved'
): Promise<CommentTree[]> {
  const options: CommentQueryOptions = {
    post: postId,
    status: status === 'all' ? undefined : status,
    per_page: 100,
    order: 'asc',
  };

  const { data } = await getComments(options);
  return buildCommentTree(data);
}

/**
 * 评论统计
 */
export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
  spam: number;
}

export async function getCommentStats(token?: string): Promise<CommentStats> {
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 获取所有状态的评论数量
  const [approved, pending, spam] = await Promise.all([
    getComments({ status: 'approved', per_page: 1 }).then(r => r.total),
    getComments({ status: 'hold', per_page: 1 }).then(r => r.total),
    getComments({ status: 'spam', per_page: 1 }).then(r => r.total),
  ]);

  return {
    total: approved + pending + spam,
    approved,
    pending,
    spam,
  };
}
