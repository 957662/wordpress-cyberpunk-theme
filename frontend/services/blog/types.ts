// ================================================================
// Blog Service - 类型定义
// ================================================================

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  role: 'subscriber' | 'contributor' | 'author' | 'editor' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'banned';
  created_at: string;
  updated_at: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  icon: string | null;
  color: string;
  cover_image_url: string | null;
  sort_order: number;
  post_count: number;
  created_at: string;
  updated_at: string;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  post_count: number;
  created_at: string;
  updated_at: string;
}

// 文章类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author_id: string;
  author?: User;
  featured_image: string | null;
  status: 'draft' | 'pending' | 'private' | 'publish' | 'future' | 'trash';
  post_type: 'post' | 'page' | 'portfolio' | 'attachment';
  comment_status: boolean;
  ping_status: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_sticky: boolean;
  menu_order: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: Tag[];
}

// 评论类型
export interface Comment {
  id: string;
  post_id: string;
  author_id: string | null;
  author?: User;
  parent_id: string | null;
  author_name: string | null;
  author_email: string | null;
  author_url: string | null;
  author_ip: string | null;
  content: string;
  karma: number;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  agent: string | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

// 媒体类型
export interface Media {
  id: string;
  title: string | null;
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  description: string | null;
  caption: string | null;
  uploader_id: string;
  uploader?: User;
  post_id: string | null;
  created_at: string;
  updated_at: string;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 文章查询参数
export interface PostQueryParams extends PaginationParams {
  status?: Post['status'][];
  postType?: Post['post_type'][];
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  isFeatured?: boolean;
  isSticky?: boolean;
  year?: number;
  month?: number;
}

// 响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 响应包装
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 文章列表响应
export type PostListResponse = PaginatedResponse<Post>;

// 分类列表响应
export type CategoryListResponse = PaginatedResponse<Category>;

// 标签列表响应
export type TagListResponse = PaginatedResponse<Tag>;

// 评论列表响应
export type CommentListResponse = PaginatedResponse<Comment>;

// 统计数据
export interface PostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topPosts: Post[];
  recentPosts: Post[];
  popularCategories: Category[];
  popularTags: Tag[];
}

// 搜索结果
export interface SearchResult {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  totalResults: number;
}

// 文章操作结果
export interface PostActionResponse {
  success: boolean;
  post?: Post;
  message?: string;
  error?: string;
}

// 点赞/取消点赞结果
export interface LikeResponse {
  success: boolean;
  liked: boolean;
  likeCount: number;
  message?: string;
}

// 评论提交结果
export interface CommentSubmitResponse {
  success: boolean;
  comment?: Comment;
  message?: string;
  error?: string;
}

// 文章归档
export interface PostArchive {
  year: number;
  months: Array<{
    month: number;
    count: number;
    posts: Post[];
  }>;
}

// 相关文章
export interface RelatedPosts {
  byCategory: Post[];
  byTag: Post[];
  byAuthor: Post[];
}

// 导出所有类型
export type {
  User,
  Category,
  Tag,
  Post,
  Comment,
  Media,
  PaginationParams,
  PostQueryParams,
  PaginatedResponse,
  ApiResponse,
  PostListResponse,
  CategoryListResponse,
  TagListResponse,
  CommentListResponse,
  PostStats,
  SearchResult,
  PostActionResponse,
  LikeResponse,
  CommentSubmitResponse,
  PostArchive,
  RelatedPosts,
};
