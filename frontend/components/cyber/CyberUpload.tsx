/**
 * CyberUpload - 赛博朋克风格文件上传组件
 */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, Image, FileText, Film, Music, Archive } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

interface CyberUploadProps {
  /** 文件变化回调 */
  onChange?: (files: File[]) => void;
  /** 已上传的文件 */
  value?: File[];
  /** 接受的文件类型 */
  accept?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxFiles?: number;
  /** 最大文件大小 (MB) */
  maxSize?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 变体 */
  variant?: 'default' | 'neon' | 'hologram';
  /** 上传图标 */
  icon?: React.ReactNode;
}

const variantClasses = {
  default: 'border-cyber-cyan/50 hover:border-cyber-cyan hover:bg-cyber-cyan/5',
  neon: 'border-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  hologram: 'border-cyber-purple/50 hover:border-cyber-purple hover:bg-cyber-purple/5',
};

/**
 * 获取文件图标
 */
function getFileIcon(type: string): React.ReactNode {
  if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
  if (type.startsWith('video/')) return <Film className="w-6 h-6" />;
  if (type.startsWith('audio/')) return <Music className="w-6 h-6" />;
  if (type.includes('pdf') || type.includes('document')) return <FileText className="w-6 h-6" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive className="w-6 h-6" />;
  return <File className="w-6 h-6" />;
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 赛博朋克风格文件上传组件
 *
 * @example
 * ```tsx
 * <CyberUpload
 *   onChange={(files) => console.log(files)}
 *   accept="image/*"
 *   multiple
 *   maxFiles={5}
 *   maxSize={10}
 * />
 * ```
 */
export const CyberUpload: React.FC<CyberUploadProps> = ({
  onChange,
  value = [],
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 10,
  disabled = false,
  className = '',
  variant = 'default',
  icon,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // 检查文件大小
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `文件 "${file.name}" 超过最大限制 ${maxSize}MB`;
      }

      // 检查文件类型
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          const [mimeMain, mimeSub] = type.split('/');
          const [fileMimeMain, fileMimeSub] = file.type.split('/');
          return (
            mimeMain === fileMimeMain &&
            (mimeSub === '*' || mimeSub === fileMimeSub)
          );
        });

        if (!isAccepted) {
          return `文件 "${file.name}" 类型不支持`;
        }
      }

      return null;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newErrors: string[] = [];
      const validFiles: FileWithPreview[] = [];

      const fileArray = Array.from(fileList);

      // 检查文件数量
      if (maxFiles && files.length + fileArray.length > maxFiles) {
        newErrors.push(`最多只能上传 ${maxFiles} 个文件`);
        setErrors(newErrors);
        return;
      }

      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          // 创建预览 URL
          const fileWithPreview = file as FileWithPreview;
          if (file.type.startsWith('image/')) {
            fileWithPreview.preview = URL.createObjectURL(file);
          }
          fileWithPreview.id = `${file.name}-${Date.now()}-${Math.random()}`;
          validFiles.push(fileWithPreview);
        }
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
        // 3秒后清除错误
        setTimeout(() => setErrors([]), 3000);
      }

      if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
      }
    },
    [files, maxFiles, multiple, validateFile, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // 重置 input 以允许再次选择相同文件
      e.target.value = '';
    },
    [processFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, onChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className={`w-full ${className}`}>
      {/* 上传区域 */}
      <motion.div
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${variantClasses[variant]}
          ${isDragging ? 'border-cyber-cyan bg-cyber-cyan/10' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {icon || (
            <motion.div
              animate={isDragging ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Upload className="w-12 h-12 text-cyber-cyan" />
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-lg font-medium text-cyber-cyan mb-1">
              {isDragging ? '释放文件以上传' : '点击或拖拽文件到此处'}
            </p>
            <p className="text-sm text-gray-400">
              {accept && `支持格式: ${accept}`}
              {maxSize && ` • 最大 ${maxSize}MB`}
              {maxFiles && ` • 最多 ${maxFiles} 个文件`}
            </p>
          </div>
        </div>

        {/* 扫描线效果 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent animate-scan" />
        </div>
      </motion.div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-1"
        >
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500">
              ⚠️ {error}
            </p>
          ))}
        </motion.div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={file.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* 文件预览/图标 */}
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="flex-shrink-0 text-cyber-cyan">
                    {getFileIcon(file.type)}
                  </div>
                )}

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyber-cyan truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 p-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                aria-label="删除文件"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CyberUpload;
