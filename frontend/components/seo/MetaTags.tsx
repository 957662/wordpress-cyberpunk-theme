'use client';

/**
 * SEO Meta 标签组件
 * 动态生成优化的 meta 标签
 */

import Head from 'next/head';
import { useRouter } from 'next/navigation';

interface MetaTagsProps {
  /**
   * 页面标题
   */
  title: string;

  /**
   * 页面描述
   */
  description: string;

  /**
   * 关键词
   */
  keywords?: string[];

  /**
   * Open Graph 图片
   */
  ogImage?: string;

  /**
   * Twitter 卡片类型
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';

  /**
   * 是否禁止索引
   */
  noIndex?: boolean;

  /**
   * 规范链接
   */
  canonical?: string;

  /**
   * 额外的 meta 标签
   */
  additionalMetas?: Array<{
    name: string;
    content: string;
  }>;

  /**
   * 结构化数据 (JSON-LD)
   */
  structuredData?: Record<string, any>;

  /**
   * 网站名称
   */
  siteName?: string;

  /**
   * Twitter 账号
   */
  twitterHandle?: string;
}

export function MetaTags({
  title,
  description,
  keywords = [],
  ogImage,
  twitterCard = 'summary_large_image',
  noIndex = false,
  canonical,
  additionalMetas = [],
  structuredData,
  siteName = 'CyberPress',
  twitterHandle,
}: MetaTagsProps) {
  const router = useRouter();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const currentUrl = canonical || url;

  // 构建 JSON-LD
  const jsonLd = structuredData
    ? {
        '@context': 'https://schema.org',
        ...structuredData,
      }
    : null;

  return (
    <>
      {/* 基础 Meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* 索引控制 */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* 规范链接 */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* 额外的 Meta 标签 */}
      {additionalMetas.map((meta, index) => (
        <meta key={index} name={meta.name} content={meta.content} />
      ))}

      {/* 结构化数据 */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}

/**
 * 文章 Meta 标签
 */
export function ArticleMetaTags({
  title,
  description,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  ogImage,
}: {
  title: string;
  description: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  ogImage?: string;
}) {
  return (
    <>
      <MetaTags title={title} description={description} ogImage={ogImage} />
      
      {/* 文章特定的 Open Graph 标签 */}
      <meta property="article:published_time" content={publishedTime || ''} />
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </>
  );
}

/**
 * 产品 Meta 标签
 */
export function ProductMetaTags({
  title,
  description,
  price,
  currency,
  availability,
  ogImage,
}: {
  title: string;
  description: string;
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  ogImage?: string;
}) {
  const structuredData = {
    '@type': 'Product',
    name: title,
    description,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: \`https://schema.org/\${availability?.replace(' ', 'InStock')}\`,
    },
  };

  return (
    <MetaTags
      title={title}
      description={description}
      ogImage={ogImage}
      structuredData={structuredData}
    />
  );
}

export default MetaTags;
