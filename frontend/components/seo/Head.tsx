/**
 * SEO Head Component
 * SEO 头部组件
 */

import { Metadata } from 'next';

export interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  noIndex?: boolean;
}

export function Head({
  title = 'CyberPress - 赛博朋克博客平台',
  description = '一个基于 WordPress + Next.js 的赛博朋克风格博客平台',
  image = '/og-image.png',
  url = 'https://cyberpress.dev',
  type = 'website',
  keywords = ['cyberpunk', 'blog', 'wordpress', 'next.js', '赛博朋克'],
  author = 'CyberPress Team',
  noIndex = false,
}: HeadProps) {
  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'CyberPress',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@cyberpress',
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };

  return <>{/* Metadata is handled by Next.js metadata API */}</>;
}

export default Head;
