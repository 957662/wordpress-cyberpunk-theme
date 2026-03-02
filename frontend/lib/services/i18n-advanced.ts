/**
 * 高级国际化服务
 * 支持多语言、复数形式、日期/数字格式化、懒加载翻译文件
 */

import { useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'ru' | 'ar';

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  dateFormat?: string;
  numberFormat?: {
    decimalSeparator: string;
    thousandsSeparator: string;
  };
}

export interface I18nConfig {
  defaultLocale: Locale;
  fallbackLocale: Locale;
  availableLocales: Locale[];
  locales: Record<Locale, LocaleConfig>;
  translationsPath: string;
  enableNamespaces: boolean;
  namespaces: string[];
  cacheTranslations: boolean;
  debugMode: boolean;
}

export interface PluralRule {
  (n: number): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
}

export interface TranslationValue {
  value: string;
  params?: Record<string, any>;
  count?: number;
}

/**
 * 国际化服务类
 */
export class I18nService {
  private config: I18nConfig;
  private currentLocale: Locale;
  private translations: Map<string, TranslationNamespace> = new Map();
  private formatters: Map<Locale, Map<string, Intl.DateTimeFormat | Intl.NumberFormat>> = new Map();
  private pluralRules: Map<Locale, PluralRule> = new Map();
  private listeners: Set<(locale: Locale) => void> = new Set();

  constructor(config: Partial<I18nConfig> = {}) {
    this.config = {
      defaultLocale: 'en',
      fallbackLocale: 'en',
      availableLocales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'],
      locales: this.getDefaultLocaleConfigs(),
      translationsPath: '/locales',
      enableNamespaces: true,
      namespaces: ['common', 'errors', 'validation'],
      cacheTranslations: true,
      debugMode: false,
      ...config,
    };

    this.currentLocale = this.config.defaultLocale;
    this.initializePluralRules();
    this.loadLocale(this.currentLocale);
  }

