/**
 * WordPress 数据适配器
 *
 * 将 WordPress REST API 返回的数据转换为应用所需的格式
 */

import { WordPressPost, WordPressCategory, WordPressTag, WordPressAuthor, WordPressMedia } from '../types';

// 应用内部的文章类型
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    url?: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  date: string;
  modified: string;
  link: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  comments?: number;
}

// 应用内部的分类类型
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent?: string;
}

// 应用内部的标签类型
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

// 应用内部的作者类型
export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  url?: string;
  postCount?: number;
}

/**
 * 转换文章数据
 */
export function adaptPost(wpPost: WordPressPost): BlogPost {
  // 提取特色图片
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const featuredImage = featuredMedia?.source_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url ||
    featuredMedia?.media_details?.sizes?.medium?.source_url ||
    featuredMedia?.media_details?.sizes?.thumbnail?.source_url;
  const featuredImageAlt = featuredMedia?.alt_text || wpPost.title.rendered;

  // 提取作者信息
  const wpAuthor = wpPost._embedded?.author?.[0];
  const author = wpAuthor ? {
    id: wpAuthor.id.toString(),
    name: wpAuthor.name,
    avatar: wpAuthor.avatar_urls?.['96'] || wpAuthor.avatar_urls?.['48'],
    url: wpAuthor.url,
  } : {
    id: wpPost.author.toString(),
    name: 'Unknown Author',
  };

  // 提取分类
  const wpTerms = wpPost._embedded?.['wp:term'] || [];
  const categories = (wpTerms[0] || [])
    .filter((term: any) => term.taxonomy === 'category')
    .map((cat: any) => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug,
    }));

  // 提取标签
  const tags = (wpTerms[1] || [])
    .filter((term: any) => term.taxonomy === 'post_tag')
    .map((tag: any) => ({
      id: tag.id.toString(),
      name: tag.name,
      slug: tag.slug,
    }));

  // 计算阅读时间
  const plainText = wpPost.content.rendered.replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return {
    id: wpPost.id.toString(),
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''),
    content: wpPost.content.rendered,
    featuredImage,
    featuredImageAlt,
    author,
    categories,
    tags,
    date: wpPost.date,
    modified: wpPost.modified,
    link: wpPost.link,
    readingTime,
  };
}

/**
 * 批量转换文章数据
 */
export function adaptPosts(wpPosts: WordPressPost[]): BlogPost[] {
  return wpPosts.map(adaptPost);
}

/**
 * 转换分类数据
 */
export function adaptCategory(wpCategory: WordPressCategory): BlogCategory {
  return {
    id: wpCategory.id.toString(),
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description,
    count: wpCategory.count,
    parent: wpCategory.parent > 0 ? wpCategory.parent.toString() : undefined,
  };
}

/**
 * 批量转换分类数据
 */
export function adaptCategories(wpCategories: WordPressCategory[]): BlogCategory[] {
  return wpCategories.map(adaptCategory);
}

/**
 * 转换标签数据
 */
export function adaptTag(wpTag: WordPressTag): BlogTag {
  return {
    id: wpTag.id.toString(),
    name: wpTag.name,
    slug: wpTag.slug,
    description: wpTag.description,
    count: wpTag.count,
  };
}

/**
 * 批量转换标签数据
 */
export function adaptTags(wpTags: WordPressTag[]): BlogTag[] {
  return wpTags.map(adaptTag);
}

/**
 * 转换作者数据
 */
export function adaptAuthor(wpAuthor: WordPressAuthor): BlogAuthor {
  return {
    id: wpAuthor.id.toString(),
    name: wpAuthor.name,
    slug: wpAuthor.slug,
    description: wpAuthor.description,
    avatar: wpAuthor.avatar_urls?.['96'] || wpAuthor.avatar_urls?.['48'],
    url: wpAuthor.url,
  };
}

/**
 * 批量转换作者数据
 */
export function adaptAuthors(wpAuthors: WordPressAuthor[]): BlogAuthor[] {
  return wpAuthors.map(adaptAuthor);
}

/**
 * 构建分类树（支持父子分类）
 */
