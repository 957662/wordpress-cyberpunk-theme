/**
 * Blog Types
 *
 * Type definitions for blog-related entities
 */

// =====================================================
// Post Types
// =====================================================

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: number;
  featured_image?: string;
  status: 'draft' | 'pending' | 'publish' | 'private' | 'trash';
  post_type: 'post' | 'page' | 'portfolio';
  comment_status: 'open' | 'closed';
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface PostWithDetails extends Post {
  author?: Author;
  categories?: Category[];
  tags?: Tag[];
  meta?: PostMeta;
  comments?: Comment[];
}

export interface Author {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
}

export interface PostMeta {
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
}

// =====================================================
// Category & Tag Types
// =====================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  type: 'category' | 'tag';
  count: number;
  icon?: string;
  color?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tag extends Omit<Category, 'type'> {
  type: 'tag';
}

// =====================================================
// Comment Types
// =====================================================

export interface Comment {
  id: number;
  post_id: number;
  author_id?: number;
  parent_id?: number;
  author_name?: string;
  author_email?: string;
  author_ip?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: number;
  author?: Author;
  replies?: Comment[];
}

export interface CommentTree extends Comment {
  replies: CommentTree[];
}

// =====================================================
// Filter & Search Types
// =====================================================

export interface PostFilters {
  category?: string;
  categories?: string[];
  tag?: string;
  tags?: string[];
  author?: number;
  status?: 'publish' | 'draft' | 'private';
  post_type?: 'post' | 'page' | 'portfolio';
  featured?: boolean;
}

export interface PostSearchParams extends PostFilters {
  query: string;
  page?: number;
  per_page?: number;
}

// =====================================================
// Pagination Types
// =====================================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    currentPage?: number;
    perPage?: number;
  };
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  orderby?: 'date' | 'title' | 'modified' | 'comment_count' | 'views';
  order?: 'asc' | 'desc';
}

// =====================================================
// Form Types
// =====================================================

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_ids?: number[];
  tag_ids?: number[];
  status?: 'draft' | 'publish';
  meta?: {
    seo_title?: string;
    seo_description?: string;
    featured?: boolean;
  };
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  id: number;
}

export interface CreateCommentDto {
  post_id: number;
  content: string;
  parent_id?: number;
  author_name?: string;
  author_email?: string;
}

// =====================================================
// Analytics Types
// =====================================================

export interface PostAnalytics {
  post_id: number;
  views: number;
  visitors: number;
  unique_visitors: number;
  bounce_rate?: number;
  avg_time_on_page?: number;
  history: AnalyticsDataPoint[];
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  visitors: number;
  unique_visitors: number;
}

// =====================================================
// Reading List Types
// =====================================================

export interface ReadingListItem {
  id: number;
  post_id: number;
  user_id: number;
  progress: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
  post?: Post;
}

export interface BookmarkItem {
  id: number;
  post_id: number;
  user_id: number;
  notes?: string;
  created_at: string;
  post?: Post;
}

// =====================================================
// Series Types
// =====================================================

export interface Series {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  sort_order: number;
  created_at: string;
}

export interface SeriesPost {
  series_id: number;
  post_id: number;
  part_number: number;
  post?: Post;
}

// =====================================================
// Newsletter Types
// =====================================================

export interface NewsletterSubscription {
  id: number;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed';
  subscribed_at: string;
}

export interface SubscribeToNewsletterDto {
  email: string;
  name?: string;
}
