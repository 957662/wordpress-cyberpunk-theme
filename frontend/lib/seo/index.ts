import { Metadata, ResolvingMetadata } from 'next';

/**
 * SEO 工具函数库
 *
 * 提供统一的 SEO metadata 生成函数
 */

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  alternate?: {
    canonical: string;
    languages: Record<string, string>;
  };
}

const siteConfig = {
  name: 'CyberPress',
  title: 'CyberPress - 赛博朋克博客平台',
  description: '基于 WordPress + Next.js 的现代化赛博朋克风格博客平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev',
  ogImage: '/og-image.svg',
  siteName: 'CyberPress',
  twitter: '@cyberpress',
  locale: 'zh_CN',
  type: 'website',
};

/**
 * 生成基础 metadata
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description,
    image,
    keywords,
    author = 'CyberPress Team',
    publishedTime,
    modifiedTime,
    section,
    tags,
    noindex = false,
    nofollow = false,
    canonical,
    alternate,
  } = props;

  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const fullDescription = description || siteConfig.description;
  const fullImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords?.join(', '),
    authors: [{ name: author }],
    creators: [author],
    publisher: siteConfig.name,

    // Open Graph
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonical || siteConfig.url,
      title: fullTitle,
      description: fullDescription,
      siteName: siteConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      publishedTime,
      modifiedTime,
      section,
      tags,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical
    alternates: {
      canonical: canonical,
      languages: alternate?.languages,
    },

    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/manifest.json',

    // Other
    category: section,
    classification: 'blog',
  };
}

/**
 * 生成文章 metadata
 */
export function generatePostMetadata(props: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  publishedTime: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  const canonical = `${siteConfig.url}/blog/${props.slug}`;

  return generateMetadata({
    title: props.title,
    description: props.description,
    image: props.image,
    author: props.author,
    publishedTime: props.publishedTime,
    modifiedTime: props.modifiedTime,
    section: props.category,
    tags: props.tags,
    canonical,
  });
}

/**
 * 生成分类页面 metadata
 */
export function generateCategoryMetadata(props: {
  name: string;
  description?: string;
  slug: string;
}): Metadata {
  const title = `${props.name}分类`;
  const description = props.description || `浏览 ${props.name} 分类下的所有文章`;
  const canonical = `${siteConfig.url}/category/${props.slug}`;

  return generateMetadata({
    title,
    description,
    canonical,
  });
}

/**
 * 生成标签页面 metadata
 */
export function generateTagMetadata(props: {
  name: string;
  description?: string;
  slug: string;
}): Metadata {
  const title = `${props.name}标签`;
  const description = props.description || `浏览带有 ${props.name} 标签的所有文章`;
  const canonical = `${siteConfig.url}/tag/${props.slug}`;

  return generateMetadata({
    title,
    description,
    canonical,
  });
}

/**
 * 生成作者页面 metadata
 */
export function generateAuthorMetadata(props: {
  name: string;
  bio?: string;
  slug: string;
  image?: string;
}): Metadata {
  const title = `${props.name} - 作者`;
  const description = props.bio || `阅读 ${props.name} 的所有文章`;
  const canonical = `${siteConfig.url}/author/${props.slug}`;

  return generateMetadata({
    title,
    description,
    image: props.image,
    canonical,
    type: 'profile',
  });
}

/**
 * 生成结构化数据（JSON-LD）
 */
export function generateJsonLd(type: string, data: Record<string, any>) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseData);
}

/**
 * 文章结构化数据
 */
export function generateArticleJsonLd(data: {
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
}) {
  return generateJsonLd('Article', {
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo || `${siteConfig.url}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  });
}

/**
 * 网站结构化数据
 */
export function generateWebsiteJsonLd() {
  return generateJsonLd('WebSite', {
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

/**
 * 面包屑结构化数据
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * 组织结构化数据
 */
export function generateOrganizationJsonLd() {
  return generateJsonLd('Organization', {
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    sameAs: [
      'https://twitter.com/cyberpress',
      'https://github.com/cyberpress',
    ],
  });
}

/**
 * 生成页面视口配置
 */
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#00f0ff',
  };
}

/**
 * 生成验证 meta 标签
 */
export function generateVerification() {
  return {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || '',
    'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
  };
}

export default {
  generateMetadata,
  generatePostMetadata,
  generateCategoryMetadata,
  generateTagMetadata,
  generateAuthorMetadata,
  generateJsonLd,
  generateArticleJsonLd,
  generateWebsiteJsonLd,
  generateBreadcrumbJsonLd,
  generateOrganizationJsonLd,
  generateViewport,
  generateVerification,
};
