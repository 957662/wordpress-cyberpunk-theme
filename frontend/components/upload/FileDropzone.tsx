'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileDropzoneProps {
  onUpload?: (files: FileWithPreview[]) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
}

const colorSchemes = {
  cyan: {
    primary: 'border-cyan-500/30 hover:border-cyan-400',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-400',
  },
  purple: {
    primary: 'border-purple-500/30 hover:border-purple-400',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-400',
  },
  pink: {
    primary: 'border-pink-500/30 hover:border-pink-400',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    button: 'bg-pink-500 hover:bg-pink-400',
  },
  green: {
    primary: 'border-green-500/30 hover:border-green-400',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    button: 'bg-green-500 hover:bg-green-400',
  },
  orange: {
    primary: 'border-orange-500/30 hover:border-orange-400',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    button: 'bg-orange-500 hover:bg-orange-400',
  },
};

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onUpload,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  className,
  colorScheme = 'cyan',
}) => {
  const colors = colorSchemes[colorScheme];
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `文件大小超过限制 (${formatFileSize(maxSize)})`,
      };
    }
    return { valid: true };
  };

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileWithPreview[] = [];

      Array.from(fileList).forEach((file) => {
        if (files.length + newFiles.length >= maxFiles) {
          return;
        }

        const validation = validateFile(file);
        if (!validation.valid) {
          newFiles.push(
            Object.assign(file, {
              id: `${file.name}-${Date.now()}`,
              status: 'error',
              error: validation.error,
            } as FileWithPreview)
          );
          return;
        }

        const fileWithPreview = Object.assign(file, {
          id: `${file.name}-${Date.now()}`,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
          status: 'pending',
        }) as FileWithPreview;

        newFiles.push(fileWithPreview);
      });

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [files, maxFiles, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);

    try {
      // 模拟上传进度
      const uploadPromises = files.map(async (file) => {
        if (file.status === 'success') return;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'uploading' as const } : f
          )
        );

        // 模拟上传进度
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'success' as const } : f
          )
        );
      });

      await Promise.all(uploadPromises);
      await onUpload(files);
    } catch (error) {
      console.error('Upload failed:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading'
            ? { ...f, status: 'error' as const, error: '上传失败' }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.01 }}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-all',
          colors.primary,
          isDragging && colors.bg,
          'cursor-pointer'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', colors.bg)}>
            <Upload className={cn('h-8 w-8', colors.text)} />
          </div>

          <div>
            <p className="text-lg font-semibold text-white">
              {isDragging ? '释放文件以上传' : '拖拽文件到此处'}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              或点击选择文件
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>最大 {formatFileSize(maxSize)}</span>
            <span>•</span>
            <span>最多 {maxFiles} 个文件</span>
          </div>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                已选择 {files.length} 个文件
              </h4>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-gray-400 hover:text-white"
              >
                清空
              </button>
            </div>

            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 p-3',
                  file.status === 'error' && 'border-red-500/50'
                )}
              >
                {/* File Icon/Preview */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <File className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <span>• {file.progress}%</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-700">
                      <motion.div
                        className={cn('h-full', colors.bg)}
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress || 0}%` }}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === 'error' && (
                    <p className="mt-1 text-xs text-red-400">{file.error}</p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex items-center gap-2">
                  {file.status === 'success' && (
                    <Check className="h-5 w-5 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-700"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Upload Button */}
            {files.length > 0 && onUpload && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpload}
                disabled={isUploading}
                className={cn(
                  'w-full rounded-lg px-4 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50',
                  colors.button
                )}
              >
                {isUploading ? '上传中...' : '开始上传'}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileDropzone;
