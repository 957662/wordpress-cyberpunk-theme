/**
 * WordPress API 类型定义
 */

// WordPress 基础响应类型
export interface WPResponse<T> {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'future' | 'private';
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
  meta: string[];
  categories: number[];
  tags: number[];
  _links: WPLinks;
}

// WordPress 文章类型
export interface WPPost extends WPResponse<WPPost> {
  type: 'post';
}

// WordPress 页面类型
export interface WPPage extends WPResponse<WPPage> {
  type: 'page';
}

// WordPress 分类类型
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category';
  parent: number;
  meta: string[];
  _links: WPLinks;
}

// WordPress 标签类型
export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'post_tag';
  meta: string[];
  _links: WPLinks;
}

// WordPress 用户类型
export interface WPUser {
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
  };
  meta: string[];
  _links: WPLinks;
}

// WordPress 媒体类型
export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'inherit' | 'publish';
  type: 'attachment';
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  alt_text: string;
  caption: { rendered: string };
  description: { rendered: string };
  media_type: 'image' | 'file' | 'video' | 'audio';
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: {
      thumbnail?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      medium?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      medium_large?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      large?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      '1536x1536'?: { file: string; width: number; height: number; mime_type: string; source_url: string };
      '2048x2048'?: { file: string; width: number; height: number; mime_type: string; source_url: string };
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
  _links: WPLinks;
}

// WordPress 评论类型
export interface WPComment {
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
  status: 'approved' | 'hold' | 'spam' | 'trash';
  type: 'comment' | 'trackback' | 'pingback';
  meta: string[];
  _links: WPLinks;
}

// WordPress 链接类型
export interface WPLinks {
  self: { href: string }[];
  collection: { href: string }[];
  about: { href: string }[];
  author?: { href: string }[];
  replies?: { href: string; embeddable: boolean }[];
  'wp:term'?: { taxonomy: string; href: string; embeddable: boolean }[];
  'curies': { name: string; href: string; templated: boolean }[];
  'wp:featuredmedia'?: { embeddable: boolean; href: string }[];
  'wp:attachment'?: { href: string }[];
  'wp:action-publish'?: { href: string }[];
  'wp:action-unpublish'?: { href: string }[];
}

// 转换后的应用类型
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: WPUser;
  categories: WPCategory[];
  tags: WPTag[];
  featured_media?: WPMedia;
  link: string;
  status: string;
  format: string;
  sticky: boolean;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: WPUser;
  featured_media?: WPMedia;
  link: string;
  parent: number;
  menu_order: number;
}

export interface Category extends WPCategory {}
export interface Tag extends WPTag {}
export interface Author extends WPUser {}

// 分页响应类型
export interface WP_paginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 搜索结果类型
export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: 'post' | 'page';
  subtype?: string;
}
