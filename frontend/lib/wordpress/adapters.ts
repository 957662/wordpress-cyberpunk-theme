/**
 * WordPress 数据适配器
 * 将 WordPress API 数据转换为前端组件可用的格式
 */

import {
  WPPost,
  WPCategory,
  WPTag,
  WPAuthor,
  WPComment,
} from './client';
import {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogAuthor,
  BlogComment,
  PostListItem,
  PostCardData,
  PostMetadata,
} from './types';
import { formatDate, formatDistanceToNow } from '@/lib/utils';

/**
 * 计算/估算阅读时间
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]+>/g, ''); // 移除 HTML 标签
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * 提取纯文本摘要
 */
function extractPlainText(html: string, maxLength: number = 200): string {
  const text = html.replace(/<[^>]+>/g, '').trim();
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

/**
 * 转换 WordPress 文章为博客文章格式
 */
export function adaptWPPostToBlogPost(wpPost: WPPost, featuredImage?: string, author?: WPAuthor): BlogPost {
  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    excerpt: extractPlainText(wpPost.excerpt.rendered, 200),
    content: wpPost.content.rendered,
    slug: wpPost.slug,
    date: wpPost.date,
    modified: wpPost.modified,
    author: {
      id: wpPost.author,
      name: author?.name || 'Unknown',
      avatar: author?.avatar_urls?.['96'],
    },
    categories: [], // 需要通过 categories API 获取
    tags: [], // 需要通过 tags API 获取
    featuredImage: featuredImage ? { src: featuredImage } : undefined,
    commentCount: 0, // 需要通过 comments API 获取
    readingTime: calculateReadingTime(wpPost.content.rendered),
    status: wpPost.status,
    link: wpPost.link,
  };
}

/**
 * 转换 WordPress 分类为博客分类格式
 */
export function adaptWPCategory(wpCategory: WPCategory): BlogCategory {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description || undefined,
    count: wpCategory.count,
    link: wpCategory.link,
  };
}

/**
 * 转换 WordPress 标签为博客标签格式
 */
export function adaptWPTag(wpTag: WPTag): BlogTag {
  return {
    id: wpTag.id,
    name: wpTag.name,
    slug: wpTag.slug,
    description: wpTag.description || undefined,
    count: wpTag.count,
    link: wpTag.link,
  };
}

/**
 * 转换 WordPress 作者为博客作者格式
 */
export function adaptWPAuthor(wpAuthor: WPAuthor): BlogAuthor {
  return {
    id: wpAuthor.id,
    name: wpAuthor.name,
    slug: wpAuthor.slug,
    description: wpAuthor.description || undefined,
    avatar: wpAuthor.avatar_urls?.['96'],
    link: wpAuthor.link,
  };
}

/**
 * 转换 WordPress 评论为博客评论格式
 */
export function adaptWPComment(wpComment: WPComment): BlogComment {
  return {
    id: wpComment.id,
    postId: wpComment.post,
    author: {
      name: wpComment.author_name,
      url: wpComment.author_url || undefined,
    },
    content: wpComment.content.rendered,
    date: wpComment.date,
    parentId: wpComment.parent || undefined,
    status: wpComment.status,
  };
}

/**
 * 转换为文章列表项格式
 */
export function adaptToPostListItem(wpPost: WPPost, category?: string): PostListItem {
  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    excerpt: extractPlainText(wpPost.excerpt.rendered, 150),
    slug: wpPost.slug,
    date: wpPost.date,
    author: '', // 需要从 author API 获取
    category,
    readingTime: calculateReadingTime(wpPost.content.rendered),
  };
}

/**
 * 转换为文章卡片数据格式
 */
export function adaptToPostCardData(
  wpPost: WPPost,
  category?: BlogCategory,
  tags?: BlogTag[],
  author?: WPAuthor,
  featuredImage?: string
): PostCardData {
  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    excerpt: extractPlainText(wpPost.excerpt.rendered, 150),
    slug: wpPost.slug,
    date: wpPost.date,
    author: {
      name: author?.name || 'Unknown',
      avatar: author?.avatar_urls?.['48'],
    },
    category: category ? {
      name: category.name,
      slug: category.slug,
    } : undefined,
    tags: tags?.slice(0, 3).map(tag => ({
      name: tag.name,
      slug: tag.slug,
    })),
    featuredImage,
    readingTime: calculateReadingTime(wpPost.content.rendered),
    stats: {
      comments: 0, // 需要从 comments API 获取
    },
  };
}

/**
 * 生成文章元数据
 */
export function generatePostMetadata(blogPost: BlogPost): PostMetadata {
  return {
    title: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.featuredImage?.src,
    author: blogPost.author.name,
    publishedDate: formatDate(blogPost.date),
    modifiedDate: formatDate(blogPost.modified),
    category: blogPost.categories[0]?.name,
    tags: blogPost.tags.map(tag => tag.name),
    readingTime: blogPost.readingTime,
  };
}

/**
 * 批量转换文章列表
 */
export function adaptWPPostsToBlogPosts(
  wpPosts: WPPost[],
  authors: Map<number, WPAuthor>,
  categories: Map<number, WPCategory>,
  tags: Map<number, WPTag>,
  featuredImages: Map<number, string>
): BlogPost[] {
  return wpPosts.map(wpPost => {
    const author = authors.get(wpPost.author);
    const postCategories = wpPost.categories
      .map(catId => categories.get(catId))
      .filter((cat): cat is WPCategory => cat !== undefined);
    const postTags = wpPost.tags
      .map(tagId => tags.get(tagId))
      .filter((tag): tag is WPTag => tag !== undefined);

    const adaptedPost = adaptWPPostToBlogPost(wpPost, featuredImages.get(wpPost.featured_media), author);
    adaptedPost.categories = postCategories.map(adaptWPCategory);
    adaptedPost.tags = postTags.map(adaptWPTag);

    return adaptedPost;
  });
}

/**
 * 格式化日期为相对时间
 */
export function formatPostDate(date: string): string {
  return formatDistanceToNow(new Date(date));
}

/**
 * 格式化日期为完整格式
 */
export function formatPostDateFull(date: string): string {
  return formatDate(new Date(date));
}

/**
 * 获取文章的第一张图片
 */
export function extractFirstImage(content: string): string | null {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

/**
 * 移除 HTML 标签获取纯文本
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
