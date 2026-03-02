'use client';

/**
 * FileUploader Component - 文件上传组件
 * 支持拖拽上传、多文件上传、预览、进度显示、文件验证
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  Image as ImageIcon,
  Film,
  Music,
  FileText,
  X,
  Check,
  AlertCircle,
  Download,
} from 'lucide-react';

// 文件类型
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other';

// 文件状态
export type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

// 上传文件项
export interface UploadFile {
  id: string;
  file: File;
  type: FileType;
  status: FileStatus;
  progress: number;
  preview?: string;
  error?: string;
  url?: string;
}

// 组件Props
export interface FileUploaderProps {
  /** 接受的文件类型 */
  accept?: string;
  /** 是否允许多文件上传 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxFiles?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 是否自动上传 */
  autoUpload?: boolean;
  /** 上传处理函数 */
  onUpload?: (files: UploadFile[]) => Promise<void>;
  /** 文件移除回调 */
  onRemove?: (file: UploadFile) => void;
  /** 上传成功回调 */
  onSuccess?: (file: UploadFile, response: any) => void;
  /** 上传失败回调 */
  onError?: (file: UploadFile, error: Error) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 拖拽区域文本 */
  dragText?: string;
  /** 拖拽区域描述 */
  dragDescription?: string;
}

// 获取文件类型
const getFileType = (file: File): FileType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('text/') || file.type.includes('pdf') || file.type.includes('document')) {
    return 'document';
  }
  return 'other';
};

// 获取文件图标
const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'image':
      return ImageIcon;
    case 'video':
      return Film;
    case 'audio':
      return Music;
    case 'document':
      return FileText;
    default:
      return File;
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 生成文件预览
const generatePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve('');
    }
  });
};

export function FileUploader({
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 10,
  showPreview = true,
  autoUpload = true,
  onUpload,
  onRemove,
  onSuccess,
  onError,
  className = '',
  dragText = '拖拽文件到此处',
  dragDescription = '或点击选择文件',
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `文件大小不能超过 ${maxSize}MB` };
    }

    // 检查文件类型
    if (accept && !file.type.match(accept.replace('*', ''))) {
      return { valid: false, error: '不支持的文件类型' };
    }

    return { valid: true };
  };

  // 处理文件选择
  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    // 检查文件数量
    if (files.length + fileArray.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 处理每个文件
    const uploadFiles: UploadFile[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);

      if (!validation.valid) {
        uploadFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          type: getFileType(file),
          status: 'error',
          progress: 0,
          error: validation.error,
        });
        continue;
      }

      const preview = await generatePreview(file);

      uploadFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: getFileType(file),
        status: 'pending',
        progress: 0,
        preview,
      });
    }

    setFiles((prev) => [...prev, ...uploadFiles]);

    // 自动上传
    if (autoUpload && onUpload) {
      uploadFiles.forEach(async (uploadFile) => {
        if (uploadFile.status === 'pending') {
          await uploadSingleFile(uploadFile);
        }
      });
    }
  }, [files.length, maxFiles, maxSize, accept, autoUpload, onUpload]);

  // 上传单个文件
  const uploadSingleFile = async (uploadFile: UploadFile) => {
    try {
      // 更新状态为上传中
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 0 } : f
        )
      );

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === uploadFile.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          })
        );
      }, 200);

      // 调用上传回调
      await onUpload([uploadFile]);

      clearInterval(progressInterval);

      // 更新状态为成功
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'success', progress: 100, url: URL.createObjectURL(uploadFile.file) }
            : f
        )
      );

      onSuccess?.(uploadFile, null);
    } catch (error) {
      // 更新状态为失败
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : '上传失败' }
            : f
        )
      );

      onError?.(uploadFile, error as Error);
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // 处理点击上传
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ''; // 重置input
    }
  };

  // 移除文件
  const handleRemove = (file: UploadFile) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    onRemove?.(file);
  };

  // 重试上传
  const handleRetry = async (file: UploadFile) => {
    await uploadSingleFile(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 拖拽上传区域 */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/10'
            : 'border-cyber-border hover:border-cyber-cyan/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 rounded-full bg-cyber-cyan/20 flex items-center justify-center"
          >
            <Upload className="w-8 h-8 text-cyber-cyan" />
          </motion.div>

          <div>
            <p className="text-lg font-semibold text-white mb-1">{dragText}</p>
            <p className="text-sm text-gray-400">{dragDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span>最大 {maxSize}MB</span>
            <span>•</span>
            <span>最多 {maxFiles} 个文件</span>
            {multiple && <span>•</span>}
            {multiple && <span>支持多文件</span>}
          </div>
        </div>
      </motion.div>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);

              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="cyber-card p-4 flex items-center gap-4"
                >
                  {/* 文件图标/预览 */}
                  <div className="flex-shrink-0 w-12 h-12 rounded bg-cyber-dark/50 flex items-center justify-center overflow-hidden">
                    {file.preview && showPreview ? (
                      <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <FileIcon className="w-6 h-6 text-cyber-cyan" />
                    )}
                  </div>

                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.file.size)}</p>

                    {/* 进度条 */}
                    {file.status === 'uploading' && (
                      <div className="mt-2 h-1 bg-cyber-dark rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                        />
                      </div>
                    )}

                    {/* 错误信息 */}
                    {file.status === 'error' && file.error && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {file.error}
                      </p>
                    )}
                  </div>

                  {/* 状态图标 */}
                  <div className="flex-shrink-0">
                    {file.status === 'pending' && (
                      <div className="w-6 h-6 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                    )}
                    {file.status === 'uploading' && (
                      <span className="text-xs text-cyber-cyan">{file.progress}%</span>
                    )}
                    {file.status === 'success' && (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex-shrink-0 flex gap-2">
                    {file.status === 'error' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(file);
                        }}
                        className="p-1 hover:bg-cyber-cyan/20 rounded transition-colors"
                        title="重试"
                      >
                        <Upload className="w-4 h-4 text-cyber-cyan" />
                      </button>
                    )}
                    {file.url && (
                      <a
                        href={file.url}
                        download={file.file.name}
                        className="p-1 hover:bg-cyber-cyan/20 rounded transition-colors"
                        title="下载"
                      >
                        <Download className="w-4 h-4 text-cyber-cyan" />
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(file);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      title="移除"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传统计 */}
      {files.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            {files.filter((f) => f.status === 'success').length} / {files.length} 个文件
          </span>
          <span>
            {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
          </span>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
