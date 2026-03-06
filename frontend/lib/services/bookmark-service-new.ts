/**
 * 收藏服务
 * 处理收藏相关的API调用
 */

import { httpClient } from '../http-client';
import {
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  BookmarkResponse,
  BookmarkStatusResponse,
  BookmarkListResponse,
  SearchBookmarksRequest,
  BookmarkTargetType,
} from '@/types/bookmark.types';

export class BookmarkService {
  private baseUrl = '/api/v1/bookmarks';

  /**
   * 创建收藏
   */
  async createBookmark(request: CreateBookmarkRequest): Promise<BookmarkResponse> {
    return await httpClient.post<BookmarkResponse>(this.baseUrl, {
      target_type: request.target_type,
      target_id: String(request.target_id),
      notes: request.notes,
    });
  }

  /**
   * 更新收藏
   */
  async updateBookmark(bookmarkId: string, request: UpdateBookmarkRequest): Promise<BookmarkResponse> {
    return await httpClient.put<BookmarkResponse>(`${this.baseUrl}/${bookmarkId}`, request);
  }

  /**
   * 删除收藏（通过ID）
   */
  async deleteBookmark(bookmarkId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${bookmarkId}`);
  }

  /**
   * 根据目标删除收藏
   */
  async deleteBookmarkByTarget(targetType: BookmarkTargetType, targetId: string | number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/target/${targetType}/${targetId}`);
  }

  /**
   * 切换收藏状态
   */
  async toggleBookmark(targetType: BookmarkTargetType, targetId: string | number, notes?: string): Promise<BookmarkStatusResponse> {
    return await httpClient.post<BookmarkStatusResponse>(`${this.baseUrl}/toggle/${targetType}/${targetId}`, notes ? { notes } : {});
  }

  /**
   * 获取收藏状态
   */
  async getBookmarkStatus(targetType: BookmarkTargetType, targetId: string | number): Promise<BookmarkStatusResponse> {
    return await httpClient.get<BookmarkStatusResponse>(`${this.baseUrl}/status/${targetType}/${targetId}`);
  }

  /**
   * 获取我的收藏列表
   */
  async getMyBookmarks(skip = 0, limit = 20, targetType?: BookmarkTargetType): Promise<BookmarkListResponse> {
    const params: any = { skip, limit };
    if (targetType) {
      params.target_type = targetType;
    }
    return await httpClient.get<BookmarkListResponse>(`${this.baseUrl}/my`, { params });
  }

  /**
   * 获取收藏详情
   */
  async getBookmarkById(bookmarkId: string): Promise<BookmarkResponse> {
    return await httpClient.get<BookmarkResponse>(`${this.baseUrl}/${bookmarkId}`);
  }

  /**
   * 搜索收藏
   */
  async searchBookmarks(request: SearchBookmarksRequest): Promise<BookmarkListResponse> {
    const params: any = {};
    if (request.query) params.query = request.query;
    if (request.target_type) params.target_type = request.target_type;
    if (request.page) params.skip = (request.page - 1) * (request.per_page || 20);
    if (request.per_page) params.limit = request.per_page;

    return await httpClient.get<BookmarkListResponse>(`${this.baseUrl}/search`, { params });
  }

  /**
   * 批量获取收藏状态
   */
  async getBatchBookmarkStatus(targets: Array<{ targetType: BookmarkTargetType; targetId: string | number }>): Promise<Map<string, boolean>> {
    // 注意：如果后端不支持批量接口，可以使用 Promise.all 并行请求
    const promises = targets.map(({ targetType, targetId }) =>
      this.getBookmarkStatus(targetType, targetId).then(res => ({
        key: `${targetType}:${targetId}`,
        isBookmarked: res.is_bookmarked,
      }))
    );

    const results = await Promise.all(promises);
    const statusMap = new Map<string, boolean>();

    results.forEach(({ key, isBookmarked }) => {
      statusMap.set(key, isBookmarked);
    });

    return statusMap;
  }
}

// 导出单例
export const bookmarkService = new BookmarkService();
