/**
 * 阅读进度同步服务
 *
 * 负责管理用户阅读进度的存储、同步和持久化
 */

export interface ReadingProgressData {
  /** 文章ID */
  articleId: string;
  /** 阅读进度百分比 */
  progress: number;
  /** 阅读时长（秒） */
  readingTime: number;
  /** 最后阅读位置 */
  lastPosition: number;
  /** 最后阅读时间 */
  lastReadAt: string;
  /** 是否已完成 */
  isCompleted: boolean;
}

export interface ReadingHistoryItem {
  id: string;
  articleId: string;
  title: string;
  slug: string;
  progress: number;
  readingTime: number;
  lastReadAt: string;
  isCompleted: boolean;
  coverImage?: string;
}

export interface ReadingStats {
  totalArticles: number;
  totalReadingTime: number;
  weeklyArticles: number;
  readingStreak: number;
  completionRate: number;
  achievements: number;
}

class ReadingProgressService {
  private static instance: ReadingProgressService;
  private readonly STORAGE_KEY = 'reading_progress';
  private readonly HISTORY_KEY = 'reading_history';
  private readonly STATS_KEY = 'reading_stats';

  private progressCache: Map<string, ReadingProgressData> = new Map();
  private syncInProgress: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadFromStorage();
    this.setupAutoSync();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ReadingProgressService {
    if (!ReadingProgressService.instance) {
      ReadingProgressService.instance = new ReadingProgressService();
    }
    return ReadingProgressService.instance;
  }

  /**
   * 从本地存储加载数据
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const progressData = localStorage.getItem(this.STORAGE_KEY);
      if (progressData) {
        const data = JSON.parse(progressData);
        Object.entries(data).forEach(([key, value]) => {
          this.progressCache.set(key, value as ReadingProgressData);
        });
      }
    } catch (error) {
      console.error('加载阅读进度失败:', error);
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = Object.fromEntries(this.progressCache);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('保存阅读进度失败:', error);
    }
  }

  /**
   * 设置自动同步
   */
  private setupAutoSync(): void {
    // 每30秒自动同步一次
    if (typeof window !== 'undefined') {
      this.syncTimer = setInterval(() => {
        this.syncToServer();
      }, 30000);
    }
  }

  /**
   * 清理定时器
   */
  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * 更新阅读进度
   */
  public updateProgress(
    articleId: string,
    progress: number,
    additionalTime: number = 0,
    lastPosition: number = 0
  ): void {
    const existingData = this.progressCache.get(articleId);
    const isCompleted = progress >= 100;

    const data: ReadingProgressData = {
      articleId,
      progress: Math.min(100, Math.max(0, progress)),
      readingTime: (existingData?.readingTime || 0) + additionalTime,
      lastPosition,
      lastReadAt: new Date().toISOString(),
      isCompleted,
    };

    this.progressCache.set(articleId, data);
    this.saveToStorage();

    // 如果文章完成，触发统计更新
    if (isCompleted && !existingData?.isCompleted) {
      this.updateStats(true);
    }
  }

  /**
   * 获取文章阅读进度
   */
  public getProgress(articleId: string): ReadingProgressData | undefined {
    return this.progressCache.get(articleId);
  }

  /**
   * 删除文章阅读进度
   */
  public deleteProgress(articleId: string): void {
    this.progressCache.delete(articleId);
    this.saveToStorage();
  }

  /**
   * 清空所有进度
   */
  public clearAllProgress(): void {
    this.progressCache.clear();
    this.saveToStorage();
    this.clearHistory();
    this.clearStats();
  }

  /**
   * 添加到阅读历史
   */
  public addToHistory(item: Omit<ReadingHistoryItem, 'id'>): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const existingIndex = history.findIndex(h => h.articleId === item.articleId);

      const historyItem: ReadingHistoryItem = {
        ...item,
        id: `${item.articleId}_${Date.now()}`,
      };

      if (existingIndex >= 0) {
        // 更新现有记录
        history[existingIndex] = historyItem;
      } else {
        // 添加新记录
        history.unshift(historyItem);
      }

