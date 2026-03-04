/**
 * CyberPress Platform - New Components Index
 * 新创建的组件索引
 */

// ============ UI Components ============

export {
  SpeedDial,
} from './ui/SpeedDial';
export type { SpeedDialProps, SpeedDialAction } from './ui/SpeedDial';

export {
  BottomSheet,
} from './ui/BottomSheet';
export type { BottomSheetProps } from './ui/BottomSheet';

export {
  PullToRefresh,
} from './ui/PullToRefresh';
export type { PullToRefreshProps } from './ui/PullToRefresh';

export {
  SkeletonCard,
  BlogCardSkeleton,
  UserCardSkeleton,
  StatCardSkeleton,
  SkeletonList,
  SkeletonTable,
} from './ui/Skeleton';
export type { SkeletonCardProps, SkeletonListProps } from './ui/Skeleton';

export {
  OTPInput,
} from './ui/OTPInput';
export type { OTPInputProps } from './ui/OTPInput';

export {
  CommentItem,
} from './ui/CommentItem';
export type { CommentItemProps } from './ui/CommentItem';

export {
  RadioGroup,
} from './ui/RadioGroup';
export type { RadioGroupProps, RadioOption } from './ui/RadioGroup';

export {
  AudioPlayer,
} from './ui/AudioPlayer';
export type { AudioPlayerProps, AudioTrack } from './ui/AudioPlayer';

export {
  ProgressBar,
  CircularProgress,
} from './ui/ProgressBar';
export type { ProgressBarProps, CircularProgressProps } from './ui/ProgressBar';

// ============ Effects Components ============

export {
  MatrixBackground,
  DigitalRainBackground,
  PurpleMatrixBackground,
} from './effects/MatrixBackground';
export type { MatrixBackgroundProps } from './effects/MatrixBackground';

export {
  CyberGrid,
  PerspectiveGrid,
  GlowGrid,
  DoubleGrid,
} from './effects/CyberGrid';
export type { CyberGridProps } from './effects/CyberGrid';

// ============ Blog Components ============

export {
  NewsletterCard,
} from './blog/NewsletterCard';
export type { NewsletterCardProps } from './blog/NewsletterCard';

// ============ Additional UI Components ============

export {
  FAQ,
  FAQWithCategories,
  defaultFAQItems,
  defaultFAQCategories,
} from './ui/faq';
export type { FAQItem, FAQProps, FAQWithCategoriesProps } from './ui/faq';

export {
  Breadcrumb,
  BreadcrumbStructuredData,
  blogBreadcrumbs,
  portfolioBreadcrumbs,
  adminBreadcrumbs,
} from './ui/breadcrumb';
export type { BreadcrumbItem, BreadcrumbProps, BreadcrumbStructuredDataProps } from './ui/breadcrumb';

export {
  BackToTop,
  BackToTopWithProgress,
  BackToTopWithCircularProgress,
} from './ui/back-to-top';
export type { BackToTopProps, BackToTopWithProgressProps } from './ui/back-to-top';

export {
  LanguageSwitcher,
  CompactLanguageSwitcher,
  defaultLanguages,
} from './ui/language-switcher';
export type { Language, LanguageSwitcherProps, CompactLanguageSwitcherProps } from './ui/language-switcher';

export {
  ThemeSwitcher,
  ThemeToggle,
  AutoThemeSwitcher,
} from './ui/theme-switcher';
export type { ThemeOption, ThemeSwitcherProps, ThemeToggleProps } from './ui/theme-switcher';

export {
  TagCloud,
  TagCloud3D,
  PopularTags,
  TagInput,
} from './ui/tag-cloud';
export type { TagItem, TagCloudProps, TagCloud3DProps, PopularTagsProps, TagInputProps } from './ui/tag-cloud';

export {
  ShareButtons,
  NativeShare,
  ArticleShare,
  FloatingShare,
  platformPresets,
} from './ui/share-buttons';
export type { ShareButton, ShareButtonsProps, NativeShareProps, ArticleShareProps, FloatingShareProps } from './ui/share-buttons';

export {
  Pagination,
  SimplePagination,
  LoadMorePagination,
  InfiniteScrollTrigger,
  PageJumper,
} from './ui/pagination';
export type {
  PaginationProps,
  SimplePaginationProps,
  LoadMorePaginationProps,
  InfiniteScrollTriggerProps,
  PageJumperProps,
} from './ui/pagination';
