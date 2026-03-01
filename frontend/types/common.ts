/**
 * 通用类型定义
 */

// 分页参数
export interface PaginationParams {
  page?: number;
  per_page?: number;
  offset?: number;
}

// 排序参数
export interface SortParams {
  orderby?: 'date' | 'modified' | 'title' | 'slug' | 'author' | 'relevance';
  order?: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams {
  search?: string;
  before?: string;
  after?: string;
}

// 过滤参数
export interface FilterParams {
  categories?: number[];
  tags?: number[];
  authors?: number[];
  exclude?: number[];
  include?: number[];
  sticky?: boolean;
}

// WordPress API 通用参数
export interface WPParams
  extends PaginationParams,
    SortParams,
    SearchParams,
    FilterParams {
  _embed?: boolean;
  _fields?: string[];
  context?: 'view' | 'embed' | 'edit';
}

// WordPress API 错误响应
export interface WPErrorResponse {
  code: string;
  message: string;
  data: {
    status?: number;
    params?: any;
  };
}

// API 响应包装
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: any;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 导航项
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
}

// 面包屑项
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// 社交链接
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color?: string;
}

// 主题配置
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

// 用户信息
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';
}

// 网站配置
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  logo?: string;
  icon?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

// SEO 配置
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  canonical?: string;
}

// 表单字段
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知配置
export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
  style?: React.CSSProperties;
  className?: string;
}

// 加载状态
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 异步状态
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// 路由配置
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
  roles?: string[];
  layout?: React.ComponentType;
}

// 断点
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// 屏幕尺寸
export interface ScreenSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
}

// 滚动位置
export interface ScrollPosition {
  x: number;
  y: number;
}

// 动画配置
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
}

// 颜色主题
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

// 尺寸
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 变体
export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
