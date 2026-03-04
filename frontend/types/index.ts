/**
 * 类型定义统一导出
 */

export * from './common';
export * from './user';
export * from './post';
export * from './comment';

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
}

export type Role = 'admin' | 'editor' | 'author' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending';

// 文章相关类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: User;
  category?: Category;
  tags: Tag[];
  status: ContentStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export type ContentStatus = 'draft' | 'published' | 'archived' | 'deleted';

// 评论相关类型
export interface Comment {
  id: string;
  content: string;
  author: User;
  post?: Post;
  parent?: Comment;
  replies?: Comment[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

// 通知相关类型
export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// 搜索结果类型
export interface SearchResult {
  type: 'post' | 'user' | 'category' | 'tag';
  id: string;
  title: string;
  excerpt?: string;
  url: string;
  score?: number;
}

// 统计数据类型
export interface Statistics {
  views: number;
  visitors: number;
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  date: string;
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// 配置类型
export interface SiteConfig {
  name: string;
  description: string;
  logo?: string;
  favicon?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
