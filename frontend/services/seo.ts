/**
 * SEO Service
 * SEO 优化服务 - 生成元标签、结构化数据等
 */

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface OpenGraphData {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
  siteName?: string;
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * SEO Service Class
 */
class SEOService {
  /**
   * Generate meta tags
   */
  generateMetaTags(data: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    canonical?: string;
    og?: OpenGraphData;
    twitter?: TwitterCardData;
    noindex?: boolean;
    nofollow?: boolean;
  }): MetaTag[] {
    const tags: MetaTag[] = [];

    // Basic meta tags
    if (data.title) {
      tags.push({ name: 'title', content: data.title });
      tags.push({ property: 'og:title', content: data.title });
    }

    if (data.description) {
      tags.push({ name: 'description', content: data.description });
      tags.push({ property: 'og:description', content: data.description });
    }

    if (data.keywords) {
      tags.push({ name: 'keywords', content: data.keywords });
    }

    if (data.author) {
      tags.push({ name: 'author', content: data.author });
    }

    if (data.canonical) {
      tags.push({ name: 'canonical', content: data.canonical });
      tags.push({ property: 'og:url', content: data.canonical });
    }

    // Robots
    if (data.noindex || data.nofollow) {
      const robots = [data.noindex ? 'noindex' : '', data.nofollow ? 'nofollow' : '']
        .filter(Boolean)
        .join(', ');
      tags.push({ name: 'robots', content: robots });
    }

    // Open Graph tags
    if (data.og) {
      if (data.og.type) tags.push({ property: 'og:type', content: data.og.type });
      if (data.og.image) tags.push({ property: 'og:image', content: data.og.image });
      if (data.og.siteName) tags.push({ property: 'og:site_name', content: data.og.siteName });
    }

    // Twitter Card tags
    if (data.twitter) {
      tags.push({ name: 'twitter:card', content: data.twitter.card || 'summary' });
      tags.push({ name: 'twitter:title', content: data.twitter.title });
      tags.push({ name: 'twitter:description', content: data.twitter.description });

      if (data.twitter.image) {
        tags.push({ name: 'twitter:image', content: data.twitter.image });
      }
      if (data.twitter.site) {
        tags.push({ name: 'twitter:site', content: data.twitter.site });
      }
      if (data.twitter.creator) {
        tags.push({ name: 'twitter:creator', content: data.twitter.creator });
      }
    }

    return tags;
  }

  /**
   * Generate JSON-LD structured data
   */
  generateStructuredData(type: 'Article' | 'WebPage' | 'Organization' | 'Person' | 'BreadcrumbList', data: Record<string, unknown>): StructuredData {
    const baseData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    return { ...baseData, ...data } as StructuredData;
  }

  /**
   * Generate article structured data
   */
  generateArticleData(data: {
    title: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author: { name: string; url?: string };
    publisher: { name: string; logo?: string };
    url?: string;
  }): StructuredData {
    return this.generateStructuredData('Article', {
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: {
        '@type': 'Person',
        name: data.author.name,
        url: data.author.url,
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: data.publisher.logo,
      },
      mainEntityOfPage: data.url,
    });
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbData(items: Array<{ name: string; url: string }>): StructuredData {
    return this.generateStructuredData('BreadcrumbList', {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  /**
   * Generate organization structured data
   */
  generateOrganizationData(data: {
    name: string;
    url?: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
      type: string;
      telephone?: string;
      email?: string;
    };
  }): StructuredData {
    return this.generateStructuredData('Organization', {
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      sameAs: data.sameAs,
      contactPoint: data.contactPoint
        ? {
            '@type': 'ContactPoint',
            contactType: data.contactPoint.type,
            telephone: data.contactPoint.telephone,
            email: data.contactPoint.email,
          }
        : undefined,
    });
  }

  /**
   * Format page title
   */
  formatTitle(title: string, suffix?: string, separator = ' | '): string {
    return suffix ? `${title}${separator}${suffix}` : title;
  }

  /**
   * Generate meta description
   */
  generateDescription(content: string, maxLength = 160): string {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    
    // Truncate to max length
    let description = text.substring(0, maxLength);
    
    // Don't cut words in half
    const lastSpace = description.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      description = description.substring(0, lastSpace);
    }
    
    return description.trim() + '...';
  }

  /**
   * Generate keywords from content
   */
  generateKeywords(content: string, maxKeywords = 10): string[] {
    // Remove common words
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by',
      'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not',
      'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then',
      'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'
    ]);

    // Extract words
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    // Count frequency
    const frequency = new Map<string, number>();
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    // Sort by frequency and return top keywords
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * Generate canonical URL
   */
  generateCanonicalURL(path: string, baseUrl: string): string {
    const cleanPath = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    return `${baseUrl}${cleanPath}`;
  }

  /**
   * Generate sitemap XML
   */
  generateSitemap(urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): string {
    const xmlUrls = urls.map(url => {
      return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>\n` : ''}${
      url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>\n` : ''
    }${url.priority ? `    <priority>${url.priority}</priority>` : ''}  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(config: {
    userAgent?: string;
    allow?: string[];
    disallow?: string[];
    sitemap?: string;
  }): string {
    const { userAgent = '*', allow = [], disallow = [], sitemap } = config;

    let content = `User-agent: ${userAgent}\n`;

    allow.forEach(path => {
      content += `Allow: ${path}\n`;
    });

    disallow.forEach(path => {
      content += `Disallow: ${path}\n`;
    });

    if (sitemap) {
      content += `\nSitemap: ${sitemap}\n`;
    }

    return content;
  }

  /**
   * Validate SEO score
   */
  validateSEOScore(data: {
    title?: string;
    description?: string;
    headings?: string[];
    images?: number;
    internalLinks?: number;
    wordCount?: number;
  }): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Title check
    if (!data.title) {
      issues.push('Missing page title');
      score -= 20;
    } else if (data.title.length < 30) {
      issues.push('Title is too short (min 30 chars)');
      score -= 5;
    } else if (data.title.length > 60) {
      issues.push('Title is too long (max 60 chars)');
      score -= 5;
    }

    // Description check
    if (!data.description) {
      issues.push('Missing meta description');
      score -= 20;
    } else if (data.description.length < 120) {
      issues.push('Description is too short (min 120 chars)');
      score -= 5;
    } else if (data.description.length > 160) {
      issues.push('Description is too long (max 160 chars)');
      score -= 5;
    }

    // Heading check
    if (!data.headings || data.headings.length === 0) {
      issues.push('No headings found');
      score -= 10;
    }

    // Content check
    if (data.wordCount && data.wordCount < 300) {
      issues.push('Content is too short (min 300 words)');
      score -= 10;
    }

    // Images check
    if (data.images !== undefined && data.images > 0) {
      issues.push('Consider adding alt text to images');
    }

    return {
      score: Math.max(0, score),
      issues,
    };
  }
}

// Create singleton instance
export const seo = new SEOService();

export default seo;
