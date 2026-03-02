/**
 * Blog Components Index
 * 统一导出所有博客组件
 */

// 基础组件
export { default as BlogCard } from './BlogCard';
export type { BlogCardProps } from './BlogCard';

export { default as BlogGrid } from './BlogGrid';
export type { BlogGridProps } from './BlogGrid';

export { default as BlogList } from './BlogList';
export type { BlogListProps } from './BlogList';

export { default as BlogDetail } from './BlogDetail';
export type { BlogDetailProps } from './BlogDetail';

export { default as BlogPagination } from './BlogPagination';
export type { BlogPaginationProps } from './BlogPagination';

export { default as BlogHero } from './BlogHero';
export type { BlogHeroProps } from './BlogHero';

// 文章相关
export { default as ArticleCard } from './ArticleCard';
export type { ArticleCardProps } from './ArticleCard';

export { default as ArticleDetail } from './ArticleDetail';
export type { ArticleDetailProps } from './ArticleDetail';

export { default as ArticleList } from './ArticleList';
export type { ArticleListProps } from './ArticleList';

export { default as ArticleSearch } from './ArticleSearch';
export type { ArticleSearchProps } from './ArticleSearch';

export { default as ArticleTimeline } from './ArticleTimeline';
export type { ArticleTimelineProps } from './ArticleTimeline';

export { default as ArticleRating } from './ArticleRating';
export type { ArticleRatingProps } from './ArticleRating';

export { default as ArticleMeta } from './ArticleMeta';
export type { ArticleMetaProps } from './ArticleMeta';

export { default as ArticleHeader } from './ArticleHeader';
export type { ArticleHeaderProps } from './ArticleHeader';

export { default as ArticleFooter, ArticleFooterMinimal } from './ArticleFooter';
export type { ArticleFooterProps } from './ArticleFooter';

export { default as FeaturedArticles } from './FeaturedArticles';
export type { FeaturedArticlesProps } from './FeaturedArticles';

// 新增：元数据、导航组件
export { default as Breadcrumb, BreadcrumbWithSchema, useBreadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

export { default as PostNavigation } from './PostNavigation';
export type { PostNavigationProps } from './PostNavigation';

export { default as SeriesNavigation } from './SeriesNavigation';
export type { SeriesNavigationProps } from './SeriesNavigation';

// 交互组件
export { default as BookmarkButton } from './BookmarkButton';
export type { BookmarkButtonProps } from './BookmarkButton';

export { default as BookmarkManager } from './BookmarkManager';
export type { BookmarkManagerProps } from './BookmarkManager';

export { default as FollowButton } from './FollowButton';
export type { FollowButtonProps } from './FollowButton';

export { default as FontSizeAdjuster } from './FontSizeAdjuster';
export type { FontSizeAdjusterProps } from './FontSizeAdjuster';

export { default as ShareButtons } from './ShareButtons';
export type { ShareButtonsProps } from './ShareButtons';

export { default as SocialShare } from './SocialShare';
export type { SocialShareProps } from './SocialShare';

// 标签和分类
export { default as CategoryList } from './CategoryList';
export type { CategoryListProps } from './CategoryList';

export { default as TagCloud } from './TagCloud';
export type { TagCloudProps } from './TagCloud';

export { default as RelatedPosts } from './RelatedPosts';
export type { RelatedPostsProps } from './RelatedPosts';

// 评论系统
export { default as CommentForm } from './CommentForm';
export type { CommentFormProps } from './CommentForm';

export { default as CommentList } from './CommentList';
export type { CommentListProps } from './CommentList';

export { default as CommentSection } from './CommentSection';
export type { CommentSectionProps } from './CommentSection';

export { default as Comments } from './Comments';
export type { CommentsProps } from './Comments';

export { default as CommentSystem } from './CommentSystem';
export type { CommentSystemProps } from './CommentSystem';

// AI 功能
export { default as AISummary } from './AISummary';
export type { AISummaryProps } from './AISummary';

export { default as BlogPostEditor } from './BlogPostEditor';
export type { BlogPostEditorProps } from './BlogPostEditor';

// 搜索
export { default as AdvancedSearch } from './AdvancedSearch';
export type { AdvancedSearchProps } from './AdvancedSearch';

// 工具组件
export { default as MarkdownRenderer } from './MarkdownRenderer';
export type { MarkdownRendererProps } from './MarkdownRenderer';

export { default as NewsletterSubscribe } from './NewsletterSubscribe';
export type { NewsletterSubscribeProps } from './NewsletterSubscribe';

export { default as ReadingTime } from './ReadingTime';
export type { ReadingTimeProps } from './ReadingTime';

export { PostMeta } from './PostMeta';
export type { PostMetaProps } from './PostMeta';
