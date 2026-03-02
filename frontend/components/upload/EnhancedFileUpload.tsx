'use client';

/**
 * Enhanced File Upload Component
 * 增强型文件上传组件 - 支持拖拽、预览、进度、验证
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Image, Film, Music, FileText, Archive } from 'lucide-react';

// 类型定义
type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  typeCategory: FileType;
}

interface UploadConfig {
  accept?: string[];
  maxSize?: number; // MB
  maxFiles?: number;
  multiple?: boolean;
  autoUpload?: boolean;
  onUpload?: (files: File[]) => Promise<string[]>;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

interface EnhancedFileUploadProps extends UploadConfig {
  className?: string;
  showPreview?: boolean;
  showProgress?: boolean;
  theme?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export function EnhancedFileUpload({
  accept = ['*/*'],
  maxSize = 10,
  maxFiles = 5,
  multiple = true,
  autoUpload = false,
  onUpload,
  onProgress,
  onError,
  className = '',
  showPreview = true,
  showProgress = true,
  theme = 'cyan',
}: EnhancedFileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 主题颜色
  const themeColors = {
    cyan: { primary: '#00f0ff', glow: 'rgba(0, 240, 255, 0.3)' },
    purple: { primary: '#9d00ff', glow: 'rgba(157, 0, 255, 0.3)' },
    pink: { primary: '#ff0080', glow: 'rgba(255, 0, 128, 0.3)' },
    yellow: { primary: '#f0ff00', glow: 'rgba(240, 255, 0, 0.3)' },
  };

  const colors = themeColors[theme];

  // 获取文件类型分类
  const getFileTypeCategory = useCallback((file: File): FileType => {
    const type = file.type;

    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'archive';

    return 'other';
  }, []);

  // 获取文件图标
  const getFileIcon = useCallback((typeCategory: FileType) => {
    switch (typeCategory) {
      case 'image':
        return <Image size={32} />;
      case 'video':
        return <Film size={32} />;
      case 'audio':
        return <Music size={32} />;
      case 'document':
        return <FileText size={32} />;
      case 'archive':
        return <Archive size={32} />;
      default:
        return <File size={32} />;
    }
  }, []);

  // 创建预览
  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  // 验证文件
  const validateFile = useCallback((file: File): string | null => {
    // 检查文件类型
    if (accept !== ['*/*']) {
      const isAccepted = accept.some(accepted => {
        if (accepted === '*/*') return true;
        if (accepted.endsWith('/*')) {
          const category = accepted.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === accepted;
      });

      if (!isAccepted) {
        return `不支持的文件类型: ${file.type}`;
      }
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小超过 ${maxSize}MB`;
    }

    return null;
  }, [accept, maxSize]);

  // 处理文件选择
  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    // 检查数量限制
    if (files.length + fileArray.length > maxFiles) {
      onError?.(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 处理每个文件
    const newFiles: FileWithPreview[] = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onError?.(error);
        continue;
      }

      const preview = await createPreview(file);
      newFiles.push({
        ...file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        preview,
        typeCategory: getFileTypeCategory(file),
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // 自动上传
    if (autoUpload && onUpload && newFiles.length > 0) {
      uploadFiles(newFiles.map(f => {
        const { id, preview, typeCategory, ...fileProps } = f;
        return fileProps as File;
      }));
    }
  }, [files.length, maxFiles, validateFile, onError, createPreview, getFileTypeCategory, autoUpload, onUpload]);

  // 上传文件
  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    if (!onUpload) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const urls = await new Promise<string[]>((resolve, reject) => {
        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          onProgress?.(progress);

          if (progress >= 100) {
            clearInterval(interval);
            onUpload(filesToUpload)
              .then(resolve)
              .catch(reject);
          }
        }, 100);
      });

      console.log('上传成功:', urls);
    } catch (error) {
      console.error('上传失败:', error);
      onError?.('上传失败');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, onProgress, onError]);

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  // 点击上传
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 文件输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // 清空输入值，允许重复选择同一文件
    e.target.value = '';
  }, [handleFiles]);

  // 删除文件
  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // 格式化文件大小
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上传区域 */}
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-gray-600'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <Upload
          size={48}
          className="mx-auto mb-4 text-gray-400"
          style={{ color: isDragging ? colors.primary : undefined }}
        />

        <p className="text-gray-300 mb-2">
          拖拽文件到此处或点击上传
        </p>

        <p className="text-sm text-gray-500">
          {accept !== ['*/*'] && `支持: ${accept.join(', ')} `}
          最大 {maxSize}MB
          {multiple && `，最多 ${maxFiles} 个文件`}
        </p>
      </motion.div>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                {/* 预览或图标 */}
                {showPreview && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-gray-700">
                    {getFileIcon(file.typeCategory)}
                  </div>
                )}

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* 删除按钮 */}
                <motion.button
                  onClick={() => removeFile(file.id)}
                  className="p-2 rounded hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} className="text-gray-400" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传进度 */}
      {showProgress && isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">上传中...</span>
            <span className="text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default EnhancedFileUpload;
