'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data:
    | Record<string, unknown>
    | Record<string, unknown>[];
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create or update JSON-LD script tag
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [data]);

  return null;
}

// Helper functions for common structured data types

export function createArticleStructuredData({
  headline,
  image,
  datePublished,
  dateModified,
  author,
  description,
  url,
}: {
  headline: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function createBlogPostingStructuredData({
  headline,
  image,
  datePublished,
  dateModified,
  author,
  description,
  url,
  keywords,
}: {
  headline: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: string;
  description: string;
  url: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(keywords && { keywords: keywords.join(', ') }),
  };
}

export function createBreadcrumbStructuredData(items: Array<{
  name: string;
  url: string;
}>) {
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

export function createOrganizationStructuredData({
  name,
  url,
  logo,
  description,
  sameAs,
}: {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    ...(sameAs && { sameAs }),
  };
}

export function createWebsiteStructuredData({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
  };
}
