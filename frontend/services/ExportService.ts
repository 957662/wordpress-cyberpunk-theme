/**
 * Export Service - CyberPress Platform
 *
 * 提供数据导出功能，支持多种格式
 */

export type ExportFormat = 'csv' | 'json' | 'xml' | 'pdf' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  headers?: string[];
  transform?: (data: any[]) => any[];
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface ExportData {
  data: any[];
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    date?: string;
  };
}

class ExportService {
  private static instance: ExportService;

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * 导出数据到指定格式
   */
  async export(exportData: ExportData, options: ExportOptions): Promise<void> {
    try {
      const { data, metadata } = exportData;
      const { format, filename, transform } = options;

      // 应用数据转换
      const processedData = transform ? transform(data) : data;

      // 根据格式导出
      switch (format) {
        case 'csv':
          await this.exportCSV(processedData, filename, metadata);
          break;
        case 'json':
          await this.exportJSON(processedData, filename, metadata);
          break;
        case 'xml':
          await this.exportXML(processedData, filename, metadata);
          break;
        case 'pdf':
          await this.exportPDF(processedData, filename, metadata);
          break;
        case 'excel':
          await this.exportExcel(processedData, filename, metadata);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      options.onComplete?.();
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 导出为 CSV
   */
  private async exportCSV(
    data: any[],
    filename?: string,
    metadata?: ExportData['metadata']
  ): Promise<void> {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // 提取表头
    const headers = Object.keys(data[0]);

    // 构建 CSV 内容
    let csv = '';

    // 添加元数据注释
    if (metadata) {
      if (metadata.title) csv += `# Title: ${metadata.title}\n`;
      if (metadata.description) csv += `# Description: ${metadata.description}\n`;
      if (metadata.author) csv += `# Author: ${metadata.author}\n`;
      if (metadata.date) csv += `# Date: ${metadata.date}\n`;
      csv += '\n';
    }

    // 添加表头
    csv += headers.join(',') + '\n';

    // 添加数据行
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csv += values.join(',') + '\n';
    }

    // 下载文件
    this.downloadFile(csv, filename || 'export.csv', 'text/csv');
  }

  /**
   * 导出为 JSON
   */
  private async exportJSON(
    data: any[],
    filename?: string,
    metadata?: ExportData['metadata']
  ): Promise<void> {
    const jsonContent = JSON.stringify({ metadata, data }, null, 2);
    this.downloadFile(jsonContent, filename || 'export.json', 'application/json');
  }

  /**
   * 导出为 XML
   */
  private async exportXML(
    data: any[],
    filename?: string,
    metadata?: ExportData['metadata']
  ): Promise<void> {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

    if (metadata) {
      xml += '<metadata>\n';
      if (metadata.title) xml += `  <title>${this.escapeXML(metadata.title)}</title>\n`;
      if (metadata.description) xml += `  <description>${this.escapeXML(metadata.description)}</description>\n`;
      if (metadata.author) xml += `  <author>${this.escapeXML(metadata.author)}</author>\n`;
      if (metadata.date) xml += `  <date>${this.escapeXML(metadata.date)}</date>\n`;
      xml += '</metadata>\n';
    }

    xml += '<data>\n';
    for (const item of data) {
      xml += '  <item>\n';
      for (const [key, value] of Object.entries(item)) {
        xml += `    <${key}>${this.escapeXML(String(value ?? ''))}</${key}>\n`;
      }
      xml += '  </item>\n';
    }
    xml += '</data>';

    this.downloadFile(xml, filename || 'export.xml', 'application/xml');
  }

  /**
   * 导出为 PDF
   */
  private async exportPDF(
    data: any[],
    filename?: string,
    metadata?: ExportData['metadata']
  ): Promise<void> {
    // 简单的 PDF 导出（实际项目中建议使用 jsPDF 或类似库）
    let content = '';

    if (metadata?.title) {
      content += `# ${metadata.title}\n\n`;
    }

    if (metadata?.description) {
      content += `${metadata.description}\n\n`;
    }

    content += '---\n\n';

    // 表格格式的数据
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      content += '| ' + headers.join(' | ') + ' |\n';
      content += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

      for (const row of data) {
        content += '| ' + headers.map((h) => row[h] ?? '').join(' | ') + ' |\n';
      }
    }

    // 创建 Markdown 并提示用户转换为 PDF
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filename || 'export') + '.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 导出为 Excel
   */
  private async exportExcel(
    data: any[],
    filename?: string,
    metadata?: ExportData['metadata']
  ): Promise<void> {
    // 简单的 Excel 导出（实际项目中建议使用 xlsx 库）
    // 这里我们使用 CSV 格式，但使用 .xls 扩展名
    await this.exportCSV(data, filename?.replace('.csv', '.xls'), metadata);
  }

  /**
   * 导出图片（图表等）
   */
  async exportImage(
    canvas: HTMLCanvasElement,
    filename?: string,
    format: 'png' | 'jpeg' | 'webp' = 'png'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const dataUrl = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = filename || `chart.${format}`;
        link.href = dataUrl;
        link.click();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 打印数据
   */
  print(data: any[], options?: { title?: string; styles?: string }): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${options?.title || 'Print'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            ${options?.styles || ''}
          </style>
        </head>
        <body>
          ${options?.title ? `<h1>${options.title}</h1>` : ''}
          <table>
    `;

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      html += '<tr><th>' + headers.join('</th><th>') + '</th></tr>';

      for (const row of data) {
        html += '<tr><td>' + headers.map((h) => row[h] ?? '').join('</td><td>') + '</td></tr>';
      }
    }

    html += `
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  /**
   * 下载文件
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 转义 XML 特殊字符
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * 获取导出格式的 MIME 类型
   */
  private getMimeType(format: ExportFormat): string {
    const mimeTypes: Record<ExportFormat, string> = {
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      pdf: 'application/pdf',
      excel: 'application/vnd.ms-excel',
    };
    return mimeTypes[format];
  }
}

// 导出单例实例
export const exportService = ExportService.getInstance();

// 便捷方法
export const exportToCSV = (data: any[], filename?: string) =>
  exportService.export({ data }, { format: 'csv', filename });

export const exportToJSON = (data: any[], filename?: string) =>
  exportService.export({ data }, { format: 'json', filename });

export const exportToXML = (data: any[], filename?: string) =>
  exportService.export({ data }, { format: 'xml', filename });

export default exportService;
