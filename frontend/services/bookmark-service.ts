/**
 * 收藏服务
 * 处理文章/评论的收藏、取消收藏、收藏夹管理等功能
 */

import { apiClient } from '@/lib/api-client';
import type {
  Bookmark,
  BookmarkFolder,
  BookmarkItem,
  BookmarkStats,
  BookmarkResponse,
} from '@/types/social.types';

export interface CreateFolderDto {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateFolderDto {
  name?: string;
  icon?: string;
  color?: string;
}

export interface BookmarksListParams {
  page?: number;
  pageSize?: number;
  folderId?: string;
  targetType?: 'post' | 'comment';
}

export interface BookmarksListResponse {
  items: BookmarkItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class BookmarkService {
  private baseUrl = '/api/bookmarks';

  /**
   * 添加收藏
   */
  async addBookmark(targetId: string, targetType: 'post' | 'comment', folderId?: string): Promise<BookmarkResponse> {
    const response = await apiClient.post<BookmarkResponse>(`${this.baseUrl}`, {
      targetId,
      targetType,
      folderId,
    });
    return response.data;
  }

  /**
   * 取消收藏
   */
  async removeBookmark(targetId: string, targetType: 'post' | 'comment'): Promise<BookmarkResponse> {
    const response = await apiClient.delete<BookmarkResponse>(`${this.baseUrl}/${targetId}`, {
      params: { targetType },
    });
    return response.data;
  }

  /**
   * 切换收藏状态
   */
  async toggleBookmark(targetId: string, targetType: 'post' | 'comment', folderId?: string): Promise<BookmarkResponse> {
    const response = await apiClient.post<BookmarkResponse>(`${this.baseUrl}/toggle`, {
      targetId,
      targetType,
      folderId,
    });
    return response.data;
  }

  /**
   * 获取收藏统计
   */
  async getBookmarkStats(targetId: string, targetType: 'post' | 'comment'): Promise<BookmarkStats> {
    const response = await apiClient.get<BookmarkStats>(`${this.baseUrl}/${targetId}/stats`, {
      params: { targetType },
    });
    return response.data;
  }

  /**
   * 获取用户的收藏列表
   */
  async getBookmarks(params: BookmarksListParams = {}): Promise<BookmarksListResponse> {
    const {
      page = 1,
      pageSize = 20,
      folderId,
      targetType,
    } = params;

    const response = await apiClient.get<BookmarksListResponse>(this.baseUrl, {
      params: {
        page,
        pageSize,
        folderId,
        targetType,
      },
    });
    return response.data;
  }

  /**
   * 获取收藏夹列表
   */
  async getFolders(): Promise<BookmarkFolder[]> {
    const response = await apiClient.get<BookmarkFolder[]>(`${this.baseUrl}/folders`);
    return response.data;
  }

  /**
   * 创建收藏夹
   */
  async createFolder(data: CreateFolderDto): Promise<BookmarkFolder> {
    const response = await apiClient.post<BookmarkFolder>(`${this.baseUrl}/folders`, data);
    return response.data;
  }

  /**
   * 更新收藏夹
   */
  async updateFolder(folderId: string, data: UpdateFolderDto): Promise<BookmarkFolder> {
    const response = await apiClient.patch<BookmarkFolder>(`${this.baseUrl}/folders/${folderId}`, data);
    return response.data;
  }

  /**
   * 删除收藏夹
   */
  async deleteFolder(folderId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/folders/${folderId}`);
  }

  /**
   * 移动收藏到其他收藏夹
   */
  async moveToFolder(bookmarkId: string, folderId: string): Promise<Bookmark> {
    const response = await apiClient.patch<Bookmark>(`${this.baseUrl}/${bookmarkId}/move`, {
      folderId,
    });
    return response.data;
  }

  /**
   * 批量删除收藏
   */
  async batchRemove(bookmarkIds: string[]): Promise<void> {
    await apiClient.post(`${this.baseUrl}/batch-delete`, { bookmarkIds });
  }

  /**
   * 检查是否已收藏
   */
  async checkIsBookmarked(targetId: string, targetType: 'post' | 'comment'): Promise<boolean> {
    const response = await apiClient.get<{ isBookmarked: boolean }>(`${this.baseUrl}/check`, {
      params: { targetId, targetType },
    });
    return response.data.isBookmarked;
  }

  /**
   * 获取收藏夹详情
   */
  async getFolderDetail(folderId: string): Promise<BookmarkFolder & { bookmarks: BookmarkItem[] }> {
    const response = await apiClient.get<BookmarkFolder & { bookmarks: BookmarkItem[] }>(
      `${this.baseUrl}/folders/${folderId}`
    );
    return response.data;
  }

  /**
   * 搜索收藏
   */
  async searchBookmarks(query: string, page = 1, pageSize = 20): Promise<BookmarksListResponse> {
    const response = await apiClient.get<BookmarksListResponse>(`${this.baseUrl}/search`, {
      params: { query, page, pageSize },
    });
    return response.data;
  }

  /**
   * 导出收藏
   */
  async exportBookmarks(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }
}

export const bookmarkService = new BookmarkService();
