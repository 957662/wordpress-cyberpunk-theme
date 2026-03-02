/**
 * 增强的 SEO 工具
 * 提供 SEO 元数据生成、结构化数据、社交媒体卡片等功能
 */

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  locale?: string;
  siteName?: string;
}

/**
 * 生成页面元数据
 */
export function generateMetadata(config: SEOConfig): {
  title: string;
  description: string;
  openGraph: Record<string, unknown>;
  twitter: Record<string, unknown>;
  alternates: Record<string, unknown>;
  keywords: string[];
} {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [],
    keywords = [],
    locale = 'zh_CN',
    siteName = 'CyberPress',
  } = config;

  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      locale,
      type,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime,
      modifiedTime,
      authors: authors.length > 0 ? authors : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: string, data: Record<string, unknown>): string {
  const baseData = {
    '@context': 'https://schema.org',
    ...data,
    '@type': type,
  };

  return JSON.stringify(baseData);
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(config: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
}): string {
  return generateStructuredData('Article', {
    headline: config.title,
    description: config.description,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: config.publisher.name,
      logo: config.publisher.logo
        ? {
            '@type': 'ImageObject',
            url: config.publisher.logo,
          }
        : undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
  });
}

/**
 * 生成网站结构化数据
 */
export function generateWebsiteStructuredData(config: {
  name: string;
  url: string;
  description?: string;
  searchAction?: string;
}): string {
  const data: Record<string, unknown> = {
    name: config.name,
    url: config.url,
  };

  if (config.description) {
    data.description = config.description;
  }

  if (config.searchAction) {
    data.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: config.searchAction,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return generateStructuredData('WebSite', data);
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbStructuredData(items: Array<{
  name: string;
  url: string;
}>): string {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * 生成组织结构化数据
 */
export function generateOrganizationStructuredData(config: {
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
  return generateStructuredData('Organization', {
    name: config.name,
    url: config.url,
    logo: config.logo,
    description: config.description,
    sameAs: config.sameAs,
    contactPoint: config.contactPoint
      ? {
          '@type': 'ContactPoint',
          contactType: config.contactPoint.type,
          telephone: config.contactPoint.telephone,
          email: config.contactPoint.email,
        }
      : undefined,
  });
}

/**
 * 生成 FAQ 结构化数据
 */
export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>): string {
  return generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * 生成产品/评价结构化数据
 */
export function generateProductStructuredData(config: {
  name: string;
  image: string;
  description: string;
  brand?: string;
  sku?: string;
  offers?: {
    price: number;
    currency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    datePublished: string;
  }>;
}): string {
  return generateStructuredData('Product', {
    name: config.name,
    image: config.image,
    description: config.description,
    brand: config.brand
      ? {
          '@type': 'Brand',
          name: config.brand,
        }
      : undefined,
    sku: config.sku,
    offers: config.offers
      ? {
          '@type': 'Offer',
          price: config.offers.price,
          priceCurrency: config.offers.currency,
          availability: `https://schema.org/${config.offers.availability}`,
          url: config.offers.url,
        }
      : undefined,
    aggregateRating: config.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: config.aggregateRating.ratingValue,
          reviewCount: config.aggregateRating.reviewCount,
        }
      : undefined,
    review: config.reviews?.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.comment,
      datePublished: review.datePublished,
    })),
  });
}

/**
 * 生成视频结构化数据
 */
export function generateVideoStructuredData(config: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
  interactionStatistic?: {
    type: string;
    userInteractionCount: number;
  };
}): string {
  return generateStructuredData('VideoObject', {
    name: config.name,
    description: config.description,
    thumbnailUrl: config.thumbnailUrl,
    uploadDate: config.uploadDate,
    duration: config.duration,
    embedUrl: config.embedUrl,
    interactionStatistic: config.interactionStatistic
      ? {
          '@type': 'InteractionCounter',
          interactionType: {
            '@type': config.interactionStatistic.type,
          },
          userInteractionCount: config.interactionStatistic.userInteractionCount,
        }
      : undefined,
  });
}

/**
 * 添加结构化数据到页面
 */
export function injectStructuredData(jsonLd: string): void {
  if (typeof document === 'undefined') return;

  // 移除已存在的相同类型的结构化数据
  const existingScript = document.querySelector(`script[type="application/ld+json"]`);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = jsonLd;
  document.head.appendChild(script);
}

/**
 * 生成 sitemap.xml 内容
 */
export function generateSitemapXML(config: {
  baseUrl: string;
  pages: Array<{
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>;
}): string {
  const pages = config.pages
    .map(
      (page) => `  <url>
    <loc>${config.baseUrl}${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : ''}
    ${page.changeFrequency ? `<changefreq>${page.changeFrequency}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages}
</urlset>`;
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
  const { userAgent = '*', allow = [], disallow = [], sitemap } = config;

  let content = `User-agent: ${userAgent}\n`;

  allow.forEach((path) => {
    content += `Allow: ${path}\n`;
  });

  disallow.forEach((path) => {
    content += `Disallow: ${path}\n`;
  });

  if (sitemap) {
    content += `\nSitemap: ${sitemap}\n`;
  }

  return content;
}

/**
 * 生成 canonical URL
 */
export function generateCanonicalURL(path: string, baseUrl: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`.replace(/\/+/g, '/');
}

/**
 * 生成 meta robots 标签
 */
export function generateMetaRobots(config: {
  index?: boolean;
  follow?: boolean;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxSnippet?: number;
  maxVideoPreview?: number;
}): string {
  const directives: string[] = [];

  if (config.index !== undefined) {
    directives.push(config.index ? 'index' : 'noindex');
  }

  if (config.follow !== undefined) {
    directives.push(config.follow ? 'follow' : 'nofollow');
  }

  if (config.maxImagePreview) {
    directives.push(`max-image-preview:${config.maxImagePreview}`);
  }

  if (config.maxSnippet) {
    directives.push(`max-snippet:${config.maxSnippet}`);
  }

  if (config.maxVideoPreview) {
    directives.push(`max-video-preview:${config.maxVideoPreview}`);
  }

  return directives.join(', ');
}
