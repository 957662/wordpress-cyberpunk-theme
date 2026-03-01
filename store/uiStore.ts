/**
 * UI 状态管理
 */

import { create } from 'zustand';

interface UIState {
  // 菜单状态
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  // 搜索状态
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;

  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 滚动状态
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;

  // 当前页面
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  isScrolled: false,
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),

  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
}));
