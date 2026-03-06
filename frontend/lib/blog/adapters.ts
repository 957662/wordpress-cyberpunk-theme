/**
 * 博客数据适配器
 * 用于在不同数据格式之间转换
 */

import type {
  BlogPost,
  Author,
  Term,
  WordPressPost,
} from '@/types/blog';

/**
 * 将 WordPress API 数据转换为统一的 BlogPost 格式
 */
export function adaptWordPressPost(wpPost: WordPressPost): BlogPost {
  // 提取特色图片
  const featuredImage =
    wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || undefined;

  // 提取作者信息
  const wpAuthor = wpPost._embedded?.author?.[0];
  const author: Author = {
    id: wpAuthor?.id || wpPost.author,
    name: wpAuthor?.name || 'Unknown',
    slug: wpAuthor?.slug || `author-${wpPost.author}`,
    avatar: wpAuthor?.avatar_urls?.['96'] || undefined,
  };

  // 提取分类（wp:term 的第一个数组是分类）
  const wpCategories = wpPost._embedded?.['wp:term']?.[0] || [];
  const categories: Term[] = wpCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    taxonomy: 'category',
  }));

  // 提取标签（wp:term 的第二个数组是标签）
  const wpTags = wpPost._embedded?.['wp:term']?.[1] || [];
  const tags: Term[] = wpTags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    taxonomy: 'post_tag',
  }));

  // 计算阅读时间（基于内容长度）
  const contentText = wpPost.content.rendered.replace(/<[^>]*>/g, '');
  const wordCount = contentText.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 假设每分钟200字

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
    content: wpPost.content.rendered,
    featuredImage,
    author,
    categories,
    tags,
    publishedAt: wpPost.date,
    modifiedAt: wpPost.modified,
    readTime,
    status: wpPost.status,
    featured: wpPost.sticky,
    sticky: wpPost.sticky,
  };
}

/**
 * 批量转换 WordPress 数据
 */
export function adaptWordPressPosts(wpPosts: WordPressPost[]): BlogPost[] {
  return wpPosts.map(adaptWordPressPost);
}

/**
 * 将自定义 Post 格式转换为 BlogPost 格式
 */
export function adaptCustomPost(post: any): BlogPost {
  // 处理不同的自定义格式
  if (post.id && post.title && post.slug) {
    return {
      id: post.id,
      title: typeof post.title === 'string' ? post.title : post.title.rendered || '',
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featuredImage: post.featuredImage || post.featured_media,
      author: post.author || {
        id: 'unknown',
        name: 'Unknown',
      },
      categories: post.categories || [],
      tags: post.tags || [],
      publishedAt: post.publishedAt || post.date || post.created_at || new Date().toISOString(),
      readTime: post.readTime || post.reading_time || 5,
      viewCount: post.viewCount || post.views || 0,
      likeCount: post.likeCount || post.likes || 0,
      commentCount: post.commentCount || post.comments || 0,
      status: post.status || 'publish',
      featured: post.featured || false,
      sticky: post.sticky || false,
    };
  }

  throw new Error('Invalid post format');
}

/**
 * 将 BlogPost 格式转换为 ArticleCard 所需格式
 */
export function blogPostToArticleCard(post: BlogPost) {
  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    author: post.author,
    categories: post.categories,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    viewCount: post.viewCount || 0,
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
  };
}

/**
 * 安全地提取文章标题
 */
export function extractPostTitle(post: any): string {
  if (typeof post.title === 'string') {
    return post.title;
  }
  if (post.title?.rendered) {
    return post.title.rendered;
  }
  return '';
}

/**
 * 安全地提取文章摘要
 */
export function extractPostExcerpt(post: any, maxLength = 150): string {
  let excerpt = '';

  if (typeof post.excerpt === 'string') {
    excerpt = post.excerpt;
  } else if (post.excerpt?.rendered) {
    excerpt = post.excerpt.rendered;
  } else if (post.content) {
    excerpt = post.content;
  }

  // 移除 HTML 标签
  excerpt = excerpt.replace(/<[^>]*>/g, '').trim();

  // 截断到指定长度
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).trim() + '...';
  }

  return excerpt;
}

/**
 * 获取文章链接
 */
export function getPostLink(slug: string, prefix = '/blog'): string {
  return `${prefix}/${slug}`;
}

/**
 * 格式化作者信息
 */
export function formatAuthor(author: any): Author {
  if (!author) {
    return {
      id: 'unknown',
      name: 'Unknown Author',
    };
  }

  if (typeof author === 'string') {
    return {
      id: author,
      name: author,
    };
  }

  return {
    id: author.id || author.slug || 'unknown',
    name: author.name || author.username || 'Unknown',
    slug: author.slug,
    avatar: author.avatar || author.avatar_url,
    bio: author.bio,
    website: author.website || author.url,
  };
}

/**
 * 格式化分类/标签信息
 */
export function formatTerm(term: any): Term {
  return {
    id: term.id || term.slug || term.name,
    name: term.name || term.title || 'Unknown',
    slug: term.slug || term.id || '',
    description: term.description,
    color: term.color,
    count: term.count || 0,
  };
}

/**
 * 验证 BlogPost 数据完整性
 */
export function validateBlogPost(post: any): post is BlogPost {
  return (
    post &&
    typeof post.id !== 'undefined' &&
    typeof post.title === 'string' &&
    typeof post.slug === 'string' &&
    typeof post.excerpt === 'string' &&
    post.author &&
    typeof post.author.name === 'string' &&
    Array.isArray(post.categories) &&
    Array.isArray(post.tags) &&
    typeof post.publishedAt === 'string' &&
    typeof post.readTime === 'number'
  );
}

/**
 * 修复不完整的 BlogPost 数据
 */
export function fixBlogPost(post: any): BlogPost {
  return {
    id: post.id || Math.random().toString(36).substr(2, 9),
    title: post.title || 'Untitled',
    slug: post.slug || `post-${Date.now()}`,
    excerpt: post.excerpt || '',
    content: post.content,
    featuredImage: post.featuredImage,
    author: post.author || { id: 'unknown', name: 'Unknown' },
    categories: Array.isArray(post.categories) ? post.categories : [],
    tags: Array.isArray(post.tags) ? post.tags : [],
    publishedAt: post.publishedAt || new Date().toISOString(),
    modifiedAt: post.modifiedAt,
    readTime: post.readTime || 5,
    viewCount: post.viewCount || 0,
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    status: post.status || 'publish',
    featured: post.featured || false,
    sticky: post.sticky || false,
  };
}
