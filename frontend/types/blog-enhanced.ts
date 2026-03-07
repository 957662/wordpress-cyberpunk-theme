/**
 * Blog Enhanced Types
 * 博客系统完整类型定义
 */

// ==================== 基础类型 ====================

export type PostStatus = 'draft' | 'published' | 'archived';
export type PostSort = 'latest' | 'popular' | 'trending';

// ==================== 用户相关 ====================

export interface Author {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  role?: 'admin' | 'author' | 'user';
  created_at: string;
}

export interface AuthorStats {
  posts_count: number;
  total_views: number;
  total_likes: number;
  followers_count: number;
}

// ==================== 分类和标签 ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  posts_count?: number;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count?: number;
  created_at: string;
}

export interface CategoryTree extends Category {
  children?: CategoryTree[];
}

// ==================== 文章相关 ====================

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;

  // 状态
  status: PostStatus;
  post_type: 'post' | 'page';

  // 统计
  view_count: number;
  comment_count: number;
  like_count?: number;
  bookmark_count?: number;

  // 时间
  created_at: string;
  updated_at: string;
  published_at?: string;

  // 作者
  author_id: number;
  author: Author;

  // 分类和标签
  category_id?: number;
  category?: Category;
  tags: Tag[];

  // 扩展字段
  is_featured?: boolean;
  reading_time?: number;
  allow_comments?: boolean;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  status: PostStatus;
  view_count: number;
  like_count?: number;
  comment_count: number;
  created_at: string;
  published_at?: string;
  author: Pick<Author, 'id' | 'username' | 'avatar_url'>;
  category?: Pick<Category, 'id' | 'name' | 'slug'>;
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
}

export interface PostDetail extends Post {
  related_posts?: PostListItem[];
  prev_post?: PostListItem;
  next_post?: PostListItem;
}

// ==================== 列表和分页 ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PostListParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: PostSort;
  status?: PostStatus;
  author?: number;
  featured?: boolean;
}

export interface PostListResponse extends PaginatedResponse<PostListItem> {}

// ==================== 创建和更新 ====================

export interface CreatePostData {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: PostStatus;
  post_type?: 'post' | 'page';
  is_featured?: boolean;
  allow_comments?: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: PostStatus;
  is_featured?: boolean;
  allow_comments?: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

// ==================== 评论相关 ====================

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  author: Author;
  parent_id?: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  created_at: string;
  updated_at: string;

  // 嵌套评论
  replies?: Comment[];
  reply_count?: number;

  // 统计
  like_count?: number;
}

export interface CreateCommentData {
  post_id: number;
  content: string;
  parent_id?: number;
}

export interface CommentListParams {
  post_id: number;
  page?: number;
  per_page?: number;
  sort?: 'latest' | 'oldest' | 'popular';
  status?: 'pending' | 'approved';
}

// ==================== 点赞和收藏 ====================

export interface Like {
  id: number;
  user_id: number;
  target_id: number;
  target_type: 'post' | 'comment';
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
  post?: PostListItem;
}

export interface BookmarkListParams {
  page?: number;
  per_page?: number;
  sort?: 'latest' | 'oldest';
}

// ==================== 搜索相关 ====================

export interface SearchQuery {
  q: string;
  type?: 'post' | 'author' | 'tag' | 'category';
  category?: string;
  tag?: string;
  date_from?: string;
  date_to?: string;
}

export interface SearchResult {
  posts: PostListItem[];
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  total_results: number;
}

// ==================== 统计相关 ====================

export interface PostStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_categories: number;
  total_tags: number;
}

export interface AuthorStats {
  id: number;
  author: Author;
  posts_count: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  top_posts: PostListItem[];
}

export interface BlogAnalytics {
  daily_views: {
    date: string;
    views: number;
  }[];
  popular_posts: PostListItem[];
  popular_tags: Tag[];
  popular_categories: Category[];
  top_authors: Author[];
}

// ==================== 订阅相关 ====================

export interface NewsletterSubscription {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface SubscribeData {
  email: string;
  name?: string;
  categories?: number[];
  tags?: number[];
}

// ==================== RSS 相关 ====================

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  language: string;
  last_build_date: string;
  items: RSSFeedItem[];
}

export interface RSSFeedItem {
  title: string;
  link: string;
  description: string;
  pub_date: string;
  author?: string;
  categories?: string[];
  guid?: string;
}

// ==================== WordPress 集成 ====================

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
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
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      thumbnail?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      medium?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      full?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

// ==================== API 响应 ====================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
  status: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
  error?: string;
}

// ==================== 表单相关 ====================

export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  category_id?: number;
  tags?: string[];
  featured_image_url?: string;
  status?: PostStatus;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  publish_date?: string;
}

export interface PostFormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
  category_id?: string;
  featured_image_url?: string;
  slug?: string;
}

// ==================== 过滤器 ====================

export interface PostFilters {
  category?: number;
  tag?: number;
  author?: number;
  dateRange?: {
    from: string;
    to: string;
  };
  status?: PostStatus;
  search?: string;
}

// ==================== 导出配置 ====================

export interface ExportConfig {
  format: 'json' | 'csv' | 'xml' | 'pdf';
  include?: {
    content?: boolean;
    comments?: boolean;
    metadata?: boolean;
    author?: boolean;
  };
  filters?: PostFilters;
  dateRange?: {
    from: string;
    to: string;
  };
}

// ==================== 通知相关 ====================

export interface PostNotification {
  type: 'comment' | 'like' | 'mention' | 'reply';
  post_id: number;
  post_title: string;
  actor: Author;
  content?: string;
  created_at: string;
  read: boolean;
}

// ==================== 阅读进度 ====================

export interface ReadingProgress {
  post_id: number;
  user_id: number;
  progress: number; // 0-100
  last_position: number; // 字符位置
  completed: boolean;
  last_read_at: string;
}

// ==================== 相关推荐 ====================

export interface RecommendationConfig {
  algorithm: 'collaborative' | 'content-based' | 'hybrid';
  max_results: number;
  filters?: PostFilters;
}

export interface RecommendationResult {
  post: PostListItem;
  score: number;
  reason: string;
}

// ==================== 导出汇总 ====================

export type {
  Post,
  PostListItem,
  PostDetail,
  PostListResponse,
  CreatePostData,
  UpdatePostData,
  Author,
  Category,
  Tag,
  Comment,
  Bookmark,
  PostStats,
  SearchResult,
  ApiResponse,
  ApiError,
};
