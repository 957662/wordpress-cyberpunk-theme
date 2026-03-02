/**
 * 博客相关类型定义
 */

/**
 * 文章基础信息
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled' | 'private';
  type: 'post' | 'page' | 'custom';
  featured: boolean;
  sticky: boolean;

  // 作者信息
  author: Author;

  // 分类和标签
  category: Category;
  tags: Tag[];

  // 媒体
  featuredImage?: Media;
  gallery?: Media[];

  // 时间信息
  publishedAt: string;
  updatedAt: string;
  createdAt: string;

  // 统计信息
  views: number;
  likes: number;
  comments: number;
  shares: number;

  // 阅读相关
  readingTime: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  // 元数据
  metadata?: Record<string, any>;

  // 相关文章
  relatedPosts?: Post[];
}

/**
 * 作者信息
 */
export interface Author {
  id: string;
  name: string;
  slug: string;
  email?: string;
  bio?: string;
  avatar?: Media;
  coverImage?: Media;
  social?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  role: 'admin' | 'editor' | 'author' | 'contributor';
  stats?: {
    posts: number;
    views: number;
    followers: number;
  };
  createdAt: string;
}

/**
 * 分类信息
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: Media;
  parentId?: string;
  order: number;
  count: number;
  metadata?: Record<string, any>;
}

/**
 * 标签信息
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count: number;
  metadata?: Record<string, any>;
}

/**
 * 媒体信息
 */
export interface Media {
  id: string;
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
  createdAt: string;
}

/**
 * 评论信息
 */
export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

/**
 * 文章列表查询参数
 */
export interface PostQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  status?: string;
  featured?: boolean;
  sticky?: boolean;
  sortBy?: 'date' | 'title' | 'views' | 'likes' | 'comments' | 'random';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 文章列表响应
 */
export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 文章表单数据
 */
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  status?: Post['status'];
  type?: Post['type'];
  featured?: boolean;
  sticky?: boolean;
  categoryId?: string;
  tagIds?: string[];
  featuredImageId?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  metadata?: Record<string, any>;
}

/**
 * 文章统计信息
 */
export interface PostStats {
  views: number;
  uniqueViews: number;
  likes: number;
  comments: number;
  shares: number;
  avgReadTime: number;
  completionRate: number;
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
}

/**
 * 阅读历史
 */
export interface ReadingHistory {
  postId: string;
  postTitle: string;
  postSlug: string;
  postThumbnail?: string;
  progress: number;
  lastReadAt: string;
  completed: boolean;
}

/**
 * 书签
 */
export interface Bookmark {
  id: string;
  type: 'post' | 'portfolio' | 'comment';
  itemId: string;
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  folder?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

/**
 * 订阅者信息
 */
export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  subscribedAt: string;
  confirmedAt?: string;
  preferences?: {
    daily?: boolean;
    weekly?: boolean;
    categories?: string[];
  };
}

/**
 * Newsletter 表单数据
 */
export interface NewsletterFormData {
  email: string;
  name?: string;
  daily?: boolean;
  weekly?: boolean;
  categories?: string[];
}
