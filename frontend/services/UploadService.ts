/**
 * Upload Service - CyberPress Platform
 *
 * 提供文件上传功能，支持多种文件类型和云存储
 */

export interface UploadOptions {
  endpoint: string;
  headers?: Record<string, string>;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  transform?: (file: File) => File | Promise<File>;
}

export interface UploadResult {
  success: boolean;
  file: File;
  url?: string;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    name: string;
  };
}

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  fields?: Record<string, string>;
}

class UploadService {
  private static instance: UploadService;
  private uploads: Map<string, XMLHttpRequest> = new Map();

  private constructor() {}

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  /**
   * 上传单个文件
   */
  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    try {
      // 验证文件
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 转换文件
      const processedFile = options.transform ? await options.transform(file) : file;

      // 创建 FormData
      const formData = new FormData();
      formData.append('file', processedFile);

      // 发送请求
      const response = await this.uploadToEndpoint(formData, options);

      const result: UploadResult = {
        success: true,
        file: processedFile,
        url: response.url,
        metadata: {
          size: processedFile.size,
          type: processedFile.type,
          name: processedFile.name,
        },
      };

      options.onSuccess?.(response);
      return result;
    } catch (error) {
      const result: UploadResult = {
        success: false,
        file,
        error: (error as Error).message,
      };
      options.onError?.(error as Error);
      return result;
    }
  }

  /**
   * 上传多个文件
   */
  async uploadFiles(files: File[], options: UploadOptions): Promise<UploadResult[]> {
    const uploads = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploads);
  }

  /**
   * 使用预签名 URL 上传（用于云存储）
   */
  async uploadWithPresignedUrl(
    file: File,
    presignedUrl: string,
    options?: {
      fields?: Record<string, string>;
      onProgress?: (progress: number) => void;
    }
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const uploadId = `${file.name}-${Date.now()}`;

      this.uploads.set(uploadId, xhr);

      // 监听进度
      if (options?.onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            options.onProgress?.(progress);
          }
        });
      }

      // 监听完成
      xhr.addEventListener('load', () => {
        this.uploads.delete(uploadId);

        if (xhr.status >= 200 && xhr.status < 300) {
          // 从 presigned URL 提取文件 URL
          const url = new URL(presignedUrl);
          const fileUrl = url.origin + url.pathname;

          resolve({
            success: true,
            file,
            url: fileUrl,
            metadata: {
              size: file.size,
              type: file.type,
              name: file.name,
            },
          });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // 监听错误
      xhr.addEventListener('error', () => {
        this.uploads.delete(uploadId);
        reject(new Error('Upload failed'));
      });

      // 发送请求
      xhr.open('PUT', presignedUrl);

      if (options?.fields) {
        // 如果有额外字段，使用 POST
        const formData = new FormData();
        Object.entries(options.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('file', file);
        xhr.send(formData);
      } else {
        // 否则直接 PUT 文件
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      }
    });
  }

  /**
   * 获取预签名 URL
   */
  async getPresignedUrl(
    filename: string,
    fileType: string,
    endpoint: string = '/api/upload/presigned'
  ): Promise<PresignedUrlResult> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, fileType }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    return response.json();
  }

  /**
   * 拖拽上传
   */
  setupDragAndDrop(
    element: HTMLElement,
    options: UploadOptions
  ): { cleanup: () => void } {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      element.classList.add('drag-over');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      element.classList.remove('drag-over');
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      element.classList.remove('drag-over');

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        await this.uploadFiles(files, options);
      }
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return {
      cleanup: () => {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('dragleave', handleDragLeave);
        element.removeEventListener('drop', handleDrop);
      },
    };
  }

  /**
   * 取消上传
   */
  cancelUpload(uploadId: string): boolean {
    const xhr = this.uploads.get(uploadId);
    if (xhr) {
      xhr.abort();
      this.uploads.delete(uploadId);
      return true;
    }
    return false;
  }

  /**
   * 取消所有上传
   */
  cancelAllUploads(): void {
    this.uploads.forEach((xhr) => xhr.abort());
    this.uploads.clear();
  }

  /**
   * 验证文件
   */
  private validateFile(file: File, options: UploadOptions): { valid: boolean; error?: string } {
    // 检查文件大小
    if (options.maxSize && file.size > options.maxSize) {
      const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      };
    }

    // 检查文件类型
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      const isAllowed =
        options.allowedTypes.includes(fileType) ||
        options.allowedTypes.includes(fileExtension) ||
        options.allowedTypes.includes('*');

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type ${fileType} is not allowed`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * 上传到端点
   */
  private uploadToEndpoint(
    formData: FormData,
    options: UploadOptions
  ): Promise<{ url: string; [key: string]: any }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const uploadId = `upload-${Date.now()}`;

      this.uploads.set(uploadId, xhr);

      // 监听进度
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            options.onProgress?.(progress);
          }
        });
      }

      // 监听完成
      xhr.addEventListener('load', () => {
        this.uploads.delete(uploadId);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve({ url: xhr.responseText });
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      // 监听错误
      xhr.addEventListener('error', () => {
        this.uploads.delete(uploadId);
        reject(new Error('Upload failed'));
      });

      // 发送请求
      xhr.open('POST', options.endpoint);

      // 添加自定义头
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.send(formData);
    });
  }

  /**
   * 图片压缩
   */
  async compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<File> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve, reject) => {
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
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 生成缩略图
   */
  async generateThumbnail(
    file: File,
    size: number = 200
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // 计算缩略图尺寸（保持宽高比）
        const ratio = Math.min(size / img.width, size / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const thumbnailUrl = canvas.toDataURL(file.type, 0.8);
        resolve(thumbnailUrl);
      };

      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// 导出单例实例
export const uploadService = UploadService.getInstance();

// 便捷方法
export const uploadFile = (file: File, options: UploadOptions) =>
  uploadService.uploadFile(file, options);

export const uploadFiles = (files: File[], options: UploadOptions) =>
  uploadService.uploadFiles(files, options);

export default uploadService;
