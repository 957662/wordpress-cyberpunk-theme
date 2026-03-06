/**
 * 博客相关类型定义
 */

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Tag[];
  featuredImage?: string;
  publishedAt: string;
  updatedAt?: string;
  status: 'draft' | 'publish' | 'private';
  views?: number;
  likes?: number;
  comments?: number;
  readingTime?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: number;
}

export interface Comment {
  id: number;
  postId: number;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentId?: number;
  status: 'approved' | 'pending' | 'spam';
  replies?: Comment[];
}

export interface Author {
  id: number;
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
