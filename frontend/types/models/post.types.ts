/**
 * 文章相关类型定义
 */

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: PostStatus;
  visibility: PostVisibility;
  featured: boolean;
  views: number;
  likesCount: number;
  commentsCount: number;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type PostVisibility = 'public' | 'private' | 'password_protected';

export interface Author {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  views: number;
  likesCount: number;
  commentsCount: number;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
}

export interface PostDetail extends Post {
  seo?: PostSEO;
  relatedPosts?: PostListItem[];
  tableOfContents?: TOCItem[];
}

export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  tagIds?: string[];
  featuredImage?: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  featured?: boolean;
  publishedAt?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface PostFilter {
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'publishedAt' | 'views' | 'likesCount' | 'commentsCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PostListResponse {
  posts: PostListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PostStats {
  id: string;
  postId: string;
  views: number;
  uniqueVisitors: number;
  averageReadTime: number;
  bounceRate: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  date: string;
}

export interface PostReaction {
  id: string;
  userId: string;
  postId: string;
  type: ReactionType;
  createdAt: string;
}

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

export interface PostComment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  parentId?: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostBookmark {
  id: string;
  userId: string;
  postId: string;
  folder?: string;
  note?: string;
  createdAt: string;
}

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  category: Category;
  relevanceScore: number;
}
