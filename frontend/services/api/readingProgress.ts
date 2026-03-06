/**
 * 阅读进度 API 服务
 * 用于跟踪和管理用户的文章阅读进度
 */

import { apiClient } from '../client';

export interface ReadingProgress {
  id: string;
  userId: string;
  articleId: string;
  articleTitle: string;
  progress: number; // 0-100
  lastPosition: number; // 像素位置
  totalTime: number; // 总阅读时间（秒）
  lastReadAt: string;
  completed: boolean;
}

export interface CreateReadingProgressDto {
  articleId: string;
  articleTitle: string;
  progress?: number;
  lastPosition?: number;
}

export interface UpdateReadingProgressDto {
  progress?: number;
  lastPosition?: number;
  totalTime?: number;
  completed?: boolean;
}

/**
 * 阅读进度 API 类
 */
export class ReadingProgressApi {
  private readonly basePath = '/reading-progress';

  /**
   * 获取用户的所有阅读进度
   */
  async getAllProgress(): Promise<ReadingProgress[]> {
    const response = await apiClient.get<ReadingProgress[]>(`${this.basePath}`);
    return response.data;
  }

  /**
   * 获取特定文章的阅读进度
   */
  async getArticleProgress(articleId: string): Promise<ReadingProgress | null> {
    try {
      const response = await apiClient.get<ReadingProgress>(
        `${this.basePath}/article/${articleId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const status = (error as any).response?.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * 创建或更新阅读进度
   */
  async upsertProgress(
    data: CreateReadingProgressDto & UpdateReadingProgressDto
  ): Promise<ReadingProgress> {
    const response = await apiClient.post<ReadingProgress>(
      `${this.basePath}/upsert`,
      data
    );
    return response.data;
  }

  /**
   * 更新阅读进度
   */
  async updateProgress(
    articleId: string,
    data: UpdateReadingProgressDto
  ): Promise<ReadingProgress> {
    const response = await apiClient.patch<ReadingProgress>(
      `${this.basePath}/article/${articleId}`,
      data
    );
    return response.data;
  }

  /**
   * 批量更新阅读进度
   */
  async batchUpdateProgress(
    updates: Array<{ articleId: string } & UpdateReadingProgressDto>
  ): Promise<ReadingProgress[]> {
    const response = await apiClient.patch<ReadingProgress[]>(
      `${this.basePath}/batch`,
      { updates }
    );
    return response.data;
  }

  /**
   * 标记文章为已读
   */
  async markAsCompleted(articleId: string): Promise<ReadingProgress> {
    const response = await apiClient.post<ReadingProgress>(
      `${this.basePath}/article/${articleId}/complete`
    );
    return response.data;
  }

  /**
   * 删除阅读进度
   */
  async deleteProgress(articleId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/article/${articleId}`);
  }

  /**
   * 清除所有阅读进度
   */
  async clearAllProgress(): Promise<void> {
    await apiClient.delete(`${this.basePath}`);
  }

  /**
   * 获取阅读统计
   */
  async getReadingStats(): Promise<{
    totalArticles: number;
    completedArticles: number;
    inProgressArticles: number;
    totalReadingTime: number;
    averageProgress: number;
  }> {
    const response = await apiClient.get(`${this.basePath}/stats`);
    return response.data;
  }

  /**
   * 获取正在阅读的文章列表
   */
  async getInProgressArticles(): Promise<ReadingProgress[]> {
    const response = await apiClient.get<ReadingProgress[]>(
      `${this.basePath}/in-progress`
    );
    return response.data;
  }

  /**
   * 获取已完成的文章列表
   */
  async getCompletedArticles(): Promise<ReadingProgress[]> {
    const response = await apiClient.get<ReadingProgress[]>(
      `${this.basePath}/completed`
    );
    return response.data;
  }

  /**
   * 导出阅读进度数据
   */
  async exportProgress(): Promise<Blob> {
    const response = await apiClient.get(`${this.basePath}/export`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * 导入阅读进度数据
   */
  async importProgress(file: File): Promise<{ imported: number; failed: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`${this.basePath}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// 导出单例实例
export const readingProgressApi = new ReadingProgressApi();

// 导出默认实例
export default readingProgressApi;
