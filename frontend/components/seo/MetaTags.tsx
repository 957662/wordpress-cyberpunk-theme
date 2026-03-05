'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
  alternateLanguages?: Record<string, string>;
}

export function MetaTags({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  noIndex = false,
  structuredData,
  alternateLanguages,
}: MetaTagsProps) {
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // Set title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    if (description) {
      updateMetaTag('description', description);
    }
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updatePropertyTag('og:title', title || document.title);
    updatePropertyTag('og:description', description || '');
    updatePropertyTag('og:type', ogType);
    updatePropertyTag('og:url', currentUrl);
    if (ogImage) {
      updatePropertyTag('og:image', ogImage);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title || document.title);
    updateMetaTag('twitter:description', description || '');
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }

    // Robots
    updateMetaTag('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Alternate languages
    if (alternateLanguages) {
      Object.entries(alternateLanguages).forEach(([lang, href]) => {
        let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'alternate';
          link.hreflang = lang;
          document.head.appendChild(link);
        }
        link.href = href;
      });
    }

    // Structured data (JSON-LD)
    if (structuredData) {
      let script = document.getElementById('structured-data') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      // Cleanup on unmount
      const script = document.getElementById('structured-data');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, ogImage, ogType, twitterCard, canonical, noIndex, structuredData, alternateLanguages, currentUrl]);

  return null;
}

// Article structured data generator
export function generateArticleStructuredData({
  title,
  description,
  publishDate,
  modifiedDate,
  author,
  image,
  publisher,
  url,
}: {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image ? [image] : undefined,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: publisher
      ? {
          '@type': 'Organization',
          name: publisher.name,
          logo: publisher.logo
            ? {
                '@type': 'ImageObject',
                url: publisher.logo,
              }
            : undefined,
        }
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Breadcrumb structured data generator
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Organization structured data generator
export function generateOrganizationStructuredData({
  name,
  url,
  logo,
  description,
  socialLinks,
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialLinks?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logo,
    description: description,
    sameAs: socialLinks,
  };
}
