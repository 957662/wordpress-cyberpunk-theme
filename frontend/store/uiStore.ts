/**
 * UI 状态管理
 * 使用 Zustand 管理全局 UI 状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 主题类型
export type Theme = 'cyber' | 'neon' | 'matrix' | 'light';

// 侧边栏状态
interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

// 模态框状态
interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

// 通知状态
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

// UI 状态接口
interface UIState {
  // 主题
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // 侧边栏
  sidebar: SidebarState;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;

  // 模态框
  modal: ModalState;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;

  // 通知
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // 加载状态
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // 搜索状态
  isSearchOpen: boolean;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;

  // 移动菜单
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  // 滚动位置
  scrollY: number;
  setScrollY: (scrollY: number) => void;

  // 面包屑
  breadcrumbs: Array<{ label: string; href?: string }>;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void;

  // 页面标题
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // 初始状态
      theme: 'cyber',
      sidebar: {
        isOpen: true,
        isCollapsed: false,
      },
      modal: {
        isOpen: false,
      },
      notifications: [],
      isLoading: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      scrollY: 0,
      breadcrumbs: [],
      pageTitle: 'CyberPress',

      // 主题操作
      setTheme: (theme) => {
        set({ theme });
        // 更新 HTML 类名
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('theme-cyber', 'theme-neon', 'theme-matrix', 'theme-light');
          document.documentElement.classList.add(`theme-${theme}`);
        }
      },

      // 侧边栏操作
      toggleSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
        }));
      },
      openSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: true },
        }));
      },
      closeSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: false },
        }));
      },
      collapseSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed: true },
        }));
      },
      expandSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed: false },
        }));
      },

      // 模态框操作
      openModal: (type, data) => {
        set({
          modal: {
            isOpen: true,
            type,
            data,
          },
        });
      },
      closeModal: () => {
        set({
          modal: {
            isOpen: false,
          },
        });
      },

      // 通知操作
      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { ...notification, id };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // 自动移除通知
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // 加载状态
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // 搜索操作
      toggleSearch: () => {
        set((state) => ({ isSearchOpen: !state.isSearchOpen }));
      },
      openSearch: () => {
        set({ isSearchOpen: true });
      },
      closeSearch: () => {
        set({ isSearchOpen: false });
      },

      // 移动菜单操作
      toggleMobileMenu: () => {
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },
      openMobileMenu: () => {
        set({ isMobileMenuOpen: true });
      },
      closeMobileMenu: () => {
        set({ isMobileMenuOpen: false });
      },

      // 滚动位置
      setScrollY: (scrollY) => {
        set({ scrollY });
      },

      // 面包屑
      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },

      // 页面标题
      setPageTitle: (pageTitle) => {
        set({ pageTitle });
        // 更新 document.title
        if (typeof document !== 'undefined') {
          document.title = `${pageTitle} | CyberPress`;
        }
      },
    }),
    {
      name: 'cyberpress-ui',
      // 只持久化特定字段
      partialize: (state) => ({
        theme: state.theme,
        sidebar: state.sidebar,
      }),
    }
  )
);

// 选择器 hooks
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebar = () => useUIStore((state) => state.sidebar);
export const useModal = () => useUIStore((state) => state.modal);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useIsLoading = () => useUIStore((state) => state.isLoading);
export const useSearchOpen = () => useUIStore((state) => state.isSearchOpen);
export const useMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useScrollY = () => useUIStore((state) => state.scrollY);
export const useBreadcrumbs = () => useUIStore((state) => state.breadcrumbs);
export const usePageTitle = () => useUIStore((state) => state.pageTitle);

// Action hooks
export const useThemeActions = () => useUIStore((state) => ({ setTheme: state.setTheme }));
export const useSidebarActions = () =>
  useUIStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    openSidebar: state.openSidebar,
    closeSidebar: state.closeSidebar,
    collapseSidebar: state.collapseSidebar,
    expandSidebar: state.expandSidebar,
  }));
export const useModalActions = () =>
  useUIStore((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));
export const useNotificationActions = () =>
  useUIStore((state) => ({
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));
export const useSearchActions = () =>
  useUIStore((state) => ({
    toggleSearch: state.toggleSearch,
    openSearch: state.openSearch,
    closeSearch: state.closeSearch,
  }));
