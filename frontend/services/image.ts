/**
 * Image Service
 *
 * Image optimization, processing, and manipulation utilities.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
}

/**
 * Get optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizeOptions = {}
): string {
  const { width, height, quality = 80, format } = options;

  // For external images, return as-is
  if (src.startsWith('http')) {
    return src;
  }

  // Build URL parameters
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  if (quality) params.set('q', String(quality));
  if (format) params.set('f', format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  src: string
): Promise<ImageDimensions | null> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = src;
  });
}

/**
 * Get image metadata
 */
export async function getImageMetadata(src: string): Promise<ImageMetadata | null> {
  const dimensions = await getImageDimensions(src);

  if (!dimensions) return null;

  // Get format from URL
  const formatMatch = src.match(/\.([^.?]+)(?:\?|$)/);
  const format = formatMatch ? formatMatch[1] : 'unknown';

  return {
    ...dimensions,
    format,
    size: 0, // Would need fetch to get actual size
    aspectRatio: dimensions.width / dimensions.height,
  };
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Generate responsive image sizes
 */
export function generateResponsiveSizes(
  breakpoints: number[] = [640, 768, 1024, 1280, 1536]
): string {
  return breakpoints
    .map((bp) => `(max-width: ${bp}px) ${bp}px`)
    .join(', ');
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  sizes: number[],
  format?: string
): string {
  return sizes
    .map((size) => {
      const url = getOptimizedImageUrl(src, { width: size, format });
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Get placeholder image (base64)
 */
export function getPlaceholderImage(
  width: number = 1,
  height: number = 1
): string {
  // Return a tiny transparent base64 image
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3C/svg%3E`;
}

/**
 * Generate blur placeholder
 */
export function generateBlurPlaceholder(
  width: number,
  height: number,
  color: string = '#000000'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Check if image is landscape
 */
export function isLandscape(width: number, height: number): boolean {
  return width > height;
}

/**
 * Check if image is portrait
 */
export function isPortrait(width: number, height: number): boolean {
  return height > width;
}

/**
 * Check if image is square
 */
export function isSquare(width: number, height: number, tolerance: number = 0.01): boolean {
  const ratio = width / height;
  return Math.abs(ratio - 1) < tolerance;
}

/**
 * Calculate image dimensions to fit container
 */
export function fitDimensions(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let width: number;
  let height: number;

  if (imageRatio > containerRatio) {
    // Image is wider, fit to width
    width = containerWidth;
    height = containerWidth / imageRatio;
  } else {
    // Image is taller, fit to height
    height = containerHeight;
    width = containerHeight * imageRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Calculate image dimensions to cover container
 */
export function coverDimensions(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let width: number;
  let height: number;

  if (imageRatio > containerRatio) {
    // Image is wider, cover by height
    height = containerHeight;
    width = containerHeight * imageRatio;
  } else {
    // Image is taller, cover by width
    width = containerWidth;
    height = containerWidth / imageRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Convert image to base64
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Download image from URL
 */
export async function downloadImage(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
}

/**
 * Validate image file type
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };

  return extensions[mimeType] || 'bin';
}

/**
 * Compress image (quality 0-1)
 */
export async function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth?: number,
  maxHeight?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize if dimensions are specified
      if (maxWidth || maxHeight) {
        const dimensions = fitDimensions(
          width,
          height,
          maxWidth || width,
          maxHeight || height
        );
        width = dimensions.width;
        height = dimensions.height;
      }

      const canvas = document.createElement('canvas');
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
    img.src = URL.createObjectURL(file);
  });
}
