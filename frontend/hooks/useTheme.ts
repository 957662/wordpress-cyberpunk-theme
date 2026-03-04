import { useDarkMode } from './useDarkMode';

/**
 * 主题 Hook
 */
export function useTheme() {
  const { isDark, toggle } = useDarkMode();

  return {
    theme: isDark ? 'dark' : 'light',
    isDark,
    isLight: !isDark,
    setTheme: (theme: 'light' | 'dark') => {
      if (theme === 'dark' && !isDark) {
        toggle();
      } else if (theme === 'light' && isDark) {
        toggle();
      }
    },
    toggle,
  };
}
