/**
 * CyberPress Platform - 类型定义
 * 赛博朋克平台的核心类型定义
 */

/**
 * 用户类型
 */
export interface CyberUser {
  id: string | number;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  createdAt: string;
  updatedAt: string;
}

/**
 * 文章类型
 */
export interface CyberPost {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: CyberUser;
  category: CyberCategory;
  tags: CyberTag[];
  featuredImage?: string;
  status: 'draft' | 'published' | 'pending' | 'private';
  meta: {
    views?: number;
    likes?: number;
    commentsCount?: number;
    readingTime?: number;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 分类类型
 */
export interface CyberCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  parent?: CyberCategory;
  count?: number;
  color?: string;
}

/**
 * 标签类型
 */
export interface CyberTag {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

/**
 * 评论类型
 */
export interface CyberComment {
  id: string | number;
  post: CyberPost;
  author: CyberUser;
  content: string;
  parent?: CyberComment;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
}

/**
 * 媒体类型
 */
export interface CyberMedia {
  id: string | number;
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

/**
 * 作品/项目类型
 */
export interface CyberProject {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  links: {
    demo?: string;
    repository?: string;
    live?: string;
  };
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 阅读列表项类型
 */
export interface CyberReadingItem {
  id: string | number;
  title: string;
  author: string;
  url: string;
  description?: string;
  category: string;
  status: 'to-read' | 'reading' | 'completed';
  rating?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * API 响应类型
 */
export interface CyberApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * 分页类型
 */
export interface CyberPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 分页响应类型
 */
export interface CyberPaginatedResponse<T> extends CyberApiResponse<T[]> {
  pagination: CyberPagination;
}

/**
 * 排序类型
 */
export type CyberSortOrder = 'asc' | 'desc';

export interface CyberSort {
  field: string;
  order: CyberSortOrder;
}

/**
 * 筛选类型
 */
export interface CyberFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

/**
 * 搜索查询类型
 */
export interface CyberSearchQuery {
  query: string;
  filters?: CyberFilter[];
  sort?: CyberSort;
  page?: number;
  limit?: number;
}

/**
 * 表单状态类型
 */
export type CyberFormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

/**
 * 表单错误类型
 */
export interface CyberFormErrors {
  [field: string]: string | undefined;
}

/**
 * 通知类型
 */
export type CyberNotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * 通知项类型
 */
export interface CyberNotification {
  id: string;
  type: CyberNotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  createdAt: Date;
}

/**
 * 主题类型
 */
export type CyberTheme = 'cyber-dark' | 'cyber-light' | 'cyber-neon';

/**
 * 语言类型
 */
export type CyberLanguage = 'en' | 'zh' | 'ja' | 'ko';

/**
 * 网站配置类型
 */
export interface CyberSiteConfig {
  name: string;
  description: string;
  url: string;
  logo?: string;
  icon?: string;
  theme: CyberTheme;
  language: CyberLanguage;
  features: {
    comments: boolean;
    search: boolean;
    newsletter: boolean;
    analytics: boolean;
  };
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    discord?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
  };
}

/**
 * 统计数据类型
 */
export interface CyberStats {
  visitors: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  posts: {
    total: number;
    published: number;
    draft: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
  };
  views: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

/**
 * 图表数据点类型
 */
export interface CyberChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * 图表数据类型
 */
export interface CyberChartData {
  title?: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'doughnut';
  data: CyberChartDataPoint[];
  labels?: string[];
  options?: Record<string, any>;
}

/**
 * 任务状态类型
 */
export type CyberTaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

/**
 * 任务优先级类型
 */
export type CyberTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 任务类型
 */
export interface CyberTask {
  id: string;
  title: string;
  description?: string;
  status: CyberTaskStatus;
  priority: CyberTaskPriority;
  assignee?: CyberUser;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 协作会话类型
 */
export interface CyberCollabSession {
  id: string;
  name: string;
  type: 'whiteboard' | 'document' | 'code';
  participants: CyberUser[];
  createdAt: string;
  updatedAt: string;
}

/**
 * WebSocket 消息类型
 */
export interface CyberWSMessage {
  type: 'init' | 'update' | 'sync' | 'error';
  channel: string;
  data: any;
  timestamp: string;
}

/**
 * 缓存项类型
 */
export interface CyberCacheItem<T = any> {
  key: string;
  data: T;
  expiry: number;
  createdAt: number;
}

/**
 * 性能指标类型
 */
export interface CyberPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiTime: number;
  memoryUsage: number;
  timestamp: number;
}

/**
 * 错误边界状态类型
 */
export interface CyberErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * 路由元信息类型
 */
export interface CyberRouteMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  requiresAuth?: boolean;
  roles?: string[];
  layout?: 'default' | 'minimal' | 'admin';
}

/**
 * 面包屑类型
 */
export interface CyberBreadcrumb {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

/**
 * 菜单项类型
 */
export interface CyberMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: CyberMenuItem[];
  badge?: string | number;
  disabled?: boolean;
}

/**
 * 表格列类型
 */
export interface CyberTableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

/**
 * 表格行选择类型
 */
export interface CyberTableRowSelection {
  selectedRowKeys: (string | number)[];
  onChange: (selectedRowKeys: (string | number)[]) => void;
}

/**
 * 模态框类型
 */
export interface CyberModalProps {
  visible: boolean;
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  width?: number | string;
  closable?: boolean;
}

/**
 * 下拉选项类型
 */
export interface CyberSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

/**
 * 文件上传类型
 */
export interface CyberFileUpload {
  file: File;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

/**
 * 主题颜色类型
 */
export interface CyberThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}