export function buildCategoryTree(categories: BlogCategory[]): BlogCategory[] {
  const categoryMap = new Map<string, BlogCategory & { children?: BlogCategory[] }>();
  const rootCategories: Array<BlogCategory & { children?: BlogCategory[] }> = [];

  // 创建分类映射
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // 构建树形结构
  categories.forEach(cat => {
    const node = categoryMap.get(cat.id)!;

    if (cat.parent) {
      const parent = categoryMap.get(cat.parent);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        rootCategories.push(node);
      }
    } else {
      rootCategories.push(node);
    }
  });

  return rootCategories;
}

/**
 * 格式化文章摘要
 */
export function formatExcerpt(html: string, maxLength: number = 160): string {
  const text = html.replace(/<[^>]*>/g, '').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 提取文章的第一张图片
 */
export function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

/**
 * 提取文章的外部链接
 */
export function extractExternalLinks(content: string): string[] {
  const linkRegex = /<a[^>]+href="(https?:\/\/[^">]+)"/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    // 排除内部链接
    if (!url.includes(window.location.hostname)) {
      links.push(url);
    }
  }

  return links;
}

/**
 * 计算文章相似度（用于相关文章推荐）
 */
export function calculateSimilarity(
  post1: BlogPost,
  post2: BlogPost
): number {
  let score = 0;

  // 相同分类
  const sharedCategories = post1.categories.filter(c1 =>
    post2.categories.some(c2 => c2.id === c1.id)
  );
  score += sharedCategories.length * 2;

  // 相同标签
  const sharedTags = post1.tags.filter(t1 =>
    post2.tags.some(t2 => t2.id === t1.id)
  );
  score += sharedTags.length;

  return score;
}

/**
 * 查找相关文章
 */
export function findRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 4
): BlogPost[] {
  const postsWithScore = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => ({
      post,
      score: calculateSimilarity(currentPost, post),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return postsWithScore;
}

/**
 * 构建面包屑导航
 */
export interface Breadcrumb {
  label: string;
  href?: string;
}

export function buildBreadcrumbs(
  post: BlogPost,
  category?: BlogCategory
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
  ];

  if (category) {
    breadcrumbs.push({
      label: category.name,
      href: `/blog?category=${category.slug}`,
    });
  }

  breadcrumbs.push({
    label: post.title,
  });

  return breadcrumbs;
}

/**
 * 格式化 SEO 数据
 */
export interface SEOData {
  title: string;
  description: string;
  ogImage?: string;
  ogType: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors: string[];
    tags: string[];
  };
}

export function buildSEOData(post: BlogPost): SEOData {
  return {
    title: post.title,
    description: formatExcerpt(post.excerpt, 160),
    ogImage: post.featuredImage,
    ogType: 'article',
    article: {
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      tags: post.tags.map(tag => tag.name),
    },
  };
}

/**
 * 验证 WordPress 数据完整性
 */
export function validatePostData(post: WordPressPost): boolean {
  return !!(
    post.id &&
    post.title?.rendered &&
    post.content?.rendered &&
    post.slug
  );
}

/**
 * 处理缺失数据
 */
export function handleMissingData(post: WordPressPost): WordPressPost {
  return {
    ...post,
    title: {
      rendered: post.title?.rendered || 'Untitled',
    },
    content: {
      rendered: post.content?.rendered || '',
      protected: post.content?.protected || false,
    },
    excerpt: {
      rendered: post.excerpt?.rendered || '',
      protected: post.excerpt?.protected || false,
    },
    slug: post.slug || `post-${post.id}`,
  };
}

// 导出所有适配器函数
export const blogDataAdapter = {
  adaptPost,
  adaptPosts,
  adaptCategory,
  adaptCategories,
  adaptTag,
  adaptTags,
  adaptAuthor,
  adaptAuthors,
  buildCategoryTree,
  formatExcerpt,
  extractFirstImage,
  extractExternalLinks,
  calculateSimilarity,
  findRelatedPosts,
  buildBreadcrumbs,
  buildSEOData,
  validatePostData,
  handleMissingData,
};

export default blogDataAdapter;
