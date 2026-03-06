/**
 * SEO 相关类型定义
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface OpenGraphConfig {
  type: 'website' | 'article' | 'profile';
  title: string;
  description: string;
  url: string;
  image?: string;
  locale?: string;
  siteName?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
}

export interface TwitterCardConfig {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface StructuredData {
  '@context'?: string;
  '@type':
    | 'WebSite'
    | 'Article'
    | 'BlogPosting'
    | 'Person'
    | 'Organization'
    | 'BreadcrumbList'
    | 'FAQPage';
  name?: string;
  url?: string;
  description?: string;
  image?: string;
  author?: {
    '@type': string;
    name: string;
    url?: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: string;
  };
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  mainEntityOfPage?: {
    '@type': string;
    '@id': string;
  };
  itemListElement?: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
  mainEntity?: Array<{
    '@type': string;
    name: string;
    acceptedAnswer?: {
      '@type': string;
      text: string;
    };
  }>;
}

export interface MetaTags {
  charset?: string;
  viewport?: string;
  httpEquiv?: string;
  name?: string;
  content?: string;
  property?: string;
  rel?: string;
  href?: string;
  sizes?: string;
  type?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  as?: string;
  crossorigin?: string;
  media?: string;
}

export interface ScriptTag {
  type: string;
  src?: string;
  innerHTML?: string;
  async?: boolean;
  defer?: boolean;
  crossOrigin?: string;
  nonce?: string;
}

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  domContentLoaded?: number;
}

export interface PageAnalytics {
  path: string;
  title: string;
  referrer?: string;
  timestamp: number;
  duration?: number;
  scrollDepth?: number;
  performance?: PerformanceMetrics;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface RobotsConfig {
  userAgent: string | '*';
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
  sitemap?: string[];
}
