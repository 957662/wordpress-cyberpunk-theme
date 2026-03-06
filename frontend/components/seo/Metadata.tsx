'use client';

import React from 'react';
import Head from 'next/head';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  alternateLanguages?: { lang: string; url: string }[];
  structuredData?: object;
}

export default function Metadata({
  title = 'CyberPress - Futuristic Blog Platform',
  description = 'A cyberpunk-themed blog platform built with Next.js and modern technologies.',
  keywords = [],
  ogTitle,
  ogDescription,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
  nofollow = false,
  alternateLanguages = [],
  structuredData,
}: MetadataProps) {
  const siteName = 'CyberPress';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Robots */}
      {(noindex || nofollow) && (
        <meta
          name="robots"
          content={`${noindex ? 'noindex' : 'index'},${
            nofollow ? 'nofollow' : 'follow'
          }`}
        />
      )}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Alternate Languages */}
      {alternateLanguages.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Head>
  );
}

// Pre-configured metadata for different page types
export const BlogMetadata = ({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
  };

  return (
    <Metadata
      title={title}
      description={description}
      ogImage={image}
      canonical={url}
      ogType="article"
      structuredData={structuredData}
    />
  );
};

export const WebsiteMetadata = ({
  title,
  description,
  url,
}: {
  title?: string;
  description?: string;
  url?: string;
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CyberPress',
    url: url || 'https://cyberpress.com',
    description,
  };

  return (
    <Metadata
      title={title}
      description={description}
      canonical={url}
      ogType="website"
      structuredData={structuredData}
    />
  );
};
