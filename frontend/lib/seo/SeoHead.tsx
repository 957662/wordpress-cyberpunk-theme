'use client';

import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noindex?: boolean;
}

const siteConfig = {
  siteName: 'CyberPress',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev',
  defaultTitle: 'CyberPress - 赛博朋克风格博客平台',
  defaultDescription: '基于 Next.js 和 WordPress 的现代化博客平台',
  defaultImage: '/og-image.png',
};

export function SEO({
  title,
  description,
  image,
  type = 'website',
  keywords,
  noindex = false,
}: SEOProps) {
  const pathname = usePathname();
  
  const pageTitle = title ? `${title} | ${siteConfig.siteName}` : siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.defaultDescription;
  const pageUrl = `${siteConfig.siteUrl}${pathname}`;
  const pageImage = image || siteConfig.defaultImage;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {noindex && <meta name="robots" content="noindex" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebSite',
            name: title || siteConfig.siteName,
            description: pageDescription,
            url: pageUrl,
          }),
        }}
      />
    </Head>
  );
}
