/**
 * SEO 优化工具
 * 提供各种 SEO 相关的辅助函数
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  tags?: string[];
}

/**
 * 生成 SEO 友好的 URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // 分离重音字符
    .replace(/[\u0300-\u036f]/g, '') // 移除重音
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 替换非字母数字字符为连字符
    .replace(/^-+|-+$/g, '') // 移除首尾连字符
    .replace(/-+/g, '-'); // 合并多个连字符
}

/**
 * 生成优化的页面标题
 */
export function generatePageTitle(title: string, suffix: string = 'CyberPress'): string {
  const maxLength = 60;
  const fullTitle = `${title} | ${suffix}`;

  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  // 如果超过长度，截断标题部分
  const titlePart = title.substring(0, maxLength - suffix.length - 4);
  return `${titlePart}... | ${suffix}`;
}

/**
 * 生成优化的 meta 描述
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 截断到指定长度
  if (text.length <= maxLength) {
    return text;
  }

  // 在最后一个完整句子处截断
  const truncated = text.substring(0, maxLength - 3);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastSpace = truncated.lastIndexOf(' ');

  const cutPoint = lastPeriod > 0 ? lastPeriod + 1 : lastSpace > 0 ? lastSpace : maxLength - 3;

  return truncated.substring(0, cutPoint) + '...';
}

/**
 * 生成关键词
 */
export function generateKeywords(content: string, maxKeywords: number = 10): string[] {
  // 简单的关键词提取算法
  const words = content
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // 词频统计
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // 过滤常见停用词
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
    '的', '了', '是', '在', '和', '有', '我', '不', '人', '这', '中', '大',
    '为', '上', '个', '到', '说', '去', '你', '会', '着', '不', '看',
  ]);

  const filtered = Array.from(wordCount.entries())
    .filter(([word]) => !stopWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return filtered;
}

/**
 * 计算内容可读性分数（Flesch Reading Ease）
 */
export function calculateReadabilityScore(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (words.length === 0 || sentences.length === 0) return 0;

  // Flesch Reading Ease 公式
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);
  return Math.max(0, Math.min(100, score));
}

/**
 * 估算音节数（简化版）
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);

  return matches ? matches.length : 1;
}

/**
 * 生成结构化数据（JSON-LD）
 */
export function generateJsonLd(type: 'article' | 'website' | 'organization', data: any): string {
  const base = {
    '@context': 'https://schema.org',
    '@type': type.charAt(0).toUpperCase() + type.slice(1),
    ...data,
  };

  return JSON.stringify(base);
}

/**
 * 验证 SEO 设置
 */
export function validateSEO(meta: SEOMetadata): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查标题
  if (!meta.title) {
    errors.push('缺少页面标题');
  } else if (meta.title.length > 60) {
    warnings.push('标题过长，建议控制在60字符以内');
  } else if (meta.title.length < 30) {
    warnings.push('标题过短，建议至少30字符');
  }

  // 检查描述
  if (!meta.description) {
    errors.push('缺少页面描述');
  } else if (meta.description.length > 160) {
    warnings.push('描述过长，建议控制在160字符以内');
  } else if (meta.description.length < 120) {
    warnings.push('描述过短，建议至少120字符');
  }

  // 检查图片
  if (!meta.image) {
    warnings.push('缺少社交分享图片');
  }

  // 检查关键词
  if (!meta.keywords || meta.keywords.length === 0) {
    warnings.push('缺少页面关键词');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * 生成 Open Graph 元数据
 */
export function generateOpenGraphMeta(meta: SEOMetadata): Array<{ property: string; content: string }> {
  const metaTags: Array<{ property: string; content: string }> = [
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: meta.url || '' },
  ];

  if (meta.image) {
    metaTags.push({ property: 'og:image', content: meta.image });
    metaTags.push({ property: 'og:image:width', content: '1200' });
    metaTags.push({ property: 'og:image:height', content: '630' });
  }

  if (meta.publishedAt) {
    metaTags.push({ property: 'article:published_time', content: meta.publishedAt });
  }

  if (meta.modifiedAt) {
    metaTags.push({ property: 'article:modified_time', content: meta.modifiedAt });
  }

  if (meta.author) {
    metaTags.push({ property: 'article:author', content: meta.author });
  }

  if (meta.category) {
    metaTags.push({ property: 'article:section', content: meta.category });
  }

  if (meta.tags && meta.tags.length > 0) {
    meta.tags.forEach(tag => {
      metaTags.push({ property: 'article:tag', content: tag });
    });
  }

  return metaTags;
}

/**
 * 生成 Twitter Card 元数据
 */
export function generateTwitterCardMeta(meta: SEOMetadata): Array<{ name: string; content: string }> {
  return [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    ...(meta.image ? [{ name: 'twitter:image', content: meta.image }] : []),
  ];
}

/**
 * 检查图片是否适合 SEO
 */
export function validateImageForSEO(image: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!image.alt) {
    errors.push('图片缺少 alt 属性');
  } else if (image.alt.length > 125) {
    warnings.push('alt 文本过长，建议控制在125字符以内');
  }

  if (!image.width || !image.height) {
    warnings.push('缺少图片尺寸信息');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
