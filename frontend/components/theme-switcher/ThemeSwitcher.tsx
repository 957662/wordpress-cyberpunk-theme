'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  ChevronDown,
  X,
  Sparkles,
  Zap,
  Flame
} from 'lucide-react';

/**
 * ThemeSwitcher - 主题切换器组件
 *
 * 功能特性：
 * - 明暗模式切换
 * - 多种赛博朋克主题
 * - 系统主题跟随
 * - 平滑过渡动画
 * - 主题预览
 * - 本地存储持久化
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface CyberTheme {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  description?: string;
}

export interface ThemeSwitcherProps {
  /** 当前主题模式 */
  currentMode?: ThemeMode;
  /** 自定义主题列表 */
  themes?: CyberTheme[];
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 显示模式 */
  variant?: 'button' | 'dropdown' | 'selector';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

// 内置赛博朋克主题
const BUILT_IN_THEMES: CyberTheme[] = [
  {
    id: 'cyber-default',
    name: '赛博默认',
    icon: <Sparkles className="w-5 h-5" />,
    colors: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      accent: '#ff0080',
      background: '#0a0a0f',
      text: '#ffffff',
    },
    description: '经典赛博朋克配色',
  },
  {
    id: 'cyber-neon',
    name: '霓虹之夜',
    icon: <Zap className="w-5 h-5" />,
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#000000',
      text: '#ffffff',
    },
    description: '高对比度霓虹配色',
  },
  {
    id: 'cyber-fire',
    name: '火焰之红',
    icon: <Flame className="w-5 h-5" />,
    colors: {
      primary: '#ff4500',
      secondary: '#ff6347',
      accent: '#ffd700',
      background: '#1a0a0a',
      text: '#ffffff',
    },
    description: '红色系火焰主题',
  },
  {
    id: 'cyber-forest',
    name: '数字森林',
    icon: <Sparkles className="w-5 h-5" />,
    colors: {
      primary: '#00ff88',
      secondary: '#00cc6a',
      accent: '#7fff00',
      background: '#0a0f0a',
      text: '#ffffff',
    },
    description: '绿色系自然主题',
  },
];

/**
 * 模式选择按钮
 */
interface ModeButtonProps {
  mode: ThemeMode;
  active: boolean;
  onClick: () => void;
  size: 'sm' | 'md' | 'lg';
}

const ModeButton: React.FC<ModeButtonProps> = ({ mode, active, onClick, size }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const icons = {
    light: <Sun size={iconSize[size]} />,
    dark: <Moon size={iconSize[size]} />,
    system: <Monitor size={iconSize[size]} />,
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all',
        active
          ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/50'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200',
        sizeClasses[size]
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icons[mode]}
    </motion.button>
  );
};

/**
 * 主题颜色预览
 */
interface ThemePreviewProps {
  theme: CyberTheme;
  active: boolean;
  onClick: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, active, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full p-3 rounded-lg border-2 transition-all',
        active
          ? 'border-cyber-cyan bg-cyber-cyan/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 主题色条 */}
      <div className="flex h-2 rounded-full overflow-hidden mb-2">
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* 主题信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ color: theme.colors.primary }}>{theme.icon}</div>
          <div className="text-left">
            <div className="text-sm font-medium text-white">{theme.name}</div>
            {theme.description && (
              <div className="text-xs text-gray-400">{theme.description}</div>
            )}
          </div>
        </div>

        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-cyber-cyan"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

