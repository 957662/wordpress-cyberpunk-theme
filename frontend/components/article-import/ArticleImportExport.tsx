'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Download,
  FileText,
  FolderOpen,
  Check,
  X,
  AlertCircle,
  Loader2,
  FileJson,
  FileCode
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberProgress } from '@/components/ui/CyberProgress';
import toast from 'react-hot-toast';

interface ImportedFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const ArticleImportExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 导出选项
  const exportOptions: ExportOption[] = [
    {
      id: 'all',
      label: '导出所有文章',
      description: '导出您所有已发布的文章为 JSON 格式',
      icon: FileJson,
    },
    {
      id: 'selected',
      label: '按分类导出',
      description: '选择特定分类进行导出',
      icon: FolderOpen,
    },
    {
      id: 'markdown',
      label: '导出为 Markdown',
      description: '将文章导出为 Markdown 文件',
      icon: FileCode,
    },
  ];

  // 处理文件拖拽
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // 处理文件选择
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // 处理文件
  const handleFiles = async (files: FileList) => {
    const newFiles: ImportedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      status: 'pending',
    }));

    setImportedFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(true);

    // 模拟处理文件
    for (const file of newFiles) {
      await processFile(file);
    }

    setIsProcessing(false);
  };

  // 处理单个文件
  const processFile = async (file: ImportedFile) => {
    // 更新状态为处理中
    setImportedFiles(prev =>
      prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f)
    );

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // 模拟成功或失败
    const success = Math.random() > 0.2; // 80% 成功率

    setImportedFiles(prev =>
      prev.map(f =>
        f.id === file.id
          ? {
              ...f,
              status: success ? 'success' : 'error',
              error: success ? undefined : '文件格式不支持或内容无效',
            }
          : f
      )
    );

    if (success) {
      toast.success(`成功导入: ${file.name}`);
    } else {
      toast.error(`导入失败: ${file.name}`);
    }
  };

  // 删除文件
  const removeFile = (id: string) => {
    setImportedFiles(prev => prev.filter(f => f.id !== id));
  };

  // 清空列表
  const clearAll = () => {
    setImportedFiles([]);
  };

  // 导出文章
  const handleExport = async (optionId: string) => {
    try {
      toast.loading('准备导出...', { id: 'export' });

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建示例数据
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        articles: [
          {
            id: '1',
            title: '示例文章 1',
            content: '这是文章内容...',
            tags: ['技术', '教程'],
            createdAt: '2024-01-01',
          },
        ],
      };

      // 创建下载链接
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cyberpress-export-${optionId}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('导出成功!', { id: 'export' });
    } catch (error) {
      toast.error('导出失败', { id: 'export' });
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 计算进度
  const calculateProgress = () => {
    if (importedFiles.length === 0) return 0;
    const completed = importedFiles.filter(
      f => f.status === 'success' || f.status === 'error'
    ).length;
    return (completed / importedFiles.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* 标签切换 */}
      <div className="flex items-center gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'import'
              ? 'text-cyber-cyan'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          导入文章
          {activeTab === 'import' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'export'
              ? 'text-cyber-cyan'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          导出文章
          {activeTab === 'export' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'import' ? (
          <motion.div
            key="import"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 上传区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                选择文件或拖拽到此处
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  dragActive
                    ? 'border-cyber-cyan bg-cyber-cyan/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".md,.markdown,.json"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium mb-1">
                    点击或拖拽文件到此处
                  </p>
                  <p className="text-gray-500 text-sm">
                    支持 Markdown (.md) 和 JSON 格式
                  </p>
                </div>
              </div>
            </div>

            {/* 文件列表 */}
            {importedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">
                    导入进度 ({importedFiles.length} 个文件)
                  </h3>
                  <button
                    onClick={clearAll}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    清空列表
                  </button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <CyberProgress value={calculateProgress()} />
                    <p className="text-gray-400 text-sm text-center">
                      正在处理... {Math.round(calculateProgress())}%
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {importedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CyberCard className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {file.status === 'pending' && (
                                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                              )}
                              {file.status === 'processing' && (
                                <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin" />
                              )}
                              {file.status === 'success' && (
                                <Check className="w-5 h-5 text-green-400" />
                              )}
                              {file.status === 'error' && (
                                <X className="w-5 h-5 text-red-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <p className="text-white font-medium truncate">
                                  {file.name}
                                </p>
                              </div>
                              <p className="text-gray-500 text-xs">
                                {formatFileSize(file.size)}
                              </p>
                              {file.error && (
                                <p className="text-red-400 text-xs mt-1">
                                  {file.error}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </CyberCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* 导入说明 */}
            <CyberCard className="bg-cyber-muted/30">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-cyber-yellow" />
                导入说明
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 支持 Markdown (.md) 和 JSON 格式的文件</li>
                <li>• JSON 文件需符合 CyberPress 文章格式规范</li>
                <li>• 导入的文章将保存为草稿状态</li>
                <li>• 重复的标题会自动添加后缀</li>
                <li>• 文章中的图片需手动上传</li>
              </ul>
            </CyberCard>
          </motion.div>
        ) : (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <CyberCard
                    key={option.id}
                    className="hover:border-cyber-cyan/50 transition-all cursor-pointer group"
                    onClick={() => handleExport(option.id)}
                  >
                    <div className="p-4">
                      <Icon className="w-8 h-8 text-cyber-cyan mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white font-semibold mb-2">
                        {option.label}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {option.description}
                      </p>
                      <CyberButton
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <Download className="w-4 h-4" />
                        导出
                      </CyberButton>
                    </div>
                  </CyberCard>
                );
              })}
            </div>

            <CyberCard className="bg-cyber-muted/30">
              <h3 className="text-white font-semibold mb-3">导出说明</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 导出的文件包含完整的文章内容和元数据</li>
                <li>• JSON 格式可用于备份或迁移到其他平台</li>
                <li>• Markdown 格式适合直接编辑或在其他编辑器中使用</li>
                <li>• 导出操作不会影响原始文章</li>
              </ul>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
