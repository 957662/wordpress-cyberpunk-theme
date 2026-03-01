/**
 * 全局类型定义
 */

// ============= 文章相关类型 =============

export interface Post {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified?: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  author?: Author;
  categories?: Category[];
  tags?: Tag[];
  featuredMedia?: number;
  featuredImage?: string;
  views?: number;
  likes?: number;
  commentCount?: number;
  readingTime?: string;
  meta?: Record<string, any>;
}

export interface Author {
  id: string | number;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  email?: string;
  website?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: number;
}

export interface Tag {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

// ============= 作品集相关类型 =============

export interface Project {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  images?: string[];
  tags: string[];
  status: 'completed' | 'in-progress' | 'planned';
  links?: {
    demo?: string;
    github?: string;
    external?: string;
  };
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  stars?: number;
  forks?: number;
  featured?: boolean;
  order?: number;
}

// ============= 评论相关类型 =============

export interface Comment {
  id: string | number;
  postId: string | number;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  date: string;
  parentId?: number;
  status: 'approved' | 'pending' | 'spam' | 'trash';
  replies?: Comment[];
}

export interface CommentForm {
  author: string;
  email: string;
  content: string;
  parentId?: number;
}

// ============= 用户相关类型 =============

export interface User {
  id: string | number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';
  capabilities?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}

// ============= 搜索相关类型 =============

export interface SearchResult {
  type: 'post' | 'project' | 'page';
  id: string | number;
  title: string;
  excerpt: string;
  url: string;
  score?: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'relevance' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ============= 分页相关类型 =============

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ============= API 响应类型 =============

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
}

// ============= 媒体相关类型 =============

export interface MediaItem {
  id: string | number;
  url: string;
  title?: string;
  caption?: string;
  alt?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

// ============= 设置相关类型 =============

export interface SiteSettings {
  title: string;
  description: string;
  logo?: string;
  icon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
    youtube?: string;
  };
  analytics?: {
    googleId?: string;
    baiduId?: string;
  };
}

// ============= 主题相关类型 =============

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
}

// ============= 通知相关类型 =============

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

// ============= 表单相关类型 =============

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

// ============= 图表相关类型 =============

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface StatsData {
  total: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
}

// ============= 组件 Props 类型扩展 =============

export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface LoadingState {
  isLoading: boolean;
  error?: Error | null;
  data?: any;
}

// ============= WordPress API 类型 =============

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: any;
    image_meta: any;
  };
  source_url: string;
  _links: any;
}

// 导出默认类型
export default {
  Post,
  Author,
  Category,
  Tag,
  Project,
  Comment,
  User,
  SearchResult,
  Pagination,
  ApiResponse,
  MediaItem,
  SiteSettings,
  Notification,
};
