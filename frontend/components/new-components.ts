/**
 * 新组件统一导出
 * 包含所有最新创建的组件
 */

// AI 相关组件
export { AIAssistant } from './ai/AIAssistant';
export type { Message, AIAssistantProps } from './ai/AIAssistant';

// UI 组件
export { RealtimeNotification } from './ui/RealtimeNotification';
export type {
  Notification,
  NotificationType,
  RealtimeNotificationProps,
} from './ui/RealtimeNotification';
export {
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
} from './ui/RealtimeNotification';

export { PerformanceMonitor } from './ui/PerformanceMonitor';
export type {
  PerformanceMetrics,
  PerformanceMonitorProps,
} from './ui/PerformanceMonitor';

export { CyberBadge } from './ui/CyberBadge';
export type { CyberBadgeProps } from './ui/CyberBadge';

// Hooks
export { useCollaboration } from '../hooks/useCollaboration';
export type {
  Collaborator,
  CollaborationOperation,
  UseCollaborationOptions,
  UseCollaborationReturn,
} from '../hooks/useCollaboration';

export { useGeolocation } from '../hooks/useGeolocation';
export type {
  GeolocationState,
  UseGeolocationOptions,
  UseGeolocationReturn,
} from '../hooks/useGeolocation';

// 服务
export { default as collaborationService } from '../lib/services/collaboration-service';
export type {
  Collaborator as ServiceCollaborator,
  TextOperation,
  CollaborationOperation as ServiceCollaborationOperation,
  DocumentState,
} from '../lib/services/collaboration-service';

// 工具函数
export * from '../lib/utils/performance-utils-new';

// 页面
export { default as AIAssistantPage } from '../app/ai-assistant/page';
