/**
 * 图片处理辅助函数
 */

import { ImageProps } from 'next/image';

// 图片尺寸预设
export const IMAGE_SIZES = {
  avatar: {
    sm: 24,
    md: 48,
    lg: 96,
    xl: 128,
  },
  thumbnail: {
    sm: 150,
    md: 300,
    lg: 600,
  },
  featured: {
    sm: 600,
    md: 1200,
    lg: 1920,
  },
  og: {
    width: 1200,
    height: 630,
  },
} as const;

/**
 * 生成响应式图片尺寸
 */
export function generateImageSizes(
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  baseSize: number
): string {
  const sizes = {
    mobile: `(max-width: 640px) ${baseSize}px`,
    tablet: `(max-width: 1024px) ${baseSize * 1.5}px`,
    desktop: `${baseSize * 2}px`,
  };
  return sizes[breakpoint];
}

/**
 * 生成图片 srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[]
): string {
  return sizes
    .map((size) => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * 获取图片占位符
 */
export function getImagePlaceholder(
  width: number,
  height: number,
  color: string = '#1a1a2e'
): string {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" fill="${encodeURIComponent(color)}"/%3E%3C/svg%3E`;
}

/**
 * 优化图片 URL
 */
export function optimizeImageUrl(
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

  try {
    const urlObj = new URL(url);

    // 添加图片优化参数
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('f', format);

    return urlObj.toString();
  } catch {
    // 如果不是有效 URL，直接返回原 URL
    return url;
  }
}

/**
 * 获取 Next.js Image 组件属性
 */
export function getImageProps(
  src: string,
  options: {
    width?: number;
    height?: number;
    alt: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    className?: string;
  } = {}
): ImageProps {
  const {
    width,
    height,
    alt,
    priority = false,
    fill = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    className,
  } = options;

  return {
    src,
    width,
    height,
    alt,
    priority,
    fill,
    sizes,
    className,
    ...(fill ? {} : { width, height }),
  };
}

/**
 * 生成头像 URL
 */
export function getAvatarUrl(
  username: string,
  size: keyof typeof IMAGE_SIZES.avatar = 'md'
): string {
  const sizeMap = {
    sm: IMAGE_SIZES.avatar.sm,
    md: IMAGE_SIZES.avatar.md,
    lg: IMAGE_SIZES.avatar.lg,
    xl: IMAGE_SIZES.avatar.xl,
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${apiUrl}/users/${username}/avatar?size=${sizeMap[size]}`;
}

/**
 * 生成封面图 URL
 */
export function getCoverImageUrl(
  postId: string,
  size: keyof typeof IMAGE_SIZES.featured = 'md'
): string {
  const sizeMap = {
    sm: IMAGE_SIZES.featured.sm,
    md: IMAGE_SIZES.featured.md,
    lg: IMAGE_SIZES.featured.lg,
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${apiUrl}/posts/${postId}/cover?size=${sizeMap[size]}`;
}

/**
 * 检查图片是否为外部 URL
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * 获取图片扩展名
 */
export function getImageExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : '';
  } catch {
    return '';
  }
}

/**
 * 判断是否为支持的图片格式
 */
export function isSupportedImageFormat(url: string): boolean {
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  const extension = getImageExtension(url);
  return supportedFormats.includes(extension);
}

/**
 * 生成模糊占位符
 */
export function generateBlurPlaceholder(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 10, 10);
    return canvas.toDataURL();
  }

  return '';
}

/**
 * 计算图片宽高比
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * 根据宽高比计算高度
 */
export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio);
}

/**
 * 根据宽高比计算宽度
 */
export function calculateWidth(height: number, aspectRatio: number): number {
  return Math.round(height * aspectRatio);
}
