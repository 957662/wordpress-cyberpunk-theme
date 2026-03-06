/**
 * 博客数据转换工具
 * 将 WordPress 数据转换为应用层数据格式
 */

import type {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressAuthor,
  WordPressMedia,
  Article,
  Category,
  Tag,
} from '@/types/blog.types';

/**
 * 转换 WordPress 文章为应用层文章
 */
export function transformWordPressPost(post: WordPressPost): Article {
  // 提取作者信息
  const author = post._embedded?.author?.[0];
  const authorData = {
    id: post.author,
    name: author?.name || 'Unknown',
    avatar: author?.avatar_urls?.['96'] || author?.avatar_urls?.['48'],
    slug: author?.slug,
  };

  // 提取特色图片
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const featuredImageData = featuredMedia
    ? {
        src: featuredMedia.source_url,
        alt: featuredMedia.alt_text || post.title.rendered,
        caption: featuredMedia.caption?.rendered,
      }
    : undefined;

  // 提取分类
  const categories =
    post._embedded?.['wp:term']?.[0]?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
    })) || [];

  // 提取标签
  const tags =
    post._embedded?.['wp:term']?.[1]?.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      count: tag.count,
    })) || [];

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''), // 移除 HTML 标签
    author: authorData,
    featuredImage: featuredImageData,
    categories,
    tags,
    date: post.date,
    modified: post.modified,
    status: post.status as any,
    commentStatus: post.comment_status,
    sticky: post.sticky,
    format: post.format,
    meta: {
      readingTime: calculateReadingTime(post.content.rendered),
    },
  };
}

/**
 * 批量转换 WordPress 文章
 */
export function transformWordPressPosts(posts: WordPressPost[]): Article[] {
  return posts.map(transformWordPressPost);
}

/**
 * 转换 WordPress 分类为应用层分类
 */
export function transformWordPressCategory(category: WordPressCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    count: category.count,
    parent: category.parent,
  };
}

/**
 * 转换 WordPress 标签为应用层标签
 */
export function transformWordPressTag(tag: WordPressTag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    count: tag.count,
  };
}

/**
 * 计算阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 计算字数（中文）
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;

  // 计算英文单词数
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;

  // 平均阅读速度：中文 400 字/分钟，英文 200 词/分钟
  const readingTime = Math.ceil(chineseChars / 400 + englishWords / 200);

  return Math.max(readingTime, 1); // 至少 1 分钟
}

/**
 * 截取摘要
 */
export function truncateExcerpt(excerpt: string, maxLength: number = 150): string {
  // 移除 HTML 标签
  const text = excerpt.replace(/<[^>]*>/g, '');

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 格式化文章 URL
 */
export function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 格式化分类 URL
 */
export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`;
}

/**
 * 格式化标签 URL
 */
export function getTagUrl(slug: string): string {
  return `/tag/${slug}`;
}

/**
 * 格式化作者 URL
 */
export function getAuthorUrl(slug: string): string {
  return `/author/${slug}`;
}

/**
 * 从 URL 中提取文章 slug
 */
export function extractPostSlug(url: string): string {
  const match = url.match(/\/blog\/([^\/]+)/);
  return match ? match[1] : '';
}

/**
 * 检查文章是否为最新（7天内）
 */
export function isRecentPost(date: string | Date): boolean {
  const postDate = new Date(date);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return postDate > weekAgo;
}

/**
 * 获取文章状态标签
 */
export function getPostStatusLabel(status: string): { label: string; color: string } {
  const labels: Record<string, { label: string; color: string }> = {
    publish: { label: '已发布', color: 'green' },
    draft: { label: '草稿', color: 'yellow' },
    pending: { label: '待审核', color: 'blue' },
    private: { label: '私密', color: 'gray' },
  };

  return labels[status] || { label: status, color: 'gray' };
}

/**
 * 按分类筛选文章
 */
export function filterPostsByCategory(posts: Article[], categoryId: number): Article[] {
  return posts.filter(post =>
    post.categories.some(cat => cat.id === categoryId)
  );
}

/**
 * 按标签筛选文章
 */
export function filterPostsByTag(posts: Article[], tagId: number): Article[] {
  return posts.filter(post =>
    post.tags.some(tag => tag.id === tagId)
  );
}

/**
 * 搜索文章
 */
export function searchPosts(posts: Article[], query: string): Article[] {
  const lowerQuery = query.toLowerCase();

  return posts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(lowerQuery);
    const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
    const categoryMatch = post.categories.some(cat =>
      cat.name.toLowerCase().includes(lowerQuery)
    );
    const tagMatch = post.tags.some(tag =>
      tag.name.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || excerptMatch || categoryMatch || tagMatch;
  });
}

/**
 * 排序文章
 */
export function sortPosts(
  posts: Article[],
  sortBy: 'date' | 'title' | 'views',
  order: 'asc' | 'desc' = 'desc'
): Article[] {
  const sorted = [...posts].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title, 'zh-CN');
        break;
      case 'views':
        comparison = (a.meta?.views || 0) - (b.meta?.views || 0);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 获取相关文章
 */
export function getRelatedPostsByTags(
  currentPost: Article,
  allPosts: Article[],
  limit: number = 4
): Article[] {
  // 获取当前文章的标签
  const currentTags = new Set(currentPost.tags.map(tag => tag.id));

  // 计算相关度并排序
  const related = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      const postTags = new Set(post.tags.map(tag => tag.id));
      const commonTags = [...currentTags].filter(tagId => postTags.has(tagId));
      return {
        post,
        relevance: commonTags.length,
      };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map(item => item.post);

  return related;
}

/**
 * 生成文章分享链接
 */
export function generateShareLinks(
  title: string,
  url: string,
  description?: string
): Record<string, string> {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
    wechat: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
}

/**
 * 格式化文章元数据
 */
export function formatPostMeta(post: Article): {
  formattedDate: string;
  relativeDate: string;
  readingTime: number;
  categoryNames: string[];
  tagNames: string[];
} {
  return {
    formattedDate: new Date(post.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    relativeDate: getRelativeTime(new Date(post.date)),
    readingTime: post.meta?.readingTime || calculateReadingTime(post.content),
    categoryNames: post.categories.map(cat => cat.name),
    tagNames: post.tags.map(tag => tag.name),
  };
}

/**
 * 获取相对时间
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  return `${Math.floor(diffInSeconds / 31536000)}年前`;
}
