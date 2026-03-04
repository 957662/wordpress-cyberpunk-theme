/**
 * 国际化工具
 * 提供翻译和语言切换功能
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  Locale,
  isSupportedLocale,
  getBrowserLocale,
  type LocaleConfig,
} from './config';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

// 翻译数据
const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

// 翻译函数类型
type TranslateFunction = (key: string, params?: Record<string, any>) => string;

// I18N 上下文类型
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFunction;
  config: LocaleConfig;
  isRTL: boolean;
}

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// I18N Provider 组件
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // 从 localStorage 或浏览器语言加载初始语言
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedLocale = localStorage.getItem('locale');
    const initialLocale = savedLocale && isSupportedLocale(savedLocale)
      ? savedLocale
      : getBrowserLocale();

    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
  }, []);

  // 设置语言
  const setLocale = (newLocale: Locale) => {
    if (!isSupportedLocale(newLocale)) {
      console.warn(`Unsupported locale: ${newLocale}`);
      return;
    }

    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  // 翻译函数
  const t: TranslateFunction = (key, params = {}) => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻译，尝试使用默认语言
        value = translations[DEFAULT_LOCALE];
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // 如果还是没有，返回原 key
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 替换参数
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? String(params[param]) : match;
    });
  };

  // 获取语言配置
  const config: LocaleConfig = {
    code: locale,
    name: locale === 'zh-CN' ? 'Simplified Chinese' : 'English',
    nativeName: locale === 'zh-CN' ? '简体中文' : 'English',
    flag: locale === 'zh-CN' ? '🇨🇳' : '🇺🇸',
  };

  const isRTL = false; // 暂不支持 RTL 语言

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, config, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用 i18n 的 Hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// 简化的翻译 Hook
export function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}

/**
 * 服务端使用的翻译函数（不依赖 React）
 */
export function getTranslations(locale: Locale = DEFAULT_LOCALE) {
  const data = translations[locale] || translations[DEFAULT_LOCALE];

  return (key: string, params: Record<string, any> = {}): string => {
    const keys = key.split('.');
    let value: any = data;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? String(params[param]) : match;
    });
  };
}

/**
 * 获取所有支持的语言列表
 */
export function getAvailableLocales(): Array<Locale & LocaleConfig> {
  return SUPPORTED_LOCALES.map(locale => {
    const config = locale === 'zh-CN'
      ? { code: 'zh-CN' as Locale, name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' }
      : { code: 'en-US' as Locale, name: 'English', nativeName: 'English', flag: '🇺🇸' };
    return { ...config };
  });
}
