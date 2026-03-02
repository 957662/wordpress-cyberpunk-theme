/**
 * 搜索 Store
 * 用于管理搜索状态
 */

import { create } from 'zustand';
import { SearchFilters } from '@/types';

interface SearchStore {
  query: string;
  filters: SearchFilters;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const defaultFilters: SearchFilters = {
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  filters: defaultFilters,
  recentSearches: [],
  setQuery: query => set({ query }),
  setFilters: filters =>
    set(state => ({
      filters: { ...state.filters, ...filters },
    })),
  clearFilters: () => set({ filters: defaultFilters, query: '' }),
  addRecentSearch: query => {
    set(state => {
      const filtered = state.recentSearches.filter(s => s !== query);
      const recentSearches = [query, ...filtered].slice(0, 10);
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      }
      return { recentSearches };
    });
  },
  removeRecentSearch: query =>
    set(state => ({
      recentSearches: state.recentSearches.filter(s => s !== query),
    })),
  clearRecentSearches: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
    set({ recentSearches: [] });
  },
}));

// 初始化时从 localStorage 加载最近搜索
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('recentSearches');
  if (saved) {
    try {
      useSearchStore.setState({ recentSearches: JSON.parse(saved) });
    } catch {
      // Ignore parse errors
    }
  }
}
