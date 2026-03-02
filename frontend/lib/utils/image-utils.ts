/**
 * 图片优化和处理工具
 * 提供图片压缩、格式转换、尺寸调整等功能
 */

export interface ImageOptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  keepAspectRatio?: boolean;
}

export interface ImageInfo {
  width: number;
  height: number;
  size: number;
  type: string;
  aspectRatio: number;
}

/**
 * 获取图片信息
 */
export function getImageInfo(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        aspectRatio: img.width / img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 压缩和优化图片
 */
export function optimizeImage(
  file: File,
  options: ImageOptimizeOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      format = 'image/jpeg',
      keepAspectRatio = true,
    } = options;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // 计算新尺寸
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > maxWidth || height > maxHeight) {
        if (keepAspectRatio) {
          if (width / maxWidth > height / maxHeight) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          if (width > maxWidth) width = maxWidth;
          if (height > maxHeight) height = maxHeight;
        }
      }

      // 创建 canvas 并调整尺寸
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 绘制图片
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
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
 * 批量优化图片
 */
export async function optimizeImages(
  files: File[],
  options?: ImageOptimizeOptions
): Promise<Blob[]> {
  const results = await Promise.allSettled(
    files.map((file) => optimizeImage(file, options))
  );

  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<Blob>).value);
}

/**
 * 转换 File 为 Data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

/**
 * 转换 Data URL 为 Blob
 */
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 裁剪图片
 */
export function cropImage(
  file: File,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to crop image'));
        }
      }, file.type);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 生成缩略图
 */
export function generateThumbnail(
  file: File,
  size: number = 150
): Promise<Blob> {
  return optimizeImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.8,
    keepAspectRatio: true,
  });
}

/**
 * 添加水印
 */
export function addWatermark(
  file: File,
  watermark: string,
  options: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    fontSize?: number;
    color?: string;
    opacity?: number;
  } = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const {
      position = 'bottom-right',
      fontSize = 24,
      color = 'rgba(255, 255, 255, 0.5)',
      opacity = 0.5,
    } = options;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
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
      const textMetrics = ctx.measureText(watermark);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      let x = padding;
      let y = padding;

      switch (position) {
        case 'top-right':
          x = canvas.width - textWidth - padding;
          break;
        case 'bottom-left':
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
        case 'top-left':
        default:
          // 使用默认值
          break;
      }

      // 绘制水印
      ctx.fillText(watermark, x, y);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to add watermark'));
        }
      }, file.type);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 获取图片的主色调
 */
export function getDominantColor(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 使用小尺寸来计算
      canvas.width = 50;
      canvas.height = 50;

      ctx.drawImage(img, 0, 0, 50, 50);

      const imageData = ctx.getImageData(0, 0, 50, 50);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

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
 * 检查图片格式
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
}

/**
 * 验证图片尺寸
 */
export async function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<boolean> {
  try {
    const info = await getImageInfo(file);

    if (minWidth && info.width < minWidth) return false;
    if (minHeight && info.height < minHeight) return false;
    if (maxWidth && info.width > maxWidth) return false;
    if (maxHeight && info.height > maxHeight) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * 创建图片占位符
 */
export function createImagePlaceholder(
  width: number,
  height: number,
  color: string = '#cccccc'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#666666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${width} x ${height}`, width / 2, height / 2);

  return canvas.toDataURL('image/png');
}

/**
 * 生成响应式图片 srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
  return sizes
    .map((size) => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * 计算最优图片尺寸
 */
export function calculateOptimalSize(
  containerWidth: number,
  devicePixelRatio: number = 1
): number {
  return Math.ceil(containerWidth * devicePixelRatio);
}
