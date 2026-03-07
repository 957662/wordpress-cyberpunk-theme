/**
 * Blog Models
 * 博客相关的类型定义
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Author;
  category: Category[];
  tags: Tag[];
  coverImage: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  readingTime: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  website?: string;
  email?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  parentId?: string;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  folder?: string;
  createdAt: string;
  note?: string;
}

export interface ReadingProgress {
  id: string;
  postId: string;
  userId: string;
  progress: number;
  lastPosition: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostView {
  postId: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  duration?: number;
  referrer?: string;
}

export interface FeaturedPost {
  post: BlogPost;
  type: 'hero' | 'sidebar' | 'grid';
  priority: number;
  expiresAt?: string;
}

export interface RelatedPost {
  post: BlogPost;
  relevance: number;
  reason: 'category' | 'tag' | 'author' | 'similar';
}

export interface TrendingPost {
  post: BlogPost;
  views: number;
  likes: number;
  comments: number;
  trendScore: number;
  period: 'day' | 'week' | 'month';
}

export interface SearchResult {
  posts: BlogPost[];
  total: number;
  query: string;
  suggestions?: string[];
  categories?: Category[];
  tags?: Tag[];
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topCategories: Category[];
  topTags: Tag[];
  topAuthors: Author[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'bookmark';
  title: string;
  description: string;
  timestamp: string;
  user?: Author;
}

export interface BlogFilter {
  categories?: string[];
  tags?: string[];
  authors?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string[];
  featured?: boolean;
  search?: string;
}

export interface BlogSort {
  field: 'date' | 'title' | 'views' | 'likes' | 'comments';
  order: 'asc' | 'desc';
}

export interface BlogPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BlogQuery extends BlogFilter, BlogSort, BlogPagination {}
