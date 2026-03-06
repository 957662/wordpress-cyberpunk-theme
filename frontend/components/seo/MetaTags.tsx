/**
 * 增强 Meta 标签组件
 * 提供完整的 SEO 支持
 */

'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
  alternateLanguages?: { lang: string; url: string }[];
}

const siteName = 'CyberPress';
const defaultTitle = 'CyberPress - 赛博朋克风格博客平台';
const defaultDescription = '基于 Next.js 14 的现代化博客平台，采用赛博朋克设计风格';
const defaultImage = '/og-image.png';
const twitterCard = 'summary_large_image';

export function MetaTags({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noIndex = false,
  canonical,
  alternateLanguages,
}: MetaTagsProps) {
  const router = useRouter();
  const currentUrl = url || `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;

  const fullTitle = title ? `${title} - ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* 多语言替代 */}
      {alternateLanguages?.map(({ lang, url: langUrl }) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={langUrl}
        />
      ))}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Article 特定 */}
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
          {tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* 额外的 SEO 标签 */}
      <meta name="theme-color" content="#00f0ff" />
      <meta name="msapplication-TileColor" content="#00f0ff" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon */}
      <link rel="icon" sizes="any" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}
