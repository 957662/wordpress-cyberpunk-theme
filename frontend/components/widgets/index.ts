/**
 * Widget 组件导出
 */

export { Widget } from './base/Widget';
export type { WidgetProps } from './base/Widget';

export { RecentPostsWidget } from './RecentPostsWidget';
export type { RecentPostsWidgetProps } from './RecentPostsWidget';

export { TagCloudWidget } from './TagCloudWidget';
export type { TagCloudWidgetProps, Tag } from './TagCloudWidget';

export { CategoryWidget } from './CategoryWidget';
export type { CategoryWidgetProps, Category } from './CategoryWidget';

export { SearchWidget } from './SearchWidget';
export type { SearchWidgetProps } from './SearchWidget';

export { AuthorWidget } from './AuthorWidget';
export type { AuthorWidgetProps, Author } from './AuthorWidget';

// 新创建的小部件
export { StatsWidget } from './StatsWidget';
export type { StatItem, StatsWidgetProps } from './StatsWidget';

export { ClockWidget } from './ClockWidget';
export type { ClockWidgetProps } from './ClockWidget';

// 扩展 Widget 组件
export { CalendarWidget } from './CalendarWidget';
export type { CalendarWidgetProps } from './CalendarWidget';

export { SocialLinksWidget } from './SocialLinksWidget';
export type { SocialLinksWidgetProps, SocialLink, SocialPlatform } from './SocialLinksWidget';

export { NewsletterWidget } from './NewsletterWidget';
export type { NewsletterWidgetProps } from './NewsletterWidget';

export { PopularPostsWidget } from './PopularPostsWidget';
export type { PopularPostsWidgetProps } from './PopularPostsWidget';

export { RelatedPostsWidget } from './RelatedPostsWidget';
export type { RelatedPostsWidgetProps } from './RelatedPostsWidget';
