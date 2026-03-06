/**
 * JSON-LD 结构化数据组件
 * 用于增强 SEO
 */

'use client';

import { useEffect } from 'react';

export interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  useEffect(() => {
    // 添加 JSON-LD 到页面
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = id || 'json-ld';
    
    document.head.appendChild(script);
    
    return () => {
      // 清理
      const existingScript = document.getElementById(id || 'json-ld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [data, id]);

  return null;
}

/**
 * 网站结构化数据
 */
export function WebSiteJsonLd({ url, name }: { url: string; name: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} id="website-json-ld" />;
}

/**
 * 文章结构化数据
 */
export function ArticleJsonLd({
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
  url,
  imageUrl,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  url: string;
  imageUrl?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: '/logo-512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} id="article-json-ld" />;
}

/**
 * 面包屑结构化数据
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} id="breadcrumb-json-ld" />;
}

/**
 * 组织结构化数据
 */
export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  socialLinks,
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialLinks?: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs: socialLinks,
  };

  return <JsonLd data={data} id="organization-json-ld" />;
}
