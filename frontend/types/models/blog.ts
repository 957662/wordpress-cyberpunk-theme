/**
 * Blog Post Models
 * 博客文章相关数据模型
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  publishedAt?: string;
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostListItem extends Omit<BlogPost, 'content'> {
  // 列表项不需要完整内容
}

export interface BlogPostDetail extends BlogPost {
  // 详情页扩展字段
  relatedPosts?: BlogPostListItem[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface BlogComment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount?: number;
  replies?: BlogComment[];
}

export interface BlogSearchParams {
  q?: string;
  category?: string;
  tag?: string;
  author?: string;
  page?: number;
  perPage?: number;
  sortBy?: 'date' | 'views' | 'likes' | 'comments';
  order?: 'asc' | 'desc';
}

export interface BlogListResponse {
  posts: BlogPostListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasMore: boolean;
}
