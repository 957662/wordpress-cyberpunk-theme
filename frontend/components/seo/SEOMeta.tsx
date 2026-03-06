'use client';

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

interface SEOMetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  articleSection?: string;
  tags?: string[];
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  canonical?: string;
  alternateLanguages?: { lang: string; url: string }[];
}

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title = 'CyberPress Platform - 赛博朋克风格博客平台',
  description = '基于 FastAPI + Next.js 的现代化博客平台，采用赛博朋克设计风格',
  keywords = ['CyberPress', '博客', 'Next.js', 'FastAPI', '赛博朋克'],
  image,
  url,
  author = 'CyberPress Team',
  publishedDate,
  modifiedDate,
  articleSection,
  tags,
  type = 'website',
  noIndex = false,
  canonical,
  alternateLanguages = [],
}) => {
  const router = useRouter();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteName = 'CyberPress Platform';

  // Open Graph 数据
  const ogData = {
    title,
    description,
    image: image || '/images/og-default.jpg',
    url: currentUrl,
    siteName,
    locale: 'zh_CN',
    type: type === 'article' ? 'article' : 'website',
  };

  // Twitter Card 数据
  const twitterCard = {
    card: 'summary_large_image',
    title,
    description,
    image: image || '/images/twitter-default.jpg',
  };

  // Schema.org 结构化数据
  const getSchemaData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: siteName,
      url: currentUrl,
    };

    if (type === 'article') {
      return {
        ...baseSchema,
        headline: title,
        description,
        image: [ogData.image],
        datePublished: publishedDate,
        dateModified: modifiedDate,
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: '/images/logo.png',
          },
        },
        articleSection,
        keywords: tags?.join(', '),
      };
    }

    return baseSchema;
  };

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {author && <meta name="author" content={author} />}

      {/* Robots 标签 */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="googlebot" content="index, follow" />

      {/* 规范链接 */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* 多语言交替链接 */}
      {alternateLanguages.map((lang) => (
        <link
          key={lang.lang}
          rel="alternate"
          hrefLang={lang.lang}
          href={lang.url}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Open Graph 标签 */}
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={ogData.description} />
      <meta property="og:image" content={ogData.image} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:site_name" content={ogData.siteName} />
      <meta property="og:locale" content={ogData.locale} />
      <meta property="og:type" content={ogData.type} />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content={twitterCard.card} />
      <meta name="twitter:title" content={twitterCard.title} />
      <meta name="twitter:description" content={twitterCard.description} />
      <meta name="twitter:image" content={twitterCard.image} />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchemaData()),
        }}
      />

      {/* 额外的 SEO 标签 */}
      <meta name="theme-color" content="#0a0a0f" />
      <meta name="msapplication-TileColor" content="#00f0ff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

// 文章专用的 SEO 组件
interface ArticleSEOMetaProps {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
  url?: string;
}

export const ArticleSEOMeta: React.FC<ArticleSEOMetaProps> = ({
  title,
  description,
  image,
  author,
  publishedDate,
  modifiedDate,
  category,
  tags,
  url,
}) => {
  return (
    <SEOMeta
      title={`${title} | ${siteName}`}
      description={description}
      image={image}
      author={author}
      publishedDate={publishedDate}
      modifiedDate={modifiedDate}
      articleSection={category}
      tags={tags}
      type="article"
      url={url}
    />
  );
};

export default SEOMeta;
