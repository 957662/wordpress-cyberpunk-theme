/**
 * Core Data Models
 * 核心数据模型定义
 */

// ==================== 用户相关 ====================

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  role: 'admin' | 'author' | 'user';
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  social_links?: SocialLinks;
  preferences?: UserPreferences;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface UserPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  privacy_level: 'public' | 'friends' | 'private';
}

// ==================== 文章相关 ====================

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author: User;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  bookmark_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author: Pick<User, 'id' | 'username' | 'avatar'>;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time: number;
  created_at: string;
}

export interface PostCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published';
  featured?: boolean;
}

export interface PostUpdateInput extends Partial<PostCreateInput> {
  id: string;
}

// ==================== 分类和标签 ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  posts_count: number;
  parent_id?: string;
  children?: Category[];
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  posts_count: number;
  created_at: string;
}

// ==================== 评论相关 ====================

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author: User;
  content: string;
  like_count: number;
  replies_count: number;
  replies?: Comment[];
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentCreateInput {
  post_id: string;
  content: string;
  parent_id?: string;
}

// ==================== 社交功能 ====================

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  folder?: string;
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender?: User;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'bookmark'
  | 'system'
  | 'new_post';

// ==================== 搜索相关 ====================

export interface SearchQuery {
  q: string;
  type?: 'all' | 'posts' | 'users' | 'tags';
  category?: string;
  tags?: string[];
  sort_by?: 'relevance' | 'date' | 'popularity';
  page?: number;
  per_page?: number;
}

export interface SearchResult {
  posts: PostListItem[];
  users: User[];
  tags: Tag[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ==================== 分页相关 ====================

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// ==================== API响应 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, any>;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, any>;
  status_code: number;
}

// ==================== 认证相关 ====================

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthUser extends User {
  tokens?: AuthTokens;
}

// ==================== 分析相关 ====================

export interface AnalyticsData {
  views: number;
  visitors: number;
  likes: number;
  comments: number;
  bookmarks: number;
  followers: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface PostAnalytics {
  post_id: string;
  views: number;
  unique_visitors: number;
  average_read_time: number;
  bounce_rate: number;
  like_rate: number;
  comment_rate: number;
  share_count: number;
}

// ==================== 设置相关 ====================

export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_logo?: string;
  site_icon?: string;
  default_language: string;
  timezone: string;
  allow_registration: boolean;
  require_email_verification: boolean;
  posts_per_page: number;
}

// ==================== 文件上传 ====================

export interface UploadFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  thumbnail_url?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ==================== WebSocket ====================

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: Notification;
}

// ==================== 表单相关 ====================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | string[];
}

// ==================== 其他 ====================

export interface ReadingProgress {
  post_id: string;
  user_id: string;
  progress: number; // 0-100
  last_position: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingListItem {
  id: string;
  user_id: string;
  post_id: string;
  post: PostListItem;
  folder?: string;
  notes?: string;
  added_at: string;
}

export interface DashboardStats {
  total_posts: number;
  total_views: number;
  total_comments: number;
  total_followers: number;
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  created_at: string;
  data?: any;
}

// ==================== 类型守卫 ====================

export function isApiError(response: any): response is ApiError {
  return response && response.success === false && response.error;
}

export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && typeof response.success === 'boolean';
}

// ==================== 导出所有类型 ====================

export type {
  User,
  UserProfile,
  SocialLinks,
  UserPreferences,
  Post,
  PostListItem,
  PostCreateInput,
  PostUpdateInput,
  Category,
  Tag,
  Comment,
  CommentCreateInput,
  Follow,
  Like,
  Bookmark,
  Notification,
  NotificationType,
  SearchQuery,
  SearchResult,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthUser,
  AnalyticsData,
  PostAnalytics,
  SiteSettings,
  UploadFile,
  UploadProgress,
  WebSocketMessage,
  NotificationMessage,
  FormFieldError,
  FormErrors,
  ReadingProgress,
  ReadingListItem,
  DashboardStats,
  ActivityItem,
};
