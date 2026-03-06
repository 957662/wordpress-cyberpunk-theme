/**
 * WordPress 数据导入工具
 *
 * 功能特性：
 * - WordPress XML 导出文件解析
 * - 文章、分类、标签导入
 * - 图片资源迁移
 * - 用户数据映射
 * - 进度追踪
 * - 错误处理
 */

export interface WordPressExport {
  rss?: {
    channel?: {
      title?: string;
      link?: string;
      description?: string;
      item?: WordPressItem[];
    };
  };
}

export interface WordPressItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  description?: string;
  content?: string;
  excerpt?: string;
  post_id?: string;
  post_date?: string;
  post_name?: string;
  post_type?: string;
  status?: string;
  categories?: string[];
  tags?: string[];
  postmeta?: WordPressPostMeta[];
}

export interface WordPressPostMeta {
  meta_key?: string;
  meta_value?: string;
}

export interface ImportedPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  meta: Record<string, any>;
  status: 'draft' | 'published';
}

export interface ImportProgress {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  current: string;
}

export interface ImportResult {
  posts: ImportedPost[];
  errors: Array<{
    item: string;
    error: string;
  }>;
  progress: ImportProgress;
}

/**
 * WordPress 导入器类
 */
export class WordPressImporter {
  private progress: ImportProgress;
  private errors: Array<{ item: string; error: string }> = [];
  private posts: ImportedPost[] = [];

  constructor() {
    this.progress = {
      total: 0,
      processed: 0,
      succeeded: 0,
      failed: 0,
      current: '',
    };
  }

