/**
 * SEO Head 组件
 * 管理页面的 SEO 元数据
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { JsonLd, JsonLdGenerators } from './JsonLd';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
  alternates?: {
    languages: Record<string, string>;
  };
}

export function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  canonical,
  alternates,
}: SEOHeadProps) {
  const pathname = usePathname();

  useEffect(() => {
    // 设置页面标题
    if (title) {
      document.title = `${title} | CyberPress`;
    }

    // 设置 meta 描述
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // 设置 Open Graph 图片
    const ogImage = image || '/og-default.jpg';
    updateMetaTag('og:image', ogImage);
    updateMetaTag('twitter:image', ogImage);

    // 设置 URL
    const fullUrl = url || `${window.location.origin}${pathname}`;
    updateMetaTag('og:url', fullUrl);
    updateMetaTag('twitter:url', fullUrl);

    // 设置类型
    updateMetaTag('og:type', type);

    // 文章特定 meta
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime);
      }
      if (author) {
        updateMetaTag('article:author', author);
      }
      if (section) {
        updateMetaTag('article:section', section);
      }
      if (tags && tags.length > 0) {
        tags.forEach((tag) => {
          addMetaTag('article:tag', tag);
        });
      }
    }

    // Noindex
    if (noindex) {
      addMetaTag('robots', 'noindex, nofollow');
    }

    // Canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Alternates (多语言)
    if (alternates) {
      Object.entries(alternates.languages).forEach(([lang, href]) => {
        updateLinkTag(`alternate-${lang}`, href, [{ key: 'hreflang', value: lang }]);
      });
    }
  }, [title, description, image, url, type, publishedTime, modifiedTime, author, section, tags, noindex, canonical, alternates, pathname]);

  return null;
}

// 辅助函数
function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  let propertyElement = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;

  if (!element && !propertyElement) {
    element = document.createElement('meta');
    element.setAttribute(name.startsWith('og:') || name.startsWith('article:') ? 'property' : 'name', name);
    document.head.appendChild(element);
  }

  if (element) {
    element.setAttribute('content', content);
  } else if (propertyElement) {
    propertyElement.setAttribute('content', content);
  }
}

function addMetaTag(name: string, content: string) {
  const existing = document.querySelector(`meta[name="${name}"][content="${content}"]`);
  if (existing) return;

  const element = document.createElement('meta');
  element.setAttribute('name', name);
  element.setAttribute('content', content);
  document.head.appendChild(element);
}

function updateLinkTag(rel: string, href: string, attrs: Array<{ key: string; value: string }> = []) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);

  attrs.forEach(({ key, value }) => {
    element?.setAttribute(key, value);
  });
}

export default SEOHead;
