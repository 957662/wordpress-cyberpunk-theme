/**
 * API Type Definitions
 * Complete type definitions for API requests and responses
 */

// ============================================================================
// Base Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
}

// ============================================================================
// Pagination & Filtering
// ============================================================================

export interface PaginationParams {
  page?: number;
  perPage?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';

export type Permission =
  | 'create_posts'
  | 'edit_posts'
  | 'delete_posts'
  | 'publish_posts'
  | 'manage_users'
  | 'manage_settings'
  | 'moderate_comments';

// ============================================================================
// Blog/Content Types
// ============================================================================

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: PostStatus;
  meta?: PostMeta;
  statistics?: PostStatistics;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface PostMeta {
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  readingTime?: number;
  viewCount?: number;
}

export interface PostStatistics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
  id: string;
  postId: string;
  author: CommentAuthor;
  content: string;
  parentId?: string;
  status: CommentStatus;
  likes: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export interface CommentAuthor {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  url?: string;
}

export interface CreateCommentRequest {
  postId: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: string;
  parentId?: string;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResult {
  type: 'post' | 'page' | 'author' | 'category' | 'tag';
  id: string;
  title: string;
  excerpt?: string;
  url: string;
  score: number;
}

export interface SearchRequest {
  query: string;
  type?: string[];
  page?: number;
  perPage?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  suggestions?: string[];
}

// ============================================================================
// Newsletter Types
// ============================================================================

export interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface SubscribeRequest {
  email: string;
  name?: string;
  tags?: string[];
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsData {
  pageviews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: PageStats[];
  referrers: ReferrerStats[];
  devices: DeviceStats[];
}

export interface PageStats {
  path: string;
  views: number;
  uniqueVisitors: number;
}

export interface ReferrerStats {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceStats {
  device: 'desktop' | 'mobile' | 'tablet';
  count: number;
  percentage: number;
}

// ============================================================================
// Media Types
// ============================================================================

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  createdAt: string;
}

export interface UploadRequest {
  file: File;
  alt?: string;
  caption?: string;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface SiteSettings {
  title: string;
  description: string;
  logo?: string;
  icon?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  theme: 'light' | 'dark' | 'auto';
  features: FeatureFlags;
}

export interface FeatureFlags {
  comments: boolean;
  newsletter: boolean;
  search: boolean;
  pwa: boolean;
  analytics: boolean;
}

export interface UpdateSettingsRequest {
  title?: string;
  description?: string;
  logo?: string;
  icon?: string;
  language?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'auto';
  features?: Partial<FeatureFlags>;
}

// ============================================================================
// User Profile Types
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  social?: SocialLinks;
  preferences: UserPreferences;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
  social?: Partial<SocialLinks>;
  preferences?: Partial<UserPreferences>;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
  recentActivity: Activity[];
  viewsOverTime: ViewsDataPoint[];
}

export interface Activity {
  id: string;
  type: 'post' | 'comment' | 'user' | 'system';
  action: string;
  description: string;
  actor: string;
  createdAt: string;
}

export interface ViewsDataPoint {
  date: string;
  views: number;
  unique: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'comment'
  | 'like'
  | 'follow'
  | 'mention'
  | 'system'
  | 'update';

// ============================================================================
// Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  validationErrors?: ValidationError[];
}
