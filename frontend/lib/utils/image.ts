/**
 * 图像处理工具
 */

/**
 * 获取优化后的图像 URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!url) return '';

  const { width, height, quality = 80, format = 'webp' } = options;

  // 如果是 Unsplash 图片
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fmt', format);
    params.set('fit', 'crop');

    return `${url}?${params.toString()}`;
  }

  // 如果是 Cloudinary 图片
  if (url.includes('cloudinary.com')) {
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
  }

  // 默认返回原 URL
  return url;
}

/**
 * 生成响应式图像 srcset
 */
export function generateSrcSet(
  url: string,
  sizes: number[] = [320, 640, 960, 1280, 1920],
  quality: number = 80
): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(url, { width: size, quality })} ${size}w`)
    .join(', ');
}

/**
 * 生成响应式图像 sizes 属性
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}`)
    .join(', ');
}

/**
 * 获取图像占位符（模糊效果）
 */
export function getBlurPlaceholder(width: number = 10, height: number = 10): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%231a1a2e'/%3E%3C/svg%3E`;
}

/**
 * 预加载图像
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 批量预加载图像
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => preloadImage(url).catch(err => err));
  await Promise.allSettled(promises);
}

/**
 * 获取图像尺寸
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 压缩图像
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 计算新尺寸
      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

      if (ratio < 1) {
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图像
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
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 转换文件为 Data URL
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
 * 生成渐变色占位符
 */
export function generateGradientPlaceholder(
  width: number,
  height: number,
  colors: string[] = ['#1a1a2e', '#16213e']
): string {
  const gradient = colors.join(',');
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:${colors[0]};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:${colors[1]};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E`;
}
