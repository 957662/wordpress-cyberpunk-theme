'use client';

/**
 * CyberPress Platform - JSON-LD Structured Data Component
 * JSON-LD 结构化数据组件
 */

import { useEffect } from 'react';

export interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // 检查是否已存在相同的 JSON-LD 脚本
    const existingScript = document.getElementById(`json-ld-${JSON.stringify(data)}`);
    if (existingScript) {
      return;
    }

    // 创建新的 JSON-LD 脚本标签
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = `json-ld-${JSON.stringify(data)}`;
    document.head.appendChild(script);

    // 清理函数
    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}

// 预定义的结构化数据类型生成器
export const JsonLdHelpers = {
  // 网站信息
  website: (data: {
    name: string;
    url: string;
    description?: string;
    searchAction?: boolean;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    ...(data.searchAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${data.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  }),

  // 文章
  article: (data: {
    title: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    author: {
      name: string;
      url?: string;
    };
    publisher?: {
      name: string;
      logo?: string;
    };
    image?: string;
    description?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    url: data.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    ...(data.publisher && {
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        ...(data.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: data.publisher.logo,
          },
        }),
      },
    }),
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
      },
    }),
    description: data.description,
  }),

  // 博客文章
  blogPost: (data: {
    title: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    author: {
      name: string;
      url?: string;
    };
    image?: string;
    description?: string;
    category?: string;
    tags?: string[];
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    url: data.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
      },
    }),
    description: data.description,
    articleSection: data.category,
    keywords: data.tags?.join(', '),
  }),

  // 面包屑
  breadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // 组织
  organization: (data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
      type: string;
      email: string;
    };
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && {
      logo: {
        '@type': 'ImageObject',
        url: data.logo,
      },
    }),
    description: data.description,
    sameAs: data.sameAs,
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: data.contactPoint.type,
        email: data.contactPoint.email,
      },
    }),
  }),

  // 个人资料
  person: (data: {
    name: string;
    url?: string;
    image?: string;
    description?: string;
    sameAs?: string[];
    jobTitle?: string;
    worksFor?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    url: data.url,
    image: data.image,
    description: data.description,
    sameAs: data.sameAs,
    jobTitle: data.jobTitle,
    worksFor: data.worksFor,
  }),
};

export default JsonLd;
