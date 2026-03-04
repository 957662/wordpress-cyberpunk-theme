/**
 * Media API Service
 * Handles all media-related API operations
 */

import { httpClient } from '../http-client';
import type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
} from '../../types/api.types';

/**
 * Media types
 */
export interface Media {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  alt?: string;
  caption?: string;
  description?: string;
  author?: {
    id: string;
    username: string;
    displayName: string;
  };
  uploadedAt: string;
  metadata?: Record<string, any>;
}

export interface MediaUpload {
  file: File;
  alt?: string;
  caption?: string;
  description?: string;
}

export interface MediaUpdate extends Partial<MediaUpload> {
  id: string;
}

export interface MediaListParams extends Pagination {
  type?: 'image' | 'video' | 'audio' | 'document' | 'other';
  search?: string;
  authorId?: string;
  sortBy?: 'uploadedAt' | 'filename' | 'size';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Media API Service
 */
export const mediaApi = {
  /**
   * Get media list
   */
  async list(params?: MediaListParams): Promise<PaginatedResponse<Media>> {
    const response = await httpClient.get<PaginatedResponse<Media>>('/api/v1/media', {
      params,
    });
    return response.data;
  },

  /**
   * Get media by ID
   */
  async getById(id: string): Promise<ApiResponse<Media>> {
    const response = await httpClient.get<ApiResponse<Media>>(`/api/v1/media/${id}`);
    return response.data;
  },

  /**
   * Upload media
   */
  async upload(data: MediaUpload): Promise<ApiResponse<Media>> {
    const formData = new FormData();
    formData.append('file', data.file);

    if (data.alt) formData.append('alt', data.alt);
    if (data.caption) formData.append('caption', data.caption);
    if (data.description) formData.append('description', data.description);

    const response = await httpClient.post<ApiResponse<Media>>(
      '/api/v1/media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Upload multiple media files
   */
  async uploadMultiple(files: File[]): Promise<ApiResponse<Media[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await httpClient.post<ApiResponse<Media[]>>(
      '/api/v1/media/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update media
   */
  async update(data: MediaUpdate): Promise<ApiResponse<Media>> {
    const response = await httpClient.put<ApiResponse<Media>>(
      `/api/v1/media/${data.id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete media
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<ApiResponse<void>>(`/api/v1/media/${id}`);
    return response.data;
  },

  /**
   * Bulk delete media
   */
  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>('/api/v1/media/bulk-delete', {
      ids,
    });
    return response.data;
  },

  /**
   * Search media
   */
  async search(query: string, params?: Omit<MediaListParams, 'search'>): Promise<PaginatedResponse<Media>> {
    const response = await httpClient.get<PaginatedResponse<Media>>('/api/v1/media/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },

  /**
   * Get media by type
   */
  async getByType(type: 'image' | 'video' | 'audio' | 'document', params?: Omit<MediaListParams, 'type'>): Promise<PaginatedResponse<Media>> {
    const response = await httpClient.get<PaginatedResponse<Media>>(`/api/v1/media/type/${type}`, {
      params,
    });
    return response.data;
  },

  /**
   * Get image optimizations
   */
  async getImageOptimizations(id: string): Promise<ApiResponse<{
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    original: string;
  }>> {
    const response = await httpClient.get<ApiResponse<any>>(
      `/api/v1/media/${id}/optimizations`
    );
    return response.data;
  },

  /**
   * Generate image thumbnail
   */
  async generateThumbnail(id: string, width?: number, height?: number): Promise<ApiResponse<{ url: string }>> {
    const response = await httpClient.post<ApiResponse<{ url: string }>>(
      `/api/v1/media/${id}/thumbnail`,
      { width, height }
    );
    return response.data;
  },

  /**
   * Get media stats
   */
  async getStats(): Promise<ApiResponse<{
    total: number;
    byType: Record<string, number>;
    totalSize: number;
    usedStorage: number;
    availableStorage: number;
  }>> {
    const response = await httpClient.get<ApiResponse<any>>('/api/v1/media/stats');
    return response.data;
  },

  /**
   * Get upload URL for direct upload (e.g., to S3)
   */
  async getUploadUrl(filename: string, contentType: string): Promise<ApiResponse<{
    uploadUrl: string;
    fileUrl: string;
    uploadId: string;
    fields: Record<string, string>;
  }>> {
    const response = await httpClient.post<ApiResponse<any>>('/api/v1/media/upload-url', {
      filename,
      contentType,
    });
    return response.data;
  },

  /**
   * Confirm direct upload
   */
  async confirmUpload(uploadId: string): Promise<ApiResponse<Media>> {
    const response = await httpClient.post<ApiResponse<Media>>(
      '/api/v1/media/confirm-upload',
      { uploadId }
    );
    return response.data;
  },

  /**
   * Copy media
   */
  async copy(id: string): Promise<ApiResponse<Media>> {
    const response = await httpClient.post<ApiResponse<Media>>(`/api/v1/media/${id}/copy`);
    return response.data;
  },

  /**
   * Get media library
   */
  async getLibrary(params?: {
    type?: 'image' | 'video' | 'audio' | 'document';
    folder?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Media>> {
    const response = await httpClient.get<PaginatedResponse<Media>>('/api/v1/media/library', {
      params,
    });
    return response.data;
  },

  /**
   * Create folder
   */
  async createFolder(name: string, parentId?: string): Promise<ApiResponse<{
    id: string;
    name: string;
    parentId: string | null;
  }>> {
    const response = await httpClient.post<ApiResponse<any>>('/api/v1/media/folders', {
      name,
      parentId,
    });
    return response.data;
  },

  /**
   * Get folders
   */
  async getFolders(parentId?: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    parentId: string | null;
    itemCount: number;
  }>>> {
    const response = await httpClient.get<ApiResponse<any>>('/api/v1/media/folders', {
      params: { parentId },
    });
    return response.data;
  },

  /**
   * Move media to folder
   */
  async moveToFolder(mediaIds: string[], folderId: string): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>('/api/v1/media/move', {
      mediaIds,
      folderId,
    });
    return response.data;
  },
};
