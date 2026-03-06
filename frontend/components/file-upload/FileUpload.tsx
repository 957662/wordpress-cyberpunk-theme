'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Image as ImageIcon, FileText, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Film;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`);
        return;
      }

      // Check file count
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);
    });

    return { valid: validFiles, errors: newErrors };
  };

  const handleFiles = useCallback((files: FileList) => {
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setErrors(errors);
      setTimeout(() => setErrors([]), 5000);
    }

    if (valid.length === 0) return;

    const newUploadedFiles: UploadedFile[] = valid.map((file) => {
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substring(7),
        file,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setUploadedFiles((prev) => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      return uploadedFile;
    });

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
    onUpload(valid);
  }, [uploadedFiles.length, maxSize, maxFiles, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8',
          'transition-all duration-200',
          'flex flex-col items-center justify-center',
          'cursor-pointer',
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-gray-700 hover:border-gray-600'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className={cn('w-12 h-12 mb-4', isDragging ? 'text-cyan-400' : 'text-gray-500')} />

        <p className="text-white font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>

        <p className="text-sm text-gray-500 mb-2">or</p>

        <p className="text-cyan-400 text-sm font-medium">Browse files</p>

        <p className="text-xs text-gray-600 mt-4">
          Maximum {maxFiles} files, {formatFileSize(maxSize)} each
        </p>
      </motion.div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              <X className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((uploadedFile) => {
            const Icon = getFileIcon(uploadedFile.file.type);

            return (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-white/10"
              >
                {/* Preview */}
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-500" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(uploadedFile.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
