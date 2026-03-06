'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import CyberButton from '@/components/ui/CyberButton';
import CyberCard from '@/components/ui/CyberCard';
import {
  WordPressImporter,
  importWordPressData,
  validateWordPressExport,
  ImportProgress,
  ImportResult,
  ImportedPost,
} from '@/lib/wordpress/importer';
import toast from 'react-hot-toast';

/**
 * WordPress 导入器组件
 *
 * 功能特性：
 * - 文件上传
 * - 进度显示
 * - 错误处理
 * - 预览导入结果
 * - 批量导入确认
 *
 * @example
 * ```tsx
 * <WordPressImporter
 *   onImportComplete={(result) => console.log(result)}
 *   baseUrl="/api/blog"
 * />
 * ```
 */
interface WordPressImporterProps {
  /**
   * 导入完成回调
   */
  onImportComplete?: (result: ImportResult) => void;
  /**
   * 导入失败回调
   */
  onImportError?: (error: Error) => void;
  /**
   * API 基础 URL
   */
  baseUrl?: string;
  /**
   * 是否显示预览
   */
  showPreview?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

export function WordPressImporterComponent({
  onImportComplete,
  onImportError,
  baseUrl = '/api/blog',
  showPreview = true,
  className = '',
}: WordPressImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [previewPosts, setPreviewPosts] = useState<ImportedPost[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // 处理文件选择
  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!validateWordPressExport(selectedFile)) {
      toast.error('请选择有效的 WordPress 导出文件 (.xml)');
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setPreviewPosts([]);
  }, []);

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  // 处理文件输入
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  // 开始导入
  const handleImport = useCallback(async () => {
    if (!file) return;

    setIsImporting(true);
    setProgress(null);
    setResult(null);

    try {
      const importResult = await importWordPressData(file, (prog) => {
        setProgress(prog);
      });

      setResult(importResult);

      // 显示前几篇文章作为预览
      if (showPreview && importResult.posts.length > 0) {
        setPreviewPosts(importResult.posts.slice(0, 5));
        setShowPreviewModal(true);
      }

      // 发送到后端
      await sendToBackend(importResult);

      toast.success(`成功导入 ${importResult.posts.length} 篇文章`);
      onImportComplete?.(importResult);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('导入失败');
      toast.error(err.message);
      onImportError?.(err);
    } finally {
      setIsImporting(false);
    }
  }, [file, showPreview, onImportComplete, onImportError]);

  // 发送到后端
  const sendToBackend = async (importResult: ImportResult) => {
    try {
      const response = await fetch(`${baseUrl}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importResult),
      });

      if (!response.ok) {
        throw new Error(`导入失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('发送到后端失败:', error);
      throw error;
    }
  };

  // 确认导入
  const handleConfirmImport = useCallback(async () => {
    if (!result) return;

    try {
      // 这里可以添加额外的确认逻辑
      setShowPreviewModal(false);
      onImportComplete?.(result);
    } catch (error) {
      console.error('确认导入失败:', error);
    }
  }, [result, onImportComplete]);

  // 重置
  const handleReset = useCallback(() => {
    setFile(null);
    setProgress(null);
    setResult(null);
    setPreviewPosts([]);
    setShowPreviewModal(false);
  }, []);

  return (
    <div className={className}>
      <CyberCard>
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyber-cyan" />
            WordPress 数据导入
          </h2>
          <p className="text-gray-400">
            从 WordPress 导出文件中导入文章、分类和标签
          </p>
        </div>

        {/* 文件上传区域 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? 'border-cyber-cyan bg-cyber-cyan/10'
              : 'border-gray-700 hover:border-cyber-cyan/50'
          }`}
        >
          <input
            type="file"
            accept=".xml,.wxr"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isImporting}
          />

          <Upload className="w-12 h-12 text-cyber-cyan mx-auto mb-4" />
          <p className="text-white font-medium mb-2">
            拖放文件到这里，或点击选择文件
          </p>
          <p className="text-gray-500 text-sm">支持 .xml 和 .wxr 格式</p>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-cyber-darker rounded-lg border border-cyber-cyan/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-white text-sm">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="text-gray-400 hover:text-red-500"
                  disabled={isImporting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
          )}
        </div>

        {/* 进度显示 */}
        {progress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">导入进度</span>
              <span className="text-cyber-cyan text-sm">
                {progress.processed} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-cyber-darker rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress.processed / progress.total) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">{progress.current}</p>

            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-green-400 font-bold">{progress.succeeded}</p>
                <p className="text-gray-500 text-xs">成功</p>
              </div>
              <div className="text-center">
                <p className="text-red-400 font-bold">{progress.failed}</p>
                <p className="text-gray-500 text-xs">失败</p>
              </div>
              <div className="text-center">
                <p className="text-cyber-cyan font-bold">{progress.processed}</p>
                <p className="text-gray-500 text-xs">已处理</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 结果显示 */}
        {result && !isImporting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="p-4 bg-cyber-darker rounded-lg border border-cyber-cyan/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-medium">导入完成</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">总文章数</p>
                  <p className="text-white font-bold">{result.posts.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">错误数</p>
                  <p className="text-red-400 font-bold">{result.errors.length}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <details className="mt-4">
                  <summary className="text-gray-400 cursor-pointer hover:text-white">
                    查看错误详情
                  </summary>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-red-500/10 rounded"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white text-sm">{error.item}</p>
                          <p className="text-red-400 text-xs">{error.error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </motion.div>
        )}

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-4">
          <CyberButton
            onClick={handleImport}
            disabled={!file || isImporting}
            className="flex-1"
          >
            {isImporting ? '导入中...' : '开始导入'}
          </CyberButton>
          {result && (
            <CyberButton variant="outline" onClick={handleReset}>
              重置
            </CyberButton>
          )}
        </div>
      </CyberCard>

      {/* 预览模态框 */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cyber-dark border border-cyber-cyan/30 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-cyber-border">
                <h3 className="text-xl font-bold text-white">导入预览</h3>
                <p className="text-gray-400 text-sm mt-1">
                  以下是即将导入的前 5 篇文章
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {previewPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="mb-4 last:mb-0 p-4 bg-cyber-darker rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-cyber-cyan font-bold">{index + 1}.</span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{post.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>作者: {post.author}</span>
                          <span>•</span>
                          <span>{post.categories.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-cyber-border flex justify-end gap-4">
                <CyberButton variant="outline" onClick={() => setShowPreviewModal(false)}>
                  取消
                </CyberButton>
                <CyberButton onClick={handleConfirmImport}>
                  确认导入
                </CyberButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WordPressImporterComponent;
