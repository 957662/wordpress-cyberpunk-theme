'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  autoUpload?: boolean;
  onUpload?: (file: FileWithPreview) => Promise<void>;
  onProgress?: (file: FileWithPreview, progress: number) => void;
  onSuccess?: (file: FileWithPreview) => void;
  onError?: (file: FileWithPreview, error: string) => void;
  onRemove?: (file: FileWithPreview) => void;
}

interface FileUploadProps extends UploadOptions {
  className?: string;
  dragActiveClassName?: string;
  children?: React.ReactNode;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Film;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  autoUpload = false,
  onUpload,
  onProgress,
  onSuccess,
  onError,
  onRemove,
  className,
  dragActiveClassName,
  children,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 验证文件
  const validateFile = (file: File): string | null => {
    if (accept && !accept.split(',').some(type => {
      if (type.startsWith('.')) return file.name.endsWith(type);
      return file.type.startsWith(type.replace('*', ''));
    })) {
      return '文件类型不支持';
    }

    if (file.size > maxSize) {
      return `文件大小超过限制 (${formatFileSize(maxSize)})`;
    }

    return null;
  };

  // 处理文件添加
  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
      .slice(0, maxFiles - files.length)
      .map((file) => {
        const error = validateFile(file);
        const fileWithPreview: FileWithPreview = Object.assign(file, {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          status: error ? 'error' : undefined,
          error,
        } as FileWithPreview);

        // 生成预览
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileWithPreview.preview = e.target?.result as string;
            setFiles((prev) => [...prev]);
          };
          reader.readAsDataURL(file);
        }

        return fileWithPreview;
      });

    setFiles((prev) => [...prev, ...fileArray]);

    // 自动上传
    if (autoUpload && onUpload) {
      fileArray.forEach(async (file) => {
        if (file.error) return;

        try {
          file.status = 'uploading';
          file.progress = 0;
          setFiles((prev) => [...prev]);

          await onUpload(file);

          file.status = 'success';
          file.progress = 100;
          setFiles((prev) => [...prev]);

          if (onSuccess) {
            onSuccess(file);
          }
        } catch (error) {
          file.status = 'error';
          file.error = error instanceof Error ? error.message : '上传失败';
          setFiles((prev) => [...prev]);

          if (onError) {
            onError(file, file.error);
          }
        }
      });
    }
  }, [files, maxFiles, accept, maxSize, autoUpload, onUpload, onSuccess, onError]);

  // 拖拽事件处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // 文件输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // 移除文件
  const handleRemove = useCallback((file: FileWithPreview) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));

    if (onRemove) {
      onRemove(file);
    }
  }, [onRemove]);

  // 重试上传
  const handleRetry = useCallback(async (file: FileWithPreview) => {
    if (!onUpload) return;

    try {
      file.status = 'uploading';
      file.progress = 0;
      file.error = undefined;
      setFiles((prev) => [...prev]);

      await onUpload(file);

      file.status = 'success';
      file.progress = 100;
      setFiles((prev) => [...prev]);

      if (onSuccess) {
        onSuccess(file);
      }
    } catch (error) {
      file.status = 'error';
      file.error = error instanceof Error ? error.message : '上传失败';
      setFiles((prev) => [...prev]);

      if (onError) {
        onError(file, file.error);
      }
    }
  }, [onUpload, onSuccess, onError]);

  return (
    <div className={cn('w-full', className)}>
      {/* 上传区域 */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
          dragActive
            ? dragActiveClassName || 'border-cyber-cyan bg-cyber-cyan/5'
            : 'border-cyber-border hover:border-cyber-cyan/50'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        {children || (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-cyber-muted rounded-full">
              <Upload className="w-8 h-8 text-cyber-cyan" />
            </div>

            <div>
              <p className="text-white font-medium mb-1">
                {dragActive ? '释放文件以上传' : '点击或拖拽文件到这里上传'}
              </p>
              <p className="text-sm text-gray-500">
                {accept && `支持文件类型: ${accept}`}
                {maxSize && ` • 最大 ${formatFileSize(maxSize)}`}
                {maxFiles && ` • 最多 ${maxFiles} 个文件`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file) => {
              const Icon = getFileIcon(file.type);

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                    file.status === 'success' && 'border-cyber-green/30 bg-cyber-green/5',
                    file.status === 'error' && 'border-cyber-pink/30 bg-cyber-pink/5',
                    file.status === 'uploading' && 'border-cyber-cyan/30 bg-cyber-cyan/5',
                    !file.status && 'border-cyber-border bg-cyber-card'
                  )}
                >
                  {/* 图标/预览 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-cyber-muted flex items-center justify-center">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>

                      {file.status === 'success' && (
                        <Check className="w-4 h-4 text-cyber-green flex-shrink-0" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-cyber-pink flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>

                      {file.status === 'uploading' && typeof file.progress === 'number' && (
                        <>
                          <span>•</span>
                          <span>{file.progress}%</span>
                        </>
                      )}

                      {file.error && (
                        <>
                          <span>•</span>
                          <span className="text-cyber-pink">{file.error}</span>
                        </>
                      )}
                    </div>

                    {/* 进度条 */}
                    {file.status === 'uploading' && typeof file.progress === 'number' && (
                      <div className="mt-2 h-1 bg-cyber-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2">
                    {file.status === 'error' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRetry(file)}
                        className="p-1.5 rounded-md hover:bg-cyber-muted transition-colors text-cyber-cyan"
                        title="重试"
                      >
                        <Upload className="w-4 h-4" />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(file)}
                      className="p-1.5 rounded-md hover:bg-cyber-muted transition-colors text-gray-400 hover:text-cyber-pink"
                      title="移除"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传按钮 */}
      {!autoUpload && files.length > 0 && onUpload && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => files.forEach(file => !file.error && handleRetry(file))}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple
            text-black font-medium rounded-lg hover:shadow-lg hover:shadow-cyber-cyan/25
            transition-all"
        >
          上传 {files.length} 个文件
        </motion.button>
      )}
    </div>
  );
}

export default FileUpload;
