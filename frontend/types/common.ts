/**
 * Common Types
 * 通用类型定义
 */

// 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  code?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 错误类型
export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
  details?: any;
}

// 文件类型
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// 选项类型
export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: any;
}

// 颜色主题
export type ColorTheme = 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';

// 组件尺寸
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 组件变体
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// 方向
export type Direction = 'horizontal' | 'vertical';

// 对齐方式
export type Alignment = 'left' | 'center' | 'right' | 'justify';

// 位置
export type Position = 'top' | 'bottom' | 'left' | 'right';

// 加载状态
export interface LoadingState {
  isLoading: boolean;
  error?: Error | string;
  data?: any;
}

// 表单字段
export interface FieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  [key: string]: any;
}

// 列表项
export interface ListItem {
  id: string | number;
  title: string;
  description?: string;
  icon?: string | React.ComponentType;
  action?: React.ReactNode;
  [key: string]: any;
}

// 标签
export interface Tag {
  id: string | number;
  name: string;
  slug?: string;
  count?: number;
  color?: string;
}

// 分类
export interface Category {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  count?: number;
  icon?: string;
  parent?: string | number;
}

// 用户
export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  bio?: string;
  website?: string;
  [key: string]: any;
}

// 评论
export interface Comment {
  id: string | number;
  author: User;
  content: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  parentId?: string | number;
  replies?: Comment[];
  [key: string]: any;
}

// 元数据
export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  [key: string]: any;
}

// 面包屑
export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: string | React.ComponentType;
}

// 导航项
export interface NavItem {
  label: string;
  href?: string;
  icon?: string | React.ComponentType;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
  [key: string]: any;
}

// 社交链接
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color?: string;
}

// 配置
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  logo?: string;
  favicon?: string;
  ogImage?: string;
  social?: SocialLink[];
  navigation?: NavItem[];
  footer?: {
    copyright?: string;
    links?: NavItem[];
  };
  [key: string]: any;
}
