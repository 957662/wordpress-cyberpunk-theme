'use client';

import React from 'react';
import Head from 'next/head';

interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.other' | 'music.song';
  siteName?: string;
  locale?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    author?: string;
    section?: string;
    tag?: string[];
  };
  audio?: string;
  video?: {
    url?: string;
    secureUrl?: string;
    type?: string;
    width?: number;
    height?: number;
  };
}

export default function OpenGraph({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'CyberPress',
  locale = 'en_US',
  article,
  audio,
  video,
}: OpenGraphProps) {
  return (
    <Head>
      {/* Basic Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Optional */}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Article specific */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.expirationTime && (
            <meta property="article:expiration_time" content={article.expirationTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tag &&
            article.tag.map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Audio */}
      {audio && <meta property="og:audio" content={audio} />}

      {/* Video */}
      {video && (
        <>
          {video.url && <meta property="og:video" content={video.url} />}
          {video.secureUrl && (
            <meta property="og:video:secure_url" content={video.secureUrl} />
          )}
          {video.type && <meta property="og:video:type" content={video.type} />}
          {video.width && <meta property="og:video:width" content={video.width.toString()} />}
          {video.height && <meta property="og:video:height" content={video.height.toString()} />}
        </>
      )}
    </Head>
  );
}

// Twitter Card component
interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export function TwitterCard({
  card = 'summary_large_image',
  site,
  creator,
  title,
  description,
  image,
  imageAlt,
}: TwitterCardProps) {
  return (
    <Head>
      <meta name="twitter:card" content={card} />
      {site && <meta name="twitter:site" content={site} />}
      {creator && <meta name="twitter:creator" content={creator} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
    </Head>
  );
}
