/**
 * 阅读列表服务
 * 管理"稍后阅读"和阅读历史
 */

import { storageService } from './storage.service';

export interface ReadingListItem {
  postId: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: string;
  category?: string;
  author?: string;
  publishedAt: string;
  addedAt: string;
  tags?: string[];
  estimatedReadTime?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ReadingHistoryItem {
  postId: string;
  title: string;
  slug: string;
  visitedAt: string;
  readTime?: number;
  progress: number; // 阅读进度 0-100
  completed: boolean;
}

export interface ReadingStats {
  totalRead: number;
  totalTime: number; // 分钟
  thisWeek: number;
  thisMonth: number;
  topCategories: Array<{ category: string; count: number }>;
}

/**
 * 阅读列表服务类
 */
class ReadingListService {
  private readonly READING_LIST_KEY = 'cyberpress_reading_list';
  private readonly READING_HISTORY_KEY = 'cyberpress_reading_history';
  private readonly STORAGE_VERSION = 'v1';

  /**
   * 获取阅读列表
   */
  getReadingList(): ReadingListItem[] {
    const data = storageService.get<{
      version: string;
      items: ReadingListItem[];
    }>(this.READING_LIST_KEY);

    if (!data || data.version !== this.STORAGE_VERSION) {
      return [];
    }

    // 按优先级和添加时间排序
    return (data.items || []).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      // 相同优先级按添加时间排序（新的在前）
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }

  /**
   * 添加到阅读列表
   */
  addToReadingList(item: Omit<ReadingListItem, 'addedAt'>): boolean {
    const list = this.getReadingList();

    // 检查是否已存在
    if (list.some((i) => i.postId === item.postId)) {
      return false;
    }

    const newItem: ReadingListItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    list.push(newItem);
    this.saveReadingList(list);

    return true;
  }

  /**
   * 从阅读列表移除
   */
  removeFromReadingList(postId: string): boolean {
    const list = this.getReadingList();
    const filtered = list.filter((item) => item.postId !== postId);

    if (filtered.length === list.length) {
      return false; // 没有找到
    }

    this.saveReadingList(filtered);
    return true;
  }

  /**
   * 更新阅读列表项
   */
  updateReadingListItem(
    postId: string,
    updates: Partial<Pick<ReadingListItem, 'priority' | 'estimatedReadTime'>>
  ): boolean {
    const list = this.getReadingList();
    const index = list.findIndex((item) => item.postId === postId);

    if (index === -1) {
      return false;
    }

    list[index] = {
      ...list[index],
      ...updates,
    };

    this.saveReadingList(list);
    return true;
  }

  /**
   * 清空阅读列表
   */
  clearReadingList(): void {
    storageService.remove(this.READING_LIST_KEY);
  }

  /**
   * 检查文章是否在阅读列表中
   */
  isInReadingList(postId: string): boolean {
    const list = this.getReadingList();
    return list.some((item) => item.postId === postId);
  }

