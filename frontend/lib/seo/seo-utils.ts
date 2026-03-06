/**
 * SEO Utilities - SEO 优化工具集
 *
 * 提供各种搜索引擎优化相关的工具函数
 */

/**
 * 生成页面元数据
 */
export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata(meta: MetaData) {
  const metadata: Record<string, any> = {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(', '),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: meta.ogType || 'website',
      ...(meta.ogImage && { images: [meta.ogImage] }),
    },
    ...(meta.canonical && { alternates: { canonical: meta.canonical } }),
    ...(meta.noindex && { robots: { index: false, follow: !meta.nofollow } }),
  };

  return metadata;
}

/**
 * 生成结构化数据（JSON-LD）
 */
export interface StructuredData {
  type: 'WebSite' | 'Article' | 'Organization' | 'Person' | 'BreadcrumbList';
  data: any;
}

export function generateJsonLd(structuredData: StructuredData): string {
  const baseData = {
    '@context': 'https://schema.org',
    ...structuredData.data,
  };

  return JSON.stringify(baseData);
}

/**
 * 生成文章结构化数据
 */
export interface ArticleStructuredData {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  image?: string;
  url: string;
}

export function generateArticleStructuredData(article: ArticleStructuredData): string {
  const data: StructuredData = {
    type: 'Article',
    data: {
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.publishDate,
      ...(article.modifiedDate && { dateModified: article.modifiedDate }),
      author: {
        '@type': 'Person',
        name: article.author.name,
        ...(article.author.url && { url: article.author.url }),
      },
      publisher: {
        '@type': 'Organization',
        name: article.publisher.name,
        ...(article.publisher.logo && { logo: article.publisher.logo }),
      },
      ...(article.image && { image: article.image }),
      url: article.url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url,
      },
    },
  };

  return generateJsonLd(data);
}

/**
 * 生成网站结构化数据
 */
export interface WebSiteStructuredData {
  name: string;
  url: string;
  description?: string;
  searchAction?: {
    target: string;
    queryInput: string;
  };
}

export function generateWebSiteStructuredData(site: WebSiteStructuredData): string {
  const data: StructuredData = {
    type: 'WebSite',
    data: {
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      ...(site.description && { description: site.description }),
      ...(site.searchAction && {
        potentialAction: {
          '@type': 'SearchAction',
          target: site.searchAction.target,
          'query-input': site.searchAction.queryInput,
        },
      }),
    },
  };

  return generateJsonLd(data);
}

/**
 * 生成面包屑结构化数据
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]): string {
  const data: StructuredData = {
    type: 'BreadcrumbList',
    data: {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': item.url,
          name: item.name,
        },
      })),
    },
  };

  return generateJsonLd(data);
}

/**
 * 生成 SEO 友好的 URL slug
 */
export function generateSlug(text: string, options: {
  lowercase?: boolean;
  separator?: string;
  max_length?: number;
} = {}): string {
  const {
    lowercase = true,
    separator = '-',
    max_length,
  } = options;

  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // 移除重音符号
    .replace(/[^\w\s-]/g, '') // 只保留字母、数字、空格和连字符
    .trim()
    .replace(/\s+/g, separator); // 空格替换为分隔符

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (max_length && slug.length > max_length) {
    slug = slug.substring(0, max_length).replace(new RegExp(`${separator}$`), '');
  }

  return slug;
}

/**
 * 生成文章描述摘要
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160,
  suffix: string = '...'
): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, ' ');
  
  // 移除多余空格
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= maxLength) {
    return cleanedText;
  }

  // 在句子边界截断
  const truncated = cleanedText.substring(0, maxLength);
  const lastSentence = truncated.search(/[。！？.!?]\s/);

  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }

  // 在最后一个空格处截断
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * 优化图片 alt 文本
 */
export function generateImageAlt(imagePath: string, fallback: string = 'Image'): string {
  // 从文件路径提取文件名
  const fileName = imagePath.split('/').pop()?.split('.')[0];
  
  if (!fileName) {
    return fallback;
  }

  // 将连字符和下划线替换为空格
  const altText = fileName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return altText || fallback;
}

/**
 * 检查 URL 是否规范
 */
