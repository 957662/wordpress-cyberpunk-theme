/**
 * 全局类型定义
 */

// 导出所有类型定义
export * from './blog.types';
export * from './api.types';

// 路由相关
export type Route = '/' | '/blog' | '/blog/[slug]' | '/portfolio' | '/portfolio/[slug]' | '/about';

// API 响应
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 主题
export type Theme = 'cyber' | 'neon' | 'matrix';

// 颜色
export type CyberColor = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';

// 组件尺寸
export type Size = 'sm' | 'md' | 'lg' | 'xl';

// 组件变体
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// SEO
export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

// 导航项
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
}

// 面包屑
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// 表格
export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T, index: number) => void;
}

// 通知
export interface NotificationProps {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

// 加载状态
export interface LoadingState {
  isLoading: boolean;
  error?: Error | string;
  data?: any;
}

// 表单
export interface FormField {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean | string;
  };
}

// 图片
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

// 社交链接
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// 配置
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  navigation: NavItem[];
  footer: {
    copyright: string;
    links: NavItem[];
  };
}
