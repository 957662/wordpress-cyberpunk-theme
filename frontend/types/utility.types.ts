/**
 * 实用工具组件类型定义
 */

// 文章类型
export interface Article {
  id: string | number;
  title: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  publishedAt?: string | Date;
  readingTime?: number;
  category?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  views?: number;
}

// 通知类型
export type NotificationType =
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'follow'
  | 'system'
  | 'mention'
  | 'reply';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read?: boolean;
  avatar?: string;
  actionUrl?: string;
}

// 状态类型
export type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'banned';

// 标签类型
export interface Tag {
  id: string;
  name: string;
  count?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

// 时间轴事件类型
export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  status?: 'completed' | 'pending' | 'error';
  icon?: React.ReactNode;
  details?: Array<{
    label: string;
    value: string;
  }>;
}

// 搜索建议类型
export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'history' | 'trending' | 'suggestion';
}

// 统计卡片数据类型
export interface StatData {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

// 分页类型
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 分页 API 响应类型
export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  success: boolean;
  message?: string;
}