      // 只保留最近100条记录
      const trimmedHistory = history.slice(0, 100);

      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('保存阅读历史失败:', error);
    }
  }

  /**
   * 获取阅读历史
   */
  public getHistory(): ReadingHistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const historyData = localStorage.getItem(this.HISTORY_KEY);
      if (historyData) {
        return JSON.parse(historyData);
      }
    } catch (error) {
      console.error('加载阅读历史失败:', error);
    }

    return [];
  }

  /**
   * 从历史中删除
   */
  public deleteFromHistory(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('删除阅读历史失败:', error);
    }
  }

  /**
   * 清空历史
   */
  public clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.HISTORY_KEY);
  }

  /**
   * 更新统计数据
   */
  private updateStats(incrementArticle: boolean = false): void {
    const stats = this.getStats();

    if (incrementArticle) {
      stats.totalArticles += 1;
    }

    // 计算完成率
    const totalProgress = Array.from(this.progressCache.values()).reduce(
      (sum, data) => sum + data.progress,
      0
    );
    stats.completionRate = this.progressCache.size > 0
      ? Math.round(totalProgress / this.progressCache.size)
      : 0;

    // 计算本周阅读文章数
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    stats.weeklyArticles = Array.from(this.progressCache.values()).filter(
      data => new Date(data.lastReadAt) > weekAgo
    ).length;

    // 计算连续阅读天数
    stats.readingStreak = this.calculateReadingStreak();

    this.saveStats(stats);
  }

  /**
   * 计算连续阅读天数
   */
  private calculateReadingStreak(): number {
    const dates = Array.from(this.progressCache.values())
      .map(data => new Date(data.lastReadAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (dates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // 检查今天或昨天是否有阅读记录
    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }

    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diffDays = Math.floor(
        (current.getTime() - next.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * 获取统计数据
   */
  public getStats(): ReadingStats {
    if (typeof window === 'undefined') {
      return {
        totalArticles: 0,
        totalReadingTime: 0,
        weeklyArticles: 0,
        readingStreak: 0,
        completionRate: 0,
        achievements: 0,
      };
    }

    try {
      const statsData = localStorage.getItem(this.STATS_KEY);
      if (statsData) {
        return JSON.parse(statsData);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }

    return {
      totalArticles: 0,
      totalReadingTime: 0,
      weeklyArticles: 0,
      readingStreak: 0,
      completionRate: 0,
      achievements: 0,
    };
  }

  /**
   * 保存统计数据
   */
  private saveStats(stats: ReadingStats): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('保存统计数据失败:', error);
    }
  }

  /**
   * 清空统计数据
   */
  public clearStats(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STATS_KEY);
  }

  /**
   * 同步到服务器
   */
  public async syncToServer(): Promise<void> {
    if (this.syncInProgress || typeof window === 'undefined') return;

    this.syncInProgress = true;

    try {
      const progressData = Object.fromEntries(this.progressCache);

      // 这里应该调用实际的API
      // await fetch('/api/reading-progress/sync', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(progressData),
      // });

      console.log('阅读进度同步成功');
    } catch (error) {
      console.error('同步阅读进度失败:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * 从服务器同步
   */
  public async syncFromServer(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // 这里应该调用实际的API
      // const response = await fetch('/api/reading-progress');
      // const data = await response.json();

      // 更新本地数据
      // this.progressCache = new Map(Object.entries(data));
      // this.saveToStorage();

      console.log('从服务器同步阅读进度成功');
    } catch (error) {
      console.error('从服务器同步阅读进度失败:', error);
    }
  }

  /**
   * 导出数据
   */
  public exportData(): string {
    const data = {
      progress: Object.fromEntries(this.progressCache),
      history: this.getHistory(),
      stats: this.getStats(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入数据
   */
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.progress) {
        this.progressCache = new Map(Object.entries(data.progress));
        this.saveToStorage();
      }

      if (data.history) {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data.history));
      }

      if (data.stats) {
        this.saveStats(data.stats);
      }

      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const readingProgressService = ReadingProgressService.getInstance();

// 导出便捷方法
export const updateReadingProgress = (
  articleId: string,
  progress: number,
  additionalTime?: number,
  lastPosition?: number
) => {
  readingProgressService.updateProgress(articleId, progress, additionalTime, lastPosition);
};

export const getReadingProgress = (articleId: string) => {
  return readingProgressService.getProgress(articleId);
};

export const getReadingHistory = () => {
  return readingProgressService.getHistory();
};

export const getReadingStats = () => {
  return readingProgressService.getStats();
};

export default ReadingProgressService;
