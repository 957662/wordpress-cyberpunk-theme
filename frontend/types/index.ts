/**
 * 全局类型定义
 */

// ==================== 用户相关类型 ====================

export interface User {
  id: string | number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role?: 'admin' | 'editor' | 'author' | 'subscriber';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==================== 文章相关类型 ====================

export interface Post {
  id: string | number;
  title: string;
  excerpt: string;
  content?: string;
  slug?: string;
  coverImage?: string;
  author?: {
    name: string;
    avatar?: string;
    id?: string | number;
  };
  category?: string;
  categories?: number[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  comments?: number;
  status?: 'draft' | 'publish' | 'pending' | 'private';
  featured?: boolean;
  sticky?: boolean;
}

export interface PostMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ==================== 评论相关类型 ====================

export interface Comment {
  id: string | number;
  postId: string | number;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | number;
  status?: 'approved' | 'pending' | 'spam' | 'trash';
  replies?: Comment[];
  likes?: number;
  isLiked?: boolean;
}

// ==================== 分类和标签类型 ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

// ==================== 社交功能类型 ====================

export interface Follow {
  id: string | number;
  followerId: string | number;
  followingId: string | number;
  createdAt: string;
}

export interface Like {
  id: string | number;
  userId: string | number;
  targetId: string | number;
  targetType: 'post' | 'comment';
  createdAt: string;
}

export interface Bookmark {
  id: string | number;
  userId: string | number;
  postId: string | number;
  createdAt: string;
  updatedAt?: string;
  post?: Post;
}

// ==================== 通知类型 ====================

export interface Notification {
  id: string | number;
  userId: string | number;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// ==================== 搜索类型 ====================

export interface SearchFilters {
  query?: string;
  categories?: string[];
  tags?: string[];
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'views' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  posts: Post[];
  total: number;
  took: number;
}

// ==================== 表单类型 ====================

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ==================== 分页类型 ====================

export interface Pagination {
  current: number;
  total: number;
  perPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

// ==================== 主题/配置类型 ====================

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  reducedMotion: boolean;
}

// ==================== 阅读进度类型 ====================

export interface ReadingProgress {
  postId: string | number;
  userId?: string | number;
  progress: number; // 0-100
  lastPosition: number; // 像素位置
  completed: boolean;
  lastReadAt: string;
  readingTime?: number; // 实际阅读时间（秒）
}

// ==================== 统计类型 ====================

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
}

export interface UserStats {
  posts: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
}

// ==================== 媒体类型 ====================

export interface MediaItem {
  id: number;
  url: string;
  title?: string;
  caption?: string;
  alt?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

// ==================== 导出所有类型 ====================

export type {
  User,
  AuthState,
  Post,
  PostMeta,
  Comment,
  Category,
  Tag,
  Follow,
  Like,
  Bookmark,
  Notification,
  SearchFilters,
  SearchResult,
  FormField,
  FormState,
  ApiResponse,
  ApiError,
  Pagination,
  ThemeConfig,
  ReadingProgress,
  PostStats,
  UserStats,
  MediaItem,
};
