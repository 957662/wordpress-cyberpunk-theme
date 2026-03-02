/**
 * Export Service - 数据导出服务
 * 支持导出为 CSV、Excel、JSON、PDF 等格式
 */

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf' | 'txt';
export type ExportDataType = any[] | Record<string, any>;

export interface ExportConfig {
  /** 文件名（不含扩展名） */
  filename: string;
  /** 导出格式 */
  format: ExportFormat;
  /** 数据 */
  data: ExportDataType;
  /** 列配置（用于 CSV/Excel） */
  columns?: ExportColumn[];
  /** 表头（用于 CSV/Excel） */
  headers?: string[];
  /** 是否包含标题行 */
  includeHeader?: boolean;
  /** 编码 */
  encoding?: string;
  /** 分隔符（用于 CSV） */
  delimiter?: string;
  /** 回调函数 */
  onSuccess?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

export interface ExportColumn {
  /** 字段名 */
  key: string;
  /** 显示名称 */
  label: string;
  /** 格式化函数 */
  formatter?: (value: any, row: any) => string;
  /** 是否导出 */
  export?: boolean;
}

export interface ExportProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class ExportService {
  /**
   * 导出数据
   */
  async export(config: ExportConfig): Promise<Blob> {
    const {
      filename,
      format,
      data,
      columns = [],
      headers = [],
      includeHeader = true,
      encoding = 'utf-8',
      delimiter = ',',
      onSuccess,
      onError,
    } = config;

    try {
      let blob: Blob;

      switch (format) {
        case 'csv':
          blob = this.exportCSV(data, columns, headers, includeHeader, delimiter, encoding);
          break;
        case 'json':
          blob = this.exportJSON(data, encoding);
          break;
        case 'xlsx':
          blob = await this.exportXLSX(data, columns, headers, includeHeader);
          break;
        case 'pdf':
          blob = await this.exportPDF(data, columns);
          break;
        case 'txt':
          blob = this.exportTXT(data, encoding);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      this.downloadBlob(blob, filename, format);

      if (onSuccess) {
        onSuccess(blob);
      }

      return blob;
    } catch (error) {
      const err = error as Error;
      if (onError) {
        onError(err);
      }
      throw err;
    }
  }

  /**
   * 导出为 CSV
   */
  private exportCSV(
    data: ExportDataType,
    columns: ExportColumn[],
    headers: string[],
    includeHeader: boolean,
    delimiter: string,
    encoding: string
  ): Blob {
    let csv = '';

    const arrayData = Array.isArray(data) ? data : [data];
    const exportColumns = columns.filter(col => col.export !== false);

    // 添加表头
    if (includeHeader) {
      const headerRow = headers.length > 0
        ? headers
        : exportColumns.map(col => col.label);

      csv += headerRow.map(h => `"${h}"`).join(delimiter) + '\n';
    }

    // 添加数据行
    arrayData.forEach(row => {
      const values = exportColumns.map(col => {
        const value = row[col.key];
        const formattedValue = col.formatter ? col.formatter(value, row) : value;
        return `"${String(formattedValue ?? '').replace(/"/g, '""')}"`;
      });
      csv += values.join(delimiter) + '\n';
    });

    // 添加 BOM 以支持 Excel 中文
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    return new Blob([bom, csv], { type: `text/csv;charset=${encoding}` });
  }

  /**
   * 导出为 JSON
   */
  private exportJSON(data: ExportDataType, encoding: string): Blob {
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: `application/json;charset=${encoding}` });
  }

  /**
   * 导出为 Excel (简化版)
   */
  private async exportXLSX(
    data: ExportDataType,
    columns: ExportColumn[],
    headers: string[],
    includeHeader: boolean
  ): Promise<Blob> {
    // 这里简化处理，实际应该使用 xlsx 库
    // 先导出为 CSV，Excel 可以打开
    return this.exportCSV(data, columns, headers, includeHeader, '\t', 'utf-8');
  }

