/**
 * FileUploader - 文件上传组件
 * 支持拖拽、多文件、预览、进度显示
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Image as ImageIcon, FileText, Film, Music, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface FileUploaderProps {
  /**
   * 接受的文件类型
   */
  accept?: string;
  /**
   * 是否多选
   */
  multiple?: boolean;
  /**
   * 最大文件数
   */
  maxFiles?: number;
  /**
   * 最大文件大小 (MB)
   */
  maxSize?: number;
  /**
   * 是否显示预览
   */
  showPreview?: boolean;
  /**
   * 自定义上传函数
   */
  onUpload?: (files: File[]) => Promise<void>;
  /**
   * 文件移除回调
   */
  onRemove?: (file: FileWithPreview) => void;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 拖拽区域文本
   */
  dragText?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = '*/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 10,
  showPreview = true,
  onUpload,
  onRemove,
  className,
  dragText = '拖拽文件到这里或点击上传',
  disabled = false,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `文件大小不能超过 ${maxSize}MB`;
      }
      if (maxFiles && files.length >= maxFiles) {
        return `最多只能上传 ${maxFiles} 个文件`;
      }
      return null;
    },
    [files.length, maxSize, maxFiles]
  );

  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: FileWithPreview[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const error = validateFile(file);

        if (error) {
          newFiles.push({
            ...file,
            id: `${file.name}-${Date.now()}-${i}`,
            error,
          });
          continue;
        }

        const preview = await createPreview(file);
        newFiles.push({
          ...file,
          id: `${file.name}-${Date.now()}-${i}`,
          preview,
          progress: 0,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);

      // 自动上传
      if (onUpload) {
        setIsUploading(true);
        try {
          const validFiles = newFiles.filter((f) => !f.error);
          await onUpload(validFiles);

          // 更新进度为 100%
          setFiles((prev) =>
            prev.map((f) => {
              const uploadedFile = validFiles.find((vf) => vf.id === f.id);
              return uploadedFile ? { ...f, progress: 100 } : f;
            })
          );
        } catch (error) {
          console.error('Upload failed:', error);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [validateFile, createPreview, onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        await processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        await processFiles(selectedFiles);
      }
      // 重置 input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleRemove = useCallback(
    (file: FileWithPreview) => {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      onRemove?.(file);
    },
    [onRemove]
  );

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-cyber-cyan" />;
    }
    if (file.type.startsWith('video/')) {
      return <Film className="w-6 h-6 text-cyber-pink" />;
    }
    if (file.type.startsWith('audio/')) {
      return <Music className="w-6 h-6 text-cyber-purple" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="w-6 h-6 text-cyber-green" />;
    }
    return <File className="w-6 h-6 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 上传区域 */}
      <motion.div
        whileHover={disabled ? {} : { scale: 1.01 }}
        whileTap={disabled ? {} : { scale: 0.99 }}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/10'
            : 'border-dark-border hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <motion.div
          animate={{
            scale: isDragging ? 1.1 : 1,
            rotate: isDragging ? 5 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            isDragging ? 'bg-cyber-cyan/20' : 'bg-dark-bg'
          )}>
            <Upload className={cn(
              'w-8 h-8 transition-colors',
              isDragging ? 'text-cyber-cyan' : 'text-gray-400'
            )} />
          </div>

          <div>
            <p className="text-white font-medium mb-1">{dragText}</p>
            <p className="text-sm text-gray-500">
              {maxFiles && `最多 ${maxFiles} 个文件`}
              {maxFiles && maxSize && ' · '}
              {maxSize && `最大 ${maxSize}MB`}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={disabled}
          >
            选择文件
          </Button>
        </motion.div>
      </motion.div>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border transition-all duration-300',
                  file.error
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-dark-border bg-dark-bg/50 hover:border-cyber-cyan/30'
                )}
              >
                {/* 预览/图标 */}
                {showPreview && file.preview ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-dark-bg/50 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                )}

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                    {file.progress !== undefined && file.progress < 100 && (
                      <span className="ml-2">· 上传中 {file.progress}%</span>
                    )}
                  </p>

                  {/* 错误信息 */}
                  {file.error && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {file.error}
                    </p>
                  )}

                  {/* 进度条 */}
                  {file.progress !== undefined && file.progress < 100 && (
                    <div className="mt-2 w-full h-1 bg-dark-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                      />
                    </div>
                  )}
                </div>

                {/* 移除按钮 */}
                <button
                  onClick={() => handleRemove(file)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传状态 */}
      {isUploading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-cyber-cyan">正在上传...</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
