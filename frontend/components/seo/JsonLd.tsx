'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // 查找或创建 JSON-LD 脚本标签
    let scriptElement = document.getElementById(`json-ld-${JSON.stringify(data).slice(0, 50)}`);

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = `json-ld-${JSON.stringify(data).slice(0, 50)}`;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(data);

    return () => {
      // 清理函数
      scriptElement?.remove();
    };
  }, [data]);

  return null;
}

// 文章结构化数据生成器
export function ArticleJsonLd({
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
  author: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}) {
  const data = {
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
      name: author,
    },
    publisher: publisher ? {
      '@type': 'Organization',
      name: publisher.name,
      logo: publisher.logo ? {
        '@type': 'ImageObject',
        url: publisher.logo,
      } : undefined,
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
}

// 博客文章结构化数据生成器
export function BlogPostJsonLd({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  category,
  tags,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category?: string;
  tags?: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CyberPress',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    articleSection: category,
    keywords: tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
}

// 网站结构化数据生成器
export function WebsiteJsonLd({
  name,
  description,
  url,
  searchAction,
}: {
  name: string;
  description: string;
  url: string;
  searchAction?: {
    target: string;
    queryInput: string;
  };
}) {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    potentialAction: searchAction ? {
      '@type': 'SearchAction',
      target: searchAction.target,
      'query-input': searchAction.queryInput,
    } : undefined,
  };

  return <JsonLd data={data} />;
}

// 面包屑结构化数据生成器
export function BreadcrumbJsonLd({
  items,
}: {
  items: {
    name: string;
    url: string;
  }[];
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

  return <JsonLd data={data} />;
}

// 组织结构化数据生成器
export function OrganizationJsonLd({
  name,
  description,
  url,
  logo,
  contactPoint,
  socialLinks,
}: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  contactPoint?: {
    type: string;
    telephone?: string;
    email?: string;
  };
  socialLinks?: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
    contactPoint: contactPoint ? {
      '@type': contactPoint.type,
      telephone: contactPoint.telephone,
      email: contactPoint.email,
      contactType: 'customer service',
    } : undefined,
    sameAs: socialLinks,
  };

  return <JsonLd data={data} />;
}

// 常见问题结构化数据生成器
export function FAQJsonLd({
  questions,
}: {
  questions: {
    question: string;
    answer: string;
  }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// 视频结构化数据生成器
export function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
  author,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
  author: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    embedUrl,
    author: {
      '@type': 'Person',
      name: author,
    },
  };

  return <JsonLd data={data} />;
}

// 产品结构化数据生成器
export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  priceCurrency,
  availability,
  brand,
  aggregateRating,
}: {
  name: string;
  description: string;
  image: string[];
  url: string;
  price: number;
  priceCurrency: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: availability ? `https://schema.org/${availability}` : undefined,
    },
    brand: brand ? {
      '@type': 'Brand',
      name: brand,
    } : undefined,
    aggregateRating: aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    } : undefined,
  };

  return <JsonLd data={data} />;
}
