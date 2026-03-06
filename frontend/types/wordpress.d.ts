/**
 * WordPress REST API 类型定义
 */

// ============ 基础类型 ============

/**
 * WordPress 分类和标签类型
 */
export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

/**
 * WordPress 作者类型
 */
export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    24: string;
    48: string;
    96: string;
  };
  meta: any[];
  _links: any;
}

/**
 * WordPress 媒体项类型
 */
export interface WPMedia {
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
  description: { rendered: string };
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: {
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
    image_meta: any;
  };
  source_url: string;
  _links: any;
  _embedded?: any;
}

/**
 * WordPress 评论类型
 */
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
  status: string;
  type: string;
  author_avatar_urls?: any;
  meta: any[];
  _links: any;
  _embedded?: any;
}

// ============ 文章类型 ============

/**
 * WordPress 文章基础类型
 */
export interface WPPostBase {
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
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

/**
 * WordPress 文章完整类型（包含嵌入数据）
 */
export interface WPPost extends WPPostBase {
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
    'wp:comment'?: WPComment[];
  };
}

/**
 * 转换后的文章类型（用于前端）
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  modifiedAt: string;
  author: {
    id: number;
    name: string;
    slug: string;
    avatar?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  commentCount: number;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  readingTime: number;
  status: 'publish' | 'draft' | 'pending' | 'private';
  format: 'standard' | 'aside' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio' | 'chat';
  sticky: boolean;
}

// ============ 页面类型 ============

/**
 * WordPress 页面类型
 */
export interface WPPage extends WPPostBase {
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
  };
}

/**
 * 转换后的页面类型（用于前端）
 */
export interface Page extends Omit<Post, 'categories' | 'tags'> {
  parent?: number;
  template?: string;
}

// ============ API 参数类型 ============

/**
 * WordPress 查询参数类型
 */
export interface WPQueryParams {
  page?: number;
  per_page?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  search?: string;
  categories?: number;
  categories_exclude?: number;
  tags?: number;
  tags_exclude?: number;
  exclude?: number[];
  include?: number[];
  author?: number;
  author_exclude?: number;
  sticky?: boolean;
  _embed?: boolean | string[];
  status?: string | string[];
  before?: string;
  after?: string;
}

/**
 * WordPress 响应头类型
 */
export interface WPResponseHeaders {
  'X-WP-Total': string;
  'X-WP-TotalPages': string;
  Link?: string;
}

// ============ 分类和标签类型 ============

/**
 * WordPress 分类类型
 */
export interface WPCategory extends WPTerm {
  taxonomy: 'category';
}

/**
 * WordPress 标签类型
 */
export interface WPTag extends WPTerm {
  taxonomy: 'post_tag';
}

// ============ 用户类型 ============

/**
 * WordPress 用户类型
 */
export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    24: string;
    48: string;
    96: string;
  };
  meta: any[];
  _links: any;
  roles?: string[];
  capabilities?: any;
  registered_date?: string;
}

// ============ 搜索类型 ============

/**
 * WordPress 搜索结果类型
 */
export interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: 'post' | 'page' | 'attachment' | string;
  subtype?: string;
  _links: any;
}

// ============ 媒体库类型 ============

/**
 * 媒体库查询参数类型
 */
export interface WPMediaQueryParams {
  search?: string;
  mime_type?: string;
  parent?: number;
  page?: number;
  per_page?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  _embed?: boolean;
}

// ============ 评论类型 ============

/**
 * 评论查询参数类型
 */
export interface WPCommentQueryParams {
  post?: number;
  parent?: number;
  page?: number;
  per_page?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  status?: string;
}

// ============ 类型转换函数 ============

/**
 * 将 WordPress 文章转换为前端文章类型
 */
export function transformWPPost(post: WPPost): Post {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];
  const author = post._embedded?.author?.[0];

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    featuredImage: featuredMedia?.source_url,
    publishedAt: post.date,
    modifiedAt: post.modified,
    author: {
      id: post.author,
      name: author?.name || 'Unknown',
      slug: author?.slug || '',
      avatar: author?.avatar_urls?.['96'],
    },
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    commentCount: 0, // 需要从评论 API 获取
    viewCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    readingTime: Math.ceil(post.content.rendered.split(/\s+/).length / 200),
    status: post.status as any,
    format: post.format as any,
    sticky: post.sticky,
  };
}

/**
 * 批量转换 WordPress 文章
 */
export function transformWPPosts(posts: WPPost[]): Post[] {
  return posts.map(transformWPPost);
}

// ============ 导出所有类型 ============
export type {
  WPTerm,
  WPAuthor,
  WPMedia,
  WPComment,
  WPPostBase,
  WPPost,
  Post,
  WPPage,
  Page,
  WPQueryParams,
  WPResponseHeaders,
  WPCategory,
  WPTag,
  WPUser,
  WPSearchResult,
  WPMediaQueryParams,
  WPCommentQueryParams,
};
