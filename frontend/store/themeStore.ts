/**
 * 主题状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'cyber' | 'neon' | 'matrix';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'cyber',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const themes: Theme[] = ['cyber', 'neon', 'matrix'];
        const currentIndex = themes.indexOf(get().theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ theme: themes[nextIndex] });
      },
    }),
    {
      name: 'cyberpress-theme',
    }
  )
);
