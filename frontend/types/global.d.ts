/**
 * 全局类型定义
 */

// ============ React 类型扩展 ============
interface Window {
  // 添加自定义窗口属性
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
  __CYBERPRESS__?: {
    version: string;
    env: 'development' | 'production' | 'test';
  };
}

// ============ Node.js 全局类型 ============
declare namespace NodeJS {
  interface ProcessEnv {
    // 环境变量类型定义
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_WORDPRESS_URL?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
  }
}

// ============ 通用类型 ============

/**
 * 可选类型：将 T 的所有属性变为可选
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * 必需类型：将 T 的所有属性变为必需
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * 只读类型：将 T 的所有属性变为只读
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * 提取类型：从 T 中提取 K 属性
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * 排除类型：从 T 中排除 K 属性
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 可空类型
 */
export type Nullable<T> = T | null;

/**
 * 可选或可空类型
 */
export type Optional<T> = T | null | undefined;

/**
 * 异步函数类型
 */
export type AsyncFunction<T extends any[] = any[], R = any> = (
  ...args: T
) => Promise<R>;

/**
 * 同步或异步函数类型
 */
export type MaybeAsyncFunction<T extends any[] = any[], R = any> = (
  ...args: T
) => R | Promise<R>;

/**
 * 事件处理器类型
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * 变更处理器类型
 */
export type ChangeHandler<T = any> = (value: T) => void;

// ============ 组件类型 ============

/**
 * 基础组件属性
 */
export interface BaseProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * 可视组件属性
 */
export interface VisibleProps extends BaseProps {
  visible?: boolean;
  hidden?: boolean;
}

/**
 * 布局组件属性
 */
export interface LayoutProps extends BaseProps {
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
}

/**
 * 颜色变体类型
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'light'
  | 'dark';

/**
 * 尺寸变体类型
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 组件变体类型
 */
export type ComponentVariant = 'default' | 'filled' | 'outline' | 'ghost' | 'link';

// ============ API 类型 ============

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * 分页参数类型
 */
export interface PaginationParams {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 错误类型
 */
export interface AppError {
  code: string;
  message: string;
  status?: number;
  details?: any;
  stack?: string;
}

// ============ 状态管理类型 ============

/**
 * Redux/状态管理通用类型
 */
export interface State<T = any> {
  data: T;
  loading: boolean;
  error: AppError | null;
}

/**
 * 分页状态类型
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ============ 表单类型 ============

/**
 * 表单字段类型
 */
export type FieldValue = string | number | boolean | Date | FileList | null;

/**
 * 表单字段错误类型
 */
export interface FieldErrors<T = any> {
  [K in keyof T]?: string[];
}

/**
 * 表单状态类型
 */
export interface FormState<T = any> {
  values: T;
  errors: FieldErrors<T>;
  touched: { [K in keyof T]?: boolean };
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
}

/**
 * 表单验证规则类型
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

/**
 * 表单字段配置类型
 */
export interface FieldConfig {
  label?: string;
  placeholder?: string;
  helpText?: string;
  rules?: ValidationRule;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'file' | 'select' | 'textarea';
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  hidden?: boolean;
}

// ============ 用户类型 ============

/**
 * 用户类型
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

/**
 * 认证状态类型
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

// ============ 主题类型 ============

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 主题配置类型
 */
export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'sharp' | 'rounded' | 'circular';
  animations: boolean;
}

// ============ 路由类型 ============

/**
 * 路由配置类型
 */
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  auth?: boolean;
  roles?: string[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * 面包屑类型
 */
export interface Breadcrumb {
  title: string;
  path?: string;
  icon?: string;
}

// ============ 文件类型 ============

/**
 * 文件上传类型
 */
export interface FileUpload {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * 图片类型
 */
export interface Image {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

// ============ 通知类型 ============

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 通知配置类型
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============ 杂项类型 ============

/**
 * 键值对类型
 */
export type KeyValue<T = any> = Record<string, T>;

/**
 * ID 类型
 */
export type ID = string | number;

/**
 * 时间戳类型
 */
export type Timestamp = number | string | Date;

/**
 * JSON 类型
 */
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

// ============ 导出所有类型 ============
export type {
  Window,
  Partial,
  Required,
  Readonly,
  Pick,
  Omit,
  Nullable,
  Optional,
  AsyncFunction,
  MaybeAsyncFunction,
  EventHandler,
  ChangeHandler,
  BaseProps,
  VisibleProps,
  LayoutProps,
  ColorVariant,
  SizeVariant,
  ComponentVariant,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  AppError,
  State,
  PaginationState,
  FieldValue,
  FieldErrors,
  FormState,
  ValidationRule,
  FieldConfig,
  User,
  AuthState,
  ThemeMode,
  ThemeConfig,
  RouteConfig,
  Breadcrumb,
  FileUpload,
  Image,
  NotificationType,
  Notification,
  KeyValue,
  ID,
  Timestamp,
  JSONValue,
  JSONObject,
  JSONArray,
};
