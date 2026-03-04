/**
 * SEO 优化服务
 * 提供 SEO 相关的工具函数和组件
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: object;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface JsonLdProps {
  type: string;
  data: object;
}

class SEOService {
  private defaultConfig: Partial<SEOConfig> = {
    ogType: 'website',
    twitterCard: 'summary_large_image',
  };

  /**
   * 生成 meta 标签
   */
  generateMetaTags(config: SEOConfig): MetaTag[] {
    const tags: MetaTag[] = [];
    const fullConfig = { ...this.defaultConfig, ...config };

    // 基础 meta 标签
    tags.push({ name: 'title', content: fullConfig.title });
    tags.push({ name: 'description', content: fullConfig.description });

    // Keywords
    if (fullConfig.keywords && fullConfig.keywords.length > 0) {
      tags.push({ name: 'keywords', content: fullConfig.keywords.join(', ') });
    }

    // Robots
    if (fullConfig.noindex || fullConfig.nofollow) {
      const robots = [fullConfig.noindex ? 'noindex' : 'index', fullConfig.nofollow ? 'nofollow' : 'follow']
        .filter(Boolean)
        .join(', ');
      tags.push({ name: 'robots', content: robots });
    }

    // Canonical
    if (fullConfig.canonical) {
      tags.push({ name: 'canonical', content: fullConfig.canonical });
    }

    // Open Graph
    tags.push({ property: 'og:title', content: fullConfig.title });
    tags.push({ property: 'og:description', content: fullConfig.description });
    tags.push({ property: 'og:type', content: fullConfig.ogType! });

    if (fullConfig.ogImage) {
      tags.push({ property: 'og:image', content: fullConfig.ogImage });
    }

    // Twitter Card
    tags.push({ name: 'twitter:card', content: fullConfig.twitterCard! });
    tags.push({ name: 'twitter:title', content: fullConfig.title });
    tags.push({ name: 'twitter:description', content: fullConfig.description });

    if (fullConfig.ogImage) {
      tags.push({ name: 'twitter:image', content: fullConfig.ogImage });
    }

    return tags;
  }

  /**
   * 生成 JSON-LD 结构化数据
   */
  generateJsonLd(type: string, data: object): string {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return JSON.stringify(jsonLd);
  }

  /**
   * 生成文章结构化数据
   */
  generateArticleSchema(data: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: {
      name: string;
      url?: string;
    };
    publisher: {
      name: string;
      logo?: string;
    };
    url?: string;
  }): string {
    return this.generateJsonLd('Article', {
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
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
   * 生成面包屑结构化数据
   */
  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
    return this.generateJsonLd('BreadcrumbList', {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  /**
   * 生成网站结构化数据
   */
  generateWebsiteSchema(data: {
    name: string;
    url: string;
    description?: string;
    searchAction?: string;
  }): string {
    const schema: any = {
      '@type': 'WebSite',
      name: data.name,
      url: data.url,
    };

    if (data.description) {
      schema.description = data.description;
    }

    if (data.searchAction) {
      schema.potentialAction = {
        '@type': 'SearchAction',
        target: `${data.searchAction}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      };
    }

    return this.generateJsonLd('WebSite', schema);
  }

  /**
   * 生成组织结构化数据
   */
  generateOrganizationSchema(data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
      type: string;
      telephone?: string;
      email?: string;
    };
  }): string {
    const schema: any = {
      '@type': 'Organization',
      name: data.name,
      url: data.url,
    };

    if (data.logo) {
      schema.logo = data.logo;
    }

    if (data.description) {
      schema.description = data.description;
    }

    if (data.sameAs && data.sameAs.length > 0) {
      schema.sameAs = data.sameAs;
    }

    if (data.contactPoint) {
      schema.contactPoint = {
        '@type': data.contactPoint.type,
        contactType: 'customer service',
      };

      if (data.contactPoint.telephone) {
        schema.contactPoint.telephone = data.contactPoint.telephone;
      }

      if (data.contactPoint.email) {
        schema.contactPoint.email = data.contactPoint.email;
      }
    }

    return this.generateJsonLd('Organization', schema);
  }

  /**
   * 生成产品结构化数据
   */
  generateProductSchema(data: {
    name: string;
    description: string;
    image: string[];
    brand?: string;
    sku?: string;
    offers: {
      price: number;
      priceCurrency: string;
      availability: 'InStock' | 'OutOfStock' | 'PreOrder';
      url?: string;
    };
  }): string {
    return this.generateJsonLd('Product', {
      name: data.name,
      description: data.description,
      image: data.image,
      brand: data.brand
        ? {
            '@type': 'Brand',
            name: data.brand,
          }
        : undefined,
      sku: data.sku,
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
        availability: `https://schema.org/${data.offers.availability}`,
        url: data.offers.url,
      },
    });
  }

  /**
   * 优化图片 URL（用于 SEO）
   */
  optimizeImageUrl(url: string, options?: { width?: number; height?: number; quality?: number }): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : '');

      // 添加图片优化参数
      if (options?.width) {
        urlObj.searchParams.set('w', options.width.toString());
      }
      if (options?.height) {
        urlObj.searchParams.set('h', options.height.toString());
      }
      if (options?.quality) {
        urlObj.searchParams.set('q', options.quality.toString());
      }

      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  /**
   * 生成 slug（URL 友好的字符串）
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * 生成页面标题
   */
  generatePageTitle(title: string, siteName?: string, template?: string): string {
    if (template) {
      return template.replace('%s', title).replace('%siteName%', siteName || '');
    }

    if (siteName) {
      return `${title} | ${siteName}`;
    }

    return title;
  }

  /**
   * 生成元描述
   */
  generateMetaDescription(content: string, maxLength: number = 160): string {
    // 移除 HTML 标签
    const text = content.replace(/<[^>]*>/g, '');

    // 截断到指定长度
    if (text.length <= maxLength) {
      return text;
    }

    // 在单词边界截断
    const truncated = text.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return truncated.substr(0, lastSpace) + '...';
  }

  /**
   * 生成关键词
   */
  generateKeywords(content: string, stopWords?: string[]): string[] {
    const text = content.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];

    const defaultStopWords = [
      'a',
      'an',
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
    ];

    const stopWordsSet = new Set([...defaultStopWords, ...(stopWords || [])]);

    // 统计词频
    const wordCount = new Map<string, number>();
    words.forEach((word) => {
      if (word.length > 2 && !stopWordsSet.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    // 返回最常见的词
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * 验证 SEO 配置
   */
  validateSEOConfig(config: SEOConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.title || config.title.length === 0) {
      errors.push('Title is required');
    }

    if (config.title && config.title.length > 60) {
      errors.push('Title should be 60 characters or less');
    }

    if (!config.description || config.description.length === 0) {
      errors.push('Description is required');
    }

    if (config.description && config.description.length > 160) {
      errors.push('Description should be 160 characters or less');
    }

    if (config.ogImage && !this.isValidUrl(config.ogImage)) {
      errors.push('OG image must be a valid URL');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证 URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 生成 sitemap URL
   */
  generateSitemapUrl(
    url: string,
    options?: {
      lastModified?: Date;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }
  ): string {
    const attrs = [
      `loc="${this.escapeXml(url)}"`,
      options?.lastModified ? `lastmod="${options.lastModified.toISOString()}"` : '',
      options?.changeFrequency ? `changefreq="${options.changeFrequency}"` : '',
      options?.priority !== undefined ? `priority="${options.priority}"` : '',
    ].filter(Boolean);

    return `<url>${attrs.map((attr) => `<${attr} />`).join('')}</url>`;
  }

  /**
   * 转义 XML
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// 创建全局实例
export const seoService = new SEOService();

// Hook
export function useSEO() {
  const generateMetaTags = React.useCallback((config: SEOConfig) => {
    return seoService.generateMetaTags(config);
  }, []);

  const generateArticleSchema = React.useCallback(
    (data: Parameters<typeof seoService.generateArticleSchema>[0]) => {
      return seoService.generateArticleSchema(data);
    },
    []
  );

  const generateSlug = React.useCallback((text: string) => {
    return seoService.generateSlug(text);
  }, []);

  const validateSEOConfig = React.useCallback((config: SEOConfig) => {
    return seoService.validateSEOConfig(config);
  }, []);

  return {
    generateMetaTags,
    generateArticleSchema,
    generateSlug,
    validateSEOConfig,
  };
}

export default SEOService;
