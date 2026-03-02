/**
 * SEO 服务
 * 处理所有 SEO 相关的功能
 */

import { Metadata } from 'next';

// 站点基础信息
const SITE_CONFIG = {
  name: 'CyberPress Platform',
  title: 'CyberPress - 赛博朋克风格的现代化博客平台',
  description: '基于 WordPress REST API 的现代化赛博朋克风格博客平台，融合未来科技感与极致用户体验。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com',
  image: '/og-image.png',
  twitter: '@cyberpress',
  author: 'CyberPress Team',
  keywords: ['WordPress', 'Next.js', '赛博朋克', '博客', 'CMS', 'Headless', 'React'],
  locale: 'zh_CN'
} as const;

/**
 * 生成基础元数据
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.title,
      template: '%s | ' + SITE_CONFIG.name
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.name,

    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.image,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      images: [SITE_CONFIG.image],
      creator: SITE_CONFIG.twitter
    },

    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png'
    },

    manifest: '/manifest.json',

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
    }
  };
}

/**
 * 生成页面元数据
 */
export function generatePageMetadata(props: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImage = props.image || SITE_CONFIG.image;

  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords || SITE_CONFIG.keywords,
    openGraph: {
      type: 'website',
      url,
      title: props.title,
      description: props.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: props.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: props.title,
      description: props.description,
      images: [ogImage]
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: !props.noIndex,
      follow: !props.noIndex
    }
  };
}

/**
 * 生成文章元数据
 */
export function generatePostMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const image = post.featuredImage || SITE_CONFIG.image;
  const description = post.excerpt || post.title;

  return {
    title: post.title,
    description,
    keywords: [post.category, ...(post.tags || [])].filter(Boolean),
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      authors: post.author ? [post.author] : undefined,
      section: post.category,
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
      creator: post.author
    },
    alternates: {
      canonical: url
    }
  };
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateJsonLd(type: 'WebSite' | 'Article' | 'Person', data: any) {
  const baseLd = {
    '@context': 'https://schema.org',
    '@type': type
  };

  if (type === 'WebSite') {
    return {
      ...baseLd,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  if (type === 'Article') {
    return {
      ...baseLd,
      headline: data.title,
      description: data.excerpt,
      image: data.featuredImage,
      datePublished: data.publishedAt,
      dateModified: data.modifiedAt,
      author: {
        '@type': 'Person',
        name: data.author
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_CONFIG.url}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.url}/blog/${data.slug}`
      }
    };
  }

  if (type === 'Person') {
    return {
      ...baseLd,
      name: data.name,
      url: data.url,
      jobTitle: data.jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: SITE_CONFIG.name
      },
      sameAs: data.socialLinks
    };
  }

  return baseLd;
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * 格式化 URL
 */
export function formatUrl(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}

/**
 * 生成 sitemap URL
 */
export function generateSitemapUrl(
  path: string,
  lastModified?: Date,
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  priority?: number
) {
  return {
    url: formatUrl(path),
    lastModified: lastModified || new Date(),
    changeFrequency: changeFrequency || 'weekly',
    priority: priority || 0.7
  };
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(): string {
  return `# CyberPress Platform robots.txt

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /wp-json/

Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;
}
