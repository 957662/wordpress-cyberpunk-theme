/**
 * Blog Component Types
 *
 * Shared TypeScript types and interfaces for blog components.
 */

// ============================================================================
// Blog Post Types
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
  likes?: number;
  isLiked?: boolean;
  status?: 'pending' | 'approved' | 'spam';
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}

// ============================================================================
// Table of Contents Types
// ============================================================================

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  type: 'post' | 'page' | 'category' | 'tag';
  category?: string;
  tags?: string[];
  publishedAt?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'latest' | 'popular';
}

// ============================================================================
// Related Posts Types
// ============================================================================

export interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
  maxCount?: number;
  className?: string;
}

// ============================================================================
// Social Actions Types
// ============================================================================

export interface SocialActionsProps {
  postId: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  initialBookmarks?: number;
  initialIsBookmarked?: boolean;
  initialComments?: number;
  className?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

// ============================================================================
// Code Highlighter Types
// ============================================================================

export interface CodeBlock {
  code: string;
  language: string;
  filename?: string;
}

export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'bash'
  | 'css'
  | 'json'
  | 'markdown'
  | 'jsx'
  | 'tsx'
  | 'html'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'sql';

// ============================================================================
// Blog List Types
// ============================================================================

export type ViewMode = 'grid' | 'list';
export type SortBy = 'latest' | 'popular' | 'trending' | 'oldest';

export interface BlogListProps {
  posts?: BlogPost[];
  loading?: boolean;
  viewMode?: ViewMode;
  sortBy?: SortBy;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

// ============================================================================
// Blog Layout Types
// ============================================================================

export interface PostHeaderProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  readingTime: number;
  views?: number;
  category?: string;
  tags?: string[];
  onBack?: () => void;
  onShare?: () => void;
}

export interface PostContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface PostFooterProps {
  author?: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      website?: string;
    };
  };
  tags?: string[];
  relatedPosts?: BlogPost[];
  className?: string;
}

// ============================================================================
// Reading Progress Types
// ============================================================================

export interface ReadingProgressProps {
  className?: string;
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
}

// ============================================================================
// Form Types
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  preferences?: string[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BlogPostsResponse extends PaginatedResponse<BlogPost> {}

export interface CommentsResponse extends PaginatedResponse<Comment> {}

// ============================================================================
// Filter Types
// ============================================================================

export interface CategoryFilter {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface TagFilter {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// ============================================================================
// Stats Types
// ============================================================================

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topPosts: BlogPost[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'comment' | 'like' | 'bookmark' | 'share';
  post: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ComponentBaseProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}
