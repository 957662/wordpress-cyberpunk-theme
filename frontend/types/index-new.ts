/**
 * CyberPress Platform - Type Definitions
 * 全局类型定义
 */

// ============= WordPress 基础类型 =============

export interface WPLink {
  embedded: boolean;
  href: string;
}

export interface WPGuid {
  rendered: string;
}

export interface WPContent {
  rendered: string;
  protected: boolean;
}

export interface WPExcerpt {
  rendered: string;
  protected: boolean;
}

export interface WPTitle {
  rendered: string;
}

// ============= 文章相关类型 =============

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: WPTitle;
  content: WPContent;
  excerpt: WPExcerpt;
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio' | 'chat';
  meta?: Record<string, any>;
  categories?: number[];
  tags?: number[];
  featured_image?: string;
  author_data?: Author;
  replies?: Comment[];
  _embedded?: {
    author?: Author[];
    'wp:featuredmedia'?: Media[];
    'wp:term'?: Array<Array<Category | Tag>>;
  };
}

export interface Page {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPTitle;
  content: WPContent;
  excerpt: WPExcerpt;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta?: Record<string, any>;
}

// ============= 分类和标签类型 =============

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta?: Record<string, any>;
}

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta?: Record<string, any>;
}

// ============= 作者/用户类型 =============

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
    '128'?: string;
    '256'?: string;
  };
  meta?: Record<string, any>;
}

// ============= 评论类型 =============

export interface Comment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_email?: string;
  author_avatar?: string;
  date: string;
  date_gmt: string;
  content: WPContent;
  link: string;
  status: 'approve' | 'hold' | 'spam' | 'trash';
  type: string;
  meta?: Record<string, any>;
  replies?: Comment[];
  author_data?: Author;
}

// ============= 媒体类型 =============

export interface Media {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPTitle;
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: WPContent;
  description: WPContent;
  media_type: 'image' | 'file' | 'video' | 'audio';
  mime_type: string;
  media_details?: {
    width: number;
    height: number;
    file: string;
    sizes?: {
      thumbnail?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      medium?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      large?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      full?: { file: string; width: number; height: number; mime_type: string; source_url: string };
    };
  };
  post: number;
  source_url: string;
  meta?: Record<string, any>;
}

// ============= 用户相关类型 =============

export interface User {
  id: number;
  username: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  url?: string;
  description?: string;
  avatar?: string;
  roles?: string[];
  capabilities?: string[];
  meta?: Record<string, any>;
}

export interface UserProfile {
  user: User;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  newsletter: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  comments: boolean;
  replies: boolean;
  mentions: boolean;
}

// ============= 认证相关类型 =============

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthTokens;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// ============= 书签相关类型 =============

export interface Bookmark {
  id: string;
  postId: number;
  userId: number;
  title: string;
  excerpt: string;
  thumbnail?: string;
  url: string;
  createdAt: string;
  folder?: string;
  tags?: string[];
  notes?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count: number;
  createdAt: string;
}

// ============= 关注相关类型 =============

export interface Follow {
  id: string;
  followerId: number;
  followingId: number;
  type: 'user' | 'category' | 'tag';
  createdAt: string;
}

export interface FollowerCount {
  followers: number;
  following: number;
}

// ============= 通知相关类型 =============

export interface Notification {
  id: string;
  userId: number;
  type: 'comment' | 'reply' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

// ============= 搜索相关类型 =============

export interface SearchFilters {
  categories?: number[];
  tags?: number[];
  authors?: number[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  results: number;
  timestamp: string;
}

// ============= 分析相关类型 =============

export interface Analytics {
  views: number;
  visitors: number;
  posts: number;
  comments: number;
  popularPosts?: Post[];
  recentActivity?: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

// ============= 表单相关类型 =============

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface FormErrors {
  [key: string]: string[];
}

// ============= API 响应类型 =============

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ============= 组件 Props 类型 =============

export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// ============= 路由相关类型 =============

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// ============= 主题相关类型 =============

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'sharp' | 'rounded' | 'circular';
}

// ============= 导出所有类型 =============

export type {
  // WordPress 类型
  WPLink,
  WPGuid,
  WPContent,
  WPExcerpt,
  WPTitle,

  // 内容类型
  Post,
  Page,
  Category,
  Tag,
  Author,
  Comment,
  Media,

  // 用户类型
  User,
  UserProfile,
  UserPreferences,
  NotificationSettings,

  // 认证类型
  AuthTokens,
  AuthResponse,
  LoginCredentials,
  RegisterData,

  // 功能类型
  Bookmark,
  BookmarkFolder,
  Follow,
  FollowerCount,
  Notification,

  // 搜索类型
  SearchFilters,
  SearchHistory,

  // 分析类型
  Analytics,
  Activity,

  // 表单类型
  FormField,
  ValidationRule,
  FormErrors,

  // API 类型
  ApiResponse,
  PaginatedResponse,

  // 组件类型
  BaseComponentProps,
  LoadingProps,
  ButtonProps,

  // 路由类型
  RouteConfig,

  // 主题类型
  ThemeMode,
  ThemeConfig,
};
