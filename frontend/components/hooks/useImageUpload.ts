/**
 * 图片上传 Hook
 * 处理图片选择、预览、压缩
 */

import { useState, useCallback } from 'react';

export interface ImageUploadOptions {
  maxSize?: number; // MB
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  accept?: string[];
}

export function useImageUpload(options: ImageUploadOptions = {}) {
  const {
    maxSize = 5,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback(
    (selectedFile: File): boolean => {
      // 检查文件类型
      if (!accept.includes(selectedFile.type)) {
        setError(`不支持的文件类型: ${selectedFile.type}`);
        return false;
      }

      // 检查文件大小
      const sizeInMB = selectedFile.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        setError(`文件大小超过限制: ${sizeInMB.toFixed(2)}MB > ${maxSize}MB`);
        return false;
      }

      setError(null);
      return true;
    },
    [accept, maxSize]
  );

  const compressImage = useCallback(
    (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();

          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // 计算新尺寸
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width *= ratio;
              height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to compress image'));
                }
              },
              file.type,
              quality
            );
          };

          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },
    [maxWidth, maxHeight, quality]
  );

  const selectFile = useCallback(
    async (selectedFile: File) => {
      if (!validateFile(selectedFile)) {
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        // 压缩图片
        const compressed = await compressImage(selectedFile);

        // 创建预览
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setFile(new File([compressed], selectedFile.name, { type: selectedFile.type }));
          setIsUploading(false);
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process image');
        setIsUploading(false);
      }
    },
    [validateFile, compressImage]
  );

  const clear = useCallback(() => {
    setPreview(null);
    setFile(null);
    setError(null);
  }, []);

  return {
    preview,
    file,
    error,
    isUploading,
    selectFile,
    clear,
  };
}

// 多图片上传 Hook
export function useMultipleImageUpload(options: ImageUploadOptions = {}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useImageUpload(options);

  const selectFiles = useCallback(
    async (selectedFiles: FileList | File[]) => {
      setIsUploading(true);
      const newPreviews: string[] = [];
      const newFiles: File[] = [];
      const newErrors: string[] = [];

      for (const file of Array.from(selectedFiles)) {
        try {
          const result = await new Promise<{ file: File; preview: string }>(
            (resolve, reject) => {
              const reader = new FileReader();

              reader.onload = (e) => {
                resolve({
                  file,
                  preview: e.target?.result as string,
                });
              };

              reader.onerror = () => reject(new Error('Failed to read file'));
              reader.readAsDataURL(file);
            }
          );

          newPreviews.push(result.preview);
          newFiles.push(result.file);
        } catch (err) {
          newErrors.push(`${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      setPreviews(prev => [...prev, ...newPreviews]);
      setFiles(prev => [...prev, ...newFiles]);
      setErrors(newErrors);
      setIsUploading(false);
    },
    [options]
  );

  const removeFile = useCallback((index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setPreviews([]);
    setFiles([]);
    setErrors([]);
  }, []);

  return {
    previews,
    files,
    errors,
    isUploading,
    selectFiles,
    removeFile,
    clear,
  };
}
