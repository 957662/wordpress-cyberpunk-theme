'use client';

import React, { useState, useCallback } from 'react';
import {
  FileUp,
  Upload,
  X,
  Check,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileJson,
  Code,
  Zap,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 支持的导入格式
type ImportFormat = 'markdown' | 'html' | 'json' | 'word' | 'notion';

// 导入状态
type ImportStatus = 'idle' | 'dragging' | 'processing' | 'success' | 'error';

// 导入结果
interface ImportResult {
  success: boolean;
  title?: string;
  content?: string;
  metadata?: {
    author?: string;
    date?: string;
    tags?: string[];
    category?: string;
    featuredImage?: string;
  };
  error?: string;
}

// 文件类型映射
const formatConfig: Record<
  ImportFormat,
  { icon: React.ElementType; label: string; extensions: string[]; mimeType: string }
> = {
  markdown: {
    icon: FileText,
    label: 'Markdown',
    extensions: ['.md', '.markdown'],
    mimeType: 'text/markdown',
  },
  html: {
    icon: Code,
    label: 'HTML',
    extensions: ['.html', '.htm'],
    mimeType: 'text/html',
  },
  json: {
    icon: FileJson,
    label: 'JSON',
    extensions: ['.json'],
    mimeType: 'application/json',
  },
  word: {
    icon: FileText,
    label: 'Word 文档',
    extensions: ['.doc', '.docx'],
    mimeType: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  notion: {
    icon: FileJson,
    label: 'Notion 导出',
    extensions: ['.zip'],
    mimeType: 'application/zip',
  },
};

// 主组件
interface ArticleImporterProps {
  onImport?: (result: ImportResult) => void;
  allowedFormats?: ImportFormat[];
  maxSize?: number; // MB
  className?: string;
}

export const ArticleImporter: React.FC<ArticleImporterProps> = ({
  onImport,
  allowedFormats = Object.keys(formatConfig) as ImportFormat[],
  maxSize = 10,
  className,
}) => {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);

  // 处理文件选择
  const handleFileSelect = useCallback(
    (file: File) => {
      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        setImportResult({
          success: false,
          error: `文件大小超过限制 (${maxSize}MB)`,
        });
        setStatus('error');
        return;
      }

      // 检查文件类型
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAllowed = allowedFormats.some((format) =>
        formatConfig[format].extensions.includes(fileExtension)
      );

      if (!isAllowed) {
        const allowedExtensions = allowedFormats.flatMap((f) => formatConfig[f].extensions);
        setImportResult({
          success: false,
          error: `不支持的文件格式。支持的格式：${allowedExtensions.join(', ')}`,
        });
        setStatus('error');
        return;
      }

      setSelectedFile(file);
      setImportResult(null);
    },
    [allowedFormats, maxSize]
  );

  // 处理文件导入
  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setStatus('processing');
    setProgress(0);

    try {
      // 模拟导入进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 读取文件内容
      const content = await readFileContent(selectedFile);

      // 解析文件内容
      const result = await parseContent(selectedFile, content);

      clearInterval(progressInterval);
      setProgress(100);

      setImportResult(result);
      setStatus(result.success ? 'success' : 'error');

      if (result.success && onImport) {
        onImport(result);
      }
    } catch (error) {
      setImportResult({
        success: false,
        error: error instanceof Error ? error.message : '导入失败',
      });
      setStatus('error');
    }
  }, [selectedFile, onImport]);

  // 读取文件内容
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  };

  // 解析内容
  const parseContent = async (file: File, content: string): Promise<ImportResult> => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();

    // Markdown 解析
    if (extension === '.md' || extension === '.markdown') {
      return parseMarkdown(content);
    }

    // HTML 解析
    if (extension === '.html' || extension === '.htm') {
      return parseHTML(content);
    }

    // JSON 解析
    if (extension === '.json') {
      return parseJSON(content);
    }

    // 其他格式暂不支持
    return {
      success: false,
      error: '该文件格式暂不支持自动导入',
    };
  };

  // 解析 Markdown
  const parseMarkdown = (content: string): ImportResult => {
    // 提取标题（第一个 # 标题）
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : '未命名文章';

    // 提取元数据（如果存在）
    const metadataMatch = content.match(/^---\n([\s\S]+?)\n---/);
    let metadata = {};

    if (metadataMatch) {
      const metadataText = metadataMatch[1];
      const titleMetaMatch = metadataText.match(/title:\s*(.+)/);
      const authorMatch = metadataText.match(/author:\s*(.+)/);
      const dateMatch = metadataText.match(/date:\s*(.+)/);
      const tagsMatch = metadataText.match(/tags:\s*\[(.+)\]/);
      const categoryMatch = metadataText.match(/category:\s*(.+)/);

      metadata = {
        title: titleMetaMatch ? titleMetaMatch[1].trim() : title,
        author: authorMatch ? authorMatch[1].trim() : undefined,
        date: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
        tags: tagsMatch ? tagsMatch[1].split(',').map((t) => t.trim()) : [],
        category: categoryMatch ? categoryMatch[1].trim() : undefined,
      };
    }

    // 移除元数据部分
    const cleanContent = metadataMatch
      ? content.replace(/^---\n[\s\S]+?\n---\n\n?/, '')
      : content;

    return {
      success: true,
      title: (metadata as any).title || title,
      content: cleanContent,
      metadata,
    };
  };

  // 解析 HTML
  const parseHTML = (content: string): ImportResult => {
    // 简单的 HTML 解析（生产环境应使用专业的 HTML 解析库）
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // 提取标题
    const title = doc.querySelector('h1')?.textContent || '未命名文章';

    // 提取正文
    const body = doc.querySelector('body');
    const cleanContent = body?.innerHTML || content;

    return {
      success: true,
      title,
      content: cleanContent,
      metadata: {
        date: new Date().toISOString(),
      },
    };
  };

  // 解析 JSON
  const parseJSON = (content: string): ImportResult => {
    try {
      const data = JSON.parse(content);

      // 验证 JSON 结构
      if (!data.title || !data.content) {
        return {
          success: false,
          error: 'JSON 格式不正确，缺少 title 或 content 字段',
        };
      }

      return {
        success: true,
        title: data.title,
        content: data.content,
        metadata: {
          author: data.author,
          date: data.date || new Date().toISOString(),
          tags: data.tags || [],
          category: data.category,
          featuredImage: data.featuredImage,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'JSON 解析失败：' + (error instanceof Error ? error.message : '未知错误'),
      };
    }
  };

  // 重置状态
  const handleReset = () => {
    setStatus('idle');
    setSelectedFile(null);
    setImportResult(null);
    setProgress(0);
  };

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus('dragging');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus('idle');

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* 导入器卡片 */}
      <div className="p-6 rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-sm">
        {/* 头部 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <FileUp className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">文章导入</h3>
            <p className="text-sm text-gray-400">支持 Markdown、HTML、JSON 等格式</p>
          </div>
        </div>

        {/* 上传区域 */}
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'dragging' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative border-2 border-dashed rounded-lg p-8 transition-all',
                status === 'dragging'
                  ? 'border-cyan-500 bg-cyan-500/5'
                  : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
              )}
            >
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                accept={allowedFormats
                  .flatMap((f) => formatConfig[f].extensions)
                  .join(',')}
              />

              <div className="flex flex-col items-center text-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-white mb-2">
                  拖拽文件到此处或点击上传
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  支持的格式：{allowedFormats.map((f) => formatConfig[f].label).join('、')}
                </p>
                <p className="text-xs text-gray-500">最大文件大小：{maxSize}MB</p>
              </div>
            </motion.div>
          ) : null}

          {/* 文件预览 */}
          {selectedFile && status !== 'idle' && status !== 'dragging' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* 文件信息 */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-white/10">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="font-medium text-white">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* 处理进度 */}
              {status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">正在处理...</span>
                    <span className="text-cyan-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* 导入结果 */}
              {importResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'p-4 rounded-lg border',
                    importResult.success
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {importResult.success ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {importResult.success ? (
                        <>
                          <p className="font-medium text-white mb-2">导入成功！</p>
                          <p className="text-sm text-gray-300 mb-1">
                            标题：{importResult.title}
                          </p>
                          {importResult.metadata?.author && (
                            <p className="text-xs text-gray-400">
                              作者：{importResult.metadata.author}
                            </p>
                          )}
                          {importResult.metadata?.tags &&
                            importResult.metadata.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {importResult.metadata.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-white mb-1">导入失败</p>
                          <p className="text-sm text-red-300">{importResult.error}</p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={status === 'processing'}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium',
                    status === 'processing'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-cyan-500 text-white hover:bg-cyan-600'
                  )}
                >
                  {status === 'processing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      开始导入
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={status === 'processing'}
                  className="px-4 py-2.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  重新选择
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 支持的格式说明 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {allowedFormats.map((format) => {
          const config = formatConfig[format];
          const Icon = config.icon;
          return (
            <div
              key={format}
              className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/30 border border-white/5"
            >
              <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{config.label}</p>
                <p className="text-xs text-gray-500">
                  {config.extensions.join(', ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleImporter;
