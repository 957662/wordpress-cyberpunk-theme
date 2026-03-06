/**
 * WordPress 数据适配器
 * 在 WordPress API 响应和内部数据格式之间转换
 */

import type { BlogCardData, WordPressPost } from '@/types/blog';

/**
 * 扩展的 WordPress Post 类型（包含所有可能的字段）
 */
interface ExtendedWordPressPost extends WordPressPost {
  yoast_head?: string;
  yoast_head_json?: any;
  custom_fields?: Record<string, any>;
}

/**
 * WordPress 作者信息适配
 */
export interface AuthorInfo {
  id: number;
  name: string;
  slug: string;
  url?: string;
  description?: string;
  avatar?: string;
  link?: string;
}

/**
 * WordPress 分类/标签信息适配
 */
export interface TermInfo {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  link?: string;
  taxonomy?: string;
}

/**
 * WordPress 媒体信息适配
 */
export interface MediaInfo {
  id: number;
  url: string;
  alt?: string;
  caption?: string;
  description?: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    medium_large?: string;
    large?: string;
    full?: string;
  };
}

/**
 * 将 WordPress 作者转换为内部格式
 */
export function adaptWPAuthor(author: any): AuthorInfo | null {
  if (!author) return null;

  return {
    id: author.id,
    name: author.name || author.username || 'Unknown',
    slug: author.slug || author.username || '',
    url: author.url || author.link,
    description: author.description,
    avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || author.avatar_urls?.['24'] || author.avatar,
    link: author.link,
  };
}

/**
 * 将 WordPress 分类/标签转换为内部格式
 */
export function adaptWPTerm(term: any): TermInfo {
  return {
    id: term.id,
    name: term.name,
    slug: term.slug,
    description: term.description,
    count: term.count,
    link: term.link,
    taxonomy: term.taxonomy,
  };
}

/**
 * 将 WordPress 媒体转换为内部格式
 */
export function adaptWPMedia(media: any): MediaInfo | null {
  if (!media) return null;

  const sizes = media.media_details?.sizes;
  return {
    id: media.id,
    url: media.source_url || media.url,
    alt: media.alt_text || media.alt,
    caption: media.caption?.rendered || media.caption,
    description: media.description?.rendered || media.description,
    sizes: {
      thumbnail: sizes?.thumbnail?.source_url,
      medium: sizes?.medium?.source_url,
      medium_large: sizes?.medium_large?.source_url,
      large: sizes?.large?.source_url,
      full: sizes?.full?.source_url || media.source_url,
    },
  };
}

/**
 * 从 WordPress Post 中提取特色图片
 */
export function extractFeaturedImage(post: WordPressPost): string | undefined {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  if (!featuredMedia) return undefined;

  // 优先使用 medium_large，然后 large，最后原图
  const sizes = featuredMedia.media_details?.sizes;
  return (
    sizes?.medium_large?.source_url ||
    sizes?.large?.source_url ||
    sizes?.full?.source_url ||
    featuredMedia.source_url
  );
}

/**
 * 从 WordPress Post 中提取分类
 */
export function extractCategories(post: WordPressPost): TermInfo[] {
  const terms = post._embedded?.['wp:term'] || [];
  const categories = terms.find((termArray: any[]) =>
    termArray.some((term: any) => term.taxonomy === 'category')
  ) || [];

  return categories.map(adaptWPTerm);
}

/**
 * 从 WordPress Post 中提取标签
 */
export function extractTags(post: WordPressPost): TermInfo[] {
  const terms = post._embedded?.['wp:term'] || [];
  const tags = terms.find((termArray: any[]) =>
    termArray.some((term: any) => term.taxonomy === 'post_tag')
  ) || [];

  return tags.map(adaptWPTerm);
}

/**
 * 从 WordPress Post 中提取作者
 */
export function extractAuthor(post: WordPressPost): AuthorInfo | null {
  const author = post._embedded?.author?.[0];
  return author ? adaptWPAuthor(author) : null;
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 计算字数（中文字符 + 英文单词）
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;
  const totalWords = chineseChars + englishWords;

  // 平均阅读速度：中文 400 字/分钟，英文 200 词/分钟
  const readingTime = Math.ceil((chineseChars / 400) + (englishWords / 200));

  return Math.max(1, readingTime); // 至少 1 分钟
}

/**
 * 高级 WordPress Post 到 BlogCardData 转换
 */
export function adaptWordPressPost(post: ExtendedWordPressPost): BlogCardData {
  const featuredImage = extractFeaturedImage(post);
  const categories = extractCategories(post);
  const tags = extractTags(post);
  const author = extractAuthor(post);

  // 清理 excerpt
  let excerpt = post.excerpt?.rendered || '';
  excerpt = excerpt
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/\[/g, '[')      // 保留方括号
    .replace(/\]/g, ']')
    .trim();

  // 如果 excerpt 为空或太短，从 content 中截取
  if (excerpt.length < 50 && post.content?.rendered) {
    const text = post.content.rendered.replace(/<[^>]*>/g, '').trim();
    excerpt = text.substring(0, 200) + '...';
  }

  // 阅读时间
  const readingTime = post.custom_fields?.reading_time ||
    calculateReadingTime(post.content?.rendered || '');

  return {
    id: post.id,
    title: post.title?.rendered || post.title?.toString() || 'Untitled',
    excerpt,
    content: post.content?.rendered,
    coverImage: featuredImage,
    category: categories[0]?.name,
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: tags.map(tag => tag.name),
    author: author ? {
      name: author.name,
      avatar: author.avatar,
      slug: author.slug,
    } : undefined,
    publishedAt: post.date || post.date_gmt,
    createdAt: post.date || post.date_gmt,
    readingTime,
    slug: post.slug,
    featured: post.sticky || false,
    viewCount: post.custom_fields?.views || post.custom_fields?.view_count,
    likeCount: post.custom_fields?.likes || post.custom_fields?.like_count,
    commentCount: post.custom_fields?.comments || post.custom_fields?.comment_count,
  };
}

/**
 * 批量转换 WordPress Posts
 */
export function adaptWordPressPosts(posts: ExtendedWordPressPost[]): BlogCardData[] {
  return posts.map(adaptWordPressPost);
}

/**
 * 将内部格式转换回 WordPress 格式（用于提交）
 */
export function adaptToWordPressPost(data: Partial<BlogCardData>): {
  title: string;
  content: string;
  excerpt: string;
  status: string;
  categories?: number[];
  tags?: number[];
  featured_media?: number;
} {
  return {
    title: data.title || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    status: 'draft',
    categories: data.categories?.map(cat => parseInt(cat.id as string)),
    tags: data.tags?.map(() => 0), // 需要从标签名称查找 ID
    featured_media: undefined, // 需要从 URL 查找媒体 ID
  };
}

/**
 * 验证 WordPress Post 数据
 */
export function validateWordPressPost(post: any): boolean {
  return (
    post &&
    typeof post === 'object' &&
    (post.id || post.slug) &&
    (post.title?.rendered || post.title)
  );
}

/**
 * 过滤有效的 WordPress Posts
 */
export function filterValidPosts(posts: any[]): ExtendedWordPressPost[] {
  return posts.filter(validateWordPressPost);
}
