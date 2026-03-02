import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 应用全局状态管理
 *
 * 使用 Zustand 进行状态管理，支持持久化存储
 */

// 用户状态
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

interface AppState {
  // 用户相关
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // 主题相关
  theme: 'light' | 'dark' | 'cyber';
  setTheme: (theme: 'light' | 'dark' | 'cyber') => void;

  // 语言相关
  locale: 'zh' | 'en';
  setLocale: (locale: 'zh' | 'en') => void;

  // 侧边栏状态
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // 搜索状态
  searchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;

  // 书签列表
  bookmarks: string[];
  addBookmark: (postId: string) => void;
  removeBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;

  // 最近查看
  recentPosts: string[];
  addRecentPost: (postId: string) => void;
  clearRecentPosts: () => void;

  // 通知设置
  notificationsEnabled: boolean;
  toggleNotifications: () => void;

  // 性能设置
  reduceMotion: boolean;
  toggleReduceMotion: () => void;

  // 数据加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 错误状态
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 用户初始状态
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // 主题初始状态
      theme: 'cyber',
      setTheme: (theme) => {
        set({ theme });
        // 应用主题到 DOM
        document.documentElement.classList.remove('light', 'dark', 'cyber');
        document.documentElement.classList.add(theme);
      },

      // 语言初始状态
      locale: 'zh',
      setLocale: (locale) => set({ locale }),

      // 侧边栏初始状态
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // 搜索初始状态
      searchOpen: false,
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setSearchOpen: (open) => set({ searchOpen: open }),

      // 书签初始状态
      bookmarks: [],
      addBookmark: (postId) =>
        set((state) => ({
          bookmarks: [...new Set([...state.bookmarks, postId])],
        })),
      removeBookmark: (postId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((id) => id !== postId),
        })),
      isBookmarked: (postId) => get().bookmarks.includes(postId),

      // 最近查看初始状态
      recentPosts: [],
      addRecentPost: (postId) =>
        set((state) => ({
          recentPosts: [postId, ...state.recentPosts.filter((id) => id !== postId)].slice(0, 10),
        })),
      clearRecentPosts: () => set({ recentPosts: [] }),

      // 通知设置初始状态
      notificationsEnabled: true,
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      // 性能设置初始状态
      reduceMotion: false,
      toggleReduceMotion: () =>
        set((state) => ({ reduceMotion: !state.reduceMotion })),

      // 加载状态初始状态
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // 错误状态初始状态
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'cyberpress-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化部分字段
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        bookmarks: state.bookmarks,
        recentPosts: state.recentPosts,
        notificationsEnabled: state.notificationsEnabled,
        reduceMotion: state.reduceMotion,
      }),
    }
  )
);

// 便捷 hooks
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLocale = () => useAppStore((state) => state.locale);
export const useSidebar = () => useAppStore((state) => state.sidebarOpen);
export const useSearch = () => useAppStore((state) => state.searchOpen);
export const useBookmarks = () => useAppStore((state) => state.bookmarks);
export const useRecentPosts = () => useAppStore((state) => state.recentPosts);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);

// Action hooks
export const useActions = () => ({
  setUser: useAppStore((state) => state.setUser),
  logout: useAppStore((state) => state.logout),
  setTheme: useAppStore((state) => state.setTheme),
  setLocale: useAppStore((state) => state.setLocale),
  toggleSidebar: useAppStore((state) => state.toggleSidebar),
  setSidebarOpen: useAppStore((state) => state.setSidebarOpen),
  toggleSearch: useAppStore((state) => state.toggleSearch),
  setSearchOpen: useAppStore((state) => state.setSearchOpen),
  addBookmark: useAppStore((state) => state.addBookmark),
  removeBookmark: useAppStore((state) => state.removeBookmark),
  isBookmarked: useAppStore((state) => state.isBookmarked),
  addRecentPost: useAppStore((state) => state.addRecentPost),
  clearRecentPosts: useAppStore((state) => state.clearRecentPosts),
  toggleNotifications: useAppStore((state) => state.toggleNotifications),
  toggleReduceMotion: useAppStore((state) => state.toggleReduceMotion),
  setIsLoading: useAppStore((state) => state.setIsLoading),
  setError: useAppStore((state) => state.setError),
});

export default useAppStore;
