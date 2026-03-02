/**
 * WordPress API 类型定义
 * 与 WordPress REST API 对应的 TypeScript 类型
 */

// ============================================
// 基础类型
// ============================================

export interface BaseModel {
  id: number;
  link: string;
}

// ============================================
// 内容类型
// ============================================

export interface Post extends BaseModel {
  date: string;
  date_gmt: string;
  guid: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'future' | 'private';
  type: string;
  title: string;
  content: string;
  excerpt: string;
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
  meta: string[];
  categories: number[];
  tags: number[];
  acf?: Record<string, any>;
}

export interface Page extends BaseModel {
  date: string;
  date_gmt: string;
  guid: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'future' | 'private';
  type: string;
  title: string;
  content: string;
  excerpt: string;
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  menu_order: number;
  template: string;
  meta: string[];
  acf?: Record<string, any>;
}

// ============================================
// 分类和标签
// ============================================

export interface Category extends BaseModel {
  name: string;
  slug: string;
  taxonomy: string;
  description: string;
  parent: number;
  meta: string[];
  acf?: Record<string, any>;
}

export interface Tag extends BaseModel {
  name: string;
  slug: string;
  taxonomy: string;
  description: string;
  meta: string[];
  acf?: Record<string, any>;
}

// ============================================
// 用户/作者
// ============================================

export interface Author extends BaseModel {
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: string[];
  acf?: Record<string, any>;
}

// ============================================
// 媒体
// ============================================

export interface Media extends BaseModel {
  date: string;
  date_gmt: string;
  guid: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  title: string;
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: string;
  description: string;
  media_type: 'image' | 'file' | 'video' | 'audio';
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
      medium_large?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      large?: {
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
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: string[];
    };
  };
  post: number;
  source_url: string;
  meta: string[];
  acf?: Record<string, any>;
}

// ============================================
// 评论
// ============================================

export interface Comment extends BaseModel {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: string;
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: string[];
  acf?: Record<string, any>;
}

// ============================================
// 分页响应
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================
// API 响应
// ============================================

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// ============================================
// 搜索结果
// ============================================

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: 'post' | 'page' | 'attachment';
  subtype: string;
}

// ============================================
// 自定义类型（用于前端）
// ============================================

export interface PostWithDetails extends Post {
  author_details?: Author;
  category_details?: Category[];
  tag_details?: Tag[];
  featured_media_details?: Media;
}

export interface PageWithDetails extends Page {
  author_details?: Author;
  featured_media_details?: Media;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  per_page?: number;
  orderby?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
}
