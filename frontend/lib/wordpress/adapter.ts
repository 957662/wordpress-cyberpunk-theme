/**
 * WordPress 数据适配器
 * 将 WordPress API 原始数据转换为应用所需的格式
 */

import { Post, Category, Tag, Author, Comment } from '@/types/blog';

// ==================== 文章适配器 ====================

/**
 * WordPress 原始文章数据类型
 */
interface WPRawPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
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
  featured_image_urls?: {
    full?: string;
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  acf?: any;
  yoast_head?: string;
}

/**
 * 将 WordPress 原始文章数据转换为应用格式
 */
export function adaptWPRawPostToPost(raw: WPRawPost,
  authorMap?: Map<number, Author>,
  categoryMap?: Map<number, Category>,
  tagMap?: Map<number, Tag>
): Post {
  return {
    id: String(raw.id),
    title: raw.title.rendered,
    slug: raw.slug,
    content: raw.content.rendered,
    excerpt: raw.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200),
    featuredImage: raw.featured_image_urls?.full || raw.featured_image_urls?.large,
    author: authorMap?.get(raw.author) || createDefaultAuthor(raw.author),
    category: categoryMap?.get(raw.categories?.[0] || 0) || createDefaultCategory(),
    tags: (raw.tags || [])
      .map(id => tagMap?.get(id))
      .filter(Boolean)
      .slice(0, 5) as Tag[],
    status: raw.status as Post['status'],
    meta: {
      views: 0,
      likes: 0,
      comments: 0,
      favorites: 0,
      readingTime: calculateReadingTime(raw.content.rendered),
      wordCount: countWords(raw.content.rendered),
      featured: raw.sticky,
      sticky: raw.sticky,
      allowComments: raw.comment_status === 'open',
    },
    seo: extractSEOFromYoast(raw.yoast_head),
    createdAt: raw.date,
    updatedAt: raw.modified,
    publishedAt: raw.status === 'publish' ? raw.date : undefined,
  };
}

/**
 * 批量转换文章数据
 */
export function adaptWPRawPostsToPosts(
  rawPosts: WPRawPost[],
  authorMap?: Map<number, Author>,
  categoryMap?: Map<number, Category>,
  tagMap?: Map<number, Tag>
): Post[] {
  return rawPosts.map(raw =>
    adaptWPRawPostToPost(raw, authorMap, categoryMap, tagMap)
  );
}

// ==================== 作者适配器 ====================

/**
 * WordPress 原始作者数据类型
 */
interface WPRawAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
    '128'?: string;
    '256'?: string;
    '512'?: string;
  };
  meta: any[];
}

/**
 * 将 WordPress 原始作者数据转换为应用格式
 */
export function adaptWPRawAuthorToAuthor(raw: WPRawAuthor): Author {
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    email: undefined,
    avatar: raw.avatar_urls?.['96'] || raw.avatar_urls?.['48'],
    bio: raw.description,
    website: raw.url,
    role: 'author',
  };
}

/**
 * 创建默认作者（当数据缺失时）
 */
function createDefaultAuthor(id: number): Author {
  return {
    id: String(id),
    name: 'Unknown Author',
    slug: `author-${id}`,
    role: 'author',
    stats: {
      postsCount: 0,
      commentsCount: 0,
      likesCount: 0,
      followersCount: 0,
      followingCount: 0,
      viewsCount: 0,
    },
    preferences: {
      theme: 'dark',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      fontSize: 'md',
      fontFamily: 'Inter',
    },
  };
}

// ==================== 分类适配器 ====================

/**
 * WordPress 原始分类数据类型
 */
interface WPRawCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  acf?: any;
}

/**
 * 将 WordPress 原始分类数据转换为应用格式
 */
export function adaptWPRawCategoryToCategory(raw: WPRawCategory): Category {
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    description: raw.description || undefined,
    parent: raw.parent ? createDefaultCategory() : undefined,
    count: raw.count,
  };
}

/**
 * 创建默认分类
 */
function createDefaultCategory(): Category {
  return {
    id: '0',
    name: 'Uncategorized',
    slug: 'uncategorized',
    count: 0,
  };
}

// ==================== 标签适配器 ====================

/**
 * WordPress 原始标签数据类型
 */
interface WPRawTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  acf?: any;
}

/**
 * 将 WordPress 原始标签数据转换为应用格式
 */
export function adaptWPRawTagToTag(raw: WPRawTag): Tag {
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    description: raw.description || undefined,
    count: raw.count,
    color: generateTagColor(raw.name),
  };
}

// ==================== 评论适配器 ====================

/**
 * WordPress 原始评论数据类型
 */
interface WPRawComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
  };
  meta: any[];
  length: number;
}

/**
 * 将 WordPress 原始评论数据转换为应用格式
 */
export function adaptWPRawCommentToComment(raw: WPRawComment): Comment {
  return {
    id: String(raw.id),
    postId: String(raw.post),
    parentId: raw.parent ? String(raw.parent) : undefined,
    author: {
      id: String(raw.author),
      name: raw.author_name,
      avatar: raw.author_avatar_urls?.['48'],
      url: raw.author_url || undefined,
    },
    content: raw.content.rendered,
    status: raw.status as Comment['status'],
    likes: 0,
    createdAt: raw.date,
    updatedAt: raw.date,
  };
}

// ==================== 工具函数 ====================

/**
 * 计算阅读时间（分钟）
 */
function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 统计字数
 */
function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * 从 Yoast SEO 数据中提取 SEO 信息
 */
function extractSEOFromYoast(yoastHead?: string) {
  if (!yoastHead) return undefined;

  const parser = new DOMParser();
  const doc = parser.parseFromString(yoastHead, 'text/html');

  const getMetaContent = (name: string) => {
    const element = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return element?.getAttribute('content') || undefined;
  };

  return {
    metaTitle: getMetaContent('title'),
    metaDescription: getMetaContent('description'),
    ogTitle: getMetaContent('og:title'),
    ogDescription: getMetaContent('og:description'),
    ogImage: getMetaContent('og:image'),
    twitterCard: getMetaContent('twitter:card'),
  };
}

/**
 * 为标签生成颜色
 */
function generateTagColor(tagName: string): string {
  const colors = [
    '#00f0ff', // 霓虹青
    '#9d00ff', // 赛博紫
    '#ff0080', // 激光粉
    '#00ff88', // 赛博绿
    '#f0ff00', // 电压黄
  ];

  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * 创建数据映射表
 */
export function createAuthorMap(authors: WPRawAuthor[]): Map<number, Author> {
  return new Map(
    authors.map(author => [author.id, adaptWPRawAuthorToAuthor(author)])
  );
}

export function createCategoryMap(categories: WPRawCategory[]): Map<number, Category> {
  return new Map(
    categories.map(category => [category.id, adaptWPRawCategoryToCategory(category)])
  );
}

export function createTagMap(tags: WPRawTag[]): Map<number, Tag> {
  return new Map(
    tags.map(tag => [tag.id, adaptWPRawTagToTag(tag)])
  );
}
