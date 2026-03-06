'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { i18nConfig, type Locale } from './config';
import translations from './translations';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface UseTranslationProps {
  initialLocale?: Locale;
}

/**
 * useTranslation Hook
 * 
 * 使用示例:
 * const { t, locale, setLocale } = useTranslation();
 * 
 * // 简单翻译
 * t('common.welcome') // "Welcome"
 * 
 * // 带参数翻译
 * t('auth.welcomeUser', { name: 'John' }) // "Welcome, John!"
 */
export function useTranslation({ initialLocale }: UseTranslationProps = {}) {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  
  return context;
}

/**
 * TranslationProvider 组件
 */
export function TranslationProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || i18nConfig.defaultLocale
  );

  useEffect(() => {
    // 从本地存储读取语言设置
    const storedLocale = localStorage.getItem(i18nConfig.storageKey) as Locale;
    if (storedLocale && i18nConfig.locales.some((l) => l.code === storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.split('-')[0] as Locale;
      const supportedLocale = i18nConfig.locales.find(
        (l) => l.code === browserLang
      )?.code;
      if (supportedLocale) {
        setLocaleState(supportedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(i18nConfig.storageKey, newLocale);
    document.documentElement.lang = newLocale;

    // 更新文本方向
    const localeConfig = i18nConfig.locales.find((l) => l.code === newLocale);
    if (localeConfig) {
      document.documentElement.dir = localeConfig.dir;
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果翻译不存在，回退到英语
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // 如果英语也没有，返回 key
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 替换参数
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || '';
      });
    }

    return value;
  };

  const localeConfig = i18nConfig.locales.find((l) => l.code === locale);
  const isRTL = localeConfig?.dir === 'rtl' || false;

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * LanguageSwitcher 组件
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {i18nConfig.locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => setLocale(loc.code)}
          className={\`
            px-3 py-1 rounded-lg text-sm font-medium transition-all
            \${locale === loc.code
              ? 'bg-cyber-cyan text-cyber-dark'
              : 'bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80'
            }
          \`}
          title={loc.name}
        >
          <span className="mr-1">{loc.flag}</span>
          <span className="hidden sm:inline">{loc.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export default useTranslation;
