/**
 * SEO 优化工具
 * 提供搜索引擎优化相关功能
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, any>;
}

export interface PageAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  fix?: string;
}

/**
 * SEO 优化器类
 */
export class SEOOptimizer {
  /**
   * 生成页面元数据
   */
  static generateMetadata(data: Partial<SEOMetadata>): SEOMetadata {
    const {
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
      structuredData,
    } = data;

    return {
      title: title || '',
      description: description || '',
      keywords,
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description,
      ogImage,
      ogType,
      twitterCard,
      canonical,
      noindex,
      nofollow,
      structuredData,
    };
  }

  /**
   * 生成 JSON-LD 结构化数据
   */
  static generateStructuredData(type: string, data: Record<string, any>): string {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return JSON.stringify(baseData);
  }

  /**
   * 生成文章结构化数据
   */
  static generateArticleSchema(data: {
    title: string;
    description: string;
    imageUrl: string;
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
  }): string {
    return this.generateStructuredData('Article', {
      headline: data.title,
      description: data.description,
      image: data.imageUrl,
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
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.publisher.logo,
      },
    });
  }

  /**
   * 生成面包屑结构化数据
   */
  static generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
    const itemList = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    }));

    return this.generateStructuredData('BreadcrumbList', {
      itemListElement: itemList,
    });
  }

  /**
   * 生成网站结构化数据
   */
  static generateWebsiteSchema(data: {
    name: string;
    url: string;
    description?: string;
    searchAction?: string;
  }): string {
    const schema: Record<string, any> = {
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
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data.searchAction,
        },
        'query-input': 'required name=search_term_string',
      };
    }

    return this.generateStructuredData('WebSite', schema);
  }

  /**
   * 分析页面 SEO
   */
  static analyzePage(html: string, url: string): PageAnalysis {
    const issues: SEOIssue[] = [];
    const suggestions: string[] = [];
    let score = 100;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 检查标题
    const title = doc.querySelector('title')?.textContent || '';
    if (!title) {
      issues.push({
        type: 'error',
        category: 'Title',
        message: '缺少页面标题',
        fix: '添加 <title> 标签',
      });
      score -= 20;
    } else if (title.length < 30 || title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: `标题长度不理想 (${title.length} 字符)`,
        fix: '标题长度应在 30-60 字符之间',
      });
      score -= 5;
    }

    // 检查描述
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (!description) {
      issues.push({
        type: 'error',
        category: 'Meta Description',
        message: '缺少页面描述',
        fix: '添加 meta description',
      });
      score -= 20;
    } else if (description.length < 120 || description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `描述长度不理想 (${description.length} 字符)`,
        fix: '描述长度应在 120-160 字符之间',
      });
      score -= 5;
    }

    // 检查 H1 标签
    const h1Tags = doc.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push({
        type: 'error',
        category: 'Heading',
        message: '缺少 H1 标签',
        fix: '添加一个 H1 标签',
      });
      score -= 15;
    } else if (h1Tags.length > 1) {
      issues.push({
        type: 'warning',
        category: 'Heading',
        message: '存在多个 H1 标签',
        fix: '只应有一个 H1 标签',
      });
      score -= 5;
    }

    // 检查图片 alt 属性
    const images = doc.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter((img) => !img.getAttribute('alt'));
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Images',
        message: `${imagesWithoutAlt.length} 张图片缺少 alt 属性`,
        fix: '为所有图片添加描述性的 alt 属性',
      });
      score -= 10;
    }

    // 检查结构化数据
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLdScripts.length === 0) {
      suggestions.push('添加结构化数据 (JSON-LD) 可以提升搜索引擎理解');
    }

    // 检查 Open Graph 标签
    const ogTitle = doc.querySelector('meta[property="og:title"]');
    const ogDescription = doc.querySelector('meta[property="og:description"]');
    const ogImage = doc.querySelector('meta[property="og:image"]');

    if (!ogTitle || !ogDescription || !ogImage) {
      suggestions.push('添加完整的 Open Graph 标签以优化社交媒体分享');
    }

    // 检查 canonical 链接
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
      suggestions.push('添加 canonical 链接以避免重复内容问题');
    }

    // 检查页面速度
    const contentLength = html.length;
    if (contentLength > 500000) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        message: '页面 HTML 体积过大',
        fix: '优化 HTML 结构，减少冗余代码',
      });
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }

  /**
   * 优化 URL
   */
  static optimizeUrl(url: string, options: { lowercase?: boolean; removeTrailingSlash?: boolean } = {}): string {
    let optimized = url;

    if (options.lowercase !== false) {
      optimized = optimized.toLowerCase();
    }

    if (options.removeTrailingSlash !== false) {
      optimized = optimized.replace(/\/$/, '') || '/';
    }

    return optimized;
  }

  /**
   * 生成 slug
   */
  static generateSlug(text: string, options: { maxLength?: number; separator?: string } = {}): string {
    const { maxLength = 100, separator = '-' } = options;

    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, separator)
      .replace(/^-+|-+$/g, '')
      .substring(0, maxLength);
  }

  /**
   * 生成关键词
   */
  static generateKeywords(content: string, count = 10): string[] {
    // 移除 HTML 标签
    const text = content.replace(/<[^>]*>/g, ' ');

    // 分词
    const words = text
      .toLowerCase()
      .match(/[\u4e00-\u9fa5]+|[a-z]+/g) || [];

    // 词频统计
    const frequency: Record<string, number> = {};
    const stopWords = new Set(['的', '了', '是', '在', '和', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);

    for (const word of words) {
      if (word.length > 1 && !stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    }

    // 排序并返回前 N 个
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word);
  }

  /**
   * 验证 SEO 元数据
   */
  static validateMetadata(metadata: SEOMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata.title) {
      errors.push('标题不能为空');
    } else if (metadata.title.length < 30 || metadata.title.length > 60) {
      errors.push('标题长度应在 30-60 字符之间');
    }

    if (!metadata.description) {
      errors.push('描述不能为空');
    } else if (metadata.description.length < 120 || metadata.description.length > 160) {
      errors.push('描述长度应在 120-160 字符之间');
    }

    if (metadata.ogImage && !this.isValidUrl(metadata.ogImage)) {
      errors.push('Open Graph 图片 URL 无效');
    }

    if (metadata.canonical && !this.isValidUrl(metadata.canonical)) {
      errors.push('Canonical URL 无效');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 验证 URL
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 生成 robots.txt 内容
   */
  static generateRobotsTxt(options: {
    userAgent?: string;
    allow?: string[];
    disallow?: string[];
    sitemap?: string;
  }): string {
    const { userAgent = '*', allow = [], disallow = [], sitemap } = options;

    let content = `User-agent: ${userAgent}\n`;

    for (const path of allow) {
      content += `Allow: ${path}\n`;
    }

    for (const path of disallow) {
      content += `Disallow: ${path}\n`;
    }

    if (sitemap) {
      content += `\nSitemap: ${sitemap}\n`;
    }

    return content;
  }

  /**
   * 生成 sitemap XML
   */
  static generateSitemap(urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): string {
    const xmlItems = urls.map((url) => {
      return `
    <url>
      <loc>${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
  }
}

export default SEOOptimizer;