export function normalizeUrl(url: string, baseUrl: string): string {
  try {
    const urlObj = new URL(url, baseUrl);
    
    // 移除尾部斜杠（对于根路径除外）
    let pathname = urlObj.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    
    // 移除 URL 参数（用于规范 URL）
    urlObj.pathname = pathname;
    urlObj.search = '';
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * 生成规范链接标签
 */
export function generateCanonicalLink(url: string): string {
  return `<link rel="canonical" href="${url}" />`;
}

/**
 * 生成 hreflang 标签
 */
export interface HreflangTag {
  lang: string;
  url: string;
}

export function generateHreflangTags(tags: HreflangTag[]): string {
  return tags
    .map((tag) => `<link rel="alternate" hreflang="${tag.lang}" href="${tag.url}" />`)
    .join('\n');
}

/**
 * 计算关键词密度
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  
  const keywordCount = words.filter((word) => word.includes(keywordLower)).length;
  
  return (keywordCount / words.length) * 100;
}

/**
 * 生成关键词标签
 */
export function generateMetaKeywords(keywords: string[]): string {
  return `<meta name="keywords" content="${keywords.join(', ')}" />`;
}

/**
 * 生成 robots meta 标签
 */
export interface RobotsMeta {
  index?: boolean;
  follow?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}

export function generateRobotsMeta(meta: RobotsMeta): string {
  const directives: string[] = [];

  directives.push(meta.index === false ? 'noindex' : 'index');
  directives.push(meta.follow === false ? 'nofollow' : 'follow');

  if (meta.maxSnippet !== undefined) {
    directives.push(`max-snippet:${meta.maxSnippet}`);
  }

  if (meta.maxImagePreview) {
    directives.push(`max-image-preview:${meta.maxImagePreview}`);
  }

  if (meta.maxVideoPreview !== undefined) {
    directives.push(`max-video-preview:${meta.maxVideoPreview}`);
  }

  return `<meta name="robots" content="${directives.join(', ')}" />`;
}

/**
 * 生成 Open Graph 标签
 */
export function generateOpenGraphTags(meta: {
  title: string;
  type: string;
  url: string;
  image?: string;
  description?: string;
  siteName?: string;
}): string {
  const tags = [
    `<meta property="og:title" content="${meta.title}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:url" content="${meta.url}" />`,
  ];

  if (meta.image) {
    tags.push(`<meta property="og:image" content="${meta.image}" />`);
  }

  if (meta.description) {
    tags.push(`<meta property="og:description" content="${meta.description}" />`);
  }

  if (meta.siteName) {
    tags.push(`<meta property="og:site_name" content="${meta.siteName}" />`);
  }

  return tags.join('\n');
}

/**
 * 生成 Twitter Card 标签
 */
export function generateTwitterCardTags(meta: {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description?: string;
  image?: string;
}): string {
  const tags = [
    `<meta name="twitter:card" content="${meta.card}" />`,
    `<meta name="twitter:title" content="${meta.title}" />`,
  ];

  if (meta.site) {
    tags.push(`<meta name="twitter:site" content="${meta.site}" />`);
  }

  if (meta.creator) {
    tags.push(`<meta name="twitter:creator" content="${meta.creator}" />`);
  }

  if (meta.description) {
    tags.push(`<meta name="twitter:description" content="${meta.description}" />`);
  }

  if (meta.image) {
    tags.push(`<meta name="twitter:image" content="${meta.image}" />`);
  }

  return tags.join('\n');
}

/**
 * SEO 检查清单
 */
export interface SEOD checklist {
  hasTitle: boolean;
  hasDescription: boolean;
  hasH1: boolean;
  hasAltText: boolean;
  hasCanonical: boolean;
  hasStructuredData: boolean;
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
}

export function checkSEO(html: string): Partial<SEOD checklist> {
  const checklist: Partial<SEOD checklist> = {
    hasTitle: /<title/i.test(html),
    hasDescription: /<meta[^>]*name=["']description["']/i.test(html),
    hasH1: /<h1/i.test(html),
    hasAltText: /<img[^>]*alt=/i.test(html),
    hasCanonical: /<link[^>]*rel=["']canonical["']/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
  };

  return checklist;
}

export default {
  generateMetadata,
  generateJsonLd,
  generateArticleStructuredData,
  generateWebSiteStructuredData,
  generateBreadcrumbStructuredData,
  generateSlug,
  generateExcerpt,
  generateImageAlt,
  normalizeUrl,
  generateCanonicalLink,
  generateHreflangTags,
  calculateKeywordDensity,
  generateMetaKeywords,
  generateRobotsMeta,
  generateOpenGraphTags,
  generateTwitterCardTags,
  checkSEO,
};
