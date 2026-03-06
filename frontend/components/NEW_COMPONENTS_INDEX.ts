/**
 * 新创建的组件导出索引
 * Newly Created Components Export Index
 *
 * 创建日期: 2026-03-06
 */

// ==================== 图片库组件 ====================
export {
  LightboxGallery,
  GalleryGrid,
} from './image-gallery/LightboxGallery';

// ==================== 评分组件 ====================
export {
  StarRating,
  RatingCard,
  ReviewCard,
} from './rating/StarRating';

// ==================== 时间线组件 ====================
export {
  Timeline,
  MilestoneTimeline,
} from './timeline/Timeline';

export type { TimelineEvent } from './timeline/Timeline';

// ==================== 统计卡片组件 ====================
export {
  StatCard,
  StatGrid,
  StatProgress,
} from './dashboard-stats/StatCards';

// ==================== 待办事项组件 ====================
export { TodoList } from './tasks/TodoList';

export type { TodoItem } from './tasks/TodoList';

// ==================== 高级搜索组件 ====================
export { AdvancedSearch } from './search-advanced/AdvancedSearch';

export type { SearchFilter } from './search-advanced/AdvancedSearch';

/**
 * 使用示例:
 *
 * import { LightboxGallery, StarRating, Timeline, StatCard, TodoList, AdvancedSearch } from '@/components';
 */
