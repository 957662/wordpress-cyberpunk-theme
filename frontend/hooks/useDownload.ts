import { useCallback, useRef } from 'react';

export interface UseDownloadOptions {
  /** 下载的文件名 */
  filename?: string;
  /** MIME 类型 */
  mimeType?: string;
  /** 下载开始时的回调 */
  onDownloadStart?: () => void;
  /** 下载完成时的回调 */
  onDownloadEnd?: () => void;
  /** 下载失败时的回调 */
  onDownloadError?: (error: Error) => void;
}

export interface UseDownloadReturn {
  /** 下载文件 */
  download: (data: Blob | string, filename?: string) => Promise<void>;
  /** 下载URL */
  downloadFromUrl: (url: string, filename?: string) => Promise<void>;
  /** 下载文本内容 */
  downloadText: (text: string, filename?: string) => void;
  /** 下载JSON */
  downloadJson: (data: unknown, filename?: string) => void;
  /** 下载图片 */
  downloadImage: (url: string, filename?: string) => Promise<void>;
  /** 是否正在下载 */
  isDownloading: boolean;
}

/**
 * 下载 Hook
 *
 * @example
 * ```tsx
 * const { download, downloadFromUrl, downloadText } = useDownload({
 *   filename: 'file.txt',
 *   onDownloadStart: () => console.log('Download started'),
 *   onDownloadEnd: () => console.log('Download completed'),
 * });
 *
 * // 下载文本
 * downloadText('Hello, World!', 'hello.txt');
 *
 * // 下载 URL
 * await downloadFromUrl('https://example.com/file.pdf', 'document.pdf');
 * ```
 */
export function useDownload(options: UseDownloadOptions = {}): UseDownloadReturn {
  const {
    filename: defaultFilename,
    mimeType = 'text/plain',
    onDownloadStart,
    onDownloadEnd,
    onDownloadError,
  } = options;

  const isDownloadingRef = useRef(false);

  const createObjectUrl = useCallback((blob: Blob): string => {
    return URL.createObjectURL(blob);
  }, []);

  const revokeObjectUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url);
  }, []);

  const triggerDownload = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const download = useCallback(async (
    data: Blob | string,
    filename?: string
  ): Promise<void> => {
    if (isDownloadingRef.current) {
      throw new Error('Download is already in progress');
    }

    try {
      isDownloadingRef.current = true;
      onDownloadStart?.();

      let blob: Blob;

      if (typeof data === 'string') {
        blob = new Blob([data], { type: mimeType });
      } else {
        blob = data;
      }

      const url = createObjectUrl(blob);
      triggerDownload(url, filename || defaultFilename || 'download');

      // 等待一段时间以确保下载开始
      await new Promise(resolve => setTimeout(resolve, 100));

      revokeObjectUrl(url);
      onDownloadEnd?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Download failed');
      onDownloadError?.(err);
      throw err;
    } finally {
      isDownloadingRef.current = false;
    }
  }, [defaultFilename, mimeType, onDownloadStart, onDownloadEnd, onDownloadError, createObjectUrl, revokeObjectUrl, triggerDownload]);

  const downloadFromUrl = useCallback(async (
    url: string,
    filename?: string
  ): Promise<void> => {
    if (isDownloadingRef.current) {
      throw new Error('Download is already in progress');
    }

    try {
      isDownloadingRef.current = true;
      onDownloadStart?.();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = createObjectUrl(blob);

      // 尝试从响应头获取文件名
      let finalFilename = filename || defaultFilename || 'download';
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          finalFilename = match[1].replace(/['"]/g, '');
        }
      }

      triggerDownload(objectUrl, finalFilename);

      await new Promise(resolve => setTimeout(resolve, 100));

      revokeObjectUrl(objectUrl);
      onDownloadEnd?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Download from URL failed');
      onDownloadError?.(err);
      throw err;
    } finally {
      isDownloadingRef.current = false;
    }
  }, [defaultFilename, onDownloadStart, onDownloadEnd, onDownloadError, createObjectUrl, revokeObjectUrl, triggerDownload]);

  const downloadText = useCallback((
    text: string,
    filename?: string
  ) => {
    download(text, filename || defaultFilename || 'text.txt');
  }, [download, defaultFilename]);

  const downloadJson = useCallback((
    data: unknown,
    filename?: string
  ) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    download(blob, filename || defaultFilename || 'data.json');
  }, [download, defaultFilename]);

  const downloadImage = useCallback(async (
    url: string,
    filename?: string
  ): Promise<void> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      await download(blob, filename || defaultFilename || 'image.png');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to download image');
      onDownloadError?.(err);
      throw err;
    }
  }, [download, defaultFilename, onDownloadError]);

  return {
    download,
    downloadFromUrl,
    downloadText,
    downloadJson,
    downloadImage,
    get isDownloading() {
      return isDownloadingRef.current;
    },
  };
}

export default useDownload;
