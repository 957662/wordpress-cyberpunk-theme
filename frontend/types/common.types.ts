/**
 * 通用类型定义
 */

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
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
  hasMore: boolean;
}

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * 错误响应
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * 列表项基础类型
 */
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户基础信息
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'banned';
}

/**
 * 文件上传信息
 */
export interface UploadFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
}

/**
 * 选项类型
 */
export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: any;
}

/**
 * 树节点类型
 */
export interface TreeNode<T = any> {
  id: string | number;
  label: string;
  value?: any;
  children?: TreeNode<T>[];
  disabled?: boolean;
  expanded?: boolean;
  data?: T;
}

/**
 * 表格列配置
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

/**
 * 表格排序配置
 */
export interface TableSort {
  column: string;
  order: 'asc' | 'desc';
}

/**
 * 表格筛选配置
 */
export interface TableFilter {
  column: string;
  value: any;
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType;
}

/**
 * 菜单项
 */
export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: number | string;
  separator?: boolean;
}

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 通知配置
 */
export interface NotificationConfig {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
}

/**
 * 模态框配置
 */
export interface ModalConfig {
  title: string;
  content?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
}

/**
 * 下拉刷新配置
 */
export interface PullRefreshConfig {
  disabled?: boolean;
  threshold?: number;
  onRefresh?: () => Promise<void>;
}

/**
 * 无限滚动配置
 */
export interface InfiniteScrollConfig {
  disabled?: boolean;
  threshold?: number;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  loading?: boolean;
}

/**
 * 搜索配置
 */
export interface SearchConfig {
  placeholder?: string;
  debounce?: number;
  onSearch?: (keyword: string) => void;
  onChange?: (keyword: string) => void;
}

/**
 * 权限定义
 */
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  condition?: string;
}

/**
 * 角色定义
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  borderRadius: number;
  fontSize: 'small' | 'medium' | 'large';
}

/**
 * 语言配置
 */
export interface LocaleConfig {
  language: string;
  region: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
  };
}

/**
 * 图表数据点
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

/**
 * 图表配置
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: ChartDataPoint[];
  title?: string;
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  legend?: boolean;
  grid?: boolean;
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * 拖拽配置
 */
export interface DragConfig {
  disabled?: boolean;
  axis?: 'x' | 'y' | 'both';
  bounds?: string | HTMLElement;
  onDragStart?: (e: MouseEvent) => void;
  onDrag?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
}

/**
 * 调整大小配置
 */
export interface ResizeConfig {
  disabled?: boolean;
  axis?: 'x' | 'y' | 'both';
  minSize?: { width?: number; height?: number };
  maxSize?: { width?: number; height?: number };
  onResizeStart?: (e: MouseEvent) => void;
  onResize?: (e: MouseEvent) => void;
  onResizeEnd?: (e: MouseEvent) => void;
}

/**
 * 键盘快捷键配置
 */
export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (e: KeyboardEvent) => void;
  description?: string;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}
