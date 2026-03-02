'use client';

import React, { useCallback, useState } from 'react';
import { Upload, File, X, Image as ImageIcon, FileText, Film, Music, Archive, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  error?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesDrop,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  className,
  disabled = false,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.startsWith('text/')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    if (type.includes('json') || type.includes('javascript') || type.includes('typescript')) return FileCode;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `文件大小超过 ${formatFileSize(maxSize)} 限制`;
    }

    // Check file type if accept is specified
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return `文件类型 ${file.type} 不被接受`;
      }
    }

    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(undefined);
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    // Check max files limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    const processedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      const preview = await createPreview(file);

      processedFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        progress: 0,
        error: error || undefined,
      });
    }

    setUploadedFiles((prev) => [...prev, ...processedFiles]);
    onFilesDrop(processedFiles.map((f) => f.file));
  };

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, maxSize, accept, maxFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <motion.div
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/5 scale-105'
            : 'border-gray-300 dark:border-gray-600 hover:border-cyber-cyan/50 hover:bg-gray-50 dark:hover:bg-gray-800/50',
          disabled && 'opacity-50 cursor-not-allowed',
          children && '!p-0 !border-0 !bg-transparent'
        )}
      >
        {children || (
          <>
            <motion.div
              animate={isDragging ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 0.3, repeat: isDragging ? Infinity : 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                isDragging ? 'bg-cyber-cyan/20' : 'bg-gray-100 dark:bg-gray-700'
              )}>
                <Upload className={cn(
                  'w-8 h-8 transition-colors',
                  isDragging ? 'text-cyber-cyan' : 'text-gray-400'
                )} />
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {isDragging ? '释放文件以上传' : '拖拽文件到这里'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  或点击选择文件
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400">
                {accept !== '*/*' && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    接受: {accept}
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  最大: {formatFileSize(maxSize)}
                </span>
                {multiple && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    最多: {maxFiles} 个
                  </span>
                )}
              </div>
            </motion.div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              已上传 {uploadedFiles.length} 个文件
            </p>

            {uploadedFiles.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.type);

              return (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    uploadedFile.error
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  )}
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadedFile.file.size)}
                      {uploadedFile.error && (
                        <span className="ml-2 text-red-600 dark:text-red-400">
                          • {uploadedFile.error}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileDropZone;