  /**
   * 获取默认的区域配置
   */
  private getDefaultLocaleConfigs(): Record<Locale, LocaleConfig> {
    return {
      en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: {
          decimalSeparator: '.',
          thousandsSeparator: ',',
        },
      },
      zh: {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        flag: '🇨🇳',
        dateFormat: 'YYYY/MM/DD',
        numberFormat: {
          decimalSeparator: '.',
          thousandsSeparator: ',',
        },
      },
      es: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
          decimalSeparator: ',',
          thousandsSeparator: '.',
        },
      },
      fr: {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
          decimalSeparator: ',',
          thousandsSeparator: ' ',
        },
      },
      de: {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: {
          decimalSeparator: ',',
          thousandsSeparator: '.',
        },
      },
      ja: {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        dateFormat: 'YYYY/MM/DD',
        numberFormat: {
          decimalSeparator: '.',
          thousandsSeparator: ',',
        },
      },
      ko: {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷',
        dateFormat: 'YYYY.MM.DD',
        numberFormat: {
          decimalSeparator: '.',
          thousandsSeparator: ',',
        },
      },
      pt: {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        flag: '🇵🇹',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
          decimalSeparator: ',',
          thousandsSeparator: '.',
        },
      },
      ru: {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
        flag: '🇷🇺',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: {
          decimalSeparator: ',',
          thousandsSeparator: ' ',
        },
      },
      ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        rtl: true,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: {
          decimalSeparator: '٫',
          thousandsSeparator: '٬',
        },
      },
    };
  }

  /**
   * 初始化复数规则
   */
  private initializePluralRules() {
    this.pluralRules.set('en', (n) => (n === 1 ? 'one' : 'other'));
    this.pluralRules.set('zh', () => 'other');
    this.pluralRules.set('es', (n) => (n === 1 ? 'one' : 'other'));
    this.pluralRules.set('fr', (n) => (n === 0 || n === 1 ? 'one' : 'other'));
    this.pluralRules.set('de', (n) => (n === 1 ? 'one' : 'other'));
    this.pluralRules.set('ja', () => 'other');
    this.pluralRules.set('ko', () => 'other');
    this.pluralRules.set('ru', (n) => {
      const lastTwo = n % 100;
      const lastOne = n % 10;
      if (lastTwo >= 11 && lastTwo <= 14) return 'many';
      if (lastOne === 1) return 'one';
      if (lastOne >= 2 && lastOne <= 4) return 'few';
      return 'many';
    });
    this.pluralRules.set('ar', (n) => {
      if (n === 0) return 'zero';
      if (n === 1) return 'one';
      if (n === 2) return 'two';
      if (n % 100 >= 3 && n % 100 <= 10) return 'few';
      if (n % 100 >= 11 && n % 100 <= 99) return 'many';
      return 'other';
    });
  }

  /**
   * 加载语言文件
   */
  async loadLocale(locale: Locale, namespace?: string): Promise<void> {
    try {
      const namespaces = namespace ? [namespace] : this.config.namespaces;

      for (const ns of namespaces) {
        const key = `${locale}:${ns}`;

        if (this.translations.has(key) && this.config.cacheTranslations) {
          continue;
        }

        const response = await fetch(`${this.config.translationsPath}/${locale}/${ns}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${locale}:${ns}`);
        }

        const translations: TranslationNamespace = await response.json();
        this.translations.set(key, translations);
      }

      if (this.config.debugMode) {
        console.log(`[I18n] Loaded locale: ${locale}`);
      }
    } catch (error) {
      console.error(`[I18n] Error loading locale ${locale}:`, error);

      // 回退到默认语言
      if (locale !== this.config.fallbackLocale) {
        await this.loadLocale(this.config.fallbackLocale, namespace);
      }
    }
  }

  /**
   * 切换语言
   */
  async changeLocale(locale: Locale): Promise<void> {
    if (!this.config.availableLocales.includes(locale)) {
      console.warn(`[I18n] Locale ${locale} is not available`);
      return;
    }

    if (this.currentLocale === locale) {
      return;
    }

    await this.loadLocale(locale);
    this.currentLocale = locale;

    // 通知所有监听器
    this.listeners.forEach((listener) => listener(locale));

    if (this.config.debugMode) {
      console.log(`[I18n] Locale changed to: ${locale}`);
    }
  }

  /**
   * 获取当前语言
   */
  getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * 获取语言配置
   */
  getLocaleConfig(locale?: Locale): LocaleConfig | undefined {
    return this.config.locales[locale || this.currentLocale];
  }

  /**
   * 翻译文本
   */
  t(key: string, params?: Record<string, any>, namespace?: string): string {
    const ns = namespace || 'common';
    const translationKey = `${this.currentLocale}:${ns}`;
    const translations = this.translations.get(translationKey);

    if (!translations) {
      if (this.config.debugMode) {
        console.warn(`[I18n] Translation not found: ${translationKey}`);
      }
      return this.fallbackTranslate(key, params);
    }

    const value = this.getNestedValue(translations, key);
    if (typeof value !== 'string') {
      return key;
    }

    return this.interpolate(value, params);
  }

  /**
   * 翻译复数形式
   */
  tp(key: string, count: number, params?: Record<string, any>, namespace?: string): string {
    const pluralRule = this.pluralRules.get(this.currentLocale);
    if (!pluralRule) {
      return this.t(key, { ...params, count }, namespace);
    }

    const form = pluralRule(count);
    const pluralKey = `${key}_${form}`;

    return this.t(pluralKey, { ...params, count }, namespace);
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date | string | number, format?: string): string {
    const dateObj = typeof date === 'object' ? date : new Date(date);
    const locale = this.currentLocale;

    try {
      if (format) {
        // 自定义格式
        const config = this.getLocaleConfig(locale);
        const formatString = format || config?.dateFormat || 'MM/DD/YYYY';

        return this.customDateFormat(dateObj, formatString);
      }

      // 使用 Intl API
      const formatter = this.getFormatter(locale, 'date');
      return formatter.format(dateObj);
    } catch (error) {
      console.error('[I18n] Error formatting date:', error);
      return dateObj.toString();
    }
  }

  /**
   * 格式化数字
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.currentLocale;

    try {
      const formatter = this.getFormatter(locale, 'number', options);
      return formatter.format(number);
    } catch (error) {
      console.error('[I18n] Error formatting number:', error);
      return number.toString();
    }
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return this.formatNumber(amount, {
      style: 'currency',
      currency,
    });
  }

  /**
   * 格式化相对时间
   */
  formatRelativeTime(date: Date | string | number): string {
    const dateObj = typeof date === 'object' ? date : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { numeric: 'auto' });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  }

  /**
   * 获取格式化器
   */
  private getFormatter(
    locale: Locale,
    type: 'date' | 'number',
    options?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions
  ): Intl.DateTimeFormat | Intl.NumberFormat {
    if (!this.formatters.has(locale)) {
      this.formatters.set(locale, new Map());
    }

    const localeFormatters = this.formatters.get(locale)!;
    const key = `${type}-${JSON.stringify(options)}`;

    if (!localeFormatters.has(key)) {
      let formatter: Intl.DateTimeFormat | Intl.NumberFormat;

      if (type === 'date') {
        formatter = new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions);
      } else {
        formatter = new Intl.NumberFormat(locale, options as Intl.NumberFormatOptions);
      }

      localeFormatters.set(key, formatter);
    }

    return localeFormatters.get(key)!;
  }

  /**
   * 获取嵌套值
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * 插值替换
   */
  private interpolate(template: string, params?: Record<string, any>): string {
    if (!params) {
      return template;
    }

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  /**
   * 回退翻译
   */
  private fallbackTranslate(key: string, params?: Record<string, any>): string {
    const fallbackKey = `${this.config.fallbackLocale}:common`;
    const fallbackTranslations = this.translations.get(fallbackKey);

    if (fallbackTranslations) {
      const value = this.getNestedValue(fallbackTranslations, key);
      if (typeof value === 'string') {
        return this.interpolate(value, params);
      }
    }

    return key;
  }

  /**
   * 自定义日期格式
   */
  private customDateFormat(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * 订阅语言变化
   */
  subscribe(listener: (locale: Locale) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 检查是否为 RTL 语言
   */
  isRTL(): boolean {
    return this.getLocaleConfig()?.rtl || false;
  }

  /**
   * 获取所有可用语言
   */
  getAvailableLocales(): LocaleConfig[] {
    return this.config.availableLocales.map((locale) => this.config.locales[locale]);
  }
}

// 单例实例
let i18nServiceInstance: I18nService | null = null;

export function getI18nService(config?: Partial<I18nConfig>): I18nService {
  if (!i18nServiceInstance) {
    i18nServiceInstance = new I18nService(config);
  }
  return i18nServiceInstance;
}

/**
 * React Hook: 使用国际化
 */
export function useI18n(namespace?: string) {
  const i18n = getI18nService();
  const [locale, setLocale] = useState<Locale>(i18n.getLocale());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newLocale) => {
      setLocale(newLocale);
    });

    return unsubscribe;
  }, [i18n]);

  const changeLocale = useCallback(async (newLocale: Locale) => {
    await i18n.changeLocale(newLocale);
  }, [i18n]);

  const t = useCallback((key: string, params?: Record<string, any>) => {
    return i18n.t(key, params, namespace);
  }, [i18n, namespace]);

  const tp = useCallback((key: string, count: number, params?: Record<string, any>) => {
    return i18n.tp(key, count, params, namespace);
  }, [i18n, namespace]);

  const formatDate = useCallback((date: Date | string | number, format?: string) => {
    return i18n.formatDate(date, format);
  }, [i18n]);

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(number, options);
  }, [i18n]);

  const formatCurrency = useCallback((amount: number, currency?: string) => {
    return i18n.formatCurrency(amount, currency);
  }, [i18n]);

  const formatRelativeTime = useCallback((date: Date | string | number) => {
    return i18n.formatRelativeTime(date);
  }, [i18n]);

  return {
    locale,
    changeLocale,
    t,
    tp,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    isRTL: i18n.isRTL(),
    availableLocales: i18n.getAvailableLocales(),
    localeConfig: i18n.getLocaleConfig(),
  };
}

export default I18nService;
