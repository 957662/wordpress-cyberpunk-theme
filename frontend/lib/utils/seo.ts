/**
 * SEO 工具函数
 * 用于生成结构化数据、元标签等 SEO 优化功能
 */

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface OpenGraphData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: string;
}

interface JsonLdData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * 生成 Meta 标签
 */
export function generateMetaTags(data: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): MetaTag[] {
  const tags: MetaTag[] = [
    // 基本 Meta 标签
    { name: 'title', content: data.title },
    { name: 'description', content: data.description },
  ];

  // 关键词
  if (data.keywords && data.keywords.length > 0) {
    tags.push({
      name: 'keywords',
      content: data.keywords.join(', '),
    });
  }

  // 作者
  if (data.author) {
    tags.push({ name: 'author', content: data.author });
  }

  // Open Graph
  if (data.title) {
    tags.push({ property: 'og:title', content: data.title });
  }
  if (data.description) {
    tags.push({ property: 'og:description', content: data.description });
  }
  if (data.image) {
    tags.push({ property: 'og:image', content: data.image });
  }
  if (data.url) {
    tags.push({ property: 'og:url', content: data.url });
  }
  tags.push({ property: 'og:type', content: 'article' });

  // Twitter Card
  tags.push({ name: 'twitter:card', content: 'summary_large_image' });
  if (data.title) {
    tags.push({ name: 'twitter:title', content: data.title });
  }
  if (data.description) {
    tags.push({ name: 'twitter:description', content: data.description });
  }
  if (data.image) {
    tags.push({ name: 'twitter:image', content: data.image });
  }

  // 文章特定标签
  if (data.publishedTime) {
    tags.push({ property: 'article:published_time', content: data.publishedTime });
  }
  if (data.modifiedTime) {
    tags.push({ property: 'article:modified_time', content: data.modifiedTime });
  }

  return tags;
}

/**
 * 生成 Open Graph 标签
 */
export function generateOpenGraphTags(data: OpenGraphData): MetaTag[] {
  const tags: MetaTag[] = [];

  if (data.title) {
    tags.push({ property: 'og:title', content: data.title });
  }
  if (data.description) {
    tags.push({ property: 'og:description', content: data.description });
  }
  if (data.image) {
    tags.push({ property: 'og:image', content: data.image });
  }
  if (data.url) {
    tags.push({ property: 'og:url', content: data.url });
  }
  if (data.type) {
    tags.push({ property: 'og:type', content: data.type });
  }
  if (data.siteName) {
    tags.push({ property: 'og:site_name', content: data.siteName });
  }
  if (data.locale) {
    tags.push({ property: 'og:locale', content: data.locale });
  }

  return tags;
}

/**
 * 生成 Twitter Card 标签
 */
export function generateTwitterCardTags(data: TwitterCardData): MetaTag[] {
  const tags: MetaTag[] = [];

  if (data.card) {
    tags.push({ name: 'twitter:card', content: data.card });
  }
  if (data.site) {
    tags.push({ name: 'twitter:site', content: data.site });
  }
  if (data.creator) {
    tags.push({ name: 'twitter:creator', content: data.creator });
  }
  if (data.title) {
    tags.push({ name: 'twitter:title', content: data.title });
  }
  if (data.description) {
    tags.push({ name: 'twitter:description', content: data.description });
  }
  if (data.image) {
    tags.push({ name: 'twitter:image', content: data.image });
  }

  return tags;
}

/**
 * 生成文章结构化数据 (JSON-LD)
 */
export function generateArticleJsonLd(data: {
  title: string;
  description: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
}): string {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    url: data.url,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
  };

  if (data.publisher) {
    jsonLd.publisher = {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: data.publisher.logo,
    };
  }

  return JSON.stringify(jsonLd);
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbJsonLd(items: Array<{
  name: string;
  url: string;
}>): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(jsonLd);
}

/**
 * 生成网站结构化数据
 */
export function generateWebsiteJsonLd(data: {
  name: string;
  url: string;
  description?: string;
  searchAction?: string;
}): string {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
  };

  if (data.description) {
    jsonLd.description = data.description;
  }

  if (data.searchAction) {
    jsonLd.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.searchAction,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return JSON.stringify(jsonLd);
}

/**
 * 生成组织结构化数据
 */
export function generateOrganizationJsonLd(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    type: string;
    telephone?: string;
    email?: string;
  };
}): string {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  };

  if (data.logo) {
    jsonLd.logo = data.logo;
  }

  if (data.description) {
    jsonLd.description = data.description;
  }

  if (data.sameAs && data.sameAs.length > 0) {
    jsonLd.sameAs = data.sameAs;
  }

  if (data.contactPoint) {
    jsonLd.contactPoint = {
      '@type': 'ContactPoint',
      contactType: data.contactPoint.type,
      telephone: data.contactPoint.telephone,
      email: data.contactPoint.email,
    };
  }

  return JSON.stringify(jsonLd);
}

/**
 * 生成 FAQ 结构化数据
 */
export function generateFAQJsonLd(faqs: Array<{
  question: string;
  answer: string;
}>): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(jsonLd);
}

/**
 * 生成产品结构化数据
 */
export function generateProductJsonLd(data: {
  name: string;
  image: string[];
  description: string;
  brand: string;
  sku?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}): string {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    image: data.image,
    description: data.description,
    brand: {
      '@type': 'Brand',
      name: data.brand,
    },
  };

  if (data.sku) {
    jsonLd.sku = data.sku;
  }

  if (data.offers) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
      availability: `https://schema.org/${data.offers.availability}`,
      url: data.offers.url,
    };
  }

  if (data.aggregateRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
    };
  }

  return JSON.stringify(jsonLd);
}

/**
 * 格式化 URL（移除尾部斜杠、添加协议等）
 */
export function normalizeUrl(url: string, base?: string): string {
  try {
    const normalized = new URL(url, base);
    return normalized.href;
  } catch {
    return url;
  }
}

/**
 * 生成规范链接（Canonical URL）
 */
export function generateCanonicalUrl(path: string, baseUrl: string): string {
  return normalizeUrl(path, baseUrl);
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(config: {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
}): string {
  const {
    userAgent = '*',
    allow = [],
    disallow = [],
    sitemap = '',
  } = config;

  let content = `User-agent: ${userAgent}\n`;

  allow.forEach(path => {
    content += `Allow: ${path}\n`;
  });

  disallow.forEach(path => {
    content += `Disallow: ${path}\n`;
  });

  if (sitemap) {
    content += `\nSitemap: ${sitemap}\n`;
  }

  return content;
}

/**
 * 生成 slug（URL 友好的标识符）
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
 * 截断文本（用于 Meta 描述）
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trim() + '...';
}

export default {
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
  generateFAQJsonLd,
  generateProductJsonLd,
  normalizeUrl,
  generateCanonicalUrl,
  generateRobotsTxt,
  generateSlug,
  truncateText,
};
