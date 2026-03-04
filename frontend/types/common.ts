/**
 * 通用类型定义
 */

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  code?: number;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 通用实体接口
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 错误类型
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

/**
 * 表单字段类型
 */
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | undefined;
  };
}

/**
 * 选择器选项类型
 */
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * 下拉菜单项类型
 */
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
}

/**
 * 面包屑导航类型
 */
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

/**
 * 表格列定义类型
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

/**
 * 排序类型
 */
export interface SortOption {
  key: string;
  label: string;
  value: string;
}

/**
 * 过滤器类型
 */
export interface FilterOption {
  key: string;
  label: string;
  value: any;
  type: 'select' | 'multiselect' | 'range' | 'date';
}

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'cyber';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';

/**
 * 用户状态
 */
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending';

/**
 * 内容状态
 */
export type ContentStatus = 'draft' | 'published' | 'archived' | 'deleted';

/**
 * 权限类型
 */
export type Permission = string;

/**
 * 角色类型
 */
export type Role = 'admin' | 'editor' | 'author' | 'user' | 'guest';
