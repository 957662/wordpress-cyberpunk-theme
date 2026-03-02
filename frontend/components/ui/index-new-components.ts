/**
 * 新创建组件索引
 * 导出所有新创建的UI组件
 */

// 通知系统
export {
  NotificationProvider,
  useNotification,
  notification,
} from './NotificationSystem';
export type { Notification, NotificationType, NotificationAction } from './NotificationSystem';

// 表单验证器
export {
  FormValidator,
  FormField,
  FieldError,
  SubmitButton,
  rules,
} from './FormValidator';
export type { FieldValidation, ValidationResult } from './FormValidator';

// 定价卡片
export {
  PricingCard,
  PricingComparison,
  PricingToggle,
} from './PricingCard';
export type { PricingFeature, PricingPlan } from './PricingCard';

// 投票组件
export {
  PollComponent,
  PollList,
  PollResults,
} from './PollComponent';
export type { PollOption } from './PollComponent';

// 测验组件
export { QuizComponent } from './QuizComponent';
export type { QuizQuestion, QuestionType, QuizOption } from './QuizComponent';

// 标签管理器
export {
  TagManager,
  TagSelector,
  TagCloud,
} from './TagManager';
export type { Tag } from './TagManager';

// 搜索过滤器
export {
  SearchFilter,
  QuickFilter,
} from './SearchFilter';
export type { FilterField, FilterType, FilterOption, SortOption } from './SearchFilter';

// 增强评论系统
export { CommentSystemEnhanced } from './CommentSystemEnhanced';
export type { Comment } from './CommentSystemEnhanced';

// 看板管理
export { KanbanBoard } from './KanbanBoard';
export type { Task, Column } from './KanbanBoard';

// Hooks
export { useDebounce, useDebouncedCallback } from '../hooks/useDebounce';
export { useLocalStorage, useLocalStorageMulti } from '../hooks/useLocalStorage';
export { useClickOutside, useDoubleClickOutside } from '../hooks/useClickOutside';
export {
  useMediaQuery,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useMinWidth,
  useMaxWidth,
  useDarkMode,
  useReducedMotion,
} from '../hooks/useMediaQuery';
export { useClipboard, useClipboardRead } from '../hooks/useClipboard';
export { useImageUpload, useMultipleImageUpload } from '../hooks/useImageUpload';
