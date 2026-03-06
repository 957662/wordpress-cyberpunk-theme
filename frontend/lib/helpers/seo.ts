/**
 * SEO 辅助函数
 */

import { Metadata } from 'next';

// 站点基础信息
const SITE_NAME = 'CyberPress Platform';
const SITE_DESCRIPTION = '赛博朋克风格的现代化博客平台，探索科技与美学的无限边界';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * 生成页面元数据
 */
export function generateMetadata({
  title,
  description,
  path = '',
  ogImage = DEFAULT_OG_IMAGE,
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const finalDescription = description || SITE_DESCRIPTION;

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: keywords.length > 0 ? keywords : ['blog', 'technology', 'cyberpunk', 'programming'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,

    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url,
      title: fullTitle,
      description: finalDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`],
      creator: '@cyberpress',
    },

    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },

    manifest: '/manifest.json',

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: url,
    },
  };
}

/**
 * 生成文章页面元数据
 */
export function generatePostMetadata({
  title,
  excerpt,
  coverImage,
  slug,
  author,
  publishedAt,
  tags = [],
}: {
  title: string;
  excerpt?: string;
  coverImage?: string;
  slug: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
}) {
  return generateMetadata({
    title,
    description: excerpt,
    path: `/blog/${slug}`,
    ogImage: coverImage,
    keywords: tags,
  });
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateJsonLd(type: 'WebSite' | 'Article' | 'Breadcrumb', data: any) {
  const base = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'WebSite':
      return {
        ...base,
        '@type': 'WebSite',
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Article':
      return {
        ...base,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt || data.publishedAt,
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
      };

    case 'Breadcrumb':
      return {
        ...base,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return base;
  }
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return generateJsonLd('Breadcrumb', { items });
}

/**
 * 格式化 URL
 */
export function formatUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * 生成 sitemap URL
 */
export function generateSitemapUrl(
  path: string,
  lastModified?: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.8
) {
  return {
    url: formatUrl(path),
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
}
