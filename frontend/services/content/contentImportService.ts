/**
 * 内容导入服务
 * 支持从多种来源导入内容到博客平台
 */

import { NotificationService } from '../notification/notificationService';

export interface ContentImportOptions {
  source: 'markdown' | 'html' | 'word' | 'pdf' | 'wordpress' | 'notion' | 'medium';
  url?: string;
  file?: File;
  extractImages?: boolean;
  preserveFormatting?: boolean;
  autoSave?: boolean;
}

export interface ImportResult {
  success: boolean;
  data?: {
    title: string;
    content: string;
    excerpt: string;
    author?: string;
    date?: Date;
    tags?: string[];
    category?: string;
    featuredImage?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
  warnings?: string[];
}

export interface WordPressExport {
  post: {
    title: string;
    content: string;
    excerpt: string;
    status: string;
    author: {
      name: string;
      email: string;
    };
    categories: string[];
    tags: string[];
    featured_media?: string;
    date: string;
    modified: string;
  };
}

/**
 * 内容导入服务类
 */
export class ContentImportService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * 从 URL 导入内容
   */
  async importFromUrl(url: string, options: Partial<ContentImportOptions> = {}): Promise<ImportResult> {
    try {
      // 验证 URL
      const urlObj = new URL(url);
      const source = this.detectSourceFromUrl(urlObj);

      // 发送请求获取内容
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // 根据来源解析内容
      const result = await this.parseContent(html, source, options);

      if (result.success) {
        this.notificationService.showSuccess('内容导入成功');
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : '导入失败';
      this.notificationService.showError(message);
      return {
        success: false,
        error: message,
      };
    }
  }

  /**
   * 从文件导入内容
   */
  async importFromFile(file: File, options: Partial<ContentImportOptions> = {}): Promise<ImportResult> {
    try {
      const content = await this.readFileContent(file);
      const source = this.detectSourceFromFile(file);

      const result = await this.parseContent(content, source, options);

      if (result.success) {
        this.notificationService.showSuccess(`文件 "${file.name}" 导入成功`);
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : '文件读取失败';
      this.notificationService.showError(message);
      return {
        success: false,
        error: message,
      };
    }
  }

  /**
   * 从 WordPress 导出
   */
  async importFromWordPress(exportData: WordPressExport): Promise<ImportResult> {
    try {
      const { post } = exportData;

      return {
        success: true,
        data: {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author.name,
          date: new Date(post.date),
          tags: post.tags,
          category: post.categories[0],
          featuredImage: post.featured_media,
          metadata: {
            originalStatus: post.status,
            lastModified: post.modified,
            source: 'wordpress',
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WordPress 导入失败',
      };
    }
  }

  /**
   * 从 Markdown 导入
   */
  async importFromMarkdown(markdown: string): Promise<ImportResult> {
    try {
      // 提取 frontmatter
      const frontmatter = this.extractFrontmatter(markdown);
      const content = this.removeFrontmatter(markdown);

      // 提取标题
      const title = this.extractTitle(markdown, frontmatter);

      // 生成摘要
      const excerpt = this.generateExcerpt(content);

      return {
        success: true,
        data: {
          title,
          content,
          excerpt,
          author: frontmatter.author,
          date: frontmatter.date ? new Date(frontmatter.date) : undefined,
          tags: frontmatter.tags || [],
          category: frontmatter.category,
          featuredImage: frontmatter.image || frontmatter.cover,
          metadata: frontmatter,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Markdown 解析失败',
      };
    }
  }

  /**
   * 从 HTML 导入
   */
  async importFromHTML(html: string): Promise<ImportResult> {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 提取标题
      const title = doc.querySelector('h1')?.textContent || doc.title || '未命名文章';

      // 提取正文内容
      const bodyElement = doc.querySelector('article, main, .content, .post-content, #content');
      const content = bodyElement?.innerHTML || doc.body.innerHTML;

      // 清理内容
      const cleanedContent = this.cleanHTMLContent(content);

      // 生成摘要
      const excerpt = this.generateExcerpt(cleanedContent);

      // 提取元数据
      const metaTags = doc.querySelectorAll('meta');
      const metadata: Record<string, any> = {};
      metaTags.forEach((tag) => {
        const name = tag.getAttribute('name') || tag.getAttribute('property');
        const content = tag.getAttribute('content');
        if (name && content) {
          metadata[name] = content;
        }
      });

      return {
        success: true,
        data: {
          title,
          content: cleanedContent,
          excerpt,
          metadata: {
            ...metadata,
            source: 'html',
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'HTML 解析失败',
      };
    }
  }

  /**
   * 批量导入
   */
  async importBatch(files: File[]): Promise<ImportResult[]> {
    const results: ImportResult[] = [];

    for (const file of files) {
      const result = await this.importFromFile(file);
      results.push(result);
    }

    const successCount = results.filter((r) => r.success).length;
    this.notificationService.showSuccess(`批量导入完成：${successCount}/${files.length} 成功`);

    return results;
  }

  /**
   * 解析内容
   */
  private async parseContent(
    content: string,
    source: string,
    options: Partial<ContentImportOptions>
  ): Promise<ImportResult> {
    switch (source) {
      case 'markdown':
        return this.importFromMarkdown(content);
      case 'html':
        return this.importFromHTML(content);
      default:
        return {
          success: false,
          error: `不支持的内容来源: ${source}`,
        };
    }
  }

  /**
   * 从 URL 检测内容来源
   */
  private detectSourceFromUrl(url: URL): string {
    const hostname = url.hostname;

    if (hostname.includes('wordpress.com') || hostname.includes('wp')) {
      return 'wordpress';
    }
    if (hostname.includes('medium.com')) {
      return 'medium';
    }
    if (hostname.includes('notion.so')) {
      return 'notion';
    }

    return 'html';
  }

  /**
   * 从文件检测内容来源
   */
  private detectSourceFromFile(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'md':
      case 'markdown':
        return 'markdown';
      case 'html':
      case 'htm':
        return 'html';
      case 'doc':
      case 'docx':
        return 'word';
      case 'pdf':
        return 'pdf';
      default:
        return 'unknown';
    }
  }

  /**
   * 读取文件内容
   */
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }

  /**
   * 提取 Frontmatter
   */
  private extractFrontmatter(markdown: string): Record<string, any> {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
    const match = markdown.match(frontmatterRegex);

    if (!match) return {};

    const frontmatter: Record<string, any> = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        frontmatter[key.trim()] = this.parseFrontmatterValue(value);
      }
    }

    return frontmatter;
  }

  /**
   * 解析 Frontmatter 值
   */
  private parseFrontmatterValue(value: string): any {
    // 数组
    if (value.startsWith('[') && value.endsWith(']')) {
      return value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
    }

    // 布尔值
    if (value === 'true') return true;
    if (value === 'false') return false;

    // 数字
    if (!isNaN(Number(value))) return Number(value);

    // 字符串
    return value.replace(/^['"]|['"]$/g, '');
  }

  /**
   * 移除 Frontmatter
   */
  private removeFrontmatter(markdown: string): string {
    return markdown.replace(/^---\n[\s\S]+?\n---\n\n?/, '');
  }

  /**
   * 提取标题
   */
  private extractTitle(markdown: string, frontmatter: Record<string, any>): string {
    // 从 frontmatter 获取
    if (frontmatter.title) {
      return frontmatter.title;
    }

    // 从第一个 # 标题获取
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1];
    }

    return '未命名文章';
  }

  /**
   * 生成摘要
   */
  private generateExcerpt(content: string, maxLength = 200): string {
    // 移除 markdown 语法
    const text = content
      .replace(/[#*`_\[\]]/g, '')
      .replace(/\n/g, ' ')
      .trim();

    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * 清理 HTML 内容
   */
  private cleanHTMLContent(html: string): string {
    // 移除脚本和样式
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // 移除注释
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    return cleaned;
  }
}

// 导出单例
export const contentImportService = new ContentImportService();
