/**
 * 博客组件统一导出
 *
 * 这个文件统一导出所有博客组件，并确保使用正确的导入路径
 *
 * @example
 * ```tsx
 * import { BlogCard, BlogList, BlogGrid } from '@/components/blog';
 * ```
 */

// ========== 核心组件（推荐使用）==========

// 统一组件 - 支持多种数据格式
export { BlogCardUnified } from './BlogCardUnified';
export type { BlogCardUnifiedProps } from './BlogCardUnified';

export { BlogListUnified } from './BlogListUnified';
export type { BlogListUnifiedProps } from './BlogListUnified';

export { BlogGridUnified } from './BlogGridUnified';
export type { BlogGridUnifiedProps } from './BlogGridUnified';

// ========== 标准组件 ==========

export { BlogCard } from './BlogCard';
export type { BlogCardProps } from './BlogCard';

export { BlogList } from './BlogList';
export type { BlogListProps } from './BlogList';

export { BlogGrid } from './BlogGrid';
export type { BlogGridProps } from './BlogGrid';

// ========== 文章组件 ==========

export { ArticleCard } from './ArticleCard';
export type { ArticleCardProps } from './ArticleCard';

export { ArticleCardUnified } from './ArticleCardUnified';
export type { ArticleCardUnifiedProps } from './ArticleCardUnified';

// ========== 增强组件 ==========

export { BlogListEnhanced } from './BlogListEnhanced';
export type { BlogListEnhancedProps } from './BlogListEnhanced';

export { BlogGridEnhanced } from './BlogGridEnhanced';
export type { BlogGridEnhancedProps } from './BlogGridEnhanced';

export { BlogListEnhancedNew } from './BlogListEnhancedNew';
export type { BlogListEnhancedNewProps } from './BlogListEnhancedNew';

export { BlogGridEnhancedNew } from './BlogGridEnhancedNew';
export type { BlogGridEnhancedNewProps } from './BlogGridEnhancedNew';

// ========== 详情页组件 ==========

export { BlogDetail } from './BlogDetail';
export { BlogDetailEnhanced } from './BlogDetailEnhanced';
export { BlogDetailEnhancedNew } from './BlogDetailEnhancedNew';

// ========== 搜索组件 ==========

export { BlogSearchBar } from './BlogSearchBar';
export type { BlogSearchBarProps } from './BlogSearchBar';

export { BlogSearchBarEnhanced } from './BlogSearchBarEnhanced';
export type { BlogSearchBarEnhancedProps } from './BlogSearchBarEnhanced';

export { BlogAdvancedSearch } from './BlogAdvancedSearch';

// ========== 分页组件 ==========

export { BlogPagination } from './BlogPagination';
export { BlogPaginationEnhanced } from './BlogPaginationEnhanced';
export type { BlogPaginationEnhancedProps } from './BlogPaginationEnhanced';

// ========== 侧边栏组件 ==========

export { BlogSidebar } from './BlogSidebar';
export type { BlogSidebarProps } from './BlogSidebar';

export { BlogSidebarEnhanced } from './BlogSidebarEnhanced';
export type { BlogSidebarEnhancedProps } from './BlogSidebarEnhanced';

// ========== 交互组件 ==========

export { LikeButton } from './LikeButton';
export type { LikeButtonProps } from './LikeButton';

export { LikeButtonEnhanced } from './LikeButtonEnhanced';
export type { LikeButtonEnhancedProps } from './LikeButtonEnhanced';

export { BookmarkButton } from './BookmarkButton';
export type { BookmarkButtonProps } from './BookmarkButton';

export { BookmarkButtonEnhanced } from './BookmarkButtonEnhanced';
export type { BookmarkButtonEnhancedProps } from './BookmarkButtonEnhanced';

// ========== 评论组件 ==========

export { CommentSystem } from './CommentSystem';
export type { CommentSystemProps } from './CommentSystem';

export { CommentSystemEnhanced } from './CommentSystemEnhanced';
export type { CommentSystemEnhancedProps } from './CommentSystemEnhanced';

export { CommentForm } from './CommentForm';
export { CommentFormEnhanced } from './CommentFormEnhanced';

export { CommentList } from './CommentList';
export { CommentListEnhanced } from './CommentListEnhanced';

// ========== 其他组件 ==========

export { BlogHero } from './BlogHero';

export { RelatedPosts } from './RelatedPosts';
export { RelatedPostsRecommended } from './RelatedPostsRecommended';

export { ReadingProgress } from './ReadingProgress';
export { ReadingProgressBar } from './ReadingProgressBar';
export { ReadingProgressIndicator } from './ReadingProgressIndicator';

export { TableOfContents } from './TableOfContents';
export { TableOfContentsEnhanced } from './TableOfContentsEnhanced';
export { TableOfContentsAuto } from './TableOfContentsAuto';

export { SocialShare } from './SocialShare';
export { ShareButtons } from './ShareButtons';

export { TagCloud } from './TagCloud';
export { TagList } from './TagList';

export { CategoryList } from './CategoryList';
export { CategoryFilter } from './CategoryFilter';

export { AuthorBio } from './AuthorBio';
export { AuthorCard } from './AuthorCard';
export { AuthorProfile } from './AuthorProfile';

export { PostMeta } from './PostMeta';
export { PostCard } from './PostCard';
export { PostGrid } from './PostGrid';

export { FeaturedArticles } from './FeaturedArticles';
export { FeaturedArticle } from './FeaturedArticle';

export { TrendingArticles } from './TrendingArticles';

export { CodeHighlight } from './CodeHighlight';
export { CodeHighlighter } from './CodeHighlighter';
export { CodeBlock } from './CodeBlock';

export { LoadingState } from './LoadingState';

// ========== 工具导出 ==========

/**
 * 数据适配器
 * 用于在不同数据格式之间转换
 */
export * from '@/lib/blog/adapters';

/**
 * 博客相关类型
 */
export type { BlogPost, Author, Term } from '@/types/blog';

/**
 * WordPress 类型
 */
export type { WordPressPost } from '@/types/blog';
