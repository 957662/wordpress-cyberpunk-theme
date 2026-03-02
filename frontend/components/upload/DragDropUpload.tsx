'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, FileText, Film, Music, Archive, Check, AlertCircle } from 'lucide-react';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface DragDropUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void | Promise<void>;
  onRemove?: (fileId: string) => void;
  className?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

export function DragDropUpload({
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  onUpload,
  onRemove,
  className = '',
  showPreview = true,
  disabled = false
}: DragDropUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Film;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    if (file.type.includes('zip') || file.type.includes('archive')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return \`文件 \${file.name} 超过最大大小限制 (\${formatFileSize(maxSize)})\`;
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });
      
      if (!isAccepted) {
        return \`文件类型 \${file.type} 不被接受\`;
      }
    }
    
    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFiles = useCallback(async (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    const validErrors: string[] = [];
    const validFiles: FileWithPreview[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        validErrors.push(error);
        continue;
      }

      const preview = await createPreview(file);
      validFiles.push({
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        preview
      });
    }

    if (validErrors.length > 0) {
      setErrors(validErrors);
    }

    if (validFiles.length > 0) {
      setFiles(prev => {
        const updated = [...prev, ...validFiles];
        if (maxFiles && updated.length > maxFiles) {
          setErrors([\`最多只能上传 \${maxFiles} 个文件\`]);
          return updated.slice(0, maxFiles);
        }
        return updated;
      });
    }
  }, [maxSize, accept, maxFiles]);

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

    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleRemove = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    onRemove?.(fileId);
  }, [onRemove]);

  const handleUpload = useCallback(async () => {
    if (onUpload) {
      await onUpload(files);
      setFiles([]);
      setErrors([]);
    }
  }, [files, onUpload]);

  const Icon = Upload;

  return (
    <div className={\`w-full \${className}\`}>
      {/* 拖拽区域 */}
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={\`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          \${isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-gray-600'}
          \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="p-4 bg-cyan-500/20 rounded-full">
            <Icon className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-medium mb-1">
              {isDragging ? '释放文件以上传' : '拖拽文件到此处'}
            </p>
            <p className="text-sm text-gray-400">
              或点击选择文件 (最大 {formatFileSize(maxSize)})
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 错误信息 */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文件列表 */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 space-y-3"
          >
            {files.map((file) => {
              const FileIcon = getFileIcon(file);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg group"
                >
                  {/* 预览图 */}
                  {showPreview && file.preview ? (
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-8 h-8 text-gray-600" />
                    </div>
                  )}

                  {/* 文件信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                  </div>

                  {/* 删除按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(file.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              );
            })}

            {/* 上传按钮 */}
            {onUpload && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                上传 {files.length} 个文件
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文件数量限制 */}
      {files.length >= maxFiles && (
        <p className="text-sm text-gray-400 mt-2 text-center">
          已达到最大文件数量限制 ({maxFiles})
        </p>
      )}
    </div>
  );
}

export default DragDropUpload;
