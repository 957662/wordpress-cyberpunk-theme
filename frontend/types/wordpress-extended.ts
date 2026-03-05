/**
 * WordPress 扩展类型定义
 * 用于 WordPress REST API 的类型扩展
 */

// ============================================
// WordPress 基础类型
// ============================================

export interface WPCore {
  site: string;
  namespace: string;
  routes: Record<string, any>;
  authentication: any;
  query: boolean;
  description: string;
  url: string;
  home: string;
  gmt_offset: string;
  timezone_string: string;
  namespacename: string;
  rss_url: string;
  rdf_url: string;
  rss2_url: string;
  atom_url: string;
  commentRSS_url: string;
  pingback_url: string;
}

// ============================================
// 文章类型扩展
// ============================================

export interface WPPostExtended {
  // 基础字段
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'future';
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
  _links: WPLinks;

  // 扩展字段
  views?: number;
  likes?: number;
  reading_time?: string;
  featured_image_url?: string;
  author_data?: WPAuthor;
  categories_data?: WPCategory[];
  tags_data?: WPTag[];
}

// ============================================
// 自定义文章类型
// ============================================

export interface WPCustomPost {
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
  template: string;
  meta: any[];
  _links: WPLinks;
}

// ============================================
// 分类和标签扩展
// ============================================

export interface WPCategoryExtended {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category';
  parent: number;
  meta: any[];
  _links: WPLinks;

  // 扩展字段
  color?: string;
  icon?: string;
  image?: string;
}

export interface WPTagExtended {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'post_tag';
  meta: any[];
  _links: WPLinks;

  // 扩展字段
  color?: string;
  icon?: string;
}

// ============================================
// 用户扩展
// ============================================

export interface WPUserExtended {
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
    '128': string;
    '256': string;
    '512': string;
  };
  meta: any[];
  _links: WPLinks;

  // 扩展字段
  role?: 'admin' | 'editor' | 'author' | 'contributor' | 'subscriber';
  capabilities?: string[];
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

// ============================================
// 评论扩展
// ============================================

export interface WPCommentExtended {
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
  status: 'approved' | 'pending' | 'spam' | 'trash';
  type: 'comment';
  author_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: any[];
  _links: WPLinks;

  // 扩展字段
  likes?: number;
  dislikes?: number;
  is_liked?: boolean;
}

// ============================================
// 媒体扩展
// ============================================

export interface WPMediaExtended {
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
    width: number;
    height: number;
    file?: string;
    sizes?: {
      [key: string]: {
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
  post: number | null;
  source_url: string;
  meta: any[];
  _links: WPLinks;

  // 扩展字段
  optimized_url?: string;
  webp_url?: string;
  thumbnail_url?: string;
}

// ============================================
// 页面类型
// ============================================

export interface WPPage extends WPPostExtended {
  type: 'page';
  parent: number;
}

// ============================================
// 菜单类型
// ============================================

export interface WPMenuItem {
  id: number;
  title: { rendered: string };
  url: string;
  attr_title: string;
  classes: string[];
  xfn: string[];
  description: string;
  menu_order: number;
  object: string;
  object_id: number;
  type: string;
  type_label: string;
  target: string;
  _links: WPLinks;

  // 扩展字段
  children?: WPMenuItem[];
  icon?: string;
  badge?: string | number;
}

// ============================================
// 侧边栏类型
// ============================================

export interface WPSidebar {
  id: string;
  name: string;
  description: string;
  class: string;
  before_widget: string;
  after_widget: string;
  before_title: string;
  after_title: string;

  // 扩展字段
  widgets?: WPWidget[];
}

export interface WPWidget {
  id: string;
  name: string;
  description: string;
  type: string;
  options: any;

  // 扩展字段
  content?: any;
}

// ============================================
// 链接类型
// ============================================

export interface WPLinks {
  self: Array<{ href: string }>;
  collection: Array<{ href: string }>;
  about?: Array<{ href: string }>;
  author?: Array<{ href: string }>;
  replies?: Array<{ href: string }>;
  version-history?: Array<{ href: string }>;
  attachments?: Array<{ href: string }>;
  term?: Array<{ href: string; taxonomy: string }>;
  'wp:post_type'?: Array<{ href: string }>;
  'wp:term'?: Array<{ href: string; taxonomy: string; embeddable: boolean }>;
  curies?: Array<{ name: string; href: string; templated: boolean }>;
}

// ============================================
// 搜索结果类型
// ============================================

export interface WPSearchResult {
  id: number | string;
  type: 'post' | 'page' | 'attachment' | 'custom';
  title: string;
  excerpt: string;
  url: string;
  date?: string;
  author?: string;
  image?: string;
}

// ============================================
// 分类法类型
// ============================================

export interface WPTaxonomy {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_namespace: string;
  rest_base: string;
  _links: WPLinks;
}

// ============================================
// 响应包装器类型
// ============================================

export interface WPResponse<T> {
  data: T[];
  headers: {
    'X-WP-Total': number;
    'X-WP-TotalPages': number;
  };
}

export interface WPError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}

// ============================================
// 查询参数类型
// ============================================

export interface WPQueryParams {
  context?: 'view' | 'embed' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  status?: string[];
  categories?: number[];
  tags?: number[];
  sticky?: boolean;
}

export interface WPCommentQueryParams extends WPQueryParams {
  post?: number;
  parent?: number[];
  author?: number[];
  author_email?: string[];
  author_exclude?: number[];
  karma?: number;
  type?: string[];
  type_in?: string[];
}

// ============================================
// 导出所有类型
// ============================================

export type {
  WPCore,
  WPPostExtended,
  WPCustomPost,
  WPCategoryExtended,
  WPTagExtended,
  WPUserExtended,
  WPCommentExtended,
  WPMediaExtended,
  WPPage,
  WPMenuItem,
  WPSidebar,
  WPWidget,
  WPLinks,
  WPSearchResult,
  WPTaxonomy,
  WPResponse,
  WPError,
  WPQueryParams,
  WPCommentQueryParams,
};

// 默认导出
export default {
  WPCore,
  WPPostExtended,
  WPCustomPost,
  WPCategoryExtended,
  WPTagExtended,
  WPUserExtended,
  WPCommentExtended,
  WPMediaExtended,
  WPPage,
  WPMenuItem,
  WPSidebar,
  WPWidget,
  WPLinks,
  WPSearchResult,
  WPTaxonomy,
  WPResponse,
  WPError,
  WPQueryParams,
  WPCommentQueryParams,
};
