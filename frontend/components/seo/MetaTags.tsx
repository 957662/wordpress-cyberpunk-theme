'use client';

/**
 * CyberPress Platform - Meta Tags Component
 * Meta 标签组件
 */

import Head from 'next/head';
import { useEffect } from 'react';

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'blog';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  alternate?: Array<{ hrefLang: string; href: string }>;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function MetaTags({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
  nofollow = false,
  alternate,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
}: MetaTagsProps) {
  useEffect(() => {
    // 动态更新 meta 标签
    const updates: Array<{ selector: string; attr: string; value: string }> = [];

    if (title) {
      document.title = title;
      updates.push({ selector: 'meta[property="og:title"]', attr: 'content', value: title });
    }

    if (description) {
      updates.push({ selector: 'meta[name="description"]', attr: 'content', value: description });
      updates.push({ selector: 'meta[property="og:description"]', attr: 'content', value: description });
    }

    if (keywords?.length) {
      updates.push({
        selector: 'meta[name="keywords"]',
        attr: 'content',
        value: keywords.join(', '),
      });
    }

    if (ogTitle) {
      updates.push({ selector: 'meta[property="og:title"]', attr: 'content', value: ogTitle });
    }

    if (ogImage) {
      updates.push({ selector: 'meta[property="og:image"]', attr: 'content', value: ogImage });
      updates.push({
        selector: 'meta[name="twitter:image"]',
        attr: 'content',
        value: ogImage,
      });
    }

    if (ogType) {
      updates.push({ selector: 'meta[property="og:type"]', attr: 'content', value: ogType });
    }

    if (twitterCard) {
      updates.push({
        selector: 'meta[name="twitter:card"]',
        attr: 'content',
        value: twitterCard,
      });
    }

    if (author) {
      updates.push({ selector: 'meta[name="author"]', attr: 'content', value: author });
    }

    if (publishedTime) {
      updates.push({
        selector: 'meta[property="article:published_time"]',
        attr: 'content',
        value: publishedTime,
      });
    }

    if (modifiedTime) {
      updates.push({
        selector: 'meta[property="article:modified_time"]',
        attr: 'content',
        value: modifiedTime,
      });
    }

    if (section) {
      updates.push({
        selector: 'meta[property="article:section"]',
        attr: 'content',
        value: section,
      });
    }

    if (tags?.length) {
      tags.forEach((tag) => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      });
    }

    // 应用更新
    updates.forEach(({ selector, attr, value }) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        const propOrName = selector.match(/property="([^"]+)"/)
          ? 'property'
          : 'name';
        const key = selector.match(/"([^"]+)"/)?.[1];
        if (key) {
          meta.setAttribute(propOrName, key);
          document.head.appendChild(meta);
        }
      }
      if (meta) meta.setAttribute(attr, value);
    });

    // 设置 robots
    if (noindex || nofollow) {
      let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      const robotsValue = [noindex && 'noindex', nofollow && 'nofollow']
        .filter(Boolean)
        .join(', ');
      robotsMeta.content = robotsValue;
    }

    // 设置 canonical
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // 设置 alternate 语言
    if (alternate?.length) {
      alternate.forEach(({ hrefLang, href }) => {
        let alternateLink = document.querySelector(
          `link[rel="alternate"][hreflang="${hrefLang}"]`
        ) as HTMLLinkElement;
        if (!alternateLink) {
          alternateLink = document.createElement('link');
          alternateLink.rel = 'alternate';
          alternateLink.hrefLang = hrefLang;
          document.head.appendChild(alternateLink);
        }
        alternateLink.href = href;
      });
    }

    // 清理函数
    return () => {
      // 这里可以添加清理逻辑
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    canonical,
    noindex,
    nofollow,
    alternate,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
  ]);

  return null;
}

export default MetaTags;
