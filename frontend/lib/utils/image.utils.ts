/**
 * Image Utility Functions
 * 图像处理工具函数集
 */

/**
 * 图片尺寸接口
 */
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const dimensions: ImageDimensions = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      };
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-1
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // 创建 canvas 进行压缩
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 生成图片缩略图
 */
export async function generateThumbnail(
  file: File,
  size: number = 200
): Promise<Blob> {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
  });
}

/**
 * 裁剪图片为正方形
 */
export async function cropToSquare(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 居中裁剪
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to crop image'));
          }
        },
        'image/jpeg',
        0.9
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 添加图片水印
 */
export async function addWatermark(
  file: File,
  options: {
    text?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
    fontSize?: number;
    color?: string;
  } = {}
): Promise<Blob> {
  const {
    text = 'CyberPress',
    position = 'bottom-right',
    opacity = 0.5,
    fontSize = 24,
    color = '#ffffff',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 绘制原图
      ctx.drawImage(img, 0, 0);

      // 设置水印样式
      ctx.globalAlpha = opacity;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;

      // 计算水印位置
      const padding = 20;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      let x = padding;
      let y = padding;

      switch (position) {
        case 'top-left':
          x = padding;
          y = textHeight + padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = textHeight + padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = (canvas.height + textHeight) / 2;
          break;
      }

      ctx.fillText(text, x, y);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to add watermark'));
          }
        },
        'image/jpeg',
        0.9
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 转换图片格式
 */
export async function convertImageFormat(
  file: File,
  format: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 生成图片 URL (用于预览)
 */
export function createImageURL(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * 释放图片 URL
 */
export function revokeImageURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * 下载图片
 */
export function downloadImage(blob: Blob, filename: string = 'image.jpg'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 获取图片主色调
 */
export async function getImageDominantColor(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 缩小尺寸以提高性能
      const maxSize = 50;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.round(r / pixelCount);
      g = Math.round(g / pixelCount);
      b = Math.round(b / pixelCount);

      URL.revokeObjectURL(url);
      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 检测图片格式
 */
export function detectImageFormat(file: File): string | null {
  const signatures: { [key: string]: string } = {
    'image/jpeg': 'FF D8 FF',
    'image/png': '89 50 4E 47',
    'image/gif': '47 49 46 38',
    'image/webp': '52 49 46 46',
    'image/bmp': '42 4D',
  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      const signature = Array.from(arr.slice(0, 4))
        .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');

      for (const [format, sig] of Object.entries(signatures)) {
        if (signature.startsWith(sig)) {
          resolve(format);
          return;
        }
      }
      resolve(null);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file.slice(0, 4));
  }) as any;
}

/**
 * 批量处理图片
 */
export async function batchProcessImages(
  files: File[],
  processor: (file: File) => Promise<Blob>,
  onProgress?: (current: number, total: number) => void
): Promise<Blob[]> {
  const results: Blob[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await processor(files[i]);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }

  return results;
}

// 默认导出
export default {
  getImageDimensions,
  compressImage,
  generateThumbnail,
  cropToSquare,
  addWatermark,
  convertImageFormat,
  createImageURL,
  revokeImageURL,
  downloadImage,
  getImageDominantColor,
  detectImageFormat,
  batchProcessImages,
};
