/**
 * 点赞/收藏服务
 * 处理文章和评论的点赞、收藏功能
 */

import { storageService } from './storage.service';

export type LikeableType = 'post' | 'comment' | 'portfolio';
export type LikeableTarget = {
  type: LikeableType;
  id: string;
};

interface LikeData {
  targetId: string;
  targetType: LikeableType;
  timestamp: number;
}

interface BookmarkData {
  postId: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string;
  createdAt: string;
  tags?: string[];
}

/**
 * 点赞收藏服务类
 */
class LikeService {
  private readonly STORAGE_KEY = 'cyberpress_likes';
  private readonly BOOKMARKS_KEY = 'cyberpress_bookmarks';
  private readonly STORAGE_VERSION = 'v1';

  /**
   * 获取所有已点赞的项目
   */
  private getLikes(): Set<string> {
    const data = storageService.get<{
      version: string;
      likes: string[];
    }>(this.STORAGE_KEY);

    if (!data || data.version !== this.STORAGE_VERSION) {
      return new Set();
    }

    return new Set(data.likes || []);
  }

  /**
   * 保存点赞数据
   */
  private saveLikes(likes: Set<string>): void {
    storageService.set(this.STORAGE_KEY, {
      version: this.STORAGE_VERSION,
      likes: Array.from(likes),
    });
  }

  /**
   * 检查是否已点赞
   */
  isLiked(target: LikeableTarget): boolean {
    const key = this.getLikeKey(target);
    const likes = this.getLikes();
    return likes.has(key);
  }

  /**
   * 点赞
   */
  async like(target: LikeableTarget): Promise<boolean> {
    const key = this.getLikeKey(target);
    const likes = this.getLikes();

    if (likes.has(key)) {
      return false; // 已经点赞过了
    }

    likes.add(key);
    this.saveLikes(likes);

    // 同步到服务器
    try {
      await this.syncLikeToServer(target, true);
    } catch (error) {
      console.error('Failed to sync like to server:', error);
      // 即使同步失败，本地状态也已更新
    }

    return true;
  }

  /**
   * 取消点赞
   */
  async unlike(target: LikeableTarget): Promise<boolean> {
    const key = this.getLikeKey(target);
    const likes = this.getLikes();

    if (!likes.has(key)) {
      return false; // 没有点赞过
    }

    likes.delete(key);
    this.saveLikes(likes);

    // 同步到服务器
    try {
      await this.syncLikeToServer(target, false);
    } catch (error) {
      console.error('Failed to sync unlike to server:', error);
    }

    return true;
  }

  /**
   * 切换点赞状态
   */
  async toggleLike(target: LikeableTarget): Promise<boolean> {
    if (this.isLiked(target)) {
      await this.unlike(target);
      return false;
    } else {
      await this.like(target);
      return true;
    }
  }

  /**
   * 获取点赞数量（从服务器）
   */
  async getLikeCount(target: LikeableTarget): Promise<number> {
    try {
      const response = await fetch(`/api/${target.type}s/${target.id}/likes`);
      if (!response.ok) return 0;

      const data = await response.json();
      return data.count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * 获取所有收藏的文章
   */
  getBookmarks(): BookmarkData[] {
    const data = storageService.get<{
      version: string;
      bookmarks: BookmarkData[];
    }>(this.BOOKMARKS_KEY);

    if (!data || data.version !== this.STORAGE_VERSION) {
      return [];
    }

    return data.bookmarks || [];
  }

  /**
   * 检查文章是否已收藏
   */
  isBookmarked(postId: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((b) => b.postId === postId);
  }

  /**
   * 添加收藏
   */
  addBookmark(bookmark: BookmarkData): void {
    const bookmarks = this.getBookmarks();

    // 检查是否已存在
    if (bookmarks.some((b) => b.postId === bookmark.postId)) {
      return;
    }

    bookmarks.unshift(bookmark); // 添加到开头
    this.saveBookmarks(bookmarks);
  }

  /**
   * 移除收藏
   */
  removeBookmark(postId: string): boolean {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter((b) => b.postId !== postId);

    if (filtered.length === bookmarks.length) {
      return false; // 没有找到
    }

    this.saveBookmarks(filtered);
    return true;
  }

  /**
   * 切换收藏状态
   */
  toggleBookmark(bookmark: BookmarkData): boolean {
    if (this.isBookmarked(bookmark.postId)) {
      this.removeBookmark(bookmark.postId);
      return false;
    } else {
      this.addBookmark(bookmark);
      return true;
    }
  }

  /**
   * 清空所有收藏
   */
  clearBookmarks(): void {
    storageService.remove(this.BOOKMARKS_KEY);
  }

  /**
   * 导出收藏数据
   */
  exportBookmarks(): string {
    const bookmarks = this.getBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  /**
   * 导入收藏数据
   */
  importBookmarks(jsonData: string): boolean {
    try {
      const bookmarks = JSON.parse(jsonData) as BookmarkData[];

      if (!Array.isArray(bookmarks)) {
        throw new Error('Invalid data format');
      }

      // 验证数据格式
      const validBookmarks = bookmarks.filter(
        (b) =>
          b.postId &&
          b.title &&
          b.slug &&
          typeof b.postId === 'string' &&
          typeof b.title === 'string' &&
          typeof b.slug === 'string'
      );

      this.saveBookmarks(validBookmarks);
      return true;
    } catch (error) {
      console.error('Failed to import bookmarks:', error);
      return false;
    }
  }

  /**
   * 同步点赞状态到服务器
   */
  private async syncLikeToServer(
    target: LikeableTarget,
    isLiked: boolean
  ): Promise<void> {
    const endpoint = `/api/${target.type}s/${target.id}/${isLiked ? 'like' : 'unlike'}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to sync like status');
    }
  }

  /**
   * 生成点赞键
   */
  private getLikeKey(target: LikeableTarget): string {
    return `${target.type}:${target.id}`;
  }

  /**
   * 保存收藏数据
   */
  private saveBookmarks(bookmarks: BookmarkData[]): void {
    storageService.set(this.BOOKMARKS_KEY, {
      version: this.STORAGE_VERSION,
      bookmarks,
    });
  }

  /**
   * 获取点赞统计
   */
  getLikeStats(): { total: number; byType: Record<LikeableType, number> } {
    const likes = this.getLikes();
    const stats = {
      total: likes.size,
      byType: {
        post: 0,
        comment: 0,
        portfolio: 0,
      } as Record<LikeableType, number>,
    };

    likes.forEach((key) => {
      const [type] = key.split(':') as [LikeableType];
      if (type in stats.byType) {
        stats.byType[type]++;
      }
    });

    return stats;
  }

  /**
   * 清空所有点赞数据
   */
  clearAllLikes(): void {
    storageService.remove(this.STORAGE_KEY);
  }
}

// 导出单例实例
export const likeService = new LikeService();
