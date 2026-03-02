/**
 * JSON-LD 结构化数据组件
 * 帮助搜索引擎更好地理解网页内容
 */

import React from 'react';

export interface JsonLdProps {
  type: 'WebSite' | 'WebPage' | 'Article' | 'BlogPosting' | 'BreadcrumbList' | 'Organization' | 'Person';
  data: Record<string, any>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const generateJsonLd = () => {
    const base = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return JSON.stringify(base);
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateJsonLd() }}
    />
  );
}

// 预设的结构化数据生成器
export const JsonLdGenerators = {
  // 网站信息
  webSite: (url: string, name: string, description?: string, searchAction?: boolean) => ({
    url,
    name,
    description,
    ...(searchAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  }),

  // 网页信息
  webPage: (url: string, title: string, description: string, lastModified?: string, image?: string) => ({
    '@id': url,
    url,
    name: title,
    description,
    dateModified: lastModified,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: image,
    },
  }),

  // 文章/博客
  article: (data: {
    title: string;
    url: string;
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
  }) => ({
    headline: data.title,
    url: data.url,
    description: data.description,
    image: {
      '@type': 'ImageObject',
      url: data.image,
    },
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
      logo: data.publisher.logo ? {
        '@type': 'ImageObject',
        url: data.publisher.logo,
      } : undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  }),

  // 面包屑导航
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // 组织信息
  organization: (data: {
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
  }) => ({
    name: data.name,
    url: data.url,
    logo: data.logo ? {
      '@type': 'ImageObject',
      url: data.logo,
    } : undefined,
    description: data.description,
    sameAs: data.sameAs,
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      contactType: data.contactPoint.type,
      telephone: data.contactPoint.telephone,
      email: data.contactPoint.email,
    } : undefined,
  }),
};
