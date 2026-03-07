/**
 * Bookmark Service
 * 收藏相关 API 服务
 */

import { apiClient } from './api-client';
import type { BlogPost } from '@/types/models';

// ============================================================================
// Types
// ============================================================================

export interface Bookmark {
  id: string;
  postId: string;
  post: BlogPost;
  createdAt: string;
  category?: string;
  notes?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface CreateBookmarkData {
  postId: string;
  category?: string;
  notes?: string;
}

export interface UpdateBookmarkData {
  category?: string;
  notes?: string;
}

// ============================================================================
// Bookmark Service
// ============================================================================

class BookmarkService {
  private readonly basePath = '/bookmarks';

  /**
   * 获取所有收藏
   */
  async getAllBookmarks(page = 1, limit = 20): Promise<Bookmark[]> {
    const response = await apiClient.get<{ data: Bookmark[] }>(this.basePath, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * 根据分类获取收藏
   */
  async getBookmarksByCategory(category: string, page = 1, limit = 20): Promise<Bookmark[]> {
    const response = await apiClient.get<{ data: Bookmark[] }>(
      `${this.basePath}/category/${category}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * 根据文件夹获取收藏
   */
  async getBookmarksByFolder(folderId: string, page = 1, limit = 20): Promise<Bookmark[]> {
    const response = await apiClient.get<{ data: Bookmark[] }>(
      `${this.basePath}/folder/${folderId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * 添加收藏
   */
  async addBookmark(data: CreateBookmarkData): Promise<Bookmark> {
    const response = await apiClient.post<{ data: Bookmark }>(this.basePath, data);
    return response.data;
  }

  /**
   * 移除收藏
   */
  async removeBookmark(bookmarkId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${bookmarkId}`);
  }

  /**
   * 批量移除收藏
   */
  async removeBookmarks(bookmarkIds: string[]): Promise<void> {
    await apiClient.delete(`${this.basePath}/batch`, {
      data: { ids: bookmarkIds },
    });
  }

  /**
   * 更新收藏
   */
  async updateBookmark(bookmarkId: string, data: UpdateBookmarkData): Promise<Bookmark> {
    const response = await apiClient.patch<{ data: Bookmark }>(
      `${this.basePath}/${bookmarkId}`,
      data
    );
    return response.data;
  }

  /**
   * 移动收藏到文件夹
   */
  async moveBookmarkToFolder(bookmarkId: string, folderId: string): Promise<Bookmark> {
    const response = await apiClient.patch<{ data: Bookmark }>(
      `${this.basePath}/${bookmarkId}`,
      { folderId }
    );
    return response.data;
  }

  /**
   * 检查文章是否已收藏
   */
  async isBookmarked(postId: string): Promise<boolean> {
    try {
      await apiClient.get(`${this.basePath}/check/${postId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 切换收藏状态
   */
  async toggleBookmark(postId: string, category?: string): Promise<Bookmark | null> {
    const isBookmarked = await this.isBookmarked(postId);

    if (isBookmarked) {
      // 移除收藏
      await this.removeBookmarkByPostId(postId);
      return null;
    } else {
      // 添加收藏
      return await this.addBookmark({ postId, category });
    }
  }

  /**
   * 根据文章 ID 移除收藏
   */
  async removeBookmarkByPostId(postId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/post/${postId}`);
  }

  /**
   * 获取收藏分类
   */
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<{ data: string[] }>(
      `${this.basePath}/categories`
    );
    return response.data;
  }

  /**
   * 创建收藏文件夹
   */
  async createFolder(name: string): Promise<BookmarkFolder> {
    const response = await apiClient.post<{ data: BookmarkFolder }>(
      `${this.basePath}/folders`,
      { name }
    );
    return response.data;
  }

  /**
   * 获取收藏文件夹
   */
  async getFolders(): Promise<BookmarkFolder[]> {
    const response = await apiClient.get<{ data: BookmarkFolder[] }>(
      `${this.basePath}/folders`
    );
    return response.data;
  }

  /**
   * 更新文件夹名称
   */
  async updateFolder(folderId: string, name: string): Promise<BookmarkFolder> {
    const response = await apiClient.patch<{ data: BookmarkFolder }>(
      `${this.basePath}/folders/${folderId}`,
      { name }
    );
    return response.data;
  }

  /**
   * 删除文件夹
   */
  async deleteFolder(folderId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/folders/${folderId}`);
  }

  /**
   * 搜索收藏
   */
  async searchBookmarks(query: string, page = 1, limit = 20): Promise<Bookmark[]> {
    const response = await apiClient.get<{ data: Bookmark[] }>(
      `${this.basePath}/search`,
      {
        params: { q: query, page, limit },
      }
    );
    return response.data;
  }
}

// 导出单例
export const bookmarkService = new BookmarkService();
