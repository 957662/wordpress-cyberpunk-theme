/**
 * Media Service
 * Business logic layer for media operations
 */

import { WordPressClient } from '@/lib/wordpress/api-client';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

// Types
export interface MediaItem {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: { rendered: string };
  description: { rendered: string };
  media_type: 'image' | 'file' | 'video';
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: string[];
    };
  };
  post: number;
  source_url: string;
  missing_image_sizes: string[];
}

export interface MediaUploadInput {
  file: File;
  title?: string;
  alt_text?: string;
  caption?: string;
  description?: string;
}

export interface MediaUpdateInput {
  title?: string;
  alt_text?: string;
  caption?: string;
  description?: string;
}

export interface MediaFilters {
  search?: string;
  per_page?: number;
  page?: number;
  media_type?: 'image' | 'file' | 'video';
  mime_type?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
}

// Validation Schemas
export const uploadMediaSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  title: z.string().max(200).optional(),
  alt_text: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  description: z.string().max(2000).optional(),
});

// API Functions
const wpClient = new WordPressClient();

export async function getMedia(filters: MediaFilters = {}): Promise<MediaItem[]> {
  try {
    const response = await wpClient.fetch<MediaItem[]>(`/media`, {
      params: {
        per_page: filters.per_page || 20,
        page: filters.page || 1,
        search: filters.search,
        media_type: filters.media_type,
        mime_type: filters.mime_type,
        author: filters.author,
        orderby: filters.orderby || 'date',
        order: filters.order || 'desc',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
}

export async function getMediaItem(id: number): Promise<MediaItem> {
  try {
    const response = await wpClient.fetch<MediaItem>(`/media/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching media item:', error);
    throw error;
  }
}

export async function uploadMedia(input: MediaUploadInput): Promise<MediaItem> {
  try {
    const formData = new FormData();
    formData.append('file', input.file);

    if (input.title) formData.append('title', input.title);
    if (input.alt_text) formData.append('alt_text', input.alt_text);
    if (input.caption) formData.append('caption', input.caption);
    if (input.description) formData.append('description', input.description);

    const response = await wpClient.fetch<MediaItem>('/media', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Disposition': `attachment; filename="${input.file.name}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

export async function updateMedia(id: number, input: MediaUpdateInput): Promise<MediaItem> {
  try {
    const response = await wpClient.fetch<MediaItem>(`/media/${id}`, {
      method: 'POST',
      data: input,
    });
    return response;
  } catch (error) {
    console.error('Error updating media:', error);
    throw error;
  }
}

export async function deleteMedia(id: number, force: boolean = false): Promise<void> {
  try {
    await wpClient.fetch(`/media/${id}?force=${force}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
}

export async function searchMedia(query: string, limit: number = 20): Promise<MediaItem[]> {
  try {
    const response = await wpClient.fetch<MediaItem[]>(`/media`, {
      params: {
        search: query,
        per_page: limit,
      },
    });
    return response;
  } catch (error) {
    console.error('Error searching media:', error);
    return [];
  }
}

export function getMediaUrl(media: MediaItem, size: 'full' | 'large' | 'medium' | 'thumbnail' = 'full'): string {
  if (size === 'full') {
    return media.source_url;
  }

  return media.media_details.sizes[size]?.source_url || media.source_url;
}

export function getMediaDimensions(media: MediaItem): { width: number; height: number } {
  return {
    width: media.media_details.width,
    height: media.media_details.height,
  };
}

export function isImage(media: MediaItem): boolean {
  return media.mime_type.startsWith('image/');
}

export function isVideo(media: MediaItem): boolean {
  return media.mime_type.startsWith('video/');
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// React Query Hooks
export function useMedia(filters: MediaFilters = {}, options?: UseQueryOptions<MediaItem[]>) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: () => getMedia(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useMediaItem(id: number, options?: UseQueryOptions<MediaItem>) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: () => getMediaItem(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useMediaSearch(query: string, limit: number = 20) {
  return useQuery({
    queryKey: ['media-search', query, limit],
    queryFn: () => searchMedia(query, limit),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MediaUploadInput) => uploadMedia(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: MediaUpdateInput }) =>
      updateMedia(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', variables.id] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => deleteMedia(id, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