  /**
   * 导出为 PDF (简化版)
   */
  private async exportPDF(
    data: ExportDataType,
    columns: ExportColumn[]
  ): Promise<Blob> {
    // 这里简化处理，实际应该使用 jsPDF 或类似库
    const arrayData = Array.isArray(data) ? data : [data];
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
        </style>
      </head>
      <body>
        <table>
    `;

    // 表头
    if (columns.length > 0) {
      html += '<tr>';
      columns.forEach(col => {
        html += `<th>${col.label}</th>`;
      });
      html += '</tr>';
    }

    // 数据
    arrayData.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        const value = row[col.key];
        const formattedValue = col.formatter ? col.formatter(value, row) : value;
        html += `<td>${formattedValue ?? ''}</td>`;
      });
      html += '</tr>';
    });

    html += '</table></body></html>';

    return new Blob([html], { type: 'application/html' });
  }

  /**
   * 导出为 TXT
   */
  private exportTXT(data: ExportDataType, encoding: string): Blob {
    let text = '';

    const arrayData = Array.isArray(data) ? data : [data];

    arrayData.forEach((item, index) => {
      text += `=== Record ${index + 1} ===\n`;
      Object.entries(item).forEach(([key, value]) => {
        text += `${key}: ${value}\n`;
      });
      text += '\n';
    });

    return new Blob([text], { type: `text/plain;charset=${encoding}` });
  }

  /**
   * 下载 Blob
   */
  private downloadBlob(blob: Blob, filename: string, format: ExportFormat): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 从 URL 导出数据
   */
  async exportFromUrl(url: string, config: Omit<ExportConfig, 'data'>): Promise<Blob> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return this.export({ ...config, data });
    } catch (error) {
      throw new Error(`Failed to fetch data from URL: ${error}`);
    }
  }

  /**
   * 导出表格元素
   */
  exportTable(tableElement: HTMLTableElement, filename: string, format: ExportFormat = 'csv'): void {
    const headers: string[] = [];
    const data: Record<string, any>[] = [];

    // 获取表头
    const headerCells = tableElement.querySelectorAll('thead th');
    headerCells.forEach(cell => {
      headers.push(cell.textContent?.trim() || '');
    });

    // 获取数据
    const rows = tableElement.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const rowData: Record<string, any> = {};
      const cells = row.querySelectorAll('td');

      cells.forEach((cell, index) => {
        const key = headers[index] || `column_${index}`;
        rowData[key] = cell.textContent?.trim() || '';
      });

      data.push(rowData);
    });

    const columns = headers.map(header => ({
      key: header,
      label: header,
    }));

    this.export({
      filename,
      format,
      data,
      columns,
      headers,
    });
  }

  /**
   * 导出图片
   */
  exportImage(element: HTMLElement, filename: string, format: 'png' | 'jpeg' = 'png'): void {
    // 使用 html2canvas 或类似库
    // 这里提供一个简化版本
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 简化处理，实际应该使用 html2canvas
      const html2canvas = (window as any).html2canvas;
      if (html2canvas) {
        html2canvas(element).then((canvas: HTMLCanvasElement) => {
          canvas.toBlob((blob) => {
            if (blob) {
              this.downloadBlob(blob, filename, format);
            }
          });
        });
      }
    }
  }

  /**
   * 批量导出
   */
  async batchExport(configs: ExportConfig[]): Promise<Blob[]> {
    const results: Blob[] = [];

    for (const config of configs) {
      try {
        const blob = await this.export(config);
        results.push(blob);
      } catch (error) {
        console.error('Export failed:', config.filename, error);
      }
    }

    return results;
  }

  /**
   * 导出进度（用于大数据量）
   */
  exportWithProgress(
    config: ExportConfig,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<Blob> {
    const total = Array.isArray(config.data) ? config.data.length : 1;
    let loaded = 0;

    // 模拟进度
    const progressInterval = setInterval(() => {
      loaded++;
      const percentage = Math.min((loaded / total) * 100, 100);

      if (onProgress) {
        onProgress({ loaded, total, percentage });
      }

      if (loaded >= total) {
        clearInterval(progressInterval);
      }
    }, 10);

    return this.export(config).finally(() => {
      clearInterval(progressInterval);
    });
  }
}

// ============= Export Factory =============

const exportService = new ExportService();

export function createExportService(): ExportService {
  return new ExportService();
}

export function exportData(config: ExportConfig): Promise<Blob> {
  return exportService.export(config);
}

export function exportTable(
  tableElement: HTMLTableElement,
  filename: string,
  format: ExportFormat = 'csv'
): void {
  exportService.exportTable(tableElement, filename, format);
}

export default exportService;
