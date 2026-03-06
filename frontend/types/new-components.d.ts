/**
 * 新组件类型定义
 */

// AI 助手类型
export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIAssistantConfig {
  apiUrl: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// 实时通知类型
export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationOptions {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: NotificationAction;
}

// 性能监控类型
export interface PerformanceData {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  renderTime?: number;
  fps?: number;
  memoryUsage?: number;
}

export interface PerformanceRating {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  color: string;
}

// 协作类型
export interface CollaboratorCursor {
  x: number;
  y: number;
}

export interface CollaboratorSelection {
  start: number;
  end: number;
}

export interface CollaboratorState {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: CollaboratorCursor;
  selection?: CollaboratorSelection;
  isOnline: boolean;
  lastSeen: Date;
}

export interface DocumentUpdate {
  documentId: string;
  version: number;
  operations: TextOperation[];
  timestamp: number;
}

export interface TextOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
}

// 地理位置类型
export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// WebSocket 类型
export interface WebSocketMessage {
  type: string;
  data?: any;
  id?: string;
  timestamp?: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
}

// 事件类型
export interface EventCallback<T = any> {
  (data: T): void;
}

export interface EventBusEvents {
  [key: string]: EventCallback[];
}

// 工具类型
export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 组件 Props 类型
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export interface AnimatedComponentProps extends BaseComponentProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
}

// 表单类型
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: any;
  onChange?: (value: any) => void;
}

export interface FormOptions {
  initialValues?: Record<string, any>;
  validate?: (values: Record<string, any>) => Record<string, string> | Promise<Record<string, string>>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

// 数据类型
export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 主题类型
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  border: string;
  radius: string;
  shadow: string;
}

export interface ThemeColors {
  cyan: string;
  purple: string;
  pink: string;
  yellow: string;
  green: string;
  orange: string;
  dark: string;
  darker: string;
  black: string;
  muted: string;
  card: string;
  border: string;
}

// 动画类型
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string | string[];
  repeat?: number | Infinity;
  repeatType?: 'loop' | 'reverse' | 'mirror';
}

export interface TransitionConfig extends AnimationConfig {
  type?: 'tween' | 'spring' | 'keyframes';
  stiffness?: number;
  damping?: number;
  mass?: number;
}

// 布局类型
export interface LayoutConfig {
  container: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  center?: boolean;
}

export interface GridConfig {
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

// 响应式类型
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// 时间类型
export interface TimeAgo {
  value: number;
  unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  formatted: string;
}

export interface CountdownConfig {
  endTime: Date | string | number;
  onTick?: (time: TimeAgo) => void;
  onComplete?: () => void;
}

// 拖拽类型
export interface DragData {
  type: string;
  id: string;
  data?: any;
}

export interface DropZoneConfig {
  accept?: string[];
  multiple?: boolean;
  maxSize?: number;
  onDrop?: (files: File[]) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}

// 虚拟滚动类型
export interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
}
