'use client';

/**
 * File Upload Component
 * 文件上传组件 - 用于拖拽和选择文件上传
 */

import { useState, useCallback } from 'react';
import { Upload, File, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface FileUploadProps {
  /** 文件变化回调 */
  onChange?: (files: File[]) => void;
  /** 接受的文件类型 */
  accept?: string;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxFiles?: number;
  /** 最大文件大小 (MB) */
  maxSize?: number;
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
  /** 拖拽区域高度 */
  dropZoneHeight?: string;
}

export function FileUpload({
  onChange,
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 10,
  className,
  variant = 'default',
  dropZoneHeight = '200px',
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `文件大小不能超过 ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      if (files.length + fileArray.length > maxFiles) {
        setError(`最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      fileArray.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
      } else {
        setError('');
      }

      if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
      }
    },
    [files, maxFiles, maxSize, multiple, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
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
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const isImage = (file: File) => file.type.startsWith('image/');
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const variants = {
    default: 'border-2 border-dashed border-gray-600 hover:border-gray-500',
    neon: 'border-2 border-dashed border-cyan-500 hover:border-cyan-400 shadow-lg shadow-cyan-500/20',
    cyber: 'border-2 border-dashed border-green-500 hover:border-green-400 bg-black/50',
  };

  return (
    <div className={cn('file-upload w-full', className)}>
      {/* 拖拽区域 */}
      <div
        className={cn(
          'drop-zone flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all',
          variants[variant],
          isDragging && 'scale-105',
          isDragging && variant === 'neon' && 'shadow-cyan-500/50',
          isDragging && variant === 'cyber' && 'shadow-green-500/50'
        )}
        style={{ height: dropZoneHeight }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">拖拽文件到这里</p>
        <p className="text-sm opacity-70 mb-4">或者点击选择文件</p>
        {maxSize && (
          <p className="text-xs opacity-50">最大文件大小: {maxSize}MB</p>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        id="file-input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* 错误信息 */}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">已选择的文件:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isImage(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded">
                    <File className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs opacity-70">{formatSize(file.size)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
