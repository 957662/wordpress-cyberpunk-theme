/**
 * API 通用类型定义
 */

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

/**
 * 验证错误类型
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API 请求配置
 */
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  headers?: HeadersInit;
}

/**
 * 上传进度回调
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * 上传响应类型
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

/**
 * 批量操作结果
 */
export interface BatchOperationResult<T = any> {
  success: T[];
  failed: Array<{ item: T; error: string }>;
  total: number;
  success_count: number;
  failed_count: number;
}

/**
 * 排序选项
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 排序参数
 */
export interface SortParams {
  field: string;
  order: SortOrder;
}

/**
 * 筛选参数
 */
export interface FilterParams {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

/**
 * 查询构建器
 */
export interface QueryBuilder {
  page?: number;
  per_page?: number;
  sort?: SortParams;
  filters?: FilterParams[];
  search?: string;
  fields?: string[];
}

/**
 * 统计数据类型
 */
export interface StatsData {
  total: number;
  today?: number;
  this_week?: number;
  this_month?: number;
  growth_rate?: number;
}

/**
 * 时间范围
 */
export type DateRange = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

/**
 * 自定义日期范围
 */
export interface CustomDateRange {
  start: string;
  end: string;
}

/**
 * 通知类型
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * 通知数据
 */
export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  data?: Record<string, any>;
}

/**
 * 导出配置
 */
export interface ExportConfig {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  fields?: string[];
  filters?: FilterParams[];
  date_range?: DateRange | CustomDateRange;
}

/**
 * 导出结果
 */
export interface ExportResult {
  download_url: string;
  filename: string;
  size: number;
  created_at: string;
  expires_at: string;
}
