/**
 * SEO Utility Functions
 * Helper functions for SEO optimization and metadata generation
 */

import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
}

const defaultSEO = {
  title: 'CyberPress Platform - Futuristic Blog',
  description: 'A cyberpunk-style blog platform with stunning visuals and cutting-edge technology',
  image: '/og-image.png',
  url: 'https://cyberpress.platform',
  type: 'website' as const,
  keywords: ['cyberpunk', 'blog', 'technology', 'nextjs', 'react'],
  author: 'CyberPress Team',
};

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description,
    image,
    url,
    type,
    keywords,
    author,
    publishDate,
    modifiedDate,
    category,
    tags,
  } = { ...defaultSEO, ...props };

  const fullTitle = title === defaultSEO.title ? title : `${title} | CyberPress`;
  const fullUrl = url || defaultSEO.url;
  const imageUrl = image || defaultSEO.image;

  return {
    title: fullTitle,
    description: description || defaultSEO.description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : undefined,

    // Open Graph
    openGraph: {
      type,
      url: fullUrl,
      title: fullTitle,
      description: description || defaultSEO.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'CyberPress Platform',
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
      ...(type === 'article' && {
        authors: [author || ''],
        section: category,
        tags: tags,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultSEO.description,
      images: [imageUrl],
      creator: '@cyberpress',
    },

    // Additional
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/manifest.json',

    // Theme color
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#00f0ff' },
      { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    ],

    // Viewport
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },

    // Verification tags (add your own)
    verification: {
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData(type: 'article' | 'website' | 'organization', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'CyberPress',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png',
          },
        },
        datePublished: data.publishDate,
        dateModified: data.modifiedDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url,
        },
      };

    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: 'CyberPress',
        url: 'https://cyberpress.platform',
        logo: 'https://cyberpress.platform/logo.png',
        description: 'A futuristic cyberpunk-style blog platform',
        sameAs: [
          'https://twitter.com/cyberpress',
          'https://github.com/cyberpress',
        ],
      };

    case 'website':
    default:
      return {
        ...baseData,
        '@type': 'WebSite',
        name: 'CyberPress Platform',
        url: 'https://cyberpress.platform',
        description: 'A futuristic cyberpunk-style blog platform',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://cyberpress.platform/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      };
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Slugify a string for URL-friendly URLs
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text for meta descriptions
 */
export function truncateMetaDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Calculate reading time for articles
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.platform';
  return `${baseUrl}${path}`;
}

/**
 * Generate alternate language URLs
 */
export function generateAlternateLanguages(path: string, languages: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.platform';
  return languages.map((lang) => ({
    lang,
    url: `${baseUrl}/${lang}${path}`,
  }));
}
