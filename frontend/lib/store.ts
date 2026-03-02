/**
 * 全局状态管理 - Zustand Store
 */

import { create } from 'zustand';

// 主题类型
export type Theme = 'dark' | 'neon';

// 界面状态
interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  searchOpen: boolean;
  loading: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setLoading: (loading: boolean) => void;
}

// 用户状态
interface UserState {
  user: {
    id: number | null;
    name: string | null;
    email: string | null;
    avatar: string | null;
    token: string | null;
  };
  isAuthenticated: boolean;

  // Actions
  setUser: (user: Partial<UserState['user']>) => void;
  logout: () => void;
}

// UI Store
export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  searchOpen: false,
  loading: false,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
  closeSearch: () => set({ searchOpen: false }),
  setLoading: (loading) => set({ loading }),
}));

// User Store
export const useUserStore = create<UserState>((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
    avatar: null,
    token: null,
  },
  isAuthenticated: false,

  setUser: (userData) => set((state) => ({
    user: { ...state.user, ...userData },
    isAuthenticated: !!userData.token,
  })),

  logout: () => set({
    user: {
      id: null,
      name: null,
      email: null,
      avatar: null,
      token: null,
    },
    isAuthenticated: false,
  }),
}));
