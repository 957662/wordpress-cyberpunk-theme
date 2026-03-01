/**
 * SEO 服务
 * 生成和管理页面元数据
 */

import type { SeoProps } from '@/types';

interface Metadata {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
    type?: 'website' | 'article';
    locale?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    images?: string[];
  };
  alternates?: {
    canonical?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

/**
 * SEO 配置
 */
const seoConfig = {
  siteName: 'CyberPress',
  defaultTitle: 'CyberPress - 赛博朋克主题平台',
  defaultDescription: '一个基于 Next.js 和 WordPress 的赛博朋克主题平台',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@cyberpress',
  url: 'https://cyberpress.com',
};

/**
 * 生成页面元数据
 */
export function generateMetadata(props: SeoProps, overrides?: Partial<Metadata>): Metadata {
  const {
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords,
    ogImage = seoConfig.defaultImage,
    twitterCard = 'summary_large_image',
  } = props;

  const fullTitle = title === seoConfig.defaultTitle ? title : `${title} | ${seoConfig.siteName}`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'zh_CN',
      ...overrides?.openGraph,
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
      ...overrides?.twitter,
    },
    alternates: {
      canonical: overrides?.alternates?.canonical,
    },
    robots: {
      index: true,
      follow: true,
      ...overrides?.robots,
    },
    ...overrides,
  };
}

/**
 * 生成文章元数据
 */
export function generateArticleMetadata({
  title,
  description,
  excerpt,
  coverImage,
  publishDate,
  modifiedDate,
  author,
  category,
  tags,
}: {
  title: string;
  description?: string;
  excerpt?: string;
  coverImage?: string;
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  tags?: string[];
}): Metadata {
  return generateMetadata(
    {
      title,
      description: description || excerpt || seoConfig.defaultDescription,
      ogImage: coverImage || seoConfig.defaultImage,
    },
    {
      openGraph: {
        type: 'article',
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: author ? [author] : undefined,
        tags: tags || [],
        section: category,
      },
    }
  );
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(type: 'WebSite' | 'Article' | 'Person', data: any) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  if (type === 'WebSite') {
    return {
      ...base,
      name: data.name || seoConfig.siteName,
      url: data.url || seoConfig.url,
      description: data.description || seoConfig.defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${seoConfig.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (type === 'Article') {
    return {
      ...base,
      headline: data.headline,
      image: data.image ? [data.image] : undefined,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      publisher: {
        '@type': 'Organization',
        name: seoConfig.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${seoConfig.url}/logo.png`,
        },
      },
      description: data.description,
    };
  }

  if (type === 'Person') {
    return {
      ...base,
      name: data.name,
      url: data.url,
      jobTitle: data.jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: seoConfig.siteName,
      },
    };
  }

  return base;
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
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
 * 面包屑生成器
 */
export function generateBreadcrumb(pathname: string, labels?: Record<string, string>) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: '首页', url: '/' }];

  let currentPath = '';
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = labels?.[path] || path;
    breadcrumbs.push({
      name: label,
      url: currentPath,
    });
  });

  return breadcrumbs;
}

export default {
  generateMetadata,
  generateArticleMetadata,
  generateStructuredData,
  generateBreadcrumbStructuredData,
  generateBreadcrumb,
};