/**
 * ThemeSwitcher 主组件
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentMode = 'dark',
  themes = BUILT_IN_THEMES,
  className,
  style,
  variant = 'button',
  size = 'md',
}) => {
  const [mode, setMode] = useState<ThemeMode>(currentMode);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [isOpen, setIsOpen] = useState(false);

  // 应用主题到文档
  useEffect(() => {
    const root = document.documentElement;

    // 应用明暗模式
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', mode === 'dark');
    }

    // 应用主题颜色
    root.style.setProperty('--cyber-primary', activeTheme.colors.primary);
    root.style.setProperty('--cyber-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--cyber-accent', activeTheme.colors.accent);
    root.style.setProperty('--cyber-background', activeTheme.colors.background);
    root.style.setProperty('--cyber-text', activeTheme.colors.text);

    // 保存到本地存储
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-colors', JSON.stringify(activeTheme.colors));
  }, [mode, activeTheme]);

  // 从本地存储加载主题
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColors = localStorage.getItem('theme-colors');

    if (savedMode) setMode(savedMode);
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      const theme = themes.find((t) =>
        Object.entries(t.colors).every(([key, value]) => colors[key] === value)
      );
      if (theme) setActiveTheme(theme);
    }
  }, [themes]);

  // 切换模式
  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // 切换主题
  const handleThemeChange = (theme: CyberTheme) => {
    setActiveTheme(theme);
    setIsOpen(false);
  };

  // 渲染按钮模式
  const renderButton = () => {
    return (
      <div className={cn('flex items-center gap-2', className)} style={style}>
        <ModeButton
          mode="light"
          active={mode === 'light'}
          onClick={() => handleModeChange('light')}
          size={size}
        />
        <ModeButton
          mode="dark"
          active={mode === 'dark'}
          onClick={() => handleModeChange('dark')}
          size={size}
        />
        <ModeButton
          mode="system"
          active={mode === 'system'}
          onClick={() => handleModeChange('system')}
          size={size}
        />
      </div>
    );
  };

  // 渲染下拉菜单模式
  const renderDropdown = () => {
    return (
      <div className={cn('relative', className)} style={style}>
        {/* 触发按钮 */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-gray-800 border border-gray-700',
            'hover:bg-gray-700 transition-colors'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Palette className="w-5 h-5 text-cyber-cyan" />
          <span className="text-white font-medium">主题</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.span>
        </motion.button>

        {/* 下拉菜单 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 遮罩 */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* 菜单内容 */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute z-50 mt-2 w-80 p-4',
                  'bg-gray-900 border border-gray-700 rounded-xl',
                  'shadow-2xl'
                )}
              >
                {/* 模式选择 */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    显示模式
                  </div>
                  <div className="flex gap-2">
                    <ModeButton
                      mode="light"
                      active={mode === 'light'}
                      onClick={() => handleModeChange('light')}
                      size="md"
                    />
                    <ModeButton
                      mode="dark"
                      active={mode === 'dark'}
                      onClick={() => handleModeChange('dark')}
                      size="md"
                    />
                    <ModeButton
                      mode="system"
                      active={mode === 'system'}
                      onClick={() => handleModeChange('system')}
                      size="md"
                    />
                  </div>
                </div>

                {/* 主题选择 */}
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    赛博朋克主题
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {themes.map((theme) => (
                      <ThemePreview
                        key={theme.id}
                        theme={theme}
                        active={activeTheme.id === theme.id}
                        onClick={() => handleThemeChange(theme)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 渲染选择器模式
  const renderSelector = () => {
    return (
      <div className={cn('space-y-4', className)} style={style}>
        {/* 模式选择 */}
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">
            显示模式
          </div>
          <div className="flex gap-2">
            <ModeButton
              mode="light"
              active={mode === 'light'}
              onClick={() => handleModeChange('light')}
              size="md"
            />
            <ModeButton
              mode="dark"
              active={mode === 'dark'}
              onClick={() => handleModeChange('dark')}
              size="md"
            />
            <ModeButton
              mode="system"
              active={mode === 'system'}
              onClick={() => handleModeChange('system')}
              size="md"
            />
          </div>
        </div>

        {/* 主题选择 */}
        <div>
          <div className="text-sm font-medium text-gray-400 mb-2">
            赛博朋克主题
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                active={activeTheme.id === theme.id}
                onClick={() => handleThemeChange(theme)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {variant === 'button' && renderButton()}
      {variant === 'dropdown' && renderDropdown()}
      {variant === 'selector' && renderSelector()}
    </>
  );
};

/**
 * Hook: 使用主题
 */
export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [theme, setTheme] = useState<CyberTheme>(BUILT_IN_THEMES[0]);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColors = localStorage.getItem('theme-colors');

    if (savedMode) setMode(savedMode);
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setTheme((prev) => ({ ...prev, colors }));
    }
  }, []);

  const changeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const changeTheme = (newTheme: CyberTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme-colors', JSON.stringify(newTheme.colors));
  };

  return { mode, theme, changeMode, changeTheme };
};

/**
 * 主题预览卡片
 */
export const ThemePreviewCard: React.FC<{
  theme: CyberTheme;
  onClick?: () => void;
  className?: string;
}> = ({ theme, onClick, className }) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-xl border-2 transition-all',
        'hover:scale-105',
        className
      )}
      style={{
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.background,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 颜色预览 */}
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* 主题信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ color: theme.colors.primary }}>{theme.icon}</div>
          <span
            className="font-medium"
            style={{ color: theme.colors.text }}
          >
            {theme.name}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default ThemeSwitcher;
