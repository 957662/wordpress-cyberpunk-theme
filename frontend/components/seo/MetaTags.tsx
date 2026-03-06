'use client';

import React from 'react';

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  alternateUrls?: { lang: string; url: string }[];
  canonicalUrl?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  author,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags,
  noIndex = false,
  noFollow = false,
  alternateUrls = [],
  canonicalUrl,
}) => {
  // 构建完整 URL
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${new URL(fullUrl).origin}${image}`
    : '';

  // 基础标题
  const siteTitle = 'CyberPress Platform';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  // 生成 robots meta
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* 语言交替链接 */}
      {alternateUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}
      {author && <meta property="og:site_name" content={author} />}

      {/* Article 特定标签 */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags &&
            tags.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {fullImageUrl && <meta name="twitter:image" content={fullImageUrl} />}

      {/* 额外的 SEO 标签 */}
      <meta name="theme-color" content="#00f0ff" />
      <meta name="msapplication-TileColor" content="#00f0ff" />
      <meta name="application-name" content={siteTitle} />

      {/* 移动端优化 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />

      {/* 结构化数据 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebSite',
            name: title,
            description,
            url: fullUrl,
            image: fullImageUrl,
            author: {
              '@type': 'Person',
              name: author,
            },
            publisher: {
              '@type': 'Organization',
              name: siteTitle,
              logo: {
                '@type': 'ImageObject',
                url: '/logo.png',
              },
            },
            ...(type === 'article' && {
              datePublished: publishedTime,
              dateModified: modifiedTime,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': fullUrl,
              },
            }),
          }),
        }}
      />
    </>
  );
};

// 默认 Meta 标签配置
export const DefaultMetaTags: React.FC = () => {
  return (
    <MetaTags
      title="CyberPress Platform"
      description="基于 FastAPI + Next.js 的赛博朋克风格博客平台"
      keywords={['Next.js', 'React', 'TypeScript', 'FastAPI', '博客', '赛博朋克']}
      type="website"
    />
  );
};

export default MetaTags;
