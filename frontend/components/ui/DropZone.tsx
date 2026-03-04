'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // bytes
  maxFiles?: number;
  multiple?: boolean;
  variant?: 'default' | 'neon' | 'cyber';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    container: 'border-2 border-dashed border-gray-700 hover:border-gray-600',
    active: 'border-gray-500 bg-gray-800/50',
    error: 'border-red-500 bg-red-500/10',
  },
  neon: {
    container: 'border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60',
    active: 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    error: 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  },
  cyber: {
    container: 'border-2 border-dashed border-purple-500/30 hover:border-purple-500/60',
    active: 'border-purple-500 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    error: 'border-pink-500 bg-pink-500/10 shadow-[0_0_25px_rgba(236,72,153,0.3)]',
  },
};

export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = false,
  variant = 'default',
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const styles = variantStyles[variant];

  const validateFiles = useCallback(
    (fileList: File[]): { valid: File[]; errors: string[] } => {
      const errors: string[] = [];
      const valid: File[] = [];

      for (const file of fileList) {
        // 检查文件大小
        if (file.size > maxSize) {
          errors.push(`${file.name} 超过最大大小限制 (${(maxSize / 1024 / 1024).toFixed(1)}MB)`);
          continue;
        }

        // 检查文件类型
        if (accept) {
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          const isAccepted = Object.values(accept).some((extensions) =>
            extensions.includes(fileExtension)
          );

          if (!isAccepted) {
            errors.push(`${file.name} 文件类型不支持`);
            continue;
          }
        }

        valid.push(file);
      }

      return { valid, errors };
    },
    [accept, maxSize]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const { valid, errors } = validateFiles(droppedFiles);

      if (errors.length > 0) {
        setError(errors[0]);
        setTimeout(() => setError(null), 3000);
      }

      if (valid.length > 0) {
        const newFiles = multiple ? [...files, ...valid].slice(0, maxFiles) : valid.slice(0, 1);
        setFiles(newFiles);
        onDrop(newFiles);
      }
    },
    [disabled, files, maxFiles, multiple, onDrop, validateFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || !e.target.files) return;

      const selectedFiles = Array.from(e.target.files);
      const { valid, errors } = validateFiles(selectedFiles);

      if (errors.length > 0) {
        setError(errors[0]);
        setTimeout(() => setError(null), 3000);
      }

      if (valid.length > 0) {
        const newFiles = multiple ? [...files, ...valid].slice(0, maxFiles) : valid.slice(0, 1);
        setFiles(newFiles);
        onDrop(newFiles);
      }

      // 重置 input
      e.target.value = '';
    },
    [disabled, files, maxFiles, multiple, onDrop, validateFiles]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      onDrop(newFiles);
      return newFiles;
    });
  }, [onDrop]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative p-8 rounded-lg transition-all duration-200',
          'flex flex-col items-center justify-center text-center',
          'cursor-pointer',
          styles.container,
          isDragging && styles.active,
          error && styles.error,
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:bg-gray-800/30'
        )}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        <input
          type="file"
          accept={accept ? Object.keys(accept).join(',') : undefined}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <motion.div
          animate={{
            y: isDragging ? -5 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Upload
            className={cn(
              'w-12 h-12 mx-auto mb-4',
              error ? 'text-red-500' : isDragging ? 'text-cyan-400' : 'text-gray-600'
            )}
          />
        </motion.div>

        <p className="text-lg font-medium text-white mb-2">
          {isDragging ? '松开以上传文件' : '拖拽文件到此处'}
        </p>

        <p className="text-sm text-gray-500">
          或点击选择文件
        </p>

        {maxSize && (
          <p className="text-xs text-gray-600 mt-2">
            最大 {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-cyan-400">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DropZone;
