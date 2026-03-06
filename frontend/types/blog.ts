/**
 * Blog Types
 * 统一的博客类型定义
 * 重新导出 models.ts 中的类型，确保类型一致性
 */

export type { 
  Post as BlogPost,
  PostListItem as BlogPostListItem,
  PostCreateInput as BlogPostCreateInput,
  PostUpdateInput as BlogPostUpdateInput,
  Category as BlogCategory,
  Tag as BlogTag,
  Comment as BlogComment,
  CommentCreateInput as BlogCommentCreateInput,
} from './models';

// WordPress API 响应类型
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium?: {
            source_url: string;
          };
          large?: {
            source_url: string;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls?: {
        '24': string;
        '48': string;
        '96': string;
      };
    }>;
  };
}

// BlogCard 组件专用的简化类型
export interface BlogCardData {
  id: string | number;
  title: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    avatar?: string;
    slug?: string;
  };
  coverImage?: string;
  category?: string;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags?: string[];
  publishedAt?: string | Date;
  createdAt?: string | Date;
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  slug?: string;
  featured?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// BlogFilter 参数
export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending' | 'oldest';
  page?: number;
  perPage?: number;
  featured?: boolean;
}

// Blog 视图模式
export type BlogViewMode = 'grid' | 'list' | 'compact';

// Blog 卡片变体
export type BlogCardVariant = 'default' | 'featured' | 'compact' | 'minimal' | 'magazine';

// Blog 网格布局
export type BlogGridColumns = 1 | 2 | 3 | 4;

export interface BlogListProps {
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSize?: number;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showTags?: boolean;
  variant?: BlogCardVariant;
  viewMode?: BlogViewMode;
  columns?: BlogGridColumns;
  onPostClick?: (post: BlogCardData) => void;
  emptyMessage?: string;
  className?: string;
}

export interface BlogGridProps {
  posts: BlogCardData[];
  loading?: boolean;
  error?: string | null;
  columns?: BlogGridColumns;
  gap?: 'sm' | 'md' | 'lg';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showTags?: boolean;
  variant?: BlogCardVariant;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  onPostClick?: (post: BlogCardData) => void;
  emptyMessage?: string;
  className?: string;
}

export interface ArticleCardProps {
  post: BlogCardData;
  variant?: BlogCardVariant;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showDate?: boolean;
  className?: string;
}

// Helper function to convert WordPress post to BlogCardData
export function wpPostToBlogCardData(wpPost: WordPressPost): BlogCardData {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const categories = wpPost._embedded?.['wp:term']?.[0] || [];
  const author = wpPost._embedded?.author?.[0];
  const tags = wpPost._embedded?.['wp:term']?.[1] || [];

  // Calculate reading time (average 200 words per minute)
  const wordCount = wpPost.content.rendered.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
    content: wpPost.content.rendered,
    coverImage: featuredMedia?.source_url,
    category: categories[0]?.name,
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: tags.map(tag => tag.name),
    author: author ? {
      name: author.name,
      avatar: author.avatar_urls?.['48'] || author.avatar_urls?.['24'],
      slug: author.slug,
    } : undefined,
    publishedAt: wpPost.date,
    createdAt: wpPost.date,
    readingTime,
    slug: wpPost.slug,
    featured: wpPost.sticky,
  };
}

// Helper function to convert Post to BlogCardData
export function postToBlogCardData(post: BlogPost): BlogCardData {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    category: post.category?.name,
    categories: post.category ? [{
      id: parseInt(post.category.id),
      name: post.category.name,
      slug: post.category.slug,
    }] : [],
    tags: post.tags?.map(tag => tag.name) || [],
    author: {
      name: post.author.username,
      avatar: post.author.avatar,
      slug: post.author.username,
    },
    publishedAt: post.published_at,
    createdAt: post.created_at,
    readingTime: post.reading_time,
    slug: post.slug,
    featured: post.featured,
    isLiked: false,
    isBookmarked: false,
    viewCount: post.view_count,
    likeCount: post.like_count,
    commentCount: post.comment_count,
  };
}
