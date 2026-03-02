/**
 * 打印工具函数
 */

/**
 * 触发浏览器打印
 */
export function print(): void {
  if (typeof window === 'undefined') return;
  window.print();
}

/**
 * 检查是否在打印环境
 */
export function isPrintMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('print').matches || false;
}

/**
 * 监听打印事件
 */
export function onPrintStart(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('print');
  const handler = (event: MediaQueryListEvent) => {
    if (event.matches) {
      callback();
    }
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * 监听打印完成事件
 */
export function onPrintEnd(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('print');
  const handler = (event: MediaQueryListEvent) => {
    if (!event.matches) {
      callback();
    }
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * 生成打印样式
 */
export function generatePrintStyles(options: {
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margin?: string;
}): string {
  const { pageSize = 'a4', orientation = 'portrait', margin = '1cm' } = options;

  return `
    @page {
      size: ${pageSize} ${orientation};
      margin: ${margin};
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .no-print {
        display: none !important;
      }

      .print-only {
        display: block !important;
      }

      a[href]:after {
        content: " (" attr(href) ")";
      }

      /* 避免在元素内部分页 */
      .no-break {
        page-break-inside: avoid;
      }

      /* 在元素前分页 */
      .break-before {
        page-break-before: always;
      }

      /* 在元素后分页 */
      .break-after {
        page-break-after: always;
      }
    }
  `;
}

/**
 * 注入打印样式到页面
 */
export function injectPrintStyles(options: Parameters<typeof generatePrintStyles>[0]): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = generatePrintStyles(options);
  style.id = 'cyberpress-print-styles';
  document.head.appendChild(style);
  return style;
}

/**
 * 移除打印样式
 */
export function removePrintStyles(): void {
  const style = document.getElementById('cyberpress-print-styles');
  if (style) {
    style.remove();
  }
}

/**
 * 生成页面内容为 PDF（需要外部库支持）
 */
export async function generatePDF(element: HTMLElement, options?: {
  filename?: string;
  quality?: number;
}): Promise<Blob> {
  // 这里可以集成 html2pdf.js 或 jsPDF 等库
  // 目前返回一个占位符
  console.warn('generatePDF requires external library integration');
  return new Blob(['PDF generation placeholder'], { type: 'application/pdf' });
}

/**
 * 打印特定元素
 */
export function printElement(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  const doc = printWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // 等待内容加载后打印
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
}

/**
 * 获取打印页数估算
 */
export function estimatePageCount(element: HTMLElement, options: {
  pageHeight?: number; // 像素
  lineHeight?: number;
}): number {
  const { pageHeight = 1123, lineHeight = 16 } = options; // A4 at 96 DPI
  const height = element.offsetHeight;
  const lines = Math.ceil(height / lineHeight);
  const linesPerPage = Math.floor(pageHeight / lineHeight);

  return Math.ceil(lines / linesPerPage);
}
