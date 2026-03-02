/**
 * 组件总导出索引
 */

// UI 组件
export * from './ui';

// 布局组件
export * from './layout';

// 博客组件
export * from './blog';

// 作品集组件
export * from './portfolio';

// 特效组件
export * from './effects';

// 图标
export * from './icons';

// 管理后台组件
export * from './admin';

// AI 组件
export { AIChatAssistant } from './ai/AIChatAssistant';
export { default as AIChatAssistant } from './ai/AIChatAssistant';

// 语音组件
export { VoiceSearch } from './voice/VoiceSearch';
export { default as VoiceSearch } from './voice/VoiceSearch';

// 表单组件
export { SmartFormBuilder } from './form/SmartFormBuilder';
export type { FormField, FormSchema, FieldType } from './form/SmartFormBuilder';

// 图表组件
export { DataChart, StatsGrid } from './charts/DataChart';
export type { ChartData, ChartSeries, ChartType } from './charts/DataChart';

// PWA 组件
export { PWAInstallPrompt, usePWAInstall } from './pwa/PWAInstallPrompt';

// 虚拟滚动组件
export { VirtualizedList, SimpleVirtualList, DefaultLoadMore, DefaultEmptyState } from './virtualized/VirtualizedList';

// 上传组件
export { DragDropUpload } from './upload/DragDropUpload';
export type { FileWithPreview } from './upload/DragDropUpload';

// 协作组件
export { CollaborativeEditor } from './collaborative/CollaborativeEditor';
export type { UserCursor, Comment } from './collaborative/CollaborativeEditor';

// 通知组件
export { NotificationCenter } from './notification/NotificationCenter';
export type { Notification, NotificationType, NotificationPriority } from './notification/NotificationCenter';

// 任务管理组件
export { TaskManager } from './tasks/TaskManager';
export type { Task, TaskList, TaskPriority, TaskStatus } from './tasks/TaskManager';
