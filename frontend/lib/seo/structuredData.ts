/**
 * 结构化数据 (JSON-LD) 生成工具
 */

import type { StructuredData } from '@/types/seo.types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';

/**
 * 生成网站结构化数据
 */
export function generateWebSiteStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'CyberPress',
    description: '基于 FastAPI + Next.js 的赛博朋克风格博客平台',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(article: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  modifiedAt?: string;
  author: {
    name: string;
    url?: string;
  };
  category?: string;
  tags?: string[];
}): StructuredData {
  const url = `${siteUrl}/blog/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage || `${siteUrl}/images/og-default.png`,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url || `${siteUrl}/author/${article.author.name}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(article.tags && {
      keywords: article.tags.join(', '),
    }),
    ...(article.category && {
      articleSection: article.category,
    }),
  };
}

/**
 * 生成博客文章结构化数据 (BlogPosting)
 */
export function generateBlogPostingStructuredData(article: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  modifiedAt?: string;
  author: {
    name: string;
    url?: string;
  };
  category?: string;
  tags?: string[];
}): StructuredData {
  const url = `${siteUrl}/blog/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.coverImage || `${siteUrl}/images/og-default.png`,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url || `${siteUrl}/author/${article.author.name}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(article.tags && {
      keywords: article.tags.join(', '),
    }),
    ...(article.category && {
      articleSection: article.category,
    }),
  };
}

/**
 * 生成面包屑结构化数据
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成个人资料结构化数据
 */
export function generatePersonStructuredData(person: {
  name: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    ...(person.description && { description: person.description }),
    ...(person.url && { url: person.url }),
    ...(person.image && { image: person.image }),
    ...(person.sameAs && { sameAs: person.sameAs }),
  };
}

/**
 * 生成组织结构化数据
 */
export function generateOrganizationStructuredData(organization: {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    ...(organization.description && { description: organization.description }),
    ...(organization.url && { url: organization.url }),
    ...(organization.logo && { logo: organization.logo }),
    ...(organization.sameAs && { sameAs: organization.sameAs }),
  };
}

/**
 * 生成 FAQ 页面结构化数据
 */
export function generateFAQPageStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>): StructuredData {
  return {
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
}

/**
 * 将结构化数据转换为 JSON-LD 脚本标签
 */
export function structuredDataToScript(data: StructuredData): string {
  return JSON.stringify(data);
}

/**
 * 生成 JSON-LD 脚本标签组件数据
 */
export function generateJsonLd(data: StructuredData) {
  return {
    __html: structuredDataToScript(data),
    type: 'application/ld+json',
  };
}

export default {
  generateWebSiteStructuredData,
  generateArticleStructuredData,
  generateBlogPostingStructuredData,
  generateBreadcrumbStructuredData,
  generatePersonStructuredData,
  generateOrganizationStructuredData,
  generateFAQPageStructuredData,
  structuredDataToScript,
  generateJsonLd,
};
