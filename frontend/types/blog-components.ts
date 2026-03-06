/**
 * Blog Component Types
 *
 * Type definitions for blog-related components
 */

import { ReactNode } from 'react';

// ============================================================================
// Comment System Types
// ============================================================================

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: string;
}

export interface CommentSystemProps {
  postId: string | number;
  comments?: Comment[];
  onAddComment?: (content: string, parentId?: string) => Promise<Comment>;
  onLikeComment?: (commentId: string) => void;
  className?: string;
}

// ============================================================================
// Share Button Types
// ============================================================================

export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'email' | 'whatsapp' | 'link';

export interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
  platforms?: SharePlatform[];
  variant?: 'default' | 'minimal' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================================================
// Reading Progress Types
// ============================================================================

export interface ReadingProgressProps {
  position?: 'top' | 'bottom';
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  size?: 'thin' | 'medium' | 'thick';
  showPercentage?: boolean;
  className?: string;
}

export interface CircularReadingProgressProps {
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  fixed?: boolean;
  className?: string;
}

export interface EstimatedReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  variant?: 'text' | 'badge' | 'card';
  className?: string;
}

// ============================================================================
// Related Posts Types
// ============================================================================

import type { BlogPost } from './models/blog';

export interface RelatedPostsProps {
  currentPostId?: string | number;
  posts: BlogPost[];
  type?: 'related' | 'popular' | 'latest';
  limit?: number;
  layout?: 'grid' | 'list' | 'cards';
  className?: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  className?: string;
}

// ============================================================================
// Search Bar Types
// ============================================================================

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export interface AdvancedSearchBarProps extends SearchBarProps {
  categories?: Array<{ id: number; name: string; slug: string }>;
  tags?: Array<{ id: number; name: string; slug: string }>;
  onCategoryChange?: (category: string) => void;
  onTagChange?: (tag: string) => void;
  selectedCategory?: string;
  selectedTag?: string;
}

// ============================================================================
// Category Filter Types
// ============================================================================

export interface CategoryFilterProps {
  categories: Array<{ id: number; name: string; slug: string; count?: number }>;
  selectedCategory?: string;
  onCategoryChange: (slug: string) => void;
  variant?: 'list' | 'cloud' | 'select';
  className?: string;
}

// ============================================================================
// Empty State Types
// ============================================================================

export interface EmptyStateProps {
  type: 'no-posts' | 'no-results' | 'no-data' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// ============================================================================
// Loading State Types
// ============================================================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export interface ArticleSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'compact';
  className?: string;
}

// ============================================================================
// Blog Card Types
// ============================================================================

export interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showCategory?: boolean;
  className?: string;
}

export interface BlogCardAdaptiveProps extends Omit<BlogCardProps, 'post'> {
  post: any; // Can be WordPress format or BlogPost format
}

// ============================================================================
// Blog Grid Types
// ============================================================================

export interface BlogGridProps {
  posts: BlogPost[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

// ============================================================================
// Blog List Types
// ============================================================================

export interface BlogListProps {
  posts: BlogPost[];
  variant?: 'default' | 'compact' | 'detailed';
  showDivider?: boolean;
  className?: string;
}

// ============================================================================
// Article Types
// ============================================================================

export interface ArticleHeaderProps {
  title: string;
  excerpt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt?: string;
  readingTime?: number;
  category?: {
    name: string;
    slug: string;
  };
  featuredImage?: string;
  className?: string;
}

export interface ArticleContentProps {
  content: string;
  className?: string;
}

export interface ArticleFooterProps {
  tags?: Array<{ id: number; name: string; slug: string }>;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  onShare?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  className?: string;
}

// ============================================================================
// Meta Types
// ============================================================================

export interface ArticleMetaProps {
  date?: string;
  author?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  comments?: number;
  className?: string;
}

export interface ArticleMetaDisplayProps extends ArticleMetaProps {
  showDate?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showViews?: boolean;
  showLikes?: boolean;
  showComments?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface ArticleNavigationProps {
  previousPost?: {
    title: string;
    slug: string;
  };
  nextPost?: {
    title: string;
    slug: string;
  };
  onNavigate?: (slug: string) => void;
  className?: string;
}

// ============================================================================
// Author Types
// ============================================================================

export interface AuthorCardProps {
  author: {
    id: number;
    name: string;
    avatar?: string;
    bio?: string;
  };
  postCount?: number;
  className?: string;
}

export interface AuthorBioProps extends AuthorCardProps {
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// ============================================================================
// Tag Types
// ============================================================================

export interface TagCloudProps {
  tags: Array<{ id: number; name: string; slug: string; count?: number }>;
  maxCount?: number;
  onTagClick?: (slug: string) => void;
  className?: string;
}

export interface TagListProps {
  tags: Array<{ id: number; name: string; slug: string }>;
  variant?: 'default' | 'pill' | 'link';
  onTagClick?: (slug: string) => void;
  className?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type BlogComponentProps<T = any> = {
  className?: string;
  children?: ReactNode;
} & T;

export type WithLoading<T> = T & {
  loading?: boolean;
  loadingComponent?: ReactNode;
};

export type WithError<T> = T & {
  error?: string | null;
  errorComponent?: ReactNode;
};

export type WithEmpty<T> = T & {
  empty?: boolean;
  emptyComponent?: ReactNode;
};