  /**
   * 获取阅读历史
   */
  getReadingHistory(limit?: number): ReadingHistoryItem[] {
    const data = storageService.get<{
      version: string;
      history: ReadingHistoryItem[];
    }>(this.READING_HISTORY_KEY);

    if (!data || data.version !== this.STORAGE_VERSION) {
      return [];
    }

    const history = (data.history || []).sort(
      (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
    );

    return limit ? history.slice(0, limit) : history;
  }

  /**
   * 添加到阅读历史
   */
  addToReadingHistory(item: ReadingHistoryItem): void {
    const history = this.getReadingHistory();

    // 移除旧记录（如果存在）
    const filtered = history.filter((h) => h.postId !== item.postId);

    // 添加新记录到开头
    filtered.unshift(item);

    // 限制历史记录数量（最多保留 500 条）
    const limited = filtered.slice(0, 500);

    this.saveReadingHistory(limited);
  }

  /**
   * 更新阅读进度
   */
  updateReadingProgress(postId: string, progress: number): void {
    const history = this.getReadingHistory();
    const item = history.find((h) => h.postId === postId);

    if (item) {
      item.progress = Math.min(100, Math.max(0, progress));
      item.completed = item.progress >= 100;
      this.saveReadingHistory(history);
    }
  }

  /**
   * 标记文章为已读
   */
  markAsRead(postId: string, readTime?: number): void {
    const history = this.getReadingHistory();
    const item = history.find((h) => h.postId === postId);

    if (item) {
      item.completed = true;
      item.progress = 100;
      if (readTime) {
        item.readTime = readTime;
      }
      this.saveReadingHistory(history);
    }
  }

  /**
   * 清空阅读历史
   */
  clearReadingHistory(): void {
    storageService.remove(this.READING_HISTORY_KEY);
  }

  /**
   * 获取阅读统计
   */
  getReadingStats(): ReadingStats {
    const history = this.getReadingHistory();

    const completed = history.filter((h) => h.completed);
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    const thisMonthStart = new Date();
    thisMonthStart.setMonth(thisMonthStart.getMonth() - 1);

    const thisWeekCount = completed.filter(
      (h) => new Date(h.visitedAt) >= thisWeekStart
    ).length;

    const thisMonthCount = completed.filter(
      (h) => new Date(h.visitedAt) >= thisMonthStart
    ).length;

    const totalTime = completed.reduce((sum, h) => sum + (h.readTime || 0), 0);

    // 统计分类
    const categoryMap = new Map<string, number>();
    completed.forEach((h) => {
      // 这里需要从其他地方获取文章的分类信息
      // 暂时跳过
    });

    return {
      totalRead: completed.length,
      totalTime,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      topCategories: Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    };
  }

  /**
   * 获取继续阅读的文章
   */
  getContinueReading(limit = 5): ReadingHistoryItem[] {
    const history = this.getReadingHistory();

    return history
      .filter((h) => h.progress > 0 && !h.completed)
      .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
      .slice(0, limit);
  }

  /**
   * 导出阅读列表
   */
  exportReadingList(): string {
    const list = this.getReadingList();
    return JSON.stringify(list, null, 2);
  }

  /**
   * 导入阅读列表
   */
  importReadingList(jsonData: string): boolean {
    try {
      const items = JSON.parse(jsonData) as ReadingListItem[];

      if (!Array.isArray(items)) {
        throw new Error('Invalid data format');
      }

      // 验证数据格式
      const validItems = items.filter(
        (item) =>
          item.postId &&
          item.title &&
          item.slug &&
          typeof item.postId === 'string' &&
          typeof item.title === 'string' &&
          typeof item.slug === 'string'
      );

      this.saveReadingList(validItems);
      return true;
    } catch (error) {
      console.error('Failed to import reading list:', error);
      return false;
    }
  }

  /**
   * 同步到服务器（如果支持）
   */
  async syncToServer(): Promise<void> {
    try {
      const list = this.getReadingList();

      await fetch('/api/reading-list/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ list }),
      });
    } catch (error) {
      console.error('Failed to sync reading list:', error);
    }
  }

  /**
   * 从服务器同步（如果支持）
   */
  async syncFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/reading-list/sync');

      if (response.ok) {
        const data = await response.json();

        if (data.list) {
          this.saveReadingList(data.list);
        }
      }
    } catch (error) {
      console.error('Failed to sync reading list from server:', error);
    }
  }

  /**
   * 保存阅读列表
   */
  private saveReadingList(list: ReadingListItem[]): void {
    storageService.set(this.READING_LIST_KEY, {
      version: this.STORAGE_VERSION,
      items: list,
    });
  }

  /**
   * 保存阅读历史
   */
  private saveReadingHistory(history: ReadingHistoryItem[]): void {
    storageService.set(this.READING_HISTORY_KEY, {
      version: this.STORAGE_VERSION,
      history,
    });
  }
}

// 导出单例实例
export const readingListService = new ReadingListService();
