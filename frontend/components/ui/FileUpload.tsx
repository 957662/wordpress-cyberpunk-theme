'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image as ImageIcon, Film, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  className,
  disabled = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `文件 "${file.name}" 超过最大大小限制 (${maxSize / 1024 / 1024}MB)`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of fileArray) {
        if (files.length + validFiles.length >= maxFiles) {
          newErrors.push(`最多只能上传 ${maxFiles} 个文件`);
          break;
        }

        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      setErrors(newErrors);
      if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onUpload(updatedFiles);
      }
    },
    [files, maxSize, maxFiles, multiple, onUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-cyber-cyan" />;
    } else if (file.type.startsWith('video/')) {
      return <Film className="w-8 h-8 text-cyber-purple" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="w-8 h-8 text-cyber-pink" />;
    }
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative p-8 rounded-lg border-2 border-dashed transition-all',
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/5'
            : 'border-dark-700 hover:border-dark-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            animate={isDragging ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-full bg-dark-800"
          >
            <Upload className="w-8 h-8 text-cyber-cyan" />
          </motion.div>

          <div>
            <p className="text-white font-medium mb-1">
              {isDragging ? '松开以上传文件' : '点击或拖拽文件到此处'}
            </p>
            <p className="text-sm text-gray-400">
              最大 {maxFiles} 个文件，每个文件最大 {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-400"
              >
                ⚠️ {error}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-dark-800 border border-dark-700"
              >
                <div className="flex-shrink-0">{getFileIcon(file)}</div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="p-2 rounded hover:bg-dark-700 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative group overflow-hidden rounded-lg bg-dark-800 border border-dark-700',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-32 object-cover"
      />

      {onRemove && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default FileUpload;
