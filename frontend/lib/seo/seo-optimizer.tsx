/**
 * SEO 优化组件和工具
 * 用于优化搜索引擎优化和社交媒体分享
 */

'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

/**
 * SEO 元数据接口
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
    url?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  schema?: any;
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * JSON-LD 结构化数据生成器
 */
export function generateSchemaMarkup(schema: any): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...schema,
  });
}

/**
 * 生成文章 Schema
 */
export function generateArticleSchema({
  title,
  description,
  publishDate,
  modifiedDate,
  author,
  images = [],
  keywords = [],
}: {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author: {
    name: string;
    url?: string;
  };
  images?: string[];
  keywords?: string[];
}) {
  return generateSchemaMarkup({
    '@type': 'Article',
    headline: title,
    description,
    image: images,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    keywords: keywords.join(', '),
  });
}

/**
 * 生成网站 Schema
 */
export function generateWebsiteSchema({
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
  const schema: any = {
    '@type': 'WebSite',
    name,
    description,
    url,
  };

  if (searchAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }

  return generateSchemaMarkup(schema);
}

/**
 * 生成组织 Schema
 */
export function generateOrganizationSchema({
  name,
  description,
  url,
  logo,
  sameAs = [],
  contactPoint,
}: {
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
}) {
  return generateSchemaMarkup({
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
    sameAs,
    contactPoint: contactPoint
      ? {
          '@type': 'ContactPoint',
          ...contactPoint,
        }
      : undefined,
  });
}

/**
 * SEO 优化组件
 */
export function SEOHead({ metadata }: { metadata: SEOMetadata }) {
  const router = useRouter();
  const fullUrl = metadata.openGraph?.url || `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}

      {/* 规范链接 */}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}

      {/* Robots */}
      {(metadata.noIndex || metadata.noFollow) && (
        <meta name="robots" content={`${metadata.noIndex ? 'noindex' : 'index'}, ${metadata.noFollow ? 'nofollow' : 'follow'}`} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={metadata.openGraph?.title || metadata.title} />
      <meta property="og:description" content={metadata.openGraph?.description || metadata.description} />
      <meta property="og:type" content={metadata.openGraph?.type || 'website'} />
      <meta property="og:url" content={fullUrl} />
      {metadata.openGraph?.image && <meta property="og:image" content={metadata.openGraph.image} />}
      {metadata.openGraph?.siteName && <meta property="og:site_name" content={metadata.openGraph.siteName} />}
      {metadata.openGraph?.locale && <meta property="og:locale" content={metadata.openGraph.locale} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={metadata.twitter?.card || 'summary_large_image'} />
      {metadata.twitter?.site && <meta name="twitter:site" content={metadata.twitter.site} />}
      {metadata.twitter?.creator && <meta name="twitter:creator" content={metadata.twitter.creator} />}
      <meta name="twitter:title" content={metadata.twitter?.title || metadata.title} />
      <meta name="twitter:description" content={metadata.twitter?.description || metadata.description} />
      {metadata.twitter?.image && <meta name="twitter:image" content={metadata.twitter.image} />}

      {/* 结构化数据 */}
      {metadata.schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.schema) }} />}
    </Head>
  );
}

/**
 * JSON-LD 组件
 */
export function JsonLd({ schema }: { schema: any }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

/**
 * 面包屑导航 Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const itemList = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return generateSchemaMarkup({
    '@type': 'BreadcrumbList',
    itemListElement: itemList,
  });
}

/**
 * 视频对象 Schema
 */
export function generateVideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
}) {
  return generateSchemaMarkup({
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    embedUrl,
  });
}

/**
 * 产品 Schema
 */
export function generateProductSchema({
  name,
  description,
  image,
  brand,
  offers,
  aggregateRating,
}: {
  name: string;
  description: string;
  image: string[];
  brand: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  const schema: any = {
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      ...offers,
    },
  };

  if (aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ...aggregateRating,
    };
  }

  return generateSchemaMarkup(schema);
}

/**
 * 事件 Schema
 */
export function generateEventSchema({
  name,
  startDate,
  endDate,
  location,
  description,
  image,
  url,
}: {
  name: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
  };
  description: string;
  image?: string[];
  url?: string;
}) {
  return generateSchemaMarkup({
    '@type': 'Event',
    name,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
      },
    },
    description,
    image,
    url,
  });
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateSchemaMarkup({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * 本地业务 Schema
 */
export function generateLocalBusinessSchema({
  name,
  description,
  url,
  telephone,
  address,
  geo,
  openingHours,
}: {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
}) {
  const schema: any = {
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
  };

  if (geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (openingHours) {
    schema.openingHoursSpecification = openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1],
      closes: hours.split(' ')[2],
    }));
  }

  return generateSchemaMarkup(schema);
}

/**
 * 默认 SEO 元数据
 */
export const defaultSEO: SEOMetadata = {
  title: 'CyberPress Platform - 赛博朋克风格的现代博客平台',
  description: '基于 WordPress + Next.js 构建的现代化博客平台，采用赛博朋克设计风格',
  keywords: '博客, WordPress, Next.js, React, TypeScript, 赛博朋克',
  openGraph: {
    type: 'website',
    siteName: 'CyberPress Platform',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

/**
 * 合并默认 SEO 和自定义 SEO
 */
export function mergeSEO(customSEO: Partial<SEOMetadata>): SEOMetadata {
  return {
    ...defaultSEO,
    ...customSEO,
    openGraph: {
      ...defaultSEO.openGraph,
      ...customSEO.openGraph,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...customSEO.twitter,
    },
  };
}

/**
 * 面包屑导航组件
 */
export function BreadcrumbNav({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <JsonLd schema={JSON.parse(schema)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-600" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a href={item.url} className="text-cyan-500 hover:text-cyan-600">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
