/**
 * 博客相关类型定义
 */

/**
 * 文章类型
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'publish' | 'private' | 'pending';
  meta: PostMeta;
  seo?: PostSEO;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * 作者信息
 */
export interface Author {
  id: string;
  name: string;
  slug: string;
  email?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: SocialLinks;
  role: 'admin' | 'editor' | 'author' | 'contributor';
}

/**
 * 社交链接
 */
export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

/**
 * 分类
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: Category;
  count: number;
  icon?: string;
}

/**
 * 标签
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  color?: string;
}

/**
 * 文章元数据
 */
export interface PostMeta {
  views: number;
  likes: number;
  comments: number;
  favorites: number;
  readingTime: number;
  wordCount: number;
  featured: boolean;
  sticky: boolean;
  allowComments: boolean;
}

/**
 * SEO 信息
 */
export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

/**
 * 评论
 */
export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: CommentAuthor;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  likes: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 评论作者
 */
export interface CommentAuthor {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * 通知
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

/**
 * 通知类型
 */
export type NotificationType =
  | 'comment'
  | 'reply'
  | 'like'
  | 'follow'
  | 'mention'
  | 'system'
  | 'post_published';

/**
 * 用户
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role: UserRole;
  social?: SocialLinks;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户角色
 */
export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber' | 'guest';

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: string;
}

/**
 * 用户统计
 */
export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  followersCount: number;
  followingCount: number;
  viewsCount: number;
}

/**
 * 关注关系
 */
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

/**
 * 收藏夹
 */
export interface Folder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 收藏项
 */
export interface Bookmark {
  id: string;
  folderId?: string;
  userId: string;
  postId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 阅读列表
 */
export interface ReadingListItem {
  id: string;
  userId: string;
  postId: string;
  progress: number;
  status: 'reading' | 'completed' | 'want_to_read';
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * 搜索结果
 */
export interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'author';
  relevance: number;
  publishedAt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

/**
 * 分页信息
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API 响应
 */
export interface APIResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * 文章列表过滤器
 */
export interface PostFilters {
  status?: Post['status'][];
  category?: string[];
  tags?: string[];
  author?: string[];
  search?: string;
  sortBy?: 'date' | 'title' | 'views' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  featured?: boolean;
  sticky?: boolean;
}

/**
 * 表单类型
 */

export interface CommentFormData {
  author: string;
  email: string;
  content: string;
  parentId?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  preferences?: string[];
}

/**
 * 上下文类型
 */
export interface BlogContext {
  post?: Post;
  posts?: Post[];
  category?: Category;
  tag?: Tag;
  author?: Author;
  search?: {
    query: string;
    results: SearchResultItem[];
  };
}

/**
 * 组件 Props 类型
 */

export interface ArticleCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showExcerpt?: boolean;
  showMeta?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  className?: string;
}

export interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'compact' | 'minimal';
  showStats?: boolean;
  showBio?: boolean;
  showSocial?: boolean;
  followButton?: boolean;
  className?: string;
}

export interface CommentListProps {
  postId: string;
  comments: Comment[];
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  allowNested?: boolean;
  maxDepth?: number;
  className?: string;
}

export interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}
