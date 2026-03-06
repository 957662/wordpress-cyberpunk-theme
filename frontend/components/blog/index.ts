/**
 * Blog Components - Unified Export
 *
 * Central export point for all blog-related components
 */

// ============================================================================
// Core Components
// ============================================================================

export { BlogCardAdaptive } from './BlogCardAdaptive';
export { default as BlogCardAdaptive } from './BlogCardAdaptive';

export { BlogPageClient } from './BlogPageClient';
export { default as BlogPageClient } from './BlogPageClient';

// ============================================================================
// New Components
// ============================================================================

export { CommentSystem } from './CommentSystem';
export { default as CommentSystem } from './CommentSystem';

export { RelatedPosts } from './RelatedPosts';
export { default as RelatedPosts } from './RelatedPosts';

export {
  ShareButtons,
  FloatingShareButton,
} from './ShareButtons';
export { default as ShareButtons } from './ShareButtons';

export {
  ReadingProgress,
  CircularReadingProgress,
  EstimatedReadingTime,
} from './ReadingProgress';
export { default as ReadingProgress } from './ReadingProgress';

// ============================================================================
// Existing Components (for convenience)
// ============================================================================

export { BlogGrid } from './BlogGrid';
export { BlogList } from './BlogList';
export { ArticleCard } from './ArticleCard';
export { ArticleHeader } from './ArticleHeader';
export { ArticleContent } from './ArticleContent';
export { ArticleFooter } from './ArticleFooter';
export { ArticleMeta } from './ArticleMeta';
export { ArticleMetaDisplay } from './ArticleMetaDisplay';
export { ArticleNavigation } from './ArticleNavigation';
export { AuthorCard } from './AuthorCard';
export { AuthorBio } from './AuthorBio';
export { AuthorProfile } from './AuthorProfile';

// ============================================================================
// Utility Components
// ============================================================================

export { CategoryFilter } from './CategoryFilter';
export { Pagination } from './Pagination';
export { SearchBar } from './SearchBar';
export { EmptyState } from './EmptyState';
export { LoadingSpinner } from './LoadingSpinner';

// ============================================================================
// Types
// ============================================================================

export type {
  Comment,
  CommentSystemProps,
  ShareButtonsProps,
  SharePlatform,
  ReadingProgressProps,
  CircularReadingProgressProps,
  EstimatedReadingTimeProps,
  RelatedPostsProps,
  PaginationProps,
  SimplePaginationProps,
  SearchBarProps,
  AdvancedSearchBarProps,
  CategoryFilterProps,
  EmptyStateProps,
  LoadingSpinnerProps,
  ArticleSkeletonProps,
  BlogCardProps,
  BlogCardAdaptiveProps,
  BlogGridProps,
  BlogListProps,
  ArticleHeaderProps,
  ArticleContentProps,
  ArticleFooterProps,
  ArticleMetaProps,
  ArticleMetaDisplayProps,
  ArticleNavigationProps,
  AuthorCardProps,
  AuthorBioProps,
  TagCloudProps,
  TagListProps,
  BlogComponentProps,
  WithLoading,
  WithError,
  WithEmpty,
} from '@/types/blog-components';