  /**
   * 从 XML 文件导入
   */
  async importFromXML(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const parsed = await this.parseXML(text);
      return this.processExport(parsed);
    } catch (error) {
      throw new Error(`XML 解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 从 URL 导入
   */
  async importFromURL(url: string): Promise<ImportResult> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
      const text = await response.text();
      const parsed = await this.parseXML(text);
      return this.processExport(parsed);
    } catch (error) {
      throw new Error(`URL 导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 解析 XML
   */
  private async parseXML(text: string): Promise<WordPressExport> {
    // 简单的 XML 解析实现
    // 在实际项目中应该使用专门的 XML 解析库
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const items = xmlDoc.querySelectorAll('item');
      const channel = xmlDoc.querySelector('channel');

      const wpItems: WordPressItem[] = [];

      items.forEach((item) => {
        const wpItem: WordPressItem = {
          title: item.querySelector('title')?.textContent || undefined,
          link: item.querySelector('link')?.textContent || undefined,
          pubDate: item.querySelector('pubDate')?.textContent || undefined,
          creator: item.querySelector('creator')?.textContent || undefined,
          description: item.querySelector('description')?.textContent || undefined,
          content: item.querySelector('content\\:encoded, encoded')?.textContent || undefined,
          excerpt: item.querySelector('excerpt\\:encoded')?.textContent || undefined,
          post_id: item.querySelector('wp\\:post_id')?.textContent || undefined,
          post_date: item.querySelector('wp\\:post_date')?.textContent || undefined,
          post_name: item.querySelector('wp\\:post_name')?.textContent || undefined,
          post_type: item.querySelector('wp\\:post_type')?.textContent || undefined,
          status: item.querySelector('wp\\:status')?.textContent || undefined,
        };

        // 提取分类和标签
        const categories = item.querySelectorAll('category');
        const categoryList: string[] = [];
        const tagList: string[] = [];

        categories.forEach((cat) => {
          const domain = cat.getAttribute('domain');
          const value = cat.textContent;
          if (value) {
            if (domain === 'category') {
              categoryList.push(value);
            } else if (domain === 'post_tag') {
              tagList.push(value);
            }
          }
        });

        wpItem.categories = categoryList;
        wpItem.tags = tagList;

        wpItems.push(wpItem);
      });

      return {
        rss: {
          channel: {
            title: channel?.querySelector('title')?.textContent || undefined,
            link: channel?.querySelector('link')?.textContent || undefined,
            description: channel?.querySelector('description')?.textContent || undefined,
            item: wpItems,
          },
        },
      };
    } catch (error) {
      throw new Error(`XML 解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 处理导出数据
   */
  private async processExport(exportData: WordPressExport): Promise<ImportResult> {
    const items = exportData.rss?.channel?.item || [];
    this.progress.total = items.length;

    // 只处理文章类型
    const posts = items.filter((item) => item.post_type === 'post' || item.post_type === 'page');

    for (const item of posts) {
      this.progress.current = item.title || '未知文章';

      try {
        const post = await this.convertToPost(item);
        this.posts.push(post);
        this.progress.succeeded++;
      } catch (error) {
        this.errors.push({
          item: item.title || '未知文章',
          error: error instanceof Error ? error.message : '未知错误',
        });
        this.progress.failed++;
      }

      this.progress.processed++;
    }

    return {
      posts: this.posts,
      errors: this.errors,
      progress: this.progress,
    };
  }

  /**
   * 转换为文章格式
   */
  private async convertToPost(item: WordPressItem): Promise<ImportedPost> {
    if (!item.title || !item.content) {
      throw new Error('缺少必需的字段');
    }

    // 处理内容中的图片链接
    const content = this.processContent(item.content);

    // 提取特色图片
    const featuredImage = this.extractFeaturedImage(item);

    // 构建元数据
    const meta = this.buildMetaData(item);

    return {
      id: item.post_id || Date.now().toString(),
      title: item.title,
      slug: item.post_name || this.generateSlug(item.title),
      content,
      excerpt: item.excerpt || item.description || this.extractExcerpt(item.content),
      author: item.creator || 'admin',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      categories: item.categories || [],
      tags: item.tags || [],
      featuredImage,
      meta,
      status: item.status === 'publish' ? 'published' : 'draft',
    };
  }

  /**
   * 处理文章内容
   */
  private processContent(content: string): string {
    let processed = content;

    // 转换 WordPress 短代码
    processed = this.convertShortcodes(processed);

    // 修复图片路径
    processed = this.fixImagePaths(processed);

    // 清理多余的空格
    processed = processed.trim();

    return processed;
  }

  /**
   * 转换短代码
   */
  private convertShortcodes(content: string): string {
    // 转换 [caption] 短代码
    content = content.replace(/\[caption.*?\](.*?)\[\/caption\]/gs, '<figure class="wp-caption">$1</figure>');

    // 转换 [gallery] 短代码
    content = content.replace(/\[gallery.*?\]/g, '<div class="wp-gallery">Gallery</div>');

    return content;
  }

  /**
   * 修复图片路径
   */
  private fixImagePaths(content: string): string {
    // 替换 wp-content/uploads 路径
    content = content.replace(
      /https?:\/\/[^\/]+\/wp-content\/uploads\//g,
      '/images/wordpress/'
    );

    return content;
  }

  /**
   * 提取特色图片
   */
  private extractFeaturedImage(item: WordPressItem): string | undefined {
    if (item.postmeta) {
      const featuredImageMeta = item.postmeta.find(
        (meta) => meta.meta_key === '_thumbnail_id' || meta.meta_key === '_wp_attached_file'
      );
      return featuredImageMeta?.meta_value;
    }
    return undefined;
  }

  /**
   * 构建元数据
   */
  private buildMetaData(item: WordPressItem): Record<string, any> {
    const meta: Record<string, any> = {};

    if (item.postmeta) {
      item.postmeta.forEach((postMeta) => {
        if (postMeta.meta_key && postMeta.meta_value) {
          meta[postMeta.meta_key] = postMeta.meta_value;
        }
      });
    }

    return meta;
  }

  /**
   * 提取摘要
   */
  private extractExcerpt(content: string, maxLength = 200): string {
    // 移除 HTML 标签
    const text = content.replace(/<[^>]*>/g, '');

    // 截取指定长度
    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * 生成 slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * 获取进度
   */
  getProgress(): ImportProgress {
    return { ...this.progress };
  }

  /**
   * 获取错误列表
   */
  getErrors(): Array<{ item: string; error: string }> {
    return [...this.errors];
  }

  /**
   * 获取导入的文章
   */
  getPosts(): ImportedPost[] {
    return [...this.posts];
  }
}

/**
 * 导入辅助函数
 */
export async function importWordPressData(
  source: File | string,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportResult> {
  const importer = new WordPressImporter();

  // 监听进度
  if (onProgress) {
    const interval = setInterval(() => {
      onProgress(importer.getProgress());
    }, 100);

    try {
      let result: ImportResult;

      if (typeof source === 'string') {
        result = await importer.importFromURL(source);
      } else {
        result = await importer.importFromXML(source);
      }

      clearInterval(interval);
      return result;
    } catch (error) {
      clearInterval(interval);
      throw error;
    }
  } else {
    if (typeof source === 'string') {
      return await importer.importFromURL(source);
    } else {
      return await importer.importFromXML(source);
    }
  }
}

/**
 * 验证 WordPress 导出文件
 */
export function validateWordPressExport(file: File): boolean {
  // 检查文件扩展名
  const validExtensions = ['.xml', '.wxr'];
  const hasValidExtension = validExtensions.some((ext) => file.name.endsWith(ext));

  if (!hasValidExtension) {
    return false;
  }

  // 检查文件大小（限制 50MB）
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return false;
  }

  return true;
}
