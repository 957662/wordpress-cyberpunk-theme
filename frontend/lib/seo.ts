/**
 * SEO 工具函数
 */

import { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

// ============ Metadata 生成器 ============

/**
 * 生成基础 metadata
 */
export function generateBaseMetadata(): Metadata {
  return {
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: ['blog', 'technology', 'cyberpunk', 'web development'],
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: SITE_CONFIG.url,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      creator: '@cyberpress',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  };
}

/**
 * 生成页面 metadata
 */
export function generatePageMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, image, keywords, noIndex } = options;
  const url = `${SITE_CONFIG.url}${path}`;
  const ogImage = image || `${SITE_CONFIG.url}/og-image.png`;

  return {
    title,
    description,
    keywords: keywords || [],
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 生成博客文章 metadata
 */
export function generateBlogPostMetadata(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}): Metadata {
  const { title, description, slug, image, author, publishedTime, modifiedTime, tags } = options;
  const url = `${SITE_CONFIG.url}/blog/${slug}`;
  const ogImage = image || `${SITE_CONFIG.url}/og-image.png`;

  return {
    title,
    description,
    keywords: tags,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
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
      authors: [author || SITE_CONFIG.author],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

// ============ 结构化数据 ============

/**
 * 生成网站结构化数据
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成文章结构化数据
 */
export function generateArticleSchema(options: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  publishedTime: string;
  modifiedTime?: string;
}) {
  const { title, description, slug, image, author, publishedTime, modifiedTime } = options;
  const url = `${SITE_CONFIG.url}/blog/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image || `${SITE_CONFIG.url}/og-image.png`,
    url,
    author: {
      '@type': 'Person',
      name: author || SITE_CONFIG.author,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成组织结构化数据
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: Object.values(SITE_CONFIG.social || {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE_CONFIG.social?.email,
    },
  };
}

// ============ Sitemap 生成器 ============

/**
 * 生成 sitemap XML
 */
export function generateSitemapXml(urls: Array<{ url: string; lastModified?: string }>): string {
  const xmlItems = urls
    .map(
      ({ url, lastModified }) => `
  <url>
    <loc>${url}</loc>
    ${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
}

// ============ Robots.txt 生成器 ============

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(): string {
  return `# Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# Disallow specific paths if needed
# Disallow: /admin/
# Disallow: /api/
`;
}
