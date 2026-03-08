/**
 * Export Service
 * 内容导出服务
 * 支持导出为 PDF、Markdown、HTML 等格式
 */

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'html' | 'json' | 'txt';
  filename?: string;
  includeMetadata?: boolean;
  styling?: boolean;
}

export interface ContentToExport {
  title: string;
  content: string;
  author?: string;
  date?: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
}

class ExportService {
  /**
   * 导出内容
   */
  async export(data: ContentToExport, options: ExportOptions): Promise<void> {
    const { format, filename, includeMetadata = true, styling = true } = options;
    const defaultFilename = `${this.sanitizeFilename(data.title)}.${format}`;

    let content: string;
    let mimeType: string;
    let blob: Blob;

    switch (format) {
      case 'markdown':
        content = this.exportMarkdown(data, includeMetadata);
        mimeType = 'text/markdown';
        blob = new Blob([content], { type: mimeType });
        break;

      case 'html':
        content = this.exportHTML(data, includeMetadata, styling);
        mimeType = 'text/html';
        blob = new Blob([content], { type: mimeType });
        break;

      case 'json':
        content = this.exportJSON(data);
        mimeType = 'application/json';
        blob = new Blob([content], { type: mimeType });
        break;

      case 'txt':
        content = this.exportTxt(data, includeMetadata);
        mimeType = 'text/plain';
        blob = new Blob([content], { type: mimeType });
        break;

      case 'pdf':
        // For PDF, we'll use browser's print functionality
        this.exportPDF(data, includeMetadata, styling);
        return;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Download the file
    this.download(blob, filename || defaultFilename);
  }

  /**
   * 导出为 Markdown
   */
  private exportMarkdown(data: ContentToExport, includeMetadata: boolean): string {
    let markdown = '';

    if (includeMetadata) {
      markdown += '---\n';
      markdown += `title: ${data.title}\n`;
      if (data.author) markdown += `author: ${data.author}\n`;
      if (data.date) markdown += `date: ${data.date}\n`;
      if (data.category) markdown += `category: ${data.category}\n`;
      if (data.tags && data.tags.length > 0) {
        markdown += `tags:\n`;
        data.tags.forEach(tag => {
          markdown += `  - ${tag}\n`;
        });
      }
      if (data.excerpt) markdown += `excerpt: ${data.excerpt}\n`;
      markdown += '---\n\n';
    }

    markdown += `# ${data.title}\n\n`;
    markdown += data.content;

    return markdown;
  }

  /**
   * 导出为 HTML
   */
  private exportHTML(data: ContentToExport, includeMetadata: boolean, styling: boolean): string {
    let html = '<!DOCTYPE html>\n';
    html += '<html lang="zh-CN">\n';
    html += '<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += `  <title>${this.escapeHtml(data.title)}</title>\n`;
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';

    if (styling) {
      html += '  <style>\n';
      html += '    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }\n';
      html += '    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }\n';
      html += '    h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }\n';
      html += '    h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }\n';
      html += '    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }\n';
      html += '    pre { background: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }\n';
      html += '    blockquote { border-left: 4px solid #ddd; padding-left: 1em; margin-left: 0; color: #666; }\n';
      html += '    img { max-width: 100%; height: auto; }\n';
      html += '    a { color: #0066cc; }\n';
      html += '    .metadata { background: #f9f9f9; padding: 1em; border-radius: 5px; margin-bottom: 2em; }\n';
      html += '    .metadata-item { margin: 0.5em 0; }\n';
      html += '    .metadata-label { font-weight: bold; }\n';
      html += '  </style>\n';
    }

    html += '</head>\n';
    html += '<body>\n';

    if (includeMetadata) {
      html += '  <div class="metadata">\n';
      html += `    <h1>${this.escapeHtml(data.title)}</h1>\n`;
      if (data.author) html += `    <div class="metadata-item"><span class="metadata-label">作者：</span>${this.escapeHtml(data.author)}</div>\n`;
      if (data.date) html += `    <div class="metadata-item"><span class="metadata-label">日期：</span>${this.escapeHtml(data.date)}</div>\n`;
      if (data.category) html += `    <div class="metadata-item"><span class="metadata-label">分类：</span>${this.escapeHtml(data.category)}</div>\n`;
      if (data.tags && data.tags.length > 0) {
        html += `    <div class="metadata-item"><span class="metadata-label">标签：</span>${data.tags.map(tag => this.escapeHtml(tag)).join(', ')}</div>\n`;
      }
      if (data.excerpt) html += `    <div class="metadata-item"><span class="metadata-label">摘要：</span>${this.escapeHtml(data.excerpt)}</div>\n`;
      html += '  </div>\n';
    }

    html += `  <div class="content">\n${data.content}\n  </div>\n`;
    html += '</body>\n';
    html += '</html>';

    return html;
  }

  /**
   * 导出为 JSON
   */
  private exportJSON(data: ContentToExport): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导出为纯文本
   */
  private exportTxt(data: ContentToExport, includeMetadata: boolean): string {
    let text = '';

    if (includeMetadata) {
      text += `${data.title}\n`;
      text += '='.repeat(data.title.length) + '\n\n';
      if (data.author) text += `作者：${data.author}\n`;
      if (data.date) text += `日期：${data.date}\n`;
      if (data.category) text += `分类：${data.category}\n`;
      if (data.tags && data.tags.length > 0) {
        text += `标签：${data.tags.join(', ')}\n`;
      }
      text += '\n';
    }

    text += data.content;

    return text;
  }

  /**
   * 导出为 PDF（使用浏览器打印功能）
   */
  private exportPDF(data: ContentToExport, includeMetadata: boolean, styling: boolean): void {
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('无法打开打印窗口，请检查浏览器弹窗设置');
    }

    const html = this.exportHTML(data, includeMetadata, styling);
    printWindow.document.write(html);
    printWindow.document.close();

    // 等待页面加载完成后触发打印
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }

  /**
   * 下载文件
   */
  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 清理文件名（移除不安全字符）
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 移除重复的连字符
      .trim() || 'untitled';
  }

  /**
   * HTML 转义
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 批量导出
   */
  async exportBatch(items: ContentToExport[], options: ExportOptions): Promise<void> {
    for (const item of items) {
      await this.export(item, {
        ...options,
        filename: `${this.sanitizeFilename(item.title)}.${options.format}`,
      });
      // 添加延迟避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * 导出为模板
   */
  exportTemplate(format: 'markdown' | 'html' | 'json'): string {
    const templateData: ContentToExport = {
      title: '文章标题',
      content: '在这里开始写作...',
      author: '作者姓名',
      date: new Date().toISOString(),
      category: '分类',
      tags: ['标签1', '标签2'],
      excerpt: '文章摘要...',
    };

    switch (format) {
      case 'markdown':
        return this.exportMarkdown(templateData, true);
      case 'html':
        return this.exportHTML(templateData, true, true);
      case 'json':
        return this.exportJSON(templateData);
      default:
        throw new Error(`Unsupported template format: ${format}`);
    }
  }
}

// Create singleton instance
export const exportService = new ExportService();

export default ExportService;
