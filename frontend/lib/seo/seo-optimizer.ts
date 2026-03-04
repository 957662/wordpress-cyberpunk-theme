/**
 * SEO 优化工具集
 * CyberPress Platform
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, any>;
}

export interface PageAnalysis {
  score: number;
  issues: SEOIssue[];
  warnings: SEOWarning[];
  suggestions: SEOSuggestion[];
}

export interface SEOIssue {
  type: 'critical' | 'error';
  message: string;
  location?: string;
}

export interface SEOWarning {
  type: 'warning';
  message: string;
  location?: string;
}

export interface SEOSuggestion {
  type: 'suggestion';
  message: string;
  impact: 'high' | 'medium' | 'low';
}

class SEOOptimizer {
  /**
   * 生成页面元数据
   */
  generateMetadata(data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    keywords?: string[];
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
  }): SEOMetadata {
    const {
      title,
      description,
      image,
      url,
      type = 'website',
      siteName = 'CyberPress',
      keywords,
      author,
      publishedTime,
      modifiedTime,
    } = data;

    const metadata: SEOMetadata = {
      title: this.formatTitle(title),
      description: this.formatDescription(description),
    };

    // Open Graph
    if (title) metadata.ogTitle = title;
    if (description) metadata.ogDescription = description;
    if (image) metadata.ogImage = image;

    // Twitter Card
    if (image) {
      metadata.twitterCard = 'summary_large_image';
    } else {
      metadata.twitterCard = 'summary';
    }

    // Keywords
    if (keywords && keywords.length > 0) {
      metadata.keywords = keywords;
    }

    // Canonical URL
    if (url) {
      metadata.canonical = url;
    }

    // Structured Data
    if (type === 'article') {
      metadata.structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        author: {
          '@type': 'Person',
          name: author,
        },
        datePublished: publishedTime,
        dateModified: modifiedTime,
      };
    } else {
      metadata.structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: url,
      };
    }

    return metadata;
  }

  /**
   * 格式化标题
   */
  private formatTitle(title: string): string {
    const maxLength = 60;
    const siteName = 'CyberPress';

    if (title.length > maxLength) {
      return title.substring(0, maxLength - 3) + '...';
    }

    return `${title} | ${siteName}`;
  }

  /**
   * 格式化描述
   */
  private formatDescription(description: string): string {
    const maxLength = 160;

    if (description.length > maxLength) {
      return description.substring(0, maxLength - 3) + '...';
    }

    return description;
  }

  /**
   * 分析页面 SEO
   */
  analyzePage(): PageAnalysis {
    const issues: SEOIssue[] = [];
    const warnings: SEOWarning[] = [];
    const suggestions: SEOSuggestion[] = [];

    // 检查标题
    const title = document.querySelector('title')?.textContent || '';
    if (!title) {
      issues.push({
        type: 'critical',
        message: '页面缺少标题标签',
        location: '<head>',
      });
    } else if (title.length < 30) {
      warnings.push({
        type: 'warning',
        message: `标题过短 (${title.length} 字符)，建议 30-60 字符`,
        location: '<title>',
      });
    } else if (title.length > 60) {
      warnings.push({
        type: 'warning',
        message: `标题过长 (${title.length} 字符)，建议 30-60 字符`,
        location: '<title>',
      });
    }

    // 检查描述
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (!description) {
      issues.push({
        type: 'critical',
        message: '页面缺少元描述',
        location: 'meta[name="description"]',
      });
    } else if (description.length < 120) {
      warnings.push({
        type: 'warning',
        message: `描述过短 (${description.length} 字符)，建议 120-160 字符`,
        location: 'meta[name="description"]',
      });
    } else if (description.length > 160) {
      warnings.push({
        type: 'warning',
        message: `描述过长 (${description.length} 字符)，建议 120-160 字符`,
        location: 'meta[name="description"]',
      });
    }

    // 检查 H1 标签
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push({
        type: 'critical',
        message: '页面缺少 H1 标签',
        location: '<body>',
      });
    } else if (h1Tags.length > 1) {
      warnings.push({
        type: 'warning',
        message: '页面有多个 H1 标签，建议只使用一个',
        location: '<body>',
      });
    }

    // 检查图片 alt 属性
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach((img) => {
      if (!img.getAttribute('alt')) {
        imagesWithoutAlt++;
      }
    });

    if (imagesWithoutAlt > 0) {
      warnings.push({
        type: 'warning',
        message: `${imagesWithoutAlt} 张图片缺少 alt 属性`,
        location: '<img>',
      });
    }

    // 检查链接
    const links = document.querySelectorAll('a[href]');
    let emptyLinks = 0;
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '' || href === '#') {
        emptyLinks++;
      }
    });

    if (emptyLinks > 0) {
      suggestions.push({
        type: 'suggestion',
        message: `${emptyLinks} 个链接为空或指向页面顶部`,
        impact: 'medium',
      });
    }

    // 检查结构化数据
    const jsonLdElements = document.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLdElements.length === 0) {
      suggestions.push({
        type: 'suggestion',
        message: '建议添加结构化数据以提升搜索引擎理解',
        impact: 'high',
      });
    }

    // 检查 Open Graph 标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (!ogTitle || !ogDescription || !ogImage) {
      suggestions.push({
        type: 'suggestion',
        message: '建议完善 Open Graph 标签以改善社交媒体分享效果',
        impact: 'high',
      });
    }

    // 检查 Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      suggestions.push({
        type: 'suggestion',
        message: '建议添加 canonical 标签以避免重复内容问题',
        impact: 'medium',
      });
    }

    // 计算 SEO 分数
    const score = this.calculateSEOScore(issues, warnings, suggestions);

    return {
      score,
      issues,
      warnings,
      suggestions,
    };
  }

  /**
   * 计算 SEO 分数
   */
  private calculateSEOScore(
    issues: SEOIssue[],
    warnings: SEOWarning[],
    suggestions: SEOSuggestion[]
  ): number {
    let score = 100;

    // 关键问题扣分
    score -= issues.filter((i) => i.type === 'critical').length * 20;
    score -= issues.filter((i) => i.type === 'error').length * 10;

    // 警告扣分
    score -= warnings.length * 5;

    // 建议扣分（较少）
    score -= suggestions.filter((s) => s.impact === 'high').length * 3;
    score -= suggestions.filter((s) => s.impact === 'medium').length * 1;

    return Math.max(0, score);
  }

  /**
   * 生成结构化数据
   */
  generateStructuredData(type: 'article' | 'blog' | 'website' | 'organization', data: any): string {
    const baseSchema = {
      '@context': 'https://schema.org',
    };

    let schema: Record<string, any> = { ...baseSchema };

    switch (type) {
      case 'article':
        schema = {
          ...schema,
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author,
          },
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime,
          publisher: {
            '@type': 'Organization',
            name: 'CyberPress',
            logo: {
              '@type': 'ImageObject',
              url: data.logo,
            },
          },
        };
        break;

      case 'blog':
        schema = {
          ...schema,
          '@type': 'Blog',
          name: data.title,
          description: data.description,
          url: data.url,
          author: {
            '@type': 'Person',
            name: data.author,
          },
        };
        break;

      case 'website':
        schema = {
          ...schema,
          '@type': 'WebSite',
          name: data.siteName,
          url: data.url,
          description: data.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${data.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };
        break;

      case 'organization':
        schema = {
          ...schema,
          '@type': 'Organization',
          name: data.name,
          url: data.url,
          logo: data.logo,
          description: data.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.street,
            addressLocality: data.address?.city,
            addressRegion: data.address?.state,
            postalCode: data.address?.zip,
            addressCountry: data.address?.country,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: data.phone,
            contactType: 'customer service',
          },
        };
        break;
    }

    return JSON.stringify(schema);
  }

  /**
   * 生成面包屑结构化数据
   */
  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };

    return JSON.stringify(schema);
  }

  /**
   * 生成网站地图
   */
  async generateSitemap(urls: Array<{
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): Promise<string> {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    ${url.lastModified ? `<lastmod>${url.lastModified}</lastmod>` : ''}
    ${url.changeFrequency ? `<changefreq>${url.changeFrequency}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

    return xmlContent;
  }

  /**
   * 生成 robots.txt
   */
  generateRobotsTxt(config: {
    userAgent?: string;
    allow?: string[];
    disallow?: string[];
    sitemap?: string;
  }): string {
    const {
      userAgent = '*',
      allow = [],
      disallow = [],
      sitemap,
    } = config;

    let content = `User-agent: ${userAgent}\n`;

    if (allow.length > 0) {
      allow.forEach((path) => {
        content += `Allow: ${path}\n`;
      });
    }

    if (disallow.length > 0) {
      disallow.forEach((path) => {
        content += `Disallow: ${path}\n`;
      });
    }

    if (sitemap) {
      content += `\nSitemap: ${sitemap}\n`;
    }

    return content;
  }

  /**
   * 优化图片 URL（添加 CDN 参数）
   */
  optimizeImageUrl(url: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url);

      if (options?.width) {
        urlObj.searchParams.set('w', options.width.toString());
      }
      if (options?.height) {
        urlObj.searchParams.set('h', options.height.toString());
      }
      if (options?.quality) {
        urlObj.searchParams.set('q', options.quality.toString());
      }
      if (options?.format) {
        urlObj.searchParams.set('f', options.format);
      }

      return urlObj.toString();
    } catch {
      return url;
    }
  }

  /**
   * 生成 slug
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
   * 提取关键词
   */
  extractKeywords(content: string, minFrequency: number = 2): string[] {
    // 移除 HTML 标签
    const text = content.replace(/<[^>]*>/g, ' ');

    // 分词并统计频率
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const frequency: Record<string, number> = {};

    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // 过滤常见停用词
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    ]);

    const keywords = Object.entries(frequency)
      .filter(([word, freq]) => freq >= minFrequency && !stopWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return keywords;
  }
}

export const seoOptimizer = new SEOOptimizer();
