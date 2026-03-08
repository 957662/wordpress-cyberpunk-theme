/**
 * WordPress 类型定义
 * 用于前端应用的 TypeScript 类型
 */

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
  meta: any[];
  categories: number[];
  tags: number[];
  _links?: {
    'wp:term'?: Array<{
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }>;
    'wp:featuredmedia'?: Array<{
      embeddable: boolean;
      href: string;
    }>;
    'wp:author'?: Array<{
      embeddable: boolean;
      href: string;
    }>;
    'wp:replies'?: Array<{
      embeddable: boolean;
      href: string;
    }>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category';
  parent: number;
  meta: any[];
  _links: any;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'post_tag';
  meta: any[];
  _links: any;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: { rendered: string };
  link: string;
  status: string;
  type: string;
  meta: any[];
  author_avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
  _links: any;
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
  media_type: 'image' | 'file' | 'video' | 'audio';
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: {
      thumbnail?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      medium?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      medium_large?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      large?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      '1536x1536'?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      '2048x2048'?: { file: string; width: number; height: number; mime_type: string; source_url: string };
    };
    image_meta?: {
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
  source_url: string;
  _links: any;
}

export interface WordPressUser {
  id: number;
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
  meta: any[];
  _links: any;
}

export interface WordPressErrorResponse {
  code: string;
  message: string;
  data: { status: number };
}

// ==================== 查询参数类型 ====================

export interface WordPressPostsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  author?: number;
  author_exclude?: number[];
  categories?: number;
  categories_exclude?: number;
  tags?: number;
  tags_exclude?: number;
  sticky?: boolean;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug' | 'modified';
  slug?: string[];
  status?: string;
  _embed?: boolean;
}

export interface WordPressCategoriesQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
  hide_empty?: boolean;
  post?: number;
  parent?: number;
}

export interface WordPressTagsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
  hide_empty?: boolean;
  post?: number;
}

export interface WordPressCommentsQueryParams {
  page?: number;
  per_page?: number;
  post?: number;
  parent?: number[];
  parent_exclude?: number[];
  author?: number[];
  author_exclude?: number[];
  author_email?: string[];
  karma?: number;
  search?: string;
  status?: string;
}

// ==================== 本地化类型 ====================

export interface LocalizedPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: WordPressUser;
  categories: WordPressCategory[];
  tags: WordPressTag[];
  featured_media: WordPressMedia | null;
  comment_count: number;
  view_count?: number;
  is_sticky: boolean;
  link: string;
}

export interface LocalizedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  link: string;
}

export interface LocalizedTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
}

export interface LocalizedComment {
  id: number;
  post_id: number;
  parent_id: number;
  author_name: string;
  author_email?: string;
  author_url?: string;
  content: string;
  date: string;
  author_avatar?: string;
  status: string;
}

// ==================== 分页类型 ====================

export interface WordPressPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface WordPressPostsResponse {
  posts: LocalizedPost[];
  pagination: WordPressPagination;
}

// ==================== 搜索结果类型 ====================

export interface WordPressSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

export interface WordPressSearchResponse {
  results: WordPressSearchResult[];
  total: number;
}

// ==================== 创建/更新类型 ====================

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  status?: 'publish' | 'draft' | 'pending';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number;
}

export interface CreateCommentData {
  post: number;
  content: string;
  parent?: number;
  author_name?: string;
  author_email?: string;
  author_url?: string;
}

// ==================== 错误类型 ====================

export class WordPressError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'WordPressError';
  }
}

// ==================== 配置类型 ====================

export interface WordPressConfig {
  baseUrl: string;
  username?: string;
  applicationPassword?: string;
  timeout?: number;
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}
