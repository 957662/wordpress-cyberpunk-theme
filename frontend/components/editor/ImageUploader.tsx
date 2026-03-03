'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

interface ImageUploaderProps {
  onUpload?: (files: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxFiles = 10,
  maxFileSize = 5,
  accept = 'image/*',
  multiple = true,
  className,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        valid: false,
        error: `文件大小超过限制 (${maxFileSize}MB)`,
      };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: '只支持图片文件',
      };
    }

    return { valid: true };
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'success', progress: 100, url: data.url }
            : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                f,
                status: 'error',
                error: error instanceof Error ? error.message : '上传失败',
              }
            : f
        )
      );
    }
  };

  const simulateUpload = (uploadFile: UploadFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: Math.min(progress, 99) }
            : f
          )
        );
      }
    }, 500);
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      alert(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    const uploadFiles: UploadFile[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      const preview = await createPreview(file);
      const uploadFile: UploadFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview,
        progress: 0,
        status: 'uploading',
      };

      uploadFiles.push(uploadFile);
    }

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Upload files
    for (const uploadFile of uploadFiles) {
      // Uncomment to use real upload
      // await uploadFile(uploadFile);
      simulateUpload(uploadFile);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [files.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = () => {
    const successfulFiles = files.filter((f) => f.status === 'success' && f.url);
    const urls = successfulFiles.map((f) => f.url!);
    onUpload?.(urls);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all',
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/10'
            : 'border-cyber-purple/30 bg-cyber-muted/5 hover:border-cyber-purple/50 hover:bg-cyber-muted/10'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <motion.div
          animate={{
            scale: isDragging ? 1.1 : 1,
            rotate: isDragging ? 5 : 0,
          }}
          className="mb-4 rounded-full bg-gradient-to-br from-cyber-purple/20 to-cyber-pink/20 p-4"
        >
          <Upload className="h-8 w-8 text-cyber-cyan" />
        </motion.div>

        <p className="mb-2 text-lg font-semibold text-cyber-cyan">
          {isDragging ? '释放以上传' : '点击或拖拽上传图片'}
        </p>

        <p className="text-sm text-cyber-muted/70">
          支持 JPG, PNG, GIF, WebP • 最大 {maxFileSize}MB
        </p>

        {files.length > 0 && (
          <p className="mt-2 text-xs text-cyber-muted/50">
            {files.length} / {maxFiles} 文件
          </p>
        )}
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map((file) => (
              <FileItem key={file.id} file={file} onRemove={handleRemove} />
            ))}

            {/* Upload Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={files.some((f) => f.status === 'uploading')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-pink py-3 font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={20} />
              确认上传
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FileItemProps {
  file: UploadFile;
  onRemove: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 rounded-lg border border-cyber-purple/20 bg-cyber-muted/5 p-3"
    >
      {/* Preview */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={file.preview}
          alt={file.file.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {file.file.name}
        </p>
        <p className="text-xs text-cyber-muted/70">
          {file.file.size ? `${(file.file.size / 1024 / 1024).toFixed(2)} MB` : '未知大小'}
        </p>

        {/* Progress Bar */}
        <AnimatePresence mode="wait">
          {file.status === 'uploading' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2"
            >
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-cyber-muted/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-1 text-xs text-cyber-muted/50">{file.progress}%</p>
            </motion.div>
          )}

          {file.status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 flex items-center gap-1 text-xs text-cyber-green"
            >
              <Check size={12} />
              上传成功
            </motion.div>
          )}

          {file.status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 flex items-center gap-1 text-xs text-cyber-pink"
            >
              <AlertCircle size={12} />
              {file.error || '上传失败'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {file.status === 'uploading' && (
          <Loader2 size={20} className="animate-spin text-cyber-purple" />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(file.id)}
          className="rounded-lg p-2 text-cyber-muted/50 transition-colors hover:bg-cyber-pink/10 hover:text-cyber-pink"
        >
          <X size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ImageUploader;
