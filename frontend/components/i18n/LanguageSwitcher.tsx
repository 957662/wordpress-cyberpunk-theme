/**
 * 语言切换组件
 * 允许用户在不同语言之间切换
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

export interface LanguageSwitcherProps {
  showLabel?: boolean;
  variant?: 'dropdown' | 'popover' | 'inline';
  onLocaleChange?: (locale: Locale) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLabel = false,
  variant = 'dropdown',
  onLocaleChange,
}) => {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  const [isOpen, setIsOpen] = useState(false);

  // 从 localStorage 或 cookie 加载保存的语言
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedLocale = localStorage.getItem('cyberpress-locale') as Locale;
    if (savedLocale && locales.some((l) => l.code === savedLocale)) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  // 切换语言
  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale);

    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberpress-locale', locale);
      document.documentElement.lang = locale;
    }

    // 触发回调
    onLocaleChange?.(locale);

    // 关闭下拉菜单
    setIsOpen(false);

    // 刷新页面以应用新语言（可选）
    // window.location.reload();
  };

  // 获取当前语言配置
  const currentLocaleConfig = locales.find((l) => l.code === currentLocale) || locales[0];

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-400" />
        <div className="flex gap-1">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              className={`px-2 py-1 text-sm rounded transition-all ${
                currentLocale === locale.code
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {locale.flag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <Globe className="w-5 h-5" />
        <span className="text-lg">{currentLocaleConfig.flag}</span>
        {showLabel && <span>{currentLocaleConfig.name}</span>}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 下拉菜单 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 w-56"
            >
              <Card className="p-2 border-cyber-cyan/20 bg-cyber-dark/95 backdrop-blur-xl">
                <div className="space-y-1">
                  {locales.map((locale) => {
                    const isSelected = currentLocale === locale.code;

                    return (
                      <button
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-cyber-cyan/20 text-cyber-cyan'
                            : 'text-gray-300 hover:bg-cyber-dark/50'
                        }`}
                      >
                        <span className="text-xl">{locale.flag}</span>
                        <span className="flex-1 text-left">{locale.name}</span>
                        <span className="text-xs text-gray-500">{locale.code}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center px-2">
                    切换语言将更改界面显示
                  </p>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
