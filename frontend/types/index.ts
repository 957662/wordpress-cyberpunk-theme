/**
 * TypeScript Type Definitions
 * CyberPress Platform 类型定义
 */

// ============= 用户相关类型 =============

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  comments_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserUpdate {
  full_name?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  birth_date?: string;
  gender?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  company?: string;
  interests?: string[];
  skills?: string[];
}

// ============= 认证相关类型 =============

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// ============= 文章相关类型 =============

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  author?: User;
  category_id?: number;
  category?: Category;
  status: PostStatus;
  post_type: PostType;
  comment_status: 'open' | 'closed';
  password?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  tags?: Tag[];
}

export type PostStatus = 'draft' | 'published' | 'pending_review' | 'private' | 'trash';
export type PostType = 'post' | 'page' | 'attachment' | 'revision';

export interface PostCreate {
  title: string;
  content: string;
  excerpt?: string;
  category_id?: number;
  status?: PostStatus;
  tags?: number[];
  featured_image?: string;
  is_featured?: boolean;
  published_at?: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  category_id?: number;
  status?: PostStatus;
  tags?: number[];
  featured_image?: string;
  is_featured?: boolean;
}

// ============= 分类相关类型 =============

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
  post_count: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
  order?: number;
}

// ============= 标签相关类型 =============

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface TagCreate {
  name: string;
  description?: string;
}

// ============= 评论相关类型 =============

export interface Comment {
  id: number;
  post_id: number;
  post?: Post;
  author_id: number;
  author?: User;
  parent_id?: number;
  content: string;
  status: CommentStatus;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  replies?: Comment[];
}

export type CommentStatus = 'approved' | 'pending' | 'spam' | 'trash';

export interface CommentCreate {
  post_id: number;
  content: string;
  parent_id?: number;
}

// ============= 点赞相关类型 =============

export interface Like {
  id: number;
  user_id: number;
  user?: User;
  target_type: 'post' | 'comment' | 'user';
  target_id: number;
  created_at: string;
}

// ============= 书签相关类型 =============

export interface Bookmark {
  id: number;
  user_id: number;
  user?: User;
  post_id: number;
  post?: Post;
  folder?: string;
  notes?: string;
  created_at: string;
}

// ============= 关注相关类型 =============

export interface Follow {
  id: number;
  follower_id: number;
  follower?: User;
  following_id: number;
  following?: User;
  created_at: string;
}

// ============= 通知相关类型 =============

export interface Notification {
  id: number;
  user_id: number;
  user?: User;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export type NotificationType = 
  | 'comment' 
  | 'like' 
  | 'follow' 
  | 'mention' 
  | 'system' 
  | 'post_published'
  | 'comment_reply';

// ============= 搜索相关类型 =============

export interface SearchResult {
  type: 'post' | 'user' | 'category' | 'tag';
  id: number;
  title: string;
  excerpt?: string;
  url?: string;
  score?: number;
}

export interface SearchRequest {
  query: string;
  type?: 'post' | 'user' | 'category' | 'tag' | 'all';
  page?: number;
  per_page?: number;
}

// ============= 统计相关类型 =============

export interface AnalyticsData {
  total_views: number;
  total_visitors: number;
  avg_session_duration: number;
  bounce_rate: number;
  date_range: string;
  metrics: MetricData[];
  chart_data: ChartData;
}

export interface MetricData {
  name: string;
  value: number;
  change: number;
  change_type: 'increase' | 'decrease';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// ============= API响应类型 =============

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ============= 表单相关类型 =============

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============= UI相关类型 =============

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// ============= 设置相关类型 =============

export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_url: string;
  logo?: string;
  icon?: string;
  posts_per_page: number;
  date_format: string;
  time_format: string;
  timezone: string;
  language: string;
  allow_comments: boolean;
  comment_moderation: boolean;
  registration_enabled: boolean;
}

export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  email_on_comment: boolean;
  email_on_follow: boolean;
  email_on_like: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

// ============= 内容分析类型 =============

export interface ContentAnalysis {
  summary: string;
  sentiment: {
    type: 'positive' | 'negative' | 'neutral';
    score: number;
  };
  keywords: string[];
  readability_score: number;
  seo_score: number;
  suggestions: string[];
  word_count: number;
  reading_time: number;
}

// ============= AI生成类型 =============

export interface AIGenerationRequest {
  type: 'article' | 'summary' | 'title' | 'tags' | 'image';
  topic: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'creative' | 'technical';
  length?: 'short' | 'medium' | 'long';
  language?: 'zh' | 'en';
}

export interface AIGenerationResponse {
  id: string;
  type: string;
  content: string;
  metadata?: {
    word_count?: number;
    reading_time?: number;
    suggestions?: string[];
  };
}
