'use client';

import { useEffect } from 'react';
import { Metadata } from 'next';

interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  siteName?: string;
  locale?: string;
}

export function OpenGraphTags({
  title,
  description,
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  siteName = 'CyberPress',
  locale = 'zh_CN',
}: OpenGraphProps) {
  useEffect(() => {
    // 获取当前页面 URL
    const currentUrl = url || window.location.href;
    const domain = window.location.origin;

    // 设置或更新 meta 标签
    const setMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setNameTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 基础 Open Graph 标签
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image.startsWith('http') ? image : `${domain}${image}`);
    setMetaTag('og:url', currentUrl);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', siteName);
    setMetaTag('og:locale', locale);

    // 文章特定标签
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime);
      }
      if (authors) {
        authors.forEach((author, index) => {
          setMetaTag(`article:author:${index + 1}`, author);
        });
      }
      if (section) {
        setMetaTag('article:section', section);
      }
      if (tags) {
        tags.forEach((tag, index) => {
          setMetaTag(`article:tag:${index + 1}`, tag);
        });
      }
    }

    // Twitter Card 标签
    setNameTag('twitter:card', 'summary_large_image');
    setNameTag('twitter:title', title);
    setNameTag('twitter:description', description);
    setNameTag('twitter:image', image.startsWith('http') ? image : `${domain}${image}`);

    // Schema.org JSON-LD
    const schema = type === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: image.startsWith('http') ? image : `${domain}${image}`,
      url: currentUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: authors?.map(author => ({ '@type': 'Person', name: author })),
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${domain}/logo.png`,
        },
      },
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: domain,
      description,
    };

    // 更新或创建 JSON-LD 脚本
    let scriptElement = document.getElementById('json-ld-schema');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'json-ld-schema';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schema);

    // 更新页面标题
    document.title = title;

    // 清理函数
    return () => {
      // 可选：在组件卸载时清理 meta 标签
    };
  }, [title, description, image, url, type, publishedTime, modifiedTime, authors, section, tags, siteName, locale]);

  return null; // 这个组件不渲染任何可见内容
}

// 服务端组件版本 (用于 Next.js App Router)
export function generateMetadata(props: OpenGraphProps): Metadata {
  const {
    title,
    description,
    image = '/og-image.png',
    url,
    type = 'website',
  } = props;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      url,
      type,
      siteName: 'CyberPress',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
