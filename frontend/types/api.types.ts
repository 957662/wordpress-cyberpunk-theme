/**
 * API 相关类型定义
 */

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}

/**
 * API 错误信息
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

/**
 * 响应元数据
 */
export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
  timestamp?: string;
  requestId?: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 排序参数
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 筛选参数
 */
export interface FilterParams {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 列表查询参数
 */
export interface ListQueryParams extends PaginationParams, SortParams, FilterParams {}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

/**
 * 认证令牌
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: 'Bearer';
}

/**
 * 登录请求
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username?: string;
}

/**
 * 密码重置请求
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * 密码重置确认
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

/**
 * 更新密码请求
 */
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 搜索结果
 */
export interface SearchResult<T = any> {
  id: string;
  type: string;
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  score: number;
  data?: T;
}

/**
 * 搜索响应
 */
export interface SearchResponse<T = any> {
  results: SearchResult<T>[];
  total: number;
  query: string;
  facets?: Record<string, Array<{ value: string; count: number }>>;
}

/**
 * 文件上传响应
 */
export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

/**
 * 批量操作请求
 */
export interface BatchOperationRequest {
  ids: string[];
  action: 'delete' | 'publish' | 'unpublish' | 'archive';
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse {
  success: number;
  failed: number;
  errors?: Array<{ id: string; error: string }>;
}

/**
 * 统计数据点
 */
export interface StatsDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * 统计摘要
 */
export interface StatsSummary {
  total: number;
  change?: number;
  changePercent?: number;
  period?: string;
}

/**
 * 站点统计
 */
export interface SiteStats {
  posts: StatsSummary;
  comments: StatsSummary;
  views: StatsSummary;
  users: StatsSummary;
  trends?: {
    views: StatsDataPoint[];
    visitors: StatsDataPoint[];
  };
}

/**
 * 通知信息
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}

/**
 * WebSocket 消息
 */
export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

/**
 * 健康检查响应
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version?: string;
  services?: Record<string, boolean>;
  uptime?: number;
}

/**
 * 配置信息
 */
export interface AppConfig {
  siteName: string;
  siteUrl: string;
  siteDescription?: string;
  logo?: string;
  icon?: string;
  features: {
    comments: boolean;
    registration: boolean;
    newsletter: boolean;
    search: boolean;
    analytics: boolean;
  };
  limits: {
    maxUploadSize: number;
    maxPostsPerPage: number;
    maxCommentsPerPage: number;
  };
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
}
