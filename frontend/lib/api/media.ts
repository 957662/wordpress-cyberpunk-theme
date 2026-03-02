/**
 * Media API
 * 媒体相关 API 接口
 */

import { apiClient } from './client';
import type { Media, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 获取媒体列表
 */
export async function getMedia(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  parent?: number;
  parent_exclude?: number;
  media_type?: 'image' | 'video' | 'audio' | 'application';
  mime_type?: string;
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'date' | 'title' | 'modified';
}): Promise<PaginatedResponse<Media>> {
  const response = await apiClient.get<Media[]>('/media', {
    params: {
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      ...params,
    },
  });

  // 获取总数
  const total = parseInt(response.headers['x-wp-total'] || '0', 10);
  const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

  return {
    data: response.data,
    total,
    totalPages,
    currentPage: params?.page || 1,
    pageSize: params?.per_page || 10,
  };
}

/**
 * 根据 ID 获取单个媒体
 */
export async function getMediaById(id: number): Promise<Media> {
  const response = await apiClient.get<Media>(`/media/${id}`);
  return response.data;
}

/**
 * 上传媒体文件
 */
export async function uploadMedia(
  file: File,
  additionalData?: {
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }
): Promise<Media> {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData?.title) {
    formData.append('title', additionalData.title);
  }
  if (additionalData?.alt_text) {
    formData.append('alt_text', additionalData.alt_text);
  }
  if (additionalData?.caption) {
    formData.append('caption', additionalData.caption);
  }
  if (additionalData?.description) {
    formData.append('description', additionalData.description);
  }

  const response = await apiClient.post<Media>('/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * 更新媒体信息（需要认证）
 */
export async function updateMedia(
  id: number,
  data: {
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
    media_type?: string;
    mime_type?: string;
  }
): Promise<Media> {
  const response = await apiClient.put<Media>(`/media/${id}`, data);
  return response.data;
}

/**
 * 删除媒体（需要认证）
 */
export async function deleteMedia(id: number, force: boolean = false): Promise<void> {
  await apiClient.delete(`/media/${id}`, {
    params: { force },
  });
}

/**
 * 搜索媒体
 */
export async function searchMedia(query: string, limit: number = 20): Promise<Media[]> {
  const response = await apiClient.get<Media[]>('/media', {
    params: {
      search: query,
      per_page: limit,
    },
  });
  return response.data;
}

/**
 * 获取图片媒体
 */
export async function getImages(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<Media>> {
  return getMedia({
    media_type: 'image',
    ...params,
  });
}

/**
 * 获取视频媒体
 */
export async function getVideos(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<Media>> {
  return getMedia({
    media_type: 'video',
    ...params,
  });
}

/**
 * 获取音频媒体
 */
export async function getAudios(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<Media>> {
  return getMedia({
    media_type: 'audio',
    ...params,
  });
}

/**
 * 根据文章 ID 获取媒体
 */
export async function getMediaByPostId(postId: number): Promise<Media[]> {
  const response = await apiClient.get<Media[]>(`/media`, {
    params: {
      parent: postId,
      per_page: 100,
    },
  });
  return response.data;
}

/**
 * 获取特色媒体
 */
export async function getFeaturedMedia(limit: number = 10): Promise<Media[]> {
  const response = await apiClient.get<Media[]>('/media', {
    params: {
      media_type: 'image',
      per_page: limit,
      orderby: 'date',
      order: 'desc',
    },
  });
  return response.data;
}

/**
 * 批量上传媒体
 */
export async function uploadMultipleMedia(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<Media[]> {
  const results: Media[] = [];

  for (let i = 0; i < files.length; i++) {
    const media = await uploadMedia(files[i]);
    results.push(media);
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return results;
}

/**
 * 获取媒体统计
 */
export async function getMediaStats(): Promise<{
  total: number;
  images: number;
  videos: number;
  audios: number;
  documents: number;
}> {
  try {
    const [total, images, videos, audios] = await Promise.all([
      getMedia({ per_page: 1 }),
      getImages({ per_page: 1 }),
      getVideos({ per_page: 1 }),
      getAudios({ per_page: 1 }),
    ]);

    return {
      total: total.total,
      images: images.total,
      videos: videos.total,
      audios: audios.total,
      documents: total.total - images.total - videos.total - audios.total,
    };
  } catch (error) {
    console.error('Error fetching media stats:', error);
    return {
      total: 0,
      images: 0,
      videos: 0,
      audios: 0,
      documents: 0,
    };
  }
}

/**
 * 优化媒体 URL
 * 返回不同尺寸的图片 URL
 */
export function getMediaUrls(media: Media): {
  full: string;
  large?: string;
  medium?: string;
  thumbnail?: string;
} {
  const sizes = media.media_details?.sizes || {};

  return {
    full: media.source_url,
    large: sizes.large?.source_url,
    medium: sizes.medium?.source_url,
    thumbnail: sizes.thumbnail?.source_url,
  };
}

/**
 * 根据尺寸获取最佳媒体 URL
 */
export function getBestMediaUrl(media: Media, preferredSize: 'thumbnail' | 'medium' | 'large' | 'full' = 'large'): string {
  const urls = getMediaUrls(media);
  return urls[preferredSize] || urls.medium || urls.full;
}
