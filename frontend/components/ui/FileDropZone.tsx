'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, Image, FileText } from 'lucide-react';

interface FileDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
}

export function FileDropZone({
  onFilesDrop,
  accept = '*/*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  className = '',
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback(
    (fileList: FileList) => {
      setError('');
      const newFiles = Array.from(fileList);

      // Check file count
      if (files.length + newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      newFiles.forEach((file) => {
        if (file.size > maxSize) {
          invalidFiles.push(`${file.name} (too large)`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        setError(`Some files were rejected: ${invalidFiles.join(', ')}`);
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesDrop(updatedFiles);
      }
    },
    [files, maxSize, maxFiles, onFilesDrop]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesDrop(updated);
      return updated;
    });
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={20} />;
    } else if (file.type.startsWith('text/')) {
      return <FileText size={20} />;
    }
    return <File size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-cyan-500/30 hover:border-cyan-500/50'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4"
          >
            <Upload className="w-8 h-8 text-cyan-400" />
          </motion.div>

          <p className="text-cyan-100 font-semibold mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-cyan-600 text-sm">
            or click to browse (max {formatFileSize(maxSize)} per file)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg"
            >
              <div className="text-cyan-400">{getFileIcon(file)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-cyan-100 text-sm font-medium truncate">
                  {file.name}
                </p>
                <p className="text-cyan-600 text-xs">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-cyan-600 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
