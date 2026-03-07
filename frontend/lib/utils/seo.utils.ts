/**
 * SEO Utility Functions
 * SEO 优化工具函数集
 */

/**
 * Meta 标签接口
 */
export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

/**
 * Open Graph 数据接口
 */
export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

/**
 * 生成 Meta 标签
 */
export function generateMetaTags(config: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): MetaTag[] {
  const {
    title,
    description,
    keywords,
    image,
    url,
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const tags: MetaTag[] = [
    // 基本 Meta 标签
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords?.join(', ') || '' },
    { name: 'author', content: author || '' },

    // Open Graph 标签
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image || '' },
    { property: 'og:url', content: url || '' },
    { property: 'og:type', content: 'website' },

    // Twitter Card 标签
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image || '' },

    // 文章特定标签
    ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
    ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
  ];

  return tags;
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'article' | 'website' | 'blog', data: any): string {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : type === 'blog' ? 'Blog' : 'WebSite',
    ...data,
  };

  return JSON.stringify(baseData);
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(data: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  url: string;
}): string {
  return generateStructuredData('article', {
    headline: data.title,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    url: data.url,
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  });
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

/**
 * 优化标题
 */
export function optimizeTitle(title: string, siteName: string = 'CyberPress'): string {
  const maxLength = 60;
  let optimized = title;

  if (title.length > maxLength) {
    optimized = title.substring(0, maxLength - 3) + '...';
  }

  return `${optimized} | ${siteName}`;
}

/**
 * 优化描述
 */
export function optimizeDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) {
    return description;
  }

  // 在句子边界截断
  const sentences = description.split(/[.!?。！？]/);
  let optimized = '';

  for (const sentence of sentences) {
    if ((optimized + sentence).length <= maxLength - 3) {
      optimized += sentence + '. ';
    } else {
      break;
    }
  }

  if (optimized.length === 0) {
    return description.substring(0, maxLength - 3) + '...';
  }

  return optimized.trim();
}

/**
 * 生成 URL 友好的 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 生成关键词
 */
export function generateKeywords(content: string, maxKeywords: number = 10): string[] {
  // 移除常见停用词
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    '的', '了', '是', '在', '和', '有', '我', '他', '她', '它', '们',
  ]);

  // 分词并统计频率
  const words = content
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const frequency: { [key: string]: number } = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // 按频率排序并返回前 N 个
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * 生成摘要
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 截取指定长度
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
}

/**
 * 生成规范 URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  const cleanPath = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  return new URL(cleanPath, baseUrl).href;
}

/**
 * 生成图片 alt 文本
 */
export function generateAltText(imageContent: string, fallback: string = 'Image'): string {
  // 如果有描述，使用描述
  if (imageContent && imageContent.length > 0) {
    return imageContent.substring(0, 125);
  }

  return fallback;
}

/**
 * 检查 SEO 基本要素
 */
export function checkSEORequirements(data: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 标题检查
  if (!data.title) {
    errors.push('缺少页面标题');
  } else if (data.title.length < 30) {
    warnings.push('标题过短，建议至少 30 个字符');
  } else if (data.title.length > 60) {
    warnings.push('标题过长，建议不超过 60 个字符');
  }

  // 描述检查
  if (!data.description) {
    errors.push('缺少页面描述');
  } else if (data.description.length < 120) {
    warnings.push('描述过短，建议至少 120 个字符');
  } else if (data.description.length > 160) {
    warnings.push('描述过长，建议不超过 160 个字符');
  }

  // 关键词检查
  if (!data.keywords || data.keywords.length === 0) {
    warnings.push('缺少关键词');
  }

  // 图片检查
  if (!data.image) {
    warnings.push('缺少社交分享图片');
  }

  // URL 检查
  if (!data.url) {
    warnings.push('缺少规范 URL');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(config: {
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
}): string {
  const { allow = [], disallow = [], sitemap } = config;

  let content = 'User-agent: *\n';

  if (allow.length > 0) {
    allow.forEach((path) => {
      content += `Allow: ${path}\n`;
    });
  }

  if (disallow.length > 0) {
    disallow.forEach((path) => {
      content += `Disallow: ${path}\n`;
    });
  }

  if (sitemap) {
    content += `\nSitemap: ${sitemap}\n`;
  }

  return content;
}

/**
 * 生成 sitemap XML
 */
export function generateSitemap(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
  const urlEntries = urls.map((url) => {
    return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>\n` : ''}${
      url.changefreq ? `<changefreq>${url.changefreq}</changefreq>\n` : ''
    }${url.priority ? `<priority>${url.priority}</priority>\n` : ''}  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// 默认导出
export default {
  generateMetaTags,
  generateStructuredData,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  optimizeTitle,
  optimizeDescription,
  generateSlug,
  generateKeywords,
  generateExcerpt,
  generateCanonicalUrl,
  generateAltText,
  checkSEORequirements,
  generateRobotsTxt,
  generateSitemap,
};
