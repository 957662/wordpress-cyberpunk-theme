/**
 * SEO 元数据生成工具
 */

import type { SEOConfig, OpenGraphConfig, TwitterCardConfig } from '@/types/seo.types';

const defaultSEOConfig: SEOConfig = {
  title: 'CyberPress - 赛博朋克博客平台',
  description: '基于 FastAPI + Next.js 的现代化赛博朋克风格博客平台',
  keywords: ['cyberpunk', 'blog', 'next.js', 'fastapi', '赛博朋克', '博客', '技术博客'],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';

/**
 * 生成完整的 SEO 元数据
 */
export function generateMetadata(config: Partial<SEOConfig> = {}) {
  const mergedConfig = { ...defaultSEOConfig, ...config };

  return {
    title: mergedConfig.title,
    description: mergedConfig.description,
    keywords: mergedConfig.keywords?.join(', '),
    authors: [{ name: 'CyberPress Team', url: siteUrl }],
    creator: 'CyberPress',
    publisher: 'CyberPress',

    // Open Graph
    openGraph: generateOpenGraph({
      type: 'website',
      title: mergedConfig.title,
      description: mergedConfig.description,
      url: siteUrl,
      image: mergedConfig.ogImage,
      locale: 'zh_CN',
      siteName: 'CyberPress',
    }),

    // Twitter
    twitter: generateTwitterCard({
      card: 'summary_large_image',
      title: mergedConfig.title,
      description: mergedConfig.description,
      image: mergedConfig.twitterImage,
    }),

    // Robots
    robots: {
      index: !mergedConfig.noindex,
      follow: !mergedConfig.nofollow,
      googleBot: {
        index: !mergedConfig.noindex,
        follow: !mergedConfig.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    ...(mergedConfig.canonical && {
      alternates: {
        canonical: mergedConfig.canonical,
      },
    }),

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

/**
 * 生成 Open Graph 配置
 */
export function generateOpenGraph(config: OpenGraphConfig) {
  return {
    type: config.type,
    title: config.title,
    description: config.description,
    url: config.url,
    siteName: config.siteName || 'CyberPress',
    locale: config.locale || 'zh_CN',
    images: config.image
      ? [
          {
            url: config.image,
            width: 1200,
            height: 630,
            alt: config.title,
          },
        ]
      : [],
    ...(config.type === 'article' && config.article
      ? {
          publishedTime: config.article.publishedTime,
          modifiedTime: config.article.modifiedTime,
          authors: config.article.authors,
          section: config.article.section,
          tags: config.article.tags,
        }
      : {}),
  };
}

/**
 * 生成 Twitter Card 配置
 */
export function generateTwitterCard(config: TwitterCardConfig) {
  return {
    card: config.card,
    title: config.title,
    description: config.description,
    images: config.image ? [config.image] : [],
    ...(config.site && { site: config.site }),
    ...(config.creator && { creator: config.creator }),
  };
}

/**
 * 生成文章页面元数据
 */
export function generateArticleMetadata(article: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: {
    name: string;
    url?: string;
  };
  tags?: string[];
  category?: string;
}) {
  const url = `${siteUrl}/blog/${article.slug}`;
  const config: SEOConfig = {
    title: `${article.title} | CyberPress`,
    description: article.excerpt,
    ogImage: article.coverImage,
    twitterImage: article.coverImage,
    canonical: url,
  };

  const metadata = generateMetadata(config);

  // Add article-specific Open Graph
  metadata.openGraph = {
    ...metadata.openGraph,
    type: 'article',
    url,
    ...(article.publishedAt && {
      publishedTime: article.publishedAt,
    }),
    ...(article.modifiedAt && {
      modifiedTime: article.modifiedAt,
    }),
    ...(article.author && {
      authors: [article.author.name],
    }),
    ...(article.category && {
      section: article.category,
    }),
    ...(article.tags && {
      tags: article.tags,
    }),
  };

  return metadata;
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'WebSite' | 'Article' | 'BreadcrumbList', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'WebSite':
      return {
        ...baseData,
        '@type': 'WebSite',
        url: siteUrl,
        name: 'CyberPress',
        description: defaultSEOConfig.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.title,
        image: data.image,
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt || data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.author?.name || 'CyberPress Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'CyberPress',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        description: data.excerpt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
      };

    case 'BreadcrumbList':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return baseData;
  }
}

/**
 * 生成 canonical URL
 */
export function generateCanonicalUrl(path: string) {
  return `${siteUrl}${path}`;
}

/**
 * 检查 URL 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default {
  generateMetadata,
  generateOpenGraph,
  generateTwitterCard,
  generateArticleMetadata,
  generateStructuredData,
  generateCanonicalUrl,
  isValidUrl,
  generateSlug,
};
