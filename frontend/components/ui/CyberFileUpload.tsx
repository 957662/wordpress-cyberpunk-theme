/**
 * CyberFileUpload - 赛博朋克风格文件上传组件
 *
 * 支持拖拽上传的文件选择组件
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useState, useCallback } from 'react';

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
}

export interface CyberFileUploadProps {
  /** 接受的文件类型 */
  accept?: string;
  /** 是否允许多个文件 */
  multiple?: boolean;
  /** 最大文件大小（字节） */
  maxSize?: number;
  /** 文件数量限制 */
  maxFiles?: number;
  /** 文件变化回调 */
  onFilesChange?: (files: FileItem[]) => void;
  /** 上传处理函数 */
  onUpload?: (file: FileItem) => Promise<void>;
  /** 额外的类名 */
  className?: string;
}

export function CyberFileUpload({
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onFilesChange,
  onUpload,
  className,
}: CyberFileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理文件添加
  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FileItem[] = [];

    Array.from(fileList).forEach((file) => {
      // 检查文件大小
      if (file.size > maxSize) {
        alert(`文件 "${file.name}" 超过最大限制 ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        return;
      }

      // 检查文件数量
      if (files.length + newFiles.length >= maxFiles) {
        alert(`最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      // 创建预览
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        status: 'pending',
      });
    });

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // 触发上传
      if (onUpload) {
        newFiles.forEach(async (fileItem) => {
          fileItem.status = 'uploading';
          setFiles([...updatedFiles]);

          try {
            await onUpload(fileItem);
            fileItem.status = 'success';
            setFiles([...updatedFiles]);
          } catch {
            fileItem.status = 'error';
            setFiles([...updatedFiles]);
          }
        });
      }
    }
  }, [files, maxSize, maxFiles, multiple, onFilesChange, onUpload]);

  // 拖拽处理
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
    handleFiles(e.dataTransfer.files);
  };

  // 移除文件
  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all',
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/5'
            : 'border-cyber-border hover:border-cyber-cyan/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="text-center">
          <motion.div
            className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
              isDragging ? 'bg-cyber-cyan/20' : 'bg-cyber-muted'
            )}
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <svg
              className={cn('w-8 h-8', isDragging ? 'text-cyber-cyan' : 'text-gray-500')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </motion.div>

          <p className="text-lg font-medium text-gray-300 mb-2">
            {isDragging ? '释放文件' : '拖拽文件到这里'}
          </p>
          <p className="text-sm text-gray-500 mb-4">或点击选择文件</p>

          <div className="text-xs text-gray-600">
            <p>最大文件大小: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
            <p>最多上传 {maxFiles} 个文件</p>
          </div>
        </div>

        {/* 扫描线效果 */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.05) 50%)',
                backgroundSize: '100% 4px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {files.map((fileItem) => (
              <motion.div
                key={fileItem.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  fileItem.status === 'success' && 'border-cyber-green bg-cyber-green/5',
                  fileItem.status === 'error' && 'border-cyber-pink bg-cyber-pink/5',
                  fileItem.status !== 'success' && fileItem.status !== 'error' && 'border-cyber-border bg-cyber-card'
                )}
              >
                {/* 预览 */}
                {fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-cyber-muted flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-300 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileItem.file.size / 1024).toFixed(1)} KB
                  </p>

                  {/* 上传进度 */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2 h-1 bg-cyber-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyber-cyan"
                        initial={{ width: 0 }}
                        animate={{ width: `${fileItem.progress || 0}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>

                {/* 状态指示 */}
                {fileItem.status === 'success' && (
                  <div className="text-cyber-green">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {fileItem.status === 'error' && (
                  <div className="text-cyber-pink">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}

                {/* 删除按钮 */}
                <button
                  onClick={() => removeFile(fileItem.id)}
                  className="p-1 text-gray-500 hover:text-cyber-pink transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
