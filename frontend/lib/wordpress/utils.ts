/**
 * WordPress 工具函数
 * 提供常用的 WordPress 相关工具函数
 */

import type { BlogCardData } from '@/types/blog';

/**
 * URL 工具
 */
export const WordPressUrlUtils = {
  /**
   * 构建 WordPress API URL
   */
  buildApiUrl(baseUrl: string, endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${baseUrl}/wp-json/wp/v2/${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, v.toString()));
          } else {
            url.searchParams.set(key, value.toString());
          }
        }
      });
    }

    return url.toString();
  },

  /**
   * 构建文章页面 URL
   */
  buildPostUrl(siteUrl: string, slug: string): string {
    return `${siteUrl}/blog/${slug}`;
  },

  /**
   * 构建分类页面 URL
   */
  buildCategoryUrl(siteUrl: string, slug: string): string {
    return `${siteUrl}/category/${slug}`;
  },

  /**
   * 构建标签页面 URL
   */
  buildTagUrl(siteUrl: string, slug: string): string {
    return `${siteUrl}/tag/${slug}`;
  },

  /**
   * 构建作者页面 URL
   */
  buildAuthorUrl(siteUrl: string, slug: string): string {
    return `${siteUrl}/author/${slug}`;
  },
};

/**
 * 内容处理工具
 */
export const WordPressContentUtils = {
  /**
   * 清理 HTML 内容
   */
  cleanHtml(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<!--.*?-->/gs, '')
      .trim();
  },

  /**
   * 提取纯文本
   */
  extractText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  },

  /**
   * 截取摘要
   */
  truncateExcerpt(text: string, maxLength: number = 200): string {
    const cleaned = WordPressContentUtils.extractText(text);
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength).trim() + '...';
  },

  /**
   * 格式化 WordPress 内容（处理短代码等）
   */
  formatContent(content: string): string {
    return content
      .replace(/\[caption.*?\](.*?)\[\/caption\]/gs, '<figure>$1</figure>')
      .replace(/\[gallery.*?\]/g, '<div class="wp-gallery"></div>')
      .replace(/\[video.*?\](.*?)\[\/video\]/gs, '<video>$1</video>');
  },
};

/**
 * 图片处理工具
 */
export const WordPressImageUtils = {
  /**
   * 获取响应式图片 srcset
   */
  getSrcSet(images: Record<string, string | undefined>): string {
    const sizes = [
      { name: 'thumbnail', width: 150 },
      { name: 'medium', width: 300 },
      { name: 'medium_large', width: 768 },
      { name: 'large', width: 1024 },
    ];

    return sizes
      .filter(size => images[size.name])
      .map(size => `${images[size.name]} ${size.width}w`)
      .join(', ');
  },

  /**
   * 获取最优图片尺寸
   */
  getOptimalSize(
    images: Record<string, string | undefined>,
    containerWidth: number
  ): string | undefined {
    if (containerWidth <= 300) return images.thumbnail;
    if (containerWidth <= 768) return images.medium;
    if (containerWidth <= 1024) return images.medium_large || images.large;
    return images.large || images.full;
  },

  /**
   * 生成懒加载属性
   */
  getLazyLoadProps(index: number) {
    return {
      loading: index < 3 ? 'eager' : 'lazy',
      fetchpriority: index < 3 ? 'high' : 'auto',
    };
  },
};

/**
 * SEO 工具
 */
export const WordPressSEOUtils = {
  /**
   * 从文章生成 meta 标题
   */
  generateMetaTitle(post: BlogCardData, siteName: string): string {
    return `${post.title} - ${siteName}`;
  },

  /**
   * 从文章生成 meta 描述
   */
  generateMetaDescription(post: BlogCardData): string {
    return post.excerpt || WordPressContentUtils.truncateExcerpt(post.content || '', 160);
  },

  /**
   * 生成 Open Graph 数据
   */
  generateOpenGraph(post: BlogCardData, siteUrl: string) {
    return {
      title: post.title,
      description: WordPressContentUtils.truncateExcerpt(post.excerpt || post.content || '', 200),
      image: post.coverImage,
      url: WordPressUrlUtils.buildPostUrl(siteUrl, post.slug || ''),
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name],
      section: post.category,
      tags: post.tags,
    };
  },

  /**
   * 生成结构化数据 (JSON-LD)
   */
  generateStructuredData(post: BlogCardData, siteUrl: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      author: {
        '@type': 'Person',
        name: post.author?.name,
      },
      publisher: {
        '@type': 'Organization',
        name: siteUrl,
      },
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
    };
  },
};

/**
 * 缓存工具
 */
export const WordPressCacheUtils = {
  /**
   * 生成缓存键
   */
  generateCacheKey(type: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `wp:${type}:${sortedParams}`;
  },

  /**
   * 检查缓存是否过期
   */
  isCacheExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  },

  /**
   * 获取缓存 TTL（根据数据类型）
   */
  getCacheTTL(type: string): number {
    const ttls = {
      posts: 5 * 60 * 1000,        // 5 分钟
      post: 10 * 60 * 1000,        // 10 分钟
      categories: 30 * 60 * 1000,  // 30 分钟
      tags: 30 * 60 * 1000,        // 30 分钟
      authors: 60 * 60 * 1000,     // 1 小时
    };
    return ttls[type as keyof typeof ttls] || 5 * 60 * 1000;
  },
};

/**
 * 验证工具
 */
export const WordPressValidationUtils = {
  /**
   * 验证 WordPress URL
   */
  isValidWordPressUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  },

  /**
   * 验证文章数据
   */
  isValidPost(post: any): boolean {
    return (
      post &&
      typeof post === 'object' &&
      (post.id || post.slug) &&
      (post.title?.rendered || post.title)
    );
  },

  /**
   * 验证 API 响应
   */
  isValidResponse(response: any): boolean {
    return (
      response &&
      typeof response === 'object' &&
      !response.error
    );
  },
};

/**
 * 错误处理工具
 */
export const WordPressErrorUtils = {
  /**
   * 解析 WordPress API 错误
   */
  parseError(error: any): { message: string; code?: string; status?: number } {
    if (error.response) {
      return {
        message: error.response.data?.message || 'WordPress API Error',
        code: error.response.data?.code,
        status: error.response.status,
      };
    }

    if (error.message) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'Unknown error occurred',
    };
  },

  /**
   * 检查是否为网络错误
   */
  isNetworkError(error: any): boolean {
    return (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('Network Error')
    );
  },

  /**
   * 检查是否为认证错误
   */
  isAuthError(error: any): boolean {
    return (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.code === 'rest_forbidden'
    );
  },
};

/**
 * 性能监控工具
 */
export const WordPressPerformanceUtils = {
  /**
   * 记录 API 请求时间
   */
  trackRequest(endpoint: string, startTime: number) {
    const duration = Date.now() - startTime;
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`wp-api-${endpoint}`);
    }
    return duration;
  },

  /**
   * 计算查询复杂度
   */
  calculateQueryComplexity(params: Record<string, any>): number {
    let complexity = 1;
    if (params._embed) complexity += 2;
    if (params.search) complexity += 1;
    if (params.categories?.length) complexity += params.categories.length;
    if (params.tags?.length) complexity += params.tags.length;
    return complexity;
  },
};
