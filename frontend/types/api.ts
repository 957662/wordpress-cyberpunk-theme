/**
 * API 相关类型定义
 */

// 通用 API 响应
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams extends PaginationParams {
  query: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// 文章相关
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'scheduled' | 'private';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  commentCount?: number;
  meta?: PostMeta;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
}

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

export interface PostMeta {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
}

// 评论相关
export interface Comment {
  id: number;
  postId: number;
  author: CommentAuthor;
  content: string;
  parent?: number;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
  likes?: number;
  replies?: Comment[];
}

export interface CommentAuthor {
  name: string;
  email?: string;
  avatar?: string;
  url?: string;
}

// 用户相关
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  avatar?: string;
}

// 媒体相关
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  name: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  alt?: string;
  caption?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 认证相关
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
  captcha?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username?: string;
  captcha?: string;
}

export interface ForgotPasswordData {
  email: string;
  captcha?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// 表单相关
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormSubmitData {
  [key: string]: any;
}

// 搜索相关
export interface SearchResult {
  type: 'post' | 'page' | 'category' | 'tag' | 'user';
  id: number | string;
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  date?: string;
  author?: string;
  category?: string;
  relevance: number;
}

// 通知相关
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  createdAt: string;
}

// 仪表板相关
export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    drafts: number;
    scheduled: number;
  };
  views: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
    spam: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}

// 设置相关
export interface SiteSettings {
  general: {
    title: string;
    description: string;
    url: string;
    logo?: string;
    icon?: string;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterCard?: string;
    robots?: string;
  };
  reading: {
    postsPerPage: number;
    theme: 'light' | 'dark' | 'auto';
    font?: string;
    fontSize?: number;
  };
  comments: {
    enabled: boolean;
    requireApproval: boolean;
    allowGuest: boolean;
    maxDepth: number;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

// 错误相关
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// WebSocket 相关
export interface WebSocketMessage {
  type: string;
  data?: any;
  error?: string;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// 导出所有类型
export type {
  ApiResponse,
  PaginationParams,
  SearchParams,
  Post,
  Author,
  Category,
  Tag,
  PostMeta,
  Comment,
  CommentAuthor,
  User,
  UserRole,
  UserProfile,
  MediaItem,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  FormField,
  FormSubmitData,
  SearchResult,
  Notification,
  DashboardStats,
  ChartData,
  SiteSettings,
  ApiError,
  ValidationError,
  WebSocketMessage,
  WebSocketConfig,
};
