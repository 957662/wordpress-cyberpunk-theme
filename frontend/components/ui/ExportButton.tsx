/**
 * ExportButton Component - 导出按钮组件
 * 支持导出数据为多种格式（CSV、JSON、Excel等）
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Download, FileSpreadsheet, FileJson, FileText, ChevronDown } from 'lucide-react';

export type ExportFormat = 'csv' | 'json' | 'txt' | 'xml';

export interface ExportData {
  [key: string]: any;
}

export interface ExportButtonProps {
  data: ExportData[];
  filename?: string;
  formats?: ExportFormat[];
  onExport?: (format: ExportFormat, data: ExportData[]) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function ExportButton({
  data,
  filename = 'export',
  formats = ['csv', 'json'],
  onExport,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  icon,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const variants = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
    outline: 'border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  // 导出为 CSV
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // 处理包含逗号或引号的值
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      ),
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  };

  // 导出为 JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json;charset=utf-8;');
  };

  // 导出为 TXT
  const exportToTXT = () => {
    let txtContent = '';
    data.forEach((row, index) => {
      txtContent += `Record ${index + 1}\n`;
      Object.entries(row).forEach(([key, value]) => {
        txtContent += `  ${key}: ${value ?? ''}\n`;
      });
      txtContent += '\n';
    });

    downloadFile(txtContent, `${filename}.txt`, 'text/plain;charset=utf-8;');
  };

  // 导出为 XML
  const exportToXML = () => {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    data.forEach(row => {
      xmlContent += '  <item>\n';
      Object.entries(row).forEach(([key, value]) => {
        xmlContent += `    <${key}>${value ?? ''}</${key}>\n`;
      });
      xmlContent += '  </item>\n';
    });
    xmlContent += '</root>';

    downloadFile(xmlContent, `${filename}.xml`, 'application/xml;charset=utf-8;');
  };

  // 下载文件
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 处理导出
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);
    setIsOpen(false);

    try {
      if (onExport) {
        await onExport(format, data);
      } else {
        switch (format) {
          case 'csv':
            exportToCSV();
            break;
          case 'json':
            exportToJSON();
            break;
          case 'txt':
            exportToTXT();
            break;
          case 'xml':
            exportToXML();
            break;
        }
      }
    } finally {
      setTimeout(() => setIsExporting(null), 500);
    }
  };

  const formatConfigs = [
    { format: 'csv' as ExportFormat, label: 'CSV', icon: FileSpreadsheet },
    { format: 'json' as ExportFormat, label: 'JSON', icon: FileJson },
    { format: 'txt' as ExportFormat, label: 'TXT', icon: FileText },
    { format: 'xml' as ExportFormat, label: 'XML', icon: FileText },
  ];

  const availableFormats = formatConfigs.filter(config =>
    formats.includes(config.format)
  );

  return (
    <div className="relative inline-block">
      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => availableFormats.length === 1 && handleExport(availableFormats[0].format)}
        disabled={disabled || !!isExporting}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            导出中...
          </>
        ) : (
          <>
            {icon || <Download className="w-4 h-4" />}
            <span>导出</span>
            {availableFormats.length > 1 && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && availableFormats.length > 1 && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-20 min-w-[200px] bg-cyber-card border border-cyber-border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="py-1">
                {availableFormats.map(({ format, label, icon: Icon }) => (
                  <motion.button
                    key={format}
                    whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                    onClick={() => handleExport(format)}
                    disabled={disabled || isExporting === format}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "text-cyber-text hover:text-cyber-cyan"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {isExporting === format && (
                      <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * QuickExport Component - 快速导出组件
 * 简化的导出组件，只有单一格式
 */
export interface QuickExportProps {
  data: ExportData[];
  filename?: string;
  format?: ExportFormat;
  onExport?: (format: ExportFormat, data: ExportData[]) => void;
  disabled?: boolean;
  className?: string;
}

export function QuickExport({
  data,
  filename = 'export',
  format = 'csv',
  onExport,
  disabled = false,
  className,
}: QuickExportProps) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      formats={[format]}
      onExport={onExport}
      disabled={disabled}
      className={className}
    />
  );
}
