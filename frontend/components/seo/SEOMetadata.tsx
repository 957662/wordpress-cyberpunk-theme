/**
 * Advanced SEO Metadata Component
 * 高级 SEO 元数据组件 - 提供完整的 SEO 优化
 *
 * @author AI Development Team
 * @version 2.0.0
 */

'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

// 类型定义
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  keywords?: string[];
  locale?: string;
  alternateLanguages?: { [key: string]: string };
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  notranslate?: boolean;
  noimageindex?: boolean;
  structuredData?: any;
}

export function SEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  keywords,
  locale = 'zh_CN',
  alternateLanguages,
  canonical,
  noindex = false,
  nofollow = false,
  noarchive = false,
  nosnippet = false,
  notranslate = false,
  noimageindex = false,
  structuredData,
}: SEOProps) {
  const router = useRouter();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteName = 'CyberPress';
  const defaultTitle = 'CyberPress - 赛博朋克风格博客平台';
  const defaultDescription = '一个现代化的、赛博朋克风格的博客平台，提供优质的技术内容和独特的用户体验。';
  const defaultImage = '/images/og-default.jpg';

  // 完整标题
  const fullTitle = useMemo(() => {
    if (title && title !== defaultTitle) {
      return `${title} | ${siteName}`;
    }
    return defaultTitle;
  }, [title]);

  // 生成 robots meta 标签
  const robotsContent = useMemo(() => {
    const parts: string[] = [];
    if (noindex) parts.push('noindex');
    if (nofollow) parts.push('nofollow');
    if (noarchive) parts.push('noarchive');
    if (nosnippet) parts.push('nosnippet');
    if (notranslate) parts.push('notranslate');
    if (noimageindex) parts.push('noimageindex');
    return parts.length > 0 ? parts.join(', ') : 'index, follow';
  }, [noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex]);

  // 生成 Open Graph 数据
  const openGraph = useMemo(() => {
    return {
      'og:title': title || defaultTitle,
      'og:description': description || defaultDescription,
      'og:image': image || defaultImage,
      'og:url': currentUrl,
      'og:type': type,
      'og:locale': locale,
      'og:site_name': siteName,
      ...(type === 'article' && {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:author': author,
        'article:section': section,
        'article:tag': tags,
      }),
    };
  }, [title, description, image, currentUrl, type, locale, publishedTime, modifiedTime, author, section, tags]);

  // 生成 Twitter Card 数据
  const twitterCard = useMemo(() => {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': title || defaultTitle,
      'twitter:description': description || defaultDescription,
      'twitter:image': image || defaultImage,
      'twitter:site': '@cyberpress',
      'twitter:creator': author ? `@${author}` : '@cyberpress',
    };
  }, [title, description, image, author]);

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords?.join(', ') || ''} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* 替代语言 */}
      {alternateLanguages &&
        Object.entries(alternateLanguages).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Open Graph / Facebook */}
      {Object.entries(openGraph).map(([property, content]) => (
        <meta
          key={property}
          property={property}
          content={Array.isArray(content) ? content.join(', ') : String(content)}
        />
      ))}

      {/* Twitter */}
      {Object.entries(twitterCard).map(([name, content]) => (
        <meta key={name} name={name} content={String(content)} />
      ))}

      {/* 额外的 SEO 标签 */}
      <meta name="theme-color" content="#0a0a0f" />
      <meta name="msapplication-TileColor" content="#00f0ff" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* 结构化数据 (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
}

/**
 * 文章结构化数据生成器
 */
export function generateArticleStructuredData({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  publisher,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: publisher.logo
        ? {
            '@type': 'ImageObject',
            url: publisher.logo,
          }
        : undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * 网站结构化数据生成器
 */
export function generateWebsiteStructuredData({
  name,
  description,
  url,
  searchAction,
}: {
  name: string;
  description: string;
  url: string;
  searchAction?: string;
}) {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: searchAction || `${url}?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return structuredData;
}

/**
 * 面包屑结构化数据生成器
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
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

export default SEOMetadata;
