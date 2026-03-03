/**
 * 新功能组件导出索引
 * 导出所有新创建的高级组件和服务
 */

// ========== 编辑器组件 ==========
export { AdvancedEditor } from '../editor/AdvancedEditor';
export type { EditorMode, EditorContent, AdvancedEditorProps } from '../editor/AdvancedEditor';

// ========== 协作组件 ==========
export { RealtimeEditor } from '../collaborative/RealtimeEditor';
export type { Collaborator, Comment, Operation, RealtimeEditorProps } from '../collaborative/RealtimeEditor';

// ========== 数据分析组件 ==========
export { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
export type { ChartType, TimeRange, MetricCard, ChartWidget, DashboardConfig, AnalyticsDashboardProps } from '../analytics/AnalyticsDashboard';

// ========== 文件上传组件 ==========
export { AdvancedFileManager } from '../upload/AdvancedFileManager';
export type { FileView, SortBy, FilterType, FileManagerFile, FolderItem, FileManagerProps } from '../upload/AdvancedFileManager';

// ========== WebSocket 服务 ==========
export {
  createWebSocket,
  useWebSocket,
  WebSocketService,
} from '@/lib/services/websocket';
export type {
  WebSocketMessage,
  WebSocketConfig,
  WebSocketState,
  WebSocketEventHandler,
} from '@/lib/services/websocket';

// ========== 国际化服务 ==========
export {
  getI18nService,
  useI18n,
  I18nService,
} from '@/lib/services/i18n-advanced';
export type {
  Locale,
  TranslationNamespace,
  LocaleConfig,
  I18nConfig,
  PluralRule,
} from '@/lib/services/i18n-advanced';

// ========== 新增 UI 组件 ==========
export { QuickView, QuickViewCard } from '../ui/quick-view';
export { MasonryGrid, SimpleMasonryGrid, MasonryItem } from '../ui/masonry-grid';
export { CommandPalette } from '../ui/command-palette';

export type {
  QuickViewProps,
  QuickViewCardProps,
} from '../ui/quick-view';

// ========== 重新导出常用类型 ==========
export type { Metadata } from 'next';
