/**
 * SEO Utilities
 * SEO 工具函数 - 搜索引擎优化辅助工具
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

/**
 * 生成页面元数据
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = '/og-image.png',
    ogType = 'website',
    canonical,
    noIndex = false,
    publishedTime,
    modifiedTime,
    section,
    tags,
  } = config;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: ogType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };

  if (canonical) {
    metadata.alternates = { canonical };
  }

  return metadata;
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'Article' | 'BlogPosting' | 'WebPage' | 'BreadcrumbList', data: any) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(base);
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(data: {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  url: string;
}) {
  return generateStructuredData('Article', {
    headline: data.title,
    description: data.description,
    datePublished: data.publishDate,
    dateModified: data.modifiedDate || data.publishDate,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    image: data.image,
    url: data.url,
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: '/logo-main.svg',
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
export function generateBreadcrumbStructuredData(items: Array<{
  name: string;
  url: string;
}>) {
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
 * 生成文章 URL
 */
export function generateArticleSlug(title: string, date?: Date): string {
  const timestamp = date ? date.getTime() : Date.now();
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${slug}-${timestamp}`;
}

/**
 * 从 URL 解析文章信息
 */
export function parseArticleSlug(slug: string): { title: string; timestamp: number } | null {
  const match = slug.match(/^(.+)-(\d{13})$/);
  if (!match) return null;

  const [, title, timestamp] = match;
  return {
    title: title.replace(/-/g, ' '),
    timestamp: parseInt(timestamp),
  };
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 生成文章摘要
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength - 3) + '...';
}

/**
 * 格式化日期为 ISO 格式
 */
export function formatDateToISO(date: Date | string): string {
  return new Date(date).toISOString();
}

/**
 * 生成 sitemap URL
 */
export function generateSitemapUrl(path: string, lastModified?: Date): {
  url: string;
  lastModified?: string;
} {
  return {
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com'}${path}`,
    lastModified: lastModified ? formatDateToISO(lastModified) : undefined,
  };
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(disallowedPaths: string[] = []): string {
  const allowed = [
    'User-agent: *',
    'Allow: /',
    ...disallowedPaths.map(path => `Disallow: ${path}`),
    '',
    'Sitemap: /sitemap.xml',
  ].join('\n');

  return allowed;
}
