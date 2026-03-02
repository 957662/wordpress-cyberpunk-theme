/**
 * i18n - 国际化系统
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { zhCN } from './zh-CN';
import { enUS } from './en-US';

// 支持的语言类型
export type Locale = 'zh-CN' | 'en-US';

// 翻译资源
const translations: Record<Locale, any> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

// 上下文类型
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider Props
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

/**
 * i18n Provider 组件
 */
export function I18nProvider({ children, defaultLocale = 'zh-CN' }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    // 从 localStorage 读取保存的语言设置
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && translations[saved]) {
        return saved;
      }

      // 尝试从浏览器语言设置获取
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        return 'zh-CN';
      }
      if (browserLang.startsWith('en')) {
        return 'en-US';
      }
    }

    return defaultLocale;
  });

  // 切换语言
  const changeLocale = (newLocale: Locale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
        document.documentElement.lang = newLocale;
      }
    }
  };

  // 翻译函数
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let result: any = translations[locale];

    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof result !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // 替换参数
    if (params) {
      return result.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return result;
  };

  // 更新 HTML lang 属性
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value: I18nContextType = {
    locale,
    setLocale: changeLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * useTranslation Hook
 */
export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }

  return context;
}

// 默认导出
export default I18nProvider;

// 便捷函数（在组件外使用）
export function getTranslation(locale: Locale) {
  return (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let result: any = translations[locale];

    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      return result.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return result;
  };
}
