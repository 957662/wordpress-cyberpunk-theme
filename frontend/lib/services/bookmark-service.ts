/**
 * Bookmark Service
 * 书签服务 - 管理用户书签
 */

export interface Bookmark {
  id: string;
  type: 'post' | 'portfolio' | 'page';
  itemId: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  createdAt: Date;
  tags?: string[];
}

class BookmarkService {
  private bookmarks: Bookmark[] = [];
  private listeners: Set<(bookmarks: Bookmark[]) => void> = new Set();
  private static instance: BookmarkService;
  private readonly STORAGE_KEY = 'bookmarks';

  private constructor() {
    this.load();
  }

  static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  private load() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.bookmarks = JSON.parse(saved).map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.bookmarks));
      this.notify();
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.bookmarks]));
  }

  subscribe(listener: (bookmarks: Bookmark[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  add(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): string {
    // 检查是否已存在
    const exists = this.bookmarks.some(
      b => b.type === bookmark.type && b.itemId === bookmark.itemId
    );

    if (exists) {
      throw new Error('Bookmark already exists');
    }

    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.type}-${bookmark.itemId}-${Date.now()}`,
      createdAt: new Date(),
    };

    this.bookmarks.unshift(newBookmark);
    this.save();
    return newBookmark.id;
  }

  remove(id: string): boolean {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookmarks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  removeByItem(type: Bookmark['type'], itemId: string): boolean {
    const index = this.bookmarks.findIndex(
      b => b.type === type && b.itemId === itemId
    );
    if (index !== -1) {
      this.bookmarks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  exists(type: Bookmark['type'], itemId: string): boolean {
    return this.bookmarks.some(
      b => b.type === type && b.itemId === itemId
    );
  }

  toggle(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): boolean {
    if (this.exists(bookmark.type, bookmark.itemId)) {
      this.removeByItem(bookmark.type, bookmark.itemId);
      return false;
    } else {
      this.add(bookmark);
      return true;
    }
  }

  getAll(): Bookmark[] {
    return [...this.bookmarks];
  }

  getByType(type: Bookmark['type']): Bookmark[] {
    return this.bookmarks.filter(b => b.type === type);
  }

  getByTag(tag: string): Bookmark[] {
    return this.bookmarks.filter(b => b.tags?.includes(tag));
  }

  search(query: string): Bookmark[] {
    const lowerQuery = query.toLowerCase();
    return this.bookmarks.filter(b =>
      b.title.toLowerCase().includes(lowerQuery) ||
      b.excerpt?.toLowerCase().includes(lowerQuery) ||
      b.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  getCount(): number {
    return this.bookmarks.length;
  }

  clear(): void {
    this.bookmarks = [];
    this.save();
  }

  export(): string {
    return JSON.stringify(this.bookmarks, null, 2);
  }

  import(data: string): number {
    try {
      const imported = JSON.parse(data) as Bookmark[];
      let added = 0;

      imported.forEach(bookmark => {
        try {
          this.add(bookmark);
          added++;
        } catch (error) {
          // 跳过已存在的书签
        }
      });

      return added;
    } catch (error) {
      console.error('Failed to import bookmarks:', error);
      return 0;
    }
  }
}

// 导出单例
export const bookmarkService = BookmarkService.getInstance();

// 导出便捷 Hook
export function useBookmarks() {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);

  React.useEffect(() => {
    return bookmarkService.subscribe(setBookmarks);
  }, []);

  return {
    bookmarks,
    add: bookmarkService.add.bind(bookmarkService),
    remove: bookmarkService.remove.bind(bookmarkService),
    removeByItem: bookmarkService.removeByItem.bind(bookmarkService),
    exists: bookmarkService.exists.bind(bookmarkService),
    toggle: bookmarkService.toggle.bind(bookmarkService),
    getAll: bookmarkService.getAll.bind(bookmarkService),
    getByType: bookmarkService.getByType.bind(bookmarkService),
    getByTag: bookmarkService.getByTag.bind(bookmarkService),
    search: bookmarkService.search.bind(bookmarkService),
    getCount: bookmarkService.getCount.bind(bookmarkService),
    clear: bookmarkService.clear.bind(bookmarkService),
    export: bookmarkService.export.bind(bookmarkService),
    import: bookmarkService.import.bind(bookmarkService),
  };
}
